# Monorepo Workspace Configuration

This repository follows a monorepo architecture with separate backend and frontend applications.

## Directory Structure

```
rust_blackjack/
├── api/                    # Rust Backend (Cargo Workspace)
│   ├── Cargo.toml         # Workspace manifest
│   ├── Dockerfile         # Backend container image
│   └── crates/
│       ├── blackjack-api/       # REST API server
│       ├── blackjack-cli/       # CLI application
│       ├── blackjack-core/      # Core game logic
│       └── blackjack-service/   # Business logic layer
├── frontend/              # React Frontend
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   └── public/
├── docs/                  # Documentation
│   ├── PRD.md
│   ├── DEPLOYMENT.md
│   └── postman/          # API testing resources
├── .github/              # CI/CD workflows
│   └── workflows/
├── .vscode/              # VS Code configuration
│   ├── launch.json       # Debug configurations
│   └── settings.json     # Workspace settings
└── README.md             # Main project documentation
```

## Backend (Rust)

The backend is a Cargo workspace located in `api/`:

- **Location**: `api/Cargo.toml`
- **Build**: `cd api && cargo build`
- **Test**: `cd api && cargo test --workspace`
- **Run API**: `cd api && cargo run --bin blackjack-api`

### VS Code Integration

Launch configurations in `.vscode/launch.json` use:
```json
"--manifest-path=api/Cargo.toml"
```

Rust Analyzer settings in `.vscode/settings.json`:
```json
"rust-analyzer.linkedProjects": ["api/Cargo.toml"]
```

## Frontend (React)

The frontend is a standalone React application:

- **Location**: `frontend/`
- **Install**: `cd frontend && npm install`
- **Dev**: `cd frontend && npm start`
- **Build**: `cd frontend && npm run build`

## Development Workflow

### Running Both Services

1. **Backend**:
   ```bash
   cd api
   cargo run --bin blackjack-api
   ```

2. **Frontend** (separate terminal):
   ```bash
   cd frontend
   npm start
   ```

### VS Code Tasks

Use the configured VS Code tasks for common operations:
- `Start Backend API`
- `Start Frontend Dev Server`
- `Start Full Stack (Backend + Frontend)`

## CI/CD

GitHub Actions workflows are configured in `.github/workflows/`:
- Backend: Rust tests, clippy, formatting
- Docker: Multi-stage build for backend API

## Environment Configuration

### Backend (.env)
Located in `api/crates/blackjack-api/`:
```
BLACKJACK_JWT_SECRET=your-secret-key
BLACKJACK_SERVER_PORT=8080
```

### Frontend (.env)
Located in `frontend/`:
```
REACT_APP_API_URL=http://localhost:8080
```

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment instructions.

### Docker Deployment

The backend can be containerized using the Dockerfile in `api/`:
```bash
docker build -t blackjack-api -f api/Dockerfile .
docker run -p 8080:8080 blackjack-api
```

## Testing

### Backend Tests
```bash
cd api
cargo test --workspace
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Documentation

- **Product Requirements**: [docs/PRD.md](docs/PRD.md)
- **API Reference**: [docs/API_REFERENCE.md](docs/API_REFERENCE.md) (if exists)
- **Security**: [docs/SECURITY.md](docs/SECURITY.md) (if exists)
- **Deployment**: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- **API Testing**: [docs/postman/README.md](docs/postman/README.md)
