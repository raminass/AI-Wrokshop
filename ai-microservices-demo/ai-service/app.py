from flask import Flask, request, jsonify
from flask_cors import CORS
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
import random
import time
import logging
import os

# Conditionally import transformers if USE_HUGGINGFACE is set
use_huggingface = os.environ.get('USE_HUGGINGFACE', 'false').lower() == 'true'

if use_huggingface:
    try:
        from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
        # Model will be downloaded on first use
        model_name = "distilbert-base-uncased-finetuned-sst-2-english"
        tokenizer = None
        model = None
        sentiment_pipeline = None
        
        # Lazy loading to make container startup faster
        def get_sentiment_pipeline():
            global tokenizer, model, sentiment_pipeline
            if sentiment_pipeline is None:
                logging.info(f"Loading HuggingFace model: {model_name}")
                tokenizer = AutoTokenizer.from_pretrained(model_name)
                model = AutoModelForSequenceClassification.from_pretrained(model_name)
                sentiment_pipeline = pipeline("sentiment-analysis", model=model, tokenizer=tokenizer)
            return sentiment_pipeline
            
        logging.info("HuggingFace transformers imported successfully")
    except ImportError:
        logging.warning("Failed to import transformers. Falling back to NLTK.")
        use_huggingface = False

# Download NLTK data (only needed if not using HuggingFace)
if not use_huggingface:
    nltk.download('vader_lexicon')

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize the NLTK sentiment analyzer (used as fallback)
sia = SentimentIntensityAnalyzer()

# Simulated categories for notes
CATEGORIES = [
    "Personal", "Work", "Shopping", "Ideas", "Health", 
    "Finance", "Travel", "Education", "Projects", "Other"
]

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "using_huggingface": use_huggingface}), 200

@app.route('/analyze', methods=['POST'])
def analyze_text():
    """Analyze text for sentiment and category"""
    
    if not request.json or 'text' not in request.json:
        return jsonify({"error": "No text provided"}), 400
    
    text = request.json['text']
    
    # Log the request
    logger.info(f"Analyzing text: {text[:50]}...")
    
    # Add artificial delay to simulate processing
    time.sleep(0.2)
    
    # Perform sentiment analysis
    if use_huggingface:
        # HuggingFace approach
        try:
            pipeline = get_sentiment_pipeline()
            start_time = time.time()
            result = pipeline(text)[0]
            processing_time = time.time() - start_time
            
            # Map HuggingFace output to our format
            sentiment_label = result['label'].lower()
            if sentiment_label == 'positive':
                sentiment = 'positive'
            elif sentiment_label == 'negative':
                sentiment = 'negative'
            else:
                sentiment = 'neutral'
                
            sentiment_scores = {
                'compound': result['score'] if sentiment == 'positive' else -result['score'] if sentiment == 'negative' else 0,
                'pos': result['score'] if sentiment == 'positive' else 0,
                'neg': result['score'] if sentiment == 'negative' else 0,
                'neu': 1.0 if sentiment == 'neutral' else 0
            }
            
            logger.info(f"HuggingFace sentiment analysis: {sentiment}")
        except Exception as e:
            logger.error(f"Error using HuggingFace: {e}. Falling back to NLTK.")
            # Fallback to NLTK
            sentiment_scores = sia.polarity_scores(text)
            
            # Determine overall sentiment
            if sentiment_scores['compound'] >= 0.05:
                sentiment = 'positive'
            elif sentiment_scores['compound'] <= -0.05:
                sentiment = 'negative'
            else:
                sentiment = 'neutral'
            
            processing_time = 0.1  # Simulated for fallback
    else:
        # NLTK approach
        start_time = time.time()
        sentiment_scores = sia.polarity_scores(text)
        processing_time = time.time() - start_time
        
        # Determine overall sentiment
        if sentiment_scores['compound'] >= 0.05:
            sentiment = 'positive'
        elif sentiment_scores['compound'] <= -0.05:
            sentiment = 'negative'
        else:
            sentiment = 'neutral'

    # Simulate category classification (in a real app, this would use a classifier)
    # For demo purposes, we'll use a simple rule-based approach
    if len(text) < 10:
        category = random.choice(CATEGORIES)
    else:
        # Simple keyword matching for demo purposes
        keywords = {
            "work": ["meeting", "project", "deadline", "boss", "colleague"],
            "personal": ["family", "friend", "home", "feeling", "love"],
            "health": ["exercise", "diet", "doctor", "healthy", "sick"],
            "finance": ["money", "budget", "expense", "save", "invest"],
            "travel": ["trip", "vacation", "flight", "hotel", "visit"],
        }
        
        text_lower = text.lower()
        
        # Check for keyword matches
        category_scores = {}
        for cat, words in keywords.items():
            score = sum(1 for word in words if word in text_lower)
            if score > 0:
                category_scores[cat] = score
        
        if category_scores:
            # Get category with highest score
            category = max(category_scores, key=category_scores.get).capitalize()
        else:
            # Default to random category if no keywords match
            category = random.choice(CATEGORIES)
    
    # Build response
    response = {
        "sentiment": {
            "label": sentiment,
            "scores": sentiment_scores
        },
        "category": category,
        "processing_time_ms": int(processing_time * 1000),
        "model": "huggingface-distilbert" if use_huggingface else "nltk-vader"
    }
    
    logger.info(f"Analysis complete: sentiment={sentiment}, category={category}")
    return jsonify(response)

@app.route('/categorize', methods=['POST'])
def categorize_text():
    """Categorize text only"""
    
    if not request.json or 'text' not in request.json:
        return jsonify({"error": "No text provided"}), 400
    
    text = request.json['text']
    
    # Simplified version for just categorization
    category = random.choice(CATEGORIES)
    
    return jsonify({"category": category})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8002) 