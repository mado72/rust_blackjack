# Frontend Configuration Guide

## Overview
React 18 frontend application for the Rust Blackjack multiplayer game.

## Prerequisites
- Node.js 18+ and npm 9+
- Backend API running on http://localhost:8080

## Installation

```bash
cd frontend
npm install
```

## Development

### Start Development Server
```bash
npm start
```
The app will run at http://localhost:3000 with hot reload enabled.

### Environment Variables

Create `.env.local` for local development overrides:

```env
# Backend API URL
REACT_APP_API_URL=http://localhost:8080

# WebSocket URL (for future use)
REACT_APP_WS_URL=ws://localhost:8080/ws

# Debug logging
REACT_APP_DEBUG=true
```

### Available Scripts

- `npm start` - Start development server (port 3000)
- `npm build` - Build production bundle
- `npm test` - Run tests in watch mode
- `npm eject` - Eject from Create React App (one-way operation)

## Project Structure

```
frontend/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── api/                # API client functions
│   │   ├── auth.ts
│   │   ├── client.ts
│   │   ├── games.ts
│   │   └── invitations.ts
│   ├── components/         # React components
│   │   ├── auth/
│   │   ├── game/
│   │   ├── lobby/
│   │   └── shared/
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx
│   ├── hooks/              # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useGame.ts
│   │   └── useWebSocket.ts
│   ├── pages/              # Page components
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── LobbyPage.tsx
│   │   └── GamePage.tsx
│   ├── types/              # TypeScript types
│   │   ├── api.ts
│   │   ├── game.ts
│   │   └── user.ts
│   ├── utils/              # Utility functions
│   │   ├── formatters.ts
│   │   └── validators.ts
│   ├── App.tsx             # Main app component
│   ├── index.tsx           # Entry point
│   └── index.css           # Global styles
├── package.json
├── tsconfig.json
└── .env.development        # Development environment variables
```

## Technology Stack

- **React 18.2** - UI framework
- **React Router 6.20** - Client-side routing
- **TypeScript 4.9** - Type safety
- **Axios 1.6** - HTTP client
- **React Scripts 5.0** - Build tooling

## Features

### Authentication
- User registration and login
- JWT token management
- Protected routes

### Game Lobby
- Browse open games
- Create new games
- Accept/decline invitations
- Real-time game list updates

### Gameplay
- Interactive game board
- Card display and management
- Turn-based actions (hit, stand, change ace values)
- Real-time game state updates

## API Integration

The frontend communicates with the Rust backend API:

- Base URL: `http://localhost:8080` (via proxy in development)
- API endpoints: `/api/v1/*`
- Authentication: JWT Bearer tokens
- WebSocket: `/ws` (planned for Milestone 10)

### Proxy Configuration

The `package.json` includes a proxy setting to avoid CORS issues during development:

```json
"proxy": "http://localhost:8080"
```

This allows the frontend to make requests to `/api/v1/*` without CORS preflight.

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

### Production Deployment

The build output can be served by:
- Static file server (nginx, Apache)
- CDN (Cloudflare, AWS S3 + CloudFront)
- Container (Docker with nginx)

Configure the backend API URL in production environment:

```env
REACT_APP_API_URL=https://api.your-domain.com
```

## Troubleshooting

### Port Already in Use
If port 3000 is busy:
```bash
# Windows
$env:PORT=3001; npm start

# Linux/Mac
PORT=3001 npm start
```

### API Connection Issues
1. Verify backend is running: `curl http://localhost:8080/health`
2. Check proxy configuration in `package.json`
3. Review browser console for CORS errors

### TypeScript Errors
```bash
# Clear TypeScript cache
rm -rf node_modules/.cache
npm start
```

## VS Code Integration

The workspace includes tasks for frontend development:

- **Start Frontend Dev Server** - Launch dev server
- **Build Frontend** - Production build
- **Test Frontend** - Run tests
- **Install Frontend Dependencies** - Run npm install

Access via Command Palette: `Tasks: Run Task`

## Next Steps

- Complete component implementations
- Add unit tests for components
- Implement WebSocket integration (Milestone 10)
- Add error boundaries
- Enhance accessibility (WCAG compliance)
- Add loading states and animations

## Resources

- [React Documentation](https://react.dev/)
- [React Router Docs](https://reactrouter.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Axios Documentation](https://axios-http.com/)
