# Frontend Quick Start Guide

## 🚀 Getting Started

### 1. Install Dependencies

```powershell
cd frontend
npm install
```

### 2. Start Development Server

**Option A: Use VS Code Debugger**
1. Press `F5`
2. Select **"🎯 Debug Full Stack (Backend + Frontend)"**
3. Both backend and frontend will start automatically

**Option B: Use VS Code Tasks**
1. Press `Ctrl+Shift+P`
2. Type "Tasks: Run Task"
3. Select **"Start Full Stack (Backend + Frontend)"**

**Option C: Manual Start**
```powershell
# Terminal 1 - Backend
cargo run --bin blackjack-api

# Terminal 2 - Frontend
cd frontend
npm start
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **API Health Check**: http://localhost:8080/api/v1/health

## 🔧 Available NPM Scripts

- `npm start` - Start development server (port 3000)
- `npm run build` - Create production build
- `npm test` - Run tests in watch mode
- `npm run eject` - Eject from Create React App (⚠️ irreversible)

## 🌐 Environment Variables

The frontend uses the following environment variables:

**Development** (`.env.development`):
- `REACT_APP_API_URL=http://localhost:8080`
- `REACT_APP_WS_URL=ws://localhost:8080/ws`
- `REACT_APP_DEBUG=true`

**Production** (`.env.production`):
- Configure before deployment

## 🎯 VS Code Debug Configurations

### Available Configurations:

1. **⚛️ Run Frontend Dev Server** - Frontend only
2. **🦀 Run Backend API** - Backend only
3. **🎯 Debug Full Stack (Backend + Frontend)** - Both services

### Setting Breakpoints:

**Frontend (TypeScript/React):**
- Set breakpoints in `.tsx` or `.ts` files
- Breakpoints work in VS Code and browser DevTools

**Backend (Rust):**
- Set breakpoints in `.rs` files
- Use CodeLLDB debugger features

## 📝 Development Workflow

1. Start both services using "Debug Full Stack"
2. Frontend auto-reloads on file changes (Hot Module Replacement)
3. Backend requires restart on code changes (use `Ctrl+Shift+F5`)
4. Use browser DevTools for React DevTools extension

## 🔍 API Integration

The frontend uses Axios for API calls. Base configuration in:
- [src/api/client.ts](src/api/client.ts) - Axios instance with interceptors
- [src/api/auth.ts](src/api/auth.ts) - Authentication endpoints
- [src/api/games.ts](src/api/games.ts) - Game management endpoints
- [src/api/invitations.ts](src/api/invitations.ts) - Invitation endpoints

## 🛠️ Troubleshooting

### Port 3000 already in use
```powershell
# Find and kill the process
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### CORS errors
- Ensure backend has CORS configured for `http://localhost:3000`
- Check [crates/blackjack-api/config.toml](../crates/blackjack-api/config.toml)

### TypeScript errors
```powershell
# Restart TypeScript server in VS Code
Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### Module not found
```powershell
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📚 Next Steps

1. Review component structure in [src/components/](src/components/)
2. Check API integration in [src/api/](src/api/)
3. Explore authentication context in [src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx)
4. Start with [src/pages/LoginPage.tsx](src/pages/LoginPage.tsx)

## 🔗 Related Documentation

- [Main README](../README.md)
- [PRD - Milestone 9](../docs/PRD.md#milestone-9-react-frontend-application)
- [API Documentation](../docs/API_REFERENCE.md)
- [VS Code Configuration Guide](../.vscode/README.md)

---

**Ready to code!** Press `F5` and select "🎯 Debug Full Stack" to get started! 🚀
