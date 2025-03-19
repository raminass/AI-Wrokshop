# User Service

This microservice handles user authentication and profile management for the Smart Note-Taking application.

## Features

- User registration and login
- JWT-based authentication
- User profile management
- Password hashing with bcrypt
- MongoDB integration for data persistence

## API Endpoints

- `GET /health`: Health check endpoint
- `POST /users/register`: Register a new user
  - Request body: `{ "name": "John Doe", "email": "john@example.com", "password": "securepassword" }`
  - Response: `{ "id": "user_id", "name": "John Doe", "email": "john@example.com", "token": "jwt_token" }`
- `POST /users/login`: Login a user
  - Request body: `{ "email": "john@example.com", "password": "securepassword" }`
  - Response: `{ "id": "user_id", "name": "John Doe", "email": "john@example.com", "token": "jwt_token" }`
- `GET /users/:id`: Get user profile (JWT authentication required)
  - Response: `{ "id": "user_id", "name": "John Doe", "email": "john@example.com", "created_at": "date", "updated_at": "date" }`
- `PUT /users/:id`: Update user profile (JWT authentication required)
  - Request body: `{ "name": "John Updated", "email": "john.updated@example.com" }`
  - Response: `{ "id": "user_id", "name": "John Updated", "email": "john.updated@example.com", "created_at": "date", "updated_at": "date" }`

## Local Development

1. Install dependencies:
   ```
   npm install
   ```

2. Run the service:
   ```
   npm run dev
   ```

3. The service will be available at http://localhost:8003

## Docker Development

Build and run the container:
```
docker build -t user-service .
docker run -p 8003:8003 user-service
```

## Environment Variables

- `MONGODB_URI`: MongoDB connection string (default: mongodb://localhost:27017/users)
- `PORT`: Port to run the service on (default: 8003)
- `JWT_SECRET`: Secret key for JWT signing (default: 'your_jwt_secret_key')

## Notes for Production

In a production environment, you would want to:
- Set a strong JWT_SECRET environment variable
- Implement role-based access control
- Add email verification
- Implement password reset functionality
- Use HTTPS for all communications
- Add rate limiting for login attempts
- Implement proper logging and monitoring 