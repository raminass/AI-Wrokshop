from flask import Flask, request, jsonify
from flask_cors import CORS
import pymongo
from pymongo import MongoClient
import os
import requests
import json
import logging
from bson import ObjectId
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# MongoDB connection
mongo_uri = os.environ.get('MONGODB_URI', 'mongodb://localhost:27017/notes')
client = MongoClient(mongo_uri)
db = client.get_database()
notes_collection = db.notes

# AI service connection
ai_service_url = os.environ.get('AI_SERVICE_URL', 'http://localhost:8002')

# JSON encoder to handle ObjectId
class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, datetime):
            return o.isoformat()
        return json.JSONEncoder.default(self, o)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy"}), 200

@app.route('/notes', methods=['GET'])
def get_notes():
    """Get all notes for a user"""
    user_id = request.args.get('user_id')
    
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400
    
    try:
        notes = list(notes_collection.find({"user_id": user_id}))
        return JSONEncoder().encode(notes), 200, {'Content-Type': 'application/json'}
    except Exception as e:
        logger.error(f"Error retrieving notes: {e}")
        return jsonify({"error": "Failed to retrieve notes"}), 500

@app.route('/notes/<note_id>', methods=['GET'])
def get_note(note_id):
    """Get a specific note"""
    try:
        note = notes_collection.find_one({"_id": ObjectId(note_id)})
        if note:
            return JSONEncoder().encode(note), 200, {'Content-Type': 'application/json'}
        else:
            return jsonify({"error": "Note not found"}), 404
    except Exception as e:
        logger.error(f"Error retrieving note: {e}")
        return jsonify({"error": "Failed to retrieve note"}), 500

@app.route('/notes', methods=['POST'])
def create_note():
    """Create a new note with AI analysis"""
    try:
        data = request.json
        
        if not data or 'content' not in data or 'user_id' not in data:
            return jsonify({"error": "Content and user_id are required"}), 400
        
        # Create note object
        note = {
            "title": data.get('title', 'Untitled Note'),
            "content": data['content'],
            "user_id": data['user_id'],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "analysis": None
        }
        
        # Get AI analysis
        try:
            response = requests.post(
                f"{ai_service_url}/analyze", 
                json={"text": data['content']},
                timeout=5
            )
            
            if response.status_code == 200:
                note['analysis'] = response.json()
            else:
                logger.warning(f"AI service returned: {response.status_code}")
        except requests.RequestException as e:
            logger.error(f"Error calling AI service: {e}")
            # Continue even if AI service fails
        
        # Insert into database
        result = notes_collection.insert_one(note)
        note['_id'] = result.inserted_id
        
        return JSONEncoder().encode(note), 201, {'Content-Type': 'application/json'}
    except Exception as e:
        logger.error(f"Error creating note: {e}")
        return jsonify({"error": "Failed to create note"}), 500

@app.route('/notes/<note_id>', methods=['PUT'])
def update_note(note_id):
    """Update a note"""
    try:
        data = request.json
        
        if not data:
            return jsonify({"error": "No update data provided"}), 400
        
        note = notes_collection.find_one({"_id": ObjectId(note_id)})
        
        if not note:
            return jsonify({"error": "Note not found"}), 404
        
        update_data = {
            "updated_at": datetime.utcnow()
        }
        
        # Update fields if provided
        if 'title' in data:
            update_data['title'] = data['title']
        
        if 'content' in data:
            update_data['content'] = data['content']
            
            # Get updated AI analysis
            try:
                response = requests.post(
                    f"{ai_service_url}/analyze", 
                    json={"text": data['content']},
                    timeout=5
                )
                
                if response.status_code == 200:
                    update_data['analysis'] = response.json()
            except requests.RequestException as e:
                logger.error(f"Error calling AI service: {e}")
                # Continue even if AI service fails
        
        # Update in database
        notes_collection.update_one(
            {"_id": ObjectId(note_id)},
            {"$set": update_data}
        )
        
        # Get updated note
        updated_note = notes_collection.find_one({"_id": ObjectId(note_id)})
        
        return JSONEncoder().encode(updated_note), 200, {'Content-Type': 'application/json'}
    except Exception as e:
        logger.error(f"Error updating note: {e}")
        return jsonify({"error": "Failed to update note"}), 500

@app.route('/notes/<note_id>', methods=['DELETE'])
def delete_note(note_id):
    """Delete a note"""
    try:
        result = notes_collection.delete_one({"_id": ObjectId(note_id)})
        
        if result.deleted_count > 0:
            return jsonify({"message": "Note deleted successfully"}), 200
        else:
            return jsonify({"error": "Note not found"}), 404
    except Exception as e:
        logger.error(f"Error deleting note: {e}")
        return jsonify({"error": "Failed to delete note"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8001) 