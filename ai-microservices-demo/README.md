# AI Microservices Demo

This project demonstrates a microservices architecture with AI integration. It's a simple "Smart Note-Taking" application that uses sentiment analysis and text categorization to enhance user notes.

## Architecture Overview

The application consists of five microservices:

1. **Frontend Service**: React-based user interface
2. **API Gateway**: Central entry point that routes requests to appropriate services
3. **Notes Service**: Handles CRUD operations for user notes
4. **AI Service**: Performs sentiment analysis and categorization on notes
5. **User Service**: Manages user authentication and profiles

![Architecture Diagram](./architecture.png)

## Prerequisites

- Docker and Docker Compose
- Git

## Getting Started

1. Clone this repository:
   ```
   git clone <repo-url>
   cd ai-microservices-demo
   ```

2. Start all services using Docker Compose:
   ```
   docker-compose up
   ```

3. Access the application at http://localhost:3000

## Service Details

### Frontend Service (Port 3000)
React application that provides the user interface.

### API Gateway (Port 8000)
Node.js/Express service that routes requests to the appropriate microservices.

### Notes Service (Port 8001)
Python/Flask service that handles CRUD operations for notes.

### AI Service (Port 8002)
Python service that performs sentiment analysis and categorization on note content.

### User Service (Port 8003)
Node.js service that handles user authentication.

## Development

Each service can be developed and run independently. See the README in each service directory for specific instructions.

## Educational Purpose

This demo is designed for educational purposes to illustrate:
- Microservices architecture patterns
- Service communication
- Containerization with Docker
- AI integration in a distributed system
- API design 