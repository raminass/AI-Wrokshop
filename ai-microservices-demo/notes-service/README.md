# Notes Service

This microservice handles the CRUD operations for notes in the Smart Note-Taking application. It communicates with the AI service to enrich notes with sentiment analysis and categorization.

## Features

- Create, read, update, and delete notes
- Automatic AI analysis of note content
- MongoDB integration for data persistence

## API Endpoints

- `GET /health`: Health check endpoint
- `GET /notes?user_id=<user_id>`: Get all notes for a user
- `GET /notes/<note_id>`: Get a specific note
- `POST /notes`: Create a new note
  - Request body: `{ "title": "Note Title", "content": "Note content", "user_id": "user123" }`
- `PUT /notes/<note_id>`: Update a note
  - Request body: `{ "title": "Updated Title", "content": "Updated content" }`
- `DELETE /notes/<note_id>`: Delete a note

## Local Development

1. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Run the service:
   ```
   python app.py
   ```

4. The service will be available at http://localhost:8001

## Docker Development

Build and run the container:
```
docker build -t notes-service .
docker run -p 8001:8001 notes-service
```

## Environment Variables

- `MONGODB_URI`: MongoDB connection string (default: mongodb://localhost:27017/notes)
- `AI_SERVICE_URL`: URL of the AI service (default: http://localhost:8002)

## Notes for Production

In a production environment, you would want to:
- Use a WSGI server like Gunicorn instead of Flask's development server
- Implement proper authentication and authorization
- Add pagination for notes listing
- Implement database indexes for better performance
- Add robust error handling and retries for service communication 