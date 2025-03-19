# AI Service

This microservice provides natural language processing capabilities to the note-taking application. It analyzes text from notes to determine sentiment and categorize content.

## Features

- Sentiment analysis (positive, negative, neutral)
- Text categorization (Personal, Work, Health, etc.)
- Simple API for integration with other services

## API Endpoints

- `GET /health`: Health check endpoint
- `POST /analyze`: Analyze text for sentiment and category
  - Request body: `{ "text": "Your text here" }`
  - Response: `{ "sentiment": { "label": "positive", "scores": {...} }, "category": "Work", "processing_time_ms": 123 }`
- `POST /categorize`: Categorize text only
  - Request body: `{ "text": "Your text here" }`
  - Response: `{ "category": "Work" }`

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

4. The service will be available at http://localhost:8002

## Docker Development

Build and run the container:
```
docker build -t ai-service .
docker run -p 8002:8002 ai-service
```

## Notes for Production

In a production environment, you would want to:
- Use a WSGI server like Gunicorn instead of Flask's development server
- Implement more sophisticated NLP models
- Add authentication/authorization to protect the API
- Add comprehensive logging and monitoring
- Implement rate limiting and caching 