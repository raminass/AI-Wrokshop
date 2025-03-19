# OpenAI Service

This microservice provides natural language processing capabilities using the OpenAI API. It serves as an alternative to the self-hosted AI service, offering the same API endpoints but powered by OpenAI's models.

## Features

- Sentiment analysis using OpenAI's GPT models
- Text categorization
- API compatible with the self-hosted AI service

## API Endpoints

- `GET /health`: Health check endpoint
- `POST /analyze`: Analyze text for sentiment and category
  - Request body: `{ "text": "Your text here" }`
  - Response: `{ "sentiment": { "label": "positive", "scores": {...} }, "category": "Work", "processing_time_ms": 123, "model": "openai-gpt3.5-turbo" }`
- `POST /categorize`: Categorize text only
  - Request body: `{ "text": "Your text here" }`
  - Response: `{ "category": "Work" }`

## Setup Instructions

1. Create an OpenAI API key at https://platform.openai.com/api-keys

2. Copy the `.env.example` file to `.env`:
   ```
   cp .env.example .env
   ```

3. Add your OpenAI API key to the `.env` file:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

## Local Development

1. Install dependencies:
   ```
   npm install
   ```

2. Run the service:
   ```
   npm run dev
   ```

3. The service will be available at http://localhost:8004

## Docker Development

Build and run the container:
```
docker build -t openai-service .
docker run -p 8004:8004 --env-file .env openai-service
```

## Using with Docker Compose

To use this service within the full application:

1. Create the `.env` file with your OpenAI API key
2. Add the service to the `docker-compose.yml` file:
   ```yaml
   openai-service:
     build: ./openai-service
     ports:
       - "8004:8004"
     env_file:
       - ./openai-service/.env
     networks:
       - app-network
   ```
3. Update the API Gateway to route to this service instead of the self-hosted AI service

## Comparison with Self-Hosted AI Service

| Feature | Self-Hosted AI | OpenAI Service |
|---------|---------------|----------------|
| Sentiment Analysis | NLTK or HuggingFace | GPT 3.5/4 |
| Categorization | Rule-based or ML | GPT 3.5/4 |
| Latency | Lower (local) | Higher (API calls) |
| Accuracy | Good | Excellent |
| Cost | Free | Pay-per-use |
| Customization | High | Limited |
| Setup Difficulty | Complex | Simple |

## Notes for Production

In a production environment, you would want to:
- Implement caching to reduce API calls
- Add rate limiting to manage costs
- Set up proper error handling and retries
- Monitor usage to track expenses
- Consider implementing fallback options 