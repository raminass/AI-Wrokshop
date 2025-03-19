# API Gateway

This microservice acts as the central entry point for all client requests in the Smart Note-Taking application. It routes requests to appropriate backend services and handles cross-cutting concerns like authentication.

## Features

- Central API entry point
- Authentication and authorization
- Request routing to microservices
- Service health monitoring
- Error handling

## API Endpoints

### Authentication

- `POST /auth/register`: Register a new user
- `POST /auth/login`: Login a user

### User Management

- `GET /users/:id`: Get user profile
- `PUT /users/:id`: Update user profile

### Notes

- `GET /notes`: Get all notes for the authenticated user
- `GET /notes/:id`: Get a specific note
- `POST /notes`: Create a new note
- `PUT /notes/:id`: Update a note
- `DELETE /notes/:id`: Delete a note

### AI Features

- `POST /analyze`: Analyze text with AI service

### System

- `GET /health`: Health check for the API Gateway
- `GET /services-health`: Check health of all backend services

## Local Development

1. Install dependencies:
   ```
   npm install
   ```

2. Run the service:
   ```
   npm run dev
   ```

3. The service will be available at http://localhost:8000

## Docker Development

Build and run the container:
```
docker build -t api-gateway .
docker run -p 8000:8000 api-gateway
```

## Environment Variables

- `PORT`: Port to run the service on (default: 8000)
- `NOTES_SERVICE_URL`: URL of the Notes service (default: http://localhost:8001)
- `AI_SERVICE_URL`: URL of the AI service (default: http://localhost:8002)
- `USER_SERVICE_URL`: URL of the User service (default: http://localhost:8003)
- `JWT_SECRET`: Secret key for JWT verification (default: 'your_jwt_secret_key')

## Notes for Production

In a production environment, you would want to:
- Set proper service URLs for all backend services
- Use the same JWT_SECRET across all services that need to verify tokens
- Implement rate limiting
- Add comprehensive logging and monitoring
- Set up proper error handling and fallback options
- Consider using a service mesh like Istio for more advanced service communication patterns 