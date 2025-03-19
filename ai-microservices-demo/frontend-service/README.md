# Frontend Service

This microservice provides the user interface for the Smart Note-Taking application. It's built with React and communicates with the backend via the API Gateway.

## Features

- User authentication (login/register)
- Note management (create, read, update, delete)
- AI-enhanced note insights (sentiment analysis, categorization)
- Responsive interface for desktop and mobile

## Local Development

1. Install dependencies:
   ```
   npm install
   ```

2. Run the development server:
   ```
   npm start
   ```

3. The application will be available at http://localhost:3000

## Docker Development

Build and run the container:
```
docker build -t frontend-service .
docker run -p 3000:3000 frontend-service
```

## Building for Production

```
npm run build
```

This will create a production-ready build in the `build` folder.

## Key Components

- **App**: Main application component and routing
- **AuthContext**: Context provider for authentication state
- **Login/Register**: User authentication screens
- **Notes List**: Display all notes for the user
- **Note Editor**: Create and edit notes
- **Note Detail**: Display note details with AI insights

## API Integration

The frontend communicates with the API Gateway on the following endpoints:

- Auth: `/api/auth/login`, `/api/auth/register`
- Notes: `/api/notes`
- User: `/api/users/:id`

## Environment Variables

Create a `.env` file in the root directory to configure the application:

```
REACT_APP_API_URL=http://localhost:8000
```

## Notes for Production

In a production environment, you would want to:
- Use HTTPS for all communications
- Implement proper error handling and loading states
- Add comprehensive analytics and monitoring
- Consider implementing Progressive Web App (PWA) features
- Add automated testing for key user flows 