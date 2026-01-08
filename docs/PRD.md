# Product Requirements Document - Blackjack Multi-Player Backend System

**Version:** 1.2.0  
**Last Updated:** January 8, 2026  
**Status:** 🚧 **IN PROGRESS** - Milestones 1-6 Complete, Milestones 7-8 Planned

## Document Overview

This document details the transformation of the CLI blackjack game into a production-ready REST backend system with versioned API, JWT authentication, multi-player game management (1-10 players per game), shared 52-card deck, ordered card history, flexible Ace value changes, rate limiting, structured logging, health checks, standardized errors, external configuration, and CI/CD pipeline.

**Implementation Status: Milestones 1-6 Complete (100%) | Milestones 7-8 Planned** 🚧

---

## Milestone 1: Workspace Configuration and CI/CD

**Status:** `completed`  
**Dependencies:** None  
**Estimated Effort:** 4 hours

### Tasks

- [x] Create workspace root `Cargo.toml` with members: `["crates/blackjack-core", "crates/blackjack-service", "crates/blackjack-api", "crates/blackjack-cli"]`
- [x] Create `crates/blackjack-core/Cargo.toml` with dependencies: rand 0.9.2, uuid v4, serde derive
- [x] Create `crates/blackjack-service/Cargo.toml` with dependencies: thiserror 2, tracing 0.1
- [x] Create `crates/blackjack-api/Cargo.toml` with dependencies: axum 0.7, tokio full, serde derive, serde_json, jsonwebtoken 9, tower-http cors 0.6, tower 0.5, tracing 0.1, tracing-subscriber 0.3 env-filter, config 0.14, dotenv 0.15
- [x] Add commented future dependencies: `# Future: sqlx, metrics, metrics-exporter-prometheus, notify, validator`
- [x] Move `src/main.rs` to `crates/blackjack-cli/src/main.rs` (preserve original CLI version)
- [x] Create `.github/workflows/ci.yml` with jobs:
  - [x] `test`: cargo test --workspace
  - [x] `lint`: cargo clippy -- -D warnings
  - [x] `format`: cargo fmt --check
  - [x] `build`: cargo build --release
  - [x] `docker-build`: multi-stage Dockerfile

### Acceptance Criteria

- ✅ Workspace builds successfully with `cargo build --workspace`
- ✅ CI pipeline runs all checks on push/PR
- ✅ Original CLI version preserved and functional

---

## Milestone 2: Core Crate (blackjack-core)

**Status:** `completed`  
**Dependencies:** Milestone 1  
**Estimated Effort:** 8 hours

### Tasks

- [x] Expand CARDS constant from 13 to 52 cards (4 copies of each type)
- [x] Add suits: ["Hearts", "Diamonds", "Clubs", "Spades"]
- [x] Create `Card` struct with `#[derive(Debug, Clone, Serialize, Deserialize)]`:
  - [x] Fields: `id: Uuid, name: String, value: u8, suit: String`
- [x] Create `Player` struct:
  - [x] Fields: `email: String, points: u8, cards_history: Vec<Card>, ace_values: HashMap<Uuid, bool>, busted: bool`
  - [x] `ace_values` maps card_id to is_eleven (true = 11 points, false = 1 point)
- [x] Create `PlayerSummary` struct:
  - [x] Fields: `points: u8, cards_count: usize, busted: bool`
- [x] Create `GameResult` struct:
  - [x] Fields: `winner: Option<String>, tied_players: Vec<String>, highest_score: u8, all_players: HashMap<String, PlayerSummary>`
- [x] Create `Game` struct:
  - [x] Fields: `id: Uuid, players: HashMap<String, Player>, available_cards: Vec<Card>, finished: bool`
- [x] Implement `Game::new(player_emails)` method:
  - [x] Validate 1-10 unique non-empty emails
  - [x] Initialize 52-card deck
  - [x] Add `#[tracing::instrument]` attribute
- [x] Implement `Game::draw_card(email) -> Result<Card, GameError>`:
  - [x] Remove random card from deck if `!finished`
  - [x] Update player's cards_history
  - [x] Add `#[tracing::instrument]` attribute
- [x] Implement `Game::set_ace_value(email, card_id, as_eleven)`:
  - [x] Recalculate player points if `!finished`
  - [x] Allow multiple changes to same Ace
  - [x] Add `#[tracing::instrument]` attribute
- [x] Implement `Game::finish_game()`:
  - [x] Set `finished = true`
- [x] Implement `Game::calculate_results() -> GameResult`:
  - [x] Based on `determine_winner` logic from main.rs lines 138-167
  - [x] Handle single winner, ties, all-bust scenarios
- [x] Document all public structs, methods and functions:
  - [x] Add comprehensive doc comments with examples
  - [x] Document struct fields and their purposes
  - [x] Include usage examples for key methods
  - [x] Add inline comments for complex logic

### Acceptance Criteria

- ✅ All structs serialize/deserialize correctly to JSON
- ✅ Deck contains exactly 52 unique cards (4 of each type)
- ✅ Ace value can be changed multiple times
- ✅ Game finished prevents further operations
- ✅ All methods have tracing instrumentation

---

## Milestone 3: Service Crate with Migrations, Logging and Config

**Status:** `completed`  
**Dependencies:** Milestone 2  
**Estimated Effort:** 6 hours

### Tasks

- [x] Create `ServiceConfig` struct:
  - [x] Fields: `max_players: u8, min_players: u8`
  - [x] Load from env vars with defaults (1-10)
- [x] Create `GameService` struct:
  - [x] Fields: `games: Arc<Mutex<HashMap<Uuid, Game>>>, config: ServiceConfig`
- [x] Create `crates/blackjack-service/migrations/` directory
- [x] Create `20250101000000_initial_schema.sql` with commented SQL:
  ```sql
  -- CREATE TABLE games (
  --   id TEXT PRIMARY KEY,
  --   finished BOOLEAN NOT NULL DEFAULT 0,
  --   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  -- );
  -- CREATE TABLE players (
  --   id TEXT PRIMARY KEY,
  --   email TEXT NOT NULL,
  --   game_id TEXT NOT NULL REFERENCES games(id),
  --   points INTEGER NOT NULL,
  --   busted BOOLEAN NOT NULL,
  --   UNIQUE(email, game_id)
  -- );
  -- CREATE TABLE cards_history (
  --   id TEXT PRIMARY KEY,
  --   player_id TEXT NOT NULL REFERENCES players(id),
  --   card_id TEXT NOT NULL,
  --   name TEXT NOT NULL,
  --   suit TEXT NOT NULL,
  --   value INTEGER NOT NULL,
  --   drawn_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  -- );
  -- CREATE INDEX idx_players_game ON players(game_id);
  -- CREATE INDEX idx_cards_player ON cards_history(player_id);
  ```
- [x] Implement `GameService::create_game(emails) -> Result<Uuid, GameError>`:
  - [x] Validate against `config.min_players` and `config.max_players`
  - [x] Log game creation with `tracing::info!`
  - [x] Add `#[tracing::instrument(skip(self), fields(game_id))]`
- [x] Implement `GameService::draw_card(game_id, email) -> Result<DrawCardResponse>`:
  - [x] Return `{card: Card, current_points: u8, busted: bool, cards_remaining: usize, cards_history: Vec<Card>}`
  - [x] Log card drawn with `tracing::debug!`
  - [x] Add instrumentation with game_id and player_email fields
- [x] Implement `GameService::set_ace_value(game_id, email, card_id, as_eleven) -> Result<PlayerStateResponse>`:
  - [x] Return `{points: u8, busted: bool}`
  - [x] Add instrumentation
- [x] Implement `GameService::get_game_state(game_id) -> Result<GameStateResponse>`:
  - [x] Return `{players: HashMap<email, PlayerInfo>, cards_in_deck: usize, finished: bool}`
  - [x] `PlayerInfo {points: u8, cards_history: Vec<Card>, busted: bool}`
- [x] Implement `GameService::finish_game(game_id) -> Result<GameResult>`:
  - [x] Log winner with `tracing::info!`
- [x] Create `GameError` enum with thiserror derives:
  - [x] Variants: GameNotFound, PlayerNotInGame, PlayerAlreadyBusted, InvalidPlayerCount, InvalidEmail, DeckEmpty, GameAlreadyFinished
- [x] Document all service layer code:
  - [x] Add module-level documentation explaining service architecture
  - [x] Document ServiceConfig and GameService structs
  - [x] Add doc comments to all public methods with examples
  - [x] Document error types and when they occur
  - [x] Include inline comments for concurrency patterns

### Acceptance Criteria

- ✅ Service handles concurrent access safely with Arc/Mutex
- ✅ All operations properly instrumented with tracing
- ✅ Configuration loaded from environment variables
- ✅ SQL migrations documented for future implementation
- ✅ Comprehensive error types with descriptive messages

---

## Milestone 4: API Crate - External Configuration and Authentication

**Status:** `completed`  
**Dependencies:** Milestone 3  
**Estimated Effort:** 8 hours

### Tasks

- [x] Create `crates/blackjack-api/config.toml`:
  ```toml
  [server]
  host = "127.0.0.1"
  port = 8080
  
  [cors]
  allowed_origins = ["http://localhost:3000"]
  
  [jwt]
  secret = "dev-secret-key-change-in-production"
  expiration_hours = 24
  
  [rate_limit]
  requests_per_minute = 10
  
  [api]
  version_deprecation_months = 6
  ```
- [x] Create `AppConfig` struct using `config` crate:
  - [x] Load from `config.toml`
  - [x] Override with env vars `BLACKJACK_*`
- [x] Create `.env.example` with variables:
  - [x] `BLACKJACK_JWT_SECRET`
  - [x] `BLACKJACK_SERVER_PORT`
  - [x] `RUST_LOG`
- [x] Initialize tracing in main:
  - [x] `tracing_subscriber::fmt().with_env_filter().init()`
- [x] Create `Claims` struct:
  - [x] Fields: `email: String, game_id: String, exp: usize`
- [x] Create `ApiError` struct:
  - [x] Fields: `message: String, code: String, status: u16, details: Option<HashMap<String, String>>`
  - [x] Implement `IntoResponse` trait
- [x] Create `RateLimiter` struct:
  - [x] Use `config.rate_limit.requests_per_minute`
  - [x] Track requests per `{game_id}:{email}` key
  - [x] Use `Arc<Mutex<HashMap<String, VecDeque<Instant>>>>`
- [x] Implement `POST /api/v1/auth/login`:
  - [x] Accept `{email: String, game_id: String}`
  - [x] Validate via `service.get_game_state()`
  - [x] Generate JWT with `config.jwt.expiration_hours` and `config.jwt.secret`
  - [x] Return `{token: String, expires_in: usize}`
  - [x] Log authentication attempt with game_id and email
- [x] Create `auth_middleware`:
  - [x] Extract Bearer token from Authorization header
  - [x] Decode JWT using `jsonwebtoken::decode`
  - [x] Inject `Claims` via Axum Extension
  - [x] Return `ApiError {status: 401, code: "UNAUTHORIZED"}` on failure
  - [x] Log authentication with `tracing::debug!`
- [x] Create `rate_limit_middleware`:
  - [x] Check request limit per player
  - [x] Return `ApiError {status: 429, code: "RATE_LIMIT_EXCEEDED"}` if exceeded
  - [x] Log excess with `tracing::warn!`
- [x] Create `version_deprecation_middleware`:
  - [x] Add headers `X-API-Deprecated`, `X-API-Sunset-Date`
  - [x] Calculate sunset date from `config.api.version_deprecation_months`
- [x] Document all API infrastructure code:
  - [x] Add comprehensive module documentation (config.rs, error.rs, auth.rs, rate_limiter.rs, middleware.rs, handlers.rs, lib.rs, main.rs)
  - [x] Document configuration loading and environment variable precedence
  - [x] Add examples for middleware usage and chaining
  - [x] Document error handling patterns and ApiError structure
  - [x] Include authentication flow documentation
  - [x] Document rate limiting algorithm and implementation
  - [x] Add startup sequence documentation in main.rs

### Acceptance Criteria

- ✅ Configuration loads from file and env vars (env vars take precedence)
- ✅ JWT authentication works with configurable secret and expiration
- ✅ Rate limiting enforces configured limits per player
- ✅ All errors return standardized JSON format
- ✅ Middleware properly chains and injects context
- ✅ All modules fully documented with examples
- ✅ 13 integration tests passing (config, state, errors, rate limiter, service conversion)

---

## Milestone 5: API Crate - REST Endpoints, Health Checks and WebSocket Blueprint

**Status:** `completed`  
**Dependencies:** Milestone 4  
**Estimated Effort:** 10 hours

### Tasks

- [x] Create `crates/blackjack-api/src/websocket.rs` with commented blueprint
- [x] Implement `GET /health`
- [x] Implement `GET /health/ready`
- [x] Implement `POST /api/v1/games`
- [x] Implement `GET /api/v1/games/:game_id` (protected)
- [x] Implement `POST /api/v1/games/:game_id/draw` (protected)
- [x] Implement `PUT /api/v1/games/:game_id/ace` (protected)
- [x] Implement `POST /api/v1/games/:game_id/finish` (protected)
- [x] Implement `GET /api/v1/games/:game_id/results` (protected)
- [x] Configure CORS with `config.cors.allowed_origins`
- [x] Configure server to bind to `config.server.host:config.server.port`
- [x] Document all REST endpoints and handlers with comprehensive examples

### Acceptance Criteria

- ✅ All endpoints versioned under `/api/v1`
- ✅ Health checks return proper status
- ✅ Protected endpoints require valid JWT
- ✅ Rate limiting applied to all protected endpoints
- ✅ CORS configured for allowed origins
- ✅ WebSocket blueprint documented for future implementation
- ✅ All operations logged with structured tracing
- ✅ All 74 tests passing (13 API + 13 CLI + 19 Core + 12 Service + 17 doctests)

---

## Milestone 6: Tests, Documentation and Docker

**Status:** `completed`  
**Dependencies:** Milestone 5  
**Estimated Effort:** 12 hours

### Tasks

#### Core Tests
- [x] Create `crates/blackjack-core/tests/integration_tests.rs` (19 tests)
- [x] Test deck has exactly 52 cards
- [x] Test 4 cards of each type (A, 2-10, J, Q, K)
- [x] Test deck exhaustion returns `GameError::DeckEmpty`
- [x] Test Ace value can be changed multiple times
- [x] Test game finished prevents draw/ace operations
- [x] Test JSON serialization/deserialization of all structs
- [x] Test `Game::calculate_results()` winner determination
- [x] Test `GameResult` with single winner, ties, all-bust scenarios

#### Service Tests
- [x] Create `crates/blackjack-service/tests/service_tests.rs` (12 tests)
- [x] Test concurrent access with Arc/Mutex
- [x] Test config validation (min_players, max_players)
- [x] Test `GameService::create_game()` with valid/invalid player counts
- [x] Test `GameService::draw_card()` response structure
- [x] Test `GameService::set_ace_value()` state updates
- [x] Test `GameService::get_game_state()` data consistency
- [x] Test `GameService::finish_game()` state transition
- [x] Test `GameError` variants and error messages

#### API Tests
- [x] Create `crates/blackjack-api/tests/api_tests.rs` (13 tests)
- [x] Test rate limiting enforcement
- [x] Test config loading from file and env vars
- [x] Test `ApiError` format with details field
- [x] Test `AppConfig` loading
- [x] Test `Claims` struct
- [x] Test `RateLimiter` request tracking and limit enforcement
- [x] Test service error conversion to API errors

#### Docker
- [x] Create `Dockerfile` multi-stage
- [x] Build stage: `cargo build --release`
- [x] Runtime stage: copy binary
- [x] `EXPOSE 8080`
- [x] `CMD ["blackjack-api"]`
- [x] Create `.dockerignore`

#### Code Documentation Review
- [x] Review and validate all inline documentation
- [x] Ensure all public APIs have doc comments
- [x] Verify all examples in doc comments are correct
- [x] Validate that error types are well documented
- [x] Ensure module-level docs explain architecture
- [x] Fix clippy warnings (0 warnings remaining)

#### Documentation
- [x] Create comprehensive `README.md` with sections:
- [x] **Project Structure**: workspace layout
- [x] **Configuration**: document `config.toml`, env vars `BLACKJACK_*`
- [x] **Development**: Setup, run API, run tests
- [x] **CI/CD**: GitHub Actions workflow
- [x] **Observability**: structured logs with tracing, health checks
- [x] **Future Enhancements**: SQLite, WebSockets, metrics, etc.
- [x] **API Examples**: complete curl flow (create game → login → draw → finish → results)
- [x] **API Reference**: all endpoints with request/response schemas
- [x] **Production Deployment**: Docker, reverse proxy, configuration
    - [ ] Get results
  - [ ] **API Reference**: all endpoints with request/response schemas
  - [ ] **Production Deployment**: Docker, reverse proxy, external config, log aggregation

### Acceptance Criteria

- ✅ All tests pass with `cargo test --workspace` (74 tests)
- ✅ Test coverage includes concurrent scenarios
- ✅ Docker image builds and runs successfully
- ✅ Documentation is comprehensive and clear (README.md with 400+ lines)
- ✅ All code passes `cargo clippy -- -D warnings` without errors
- ✅ CI/CD pipeline executes all milestones successfully
- ✅ Core tests (19): Deck validation, Ace mechanics, game state, winner calculation
- ✅ Service tests (12): Concurrent access, configuration, error handling
- ✅ API tests (13): Configuration, errors, rate limiting, authentication
- ✅ CLI tests (13): Original game logic preserved
- ✅ Doc tests (17): All documentation examples compile and run

---

## Milestone 7: Turn-Based Gameplay and User Management

**Status:** `planned`  
**Dependencies:** Milestone 6  
**Estimated Effort:** 16 hours

### Overview

Refactor game flow to implement turn-based gameplay with proper user management, authentication, and game invitation system. This milestone transforms the game from a simultaneous multi-player model to a structured turn-based experience.

### Key Changes

#### 1. User Authentication
- **Current:** JWT authentication based on email + game_id
- **New:** User login with email + password (password validation to be implemented in future milestone)
- **Impact:** Requires user management system and session handling

#### 2. Game Creation Flow
- **Current:** Anyone can create a game with a list of player emails
- **New:** Only authenticated users can create games
- **Impact:** Game creation endpoint requires authentication

#### 3. Player Invitation System
- **Current:** All players specified at game creation
- **New:** Game creator invites players by email after game creation
- **Timeout:** Game creator specifies timeout for each invitation (default 300 seconds if not specified)
- **Impact:** New invitation endpoints, pending invitation state, per-invitation expiration handling

#### 4. Turn-Based Card Drawing
- **Current:** Any player can draw cards at any time
- **New:** Players draw cards in turn order, one card per turn
- **Impact:** Requires turn management, turn order tracking, and turn validation

#### 5. Stand Mechanism
- **Current:** Players implicitly stop when they choose not to draw
- **New:** Players explicitly declare they're done by calling "stand"
- **Impact:** New stand endpoint and player state tracking

#### 6. Game Completion Logic
- **Current:** Manual finish_game call
- **New:** Automatic game end when all players have stood or busted
- **Impact:** Game state monitoring and automatic transition to finished state

### Tasks

#### Core Layer Changes

- [ ] **User Management**
  - [ ] Create `User` struct with fields: `id: Uuid, email: String, password_hash: String, created_at: DateTime`
  - [ ] Create `UserStore` in-memory storage: `Arc<Mutex<HashMap<Uuid, User>>>`
  - [ ] Implement `User::new(email, password)` - hash password (use placeholder for now)
  - [ ] Add `#[derive(Serialize, Deserialize)]` to User struct

- [ ] **Game State Extensions**
  - [ ] Add `creator_id: Uuid` field to `Game` struct
  - [ ] Add `turn_order: Vec<String>` field (list of player emails in order)
  - [ ] Add `current_turn_index: usize` field
  - [ ] Add `player_states: HashMap<String, PlayerState>` field
  - [ ] Create `PlayerState` enum: `Active, Standing, Busted`
  - [ ] Modify `Player` struct to include `state: PlayerState`

- [ ] **Invitation System**
  - [ ] Create `GameInvitation` struct: `id: Uuid, game_id: Uuid, inviter_email: String, invitee_email: String, status: InvitationStatus, timeout_seconds: u64, created_at: DateTime, expires_at: DateTime`
  - [ ] Create `InvitationStatus` enum: `Pending, Accepted, Declined, Expired`
  - [ ] Create `InvitationStore`: `Arc<Mutex<HashMap<Uuid, GameInvitation>>>`
  - [ ] Implement `GameInvitation::is_expired() -> bool` - checks if current time > expires_at
  - [ ] Implement `GameInvitation::new(game_id, inviter, invitee, timeout_seconds)` - sets expires_at based on timeout_seconds

- [ ] **Turn Management**
  - [ ] Implement `Game::get_current_player() -> Option<&str>` - returns email of player whose turn it is
  - [ ] Implement `Game::advance_turn()` - moves to next active player
  - [ ] Implement `Game::can_player_act(email) -> bool` - validates it's player's turn
  - [ ] Update `Game::draw_card(email)` to validate current turn
  - [ ] Implement `Game::stand(email) -> Result<(), GameError>` - marks player as standing

- [ ] **Auto-finish Logic**
  - [ ] Implement `Game::check_auto_finish() -> bool` - checks if all players stood/busted
  - [ ] Call `check_auto_finish()` after each draw_card and stand action
  - [ ] Automatically set `finished = true` when conditions met

#### Service Layer Changes

- [ ] **Configuration Updates**
  - [ ] Add `InvitationConfig` struct with fields: `default_timeout_seconds: u64` (default: 300), `max_timeout_seconds: u64` (default: 3600)
  - [ ] Add to `config.toml`: `[invitations]` section with `default_timeout_seconds = 300` and `max_timeout_seconds = 3600`
  - [ ] Load from env vars `BLACKJACK_INVITATIONS_DEFAULT_TIMEOUT_SECONDS` and `BLACKJACK_INVITATIONS_MAX_TIMEOUT_SECONDS`

- [ ] **User Service**
  - [ ] Create `UserService` struct with `users: Arc<Mutex<HashMap<Uuid, User>>>`
  - [ ] Implement `UserService::register(email, password) -> Result<Uuid, ServiceError>`
  - [ ] Implement `UserService::login(email, password) -> Result<User, ServiceError>`
  - [ ] Implement `UserService::get_user(user_id) -> Result<User, ServiceError>`
  - [ ] Add `ServiceError::UserNotFound`, `ServiceError::UserAlreadyExists`, `ServiceError::InvalidCredentials`

- [ ] **Game Service Updates**
  - [ ] Update `GameService::create_game(creator_id, initial_players)` to require creator_id
  - [ ] Implement `GameService::invite_player(game_id, inviter_id, invitee_email, timeout_seconds: Option<u64>) -> Result<Uuid, ServiceError>`
    - [ ] Validate timeout is within allowed range
    - [ ] Pass timeout to InvitationService
  - [ ] Implement `GameService::accept_invitation(invitation_id, user_id) -> Result<(), ServiceError>`
  - [ ] Implement `GameService::decline_invitation(invitation_id, user_id) -> Result<(), ServiceError>`
  - [ ] Update `GameService::draw_card(game_id, user_id)` to validate turn order
  - [ ] Implement `GameService::stand(game_id, user_id) -> Result<GameStateResponse, ServiceError>`
  - [ ] Add `ServiceError::NotPlayerTurn`, `ServiceError::PlayerNotInvited`, `ServiceError::InvitationNotFound`, `ServiceError::InvitationExpired`, `ServiceError::InvalidTimeout`

- [ ] **Invitation Service**
  - [ ] Create `InvitationService` struct with `config: InvitationConfig`
  - [ ] Implement `InvitationService::create(game_id, inviter, invitee, timeout_seconds: Option<u64>) -> Result<Uuid, ServiceError>`
    - [ ] Use `timeout_seconds.unwrap_or(config.default_timeout_seconds)`
    - [ ] Validate timeout doesn't exceed `config.max_timeout_seconds`
    - [ ] Return `ServiceError::InvalidTimeout` if exceeds max
    - [ ] Calculate `expires_at = created_at + timeout_seconds`
    - [ ] Store invitation with expiration time and timeout value
  - [ ] Implement `InvitationService::accept(invitation_id) -> Result<(), ServiceError>`
    - [ ] Check if invitation is expired before accepting
    - [ ] Return `ServiceError::InvitationExpired` if expired
    - [ ] Auto-update status to Expired if expired
  - [ ] Implement `InvitationService::decline(invitation_id) -> Result<(), ServiceError>`
  - [ ] Implement `InvitationService::get_pending_for_user(email) -> Vec<GameInvitation>`
    - [ ] Filter out expired invitations
    - [ ] Auto-update expired invitations to Expired status
  - [ ] Implement `InvitationService::cleanup_expired() -> usize`
    - [ ] Background task to mark expired invitations
    - [ ] Return count of expired invitations

#### API Layer Changes

- [ ] **Authentication Endpoints**
  - [ ] Implement `POST /api/v1/auth/register`
    - [ ] Request: `{email: String, password: String}`
    - [ ] Response: `{user_id: String, message: String}`
    - [ ] Validate email format and password length (min 8 chars)
  - [ ] Update `POST /api/v1/auth/login`
    - [ ] Request: `{email: String, password: String}`
    - [ ] Response: `{token: String, user_id: String, expires_in: usize}`
    - [ ] Generate JWT with `user_id` claim instead of `game_id`
  - [ ] Update `Claims` struct:
    - [ ] Fields: `user_id: String, email: String, exp: usize`
    - [ ] Remove `game_id` field from claims

- [ ] **Game Management Endpoints**
  - [ ] Update `POST /api/v1/games` (protected)
    - [ ] Request: `{player_emails: Vec<String>}` (optional, can be empty)
    - [ ] Extract `user_id` from JWT claims
    - [ ] Create game with authenticated user as creator
    - [ ] Response: `{game_id: String, creator_email: String, turn_order: Vec<String>}`
  - [ ] Implement `POST /api/v1/games/:game_id/invitations` (protected)
    - [ ] Request: `{invitee_email: String, timeout_seconds: Option<u64>}`
    - [ ] Use default timeout (300) if not specified
    - [ ] Validate timeout doesn't exceed max_timeout_seconds (3600)
    - [ ] Return `ApiError {status: 400, code: "INVALID_TIMEOUT"}` if exceeds max
    - [ ] Validate requester is game creator
    - [ ] Response: `{invitation_id: String, status: String, timeout_seconds: u64, expires_at: String, expires_in_seconds: u64}`
  - [ ] Implement `GET /api/v1/invitations/pending` (protected)
    - [ ] Get all pending (non-expired) invitations for authenticated user
    - [ ] Auto-expire invitations past timeout
    - [ ] Response: `{invitations: Vec<InvitationInfo>}` where `InvitationInfo` includes `timeout_seconds`, `expires_at` and `expires_in_seconds`
  - [ ] Implement `POST /api/v1/invitations/:invitation_id/accept` (protected)
    - [ ] Validate invitation hasn't expired
    - [ ] Return `ApiError {status: 410, code: "INVITATION_EXPIRED"}` if expired
    - [ ] Add user to game and set turn order
    - [ ] Response: `{game_id: String, message: String}`
  - [ ] Implement `POST /api/v1/invitations/:invitation_id/decline` (protected)
    - [ ] Mark invitation as declined
    - [ ] Response: `{message: String}`

- [ ] **Gameplay Endpoints**
  - [ ] Update `POST /api/v1/games/:game_id/draw` (protected)
    - [ ] Validate it's player's turn
    - [ ] Return `ApiError {status: 403, code: "NOT_YOUR_TURN"}` if not
    - [ ] Auto-advance turn after successful draw
    - [ ] Auto-finish game if conditions met
    - [ ] Response includes: `{card, points, busted, is_finished, next_player_email}`
  - [ ] Implement `POST /api/v1/games/:game_id/stand` (protected)
    - [ ] Mark player as standing
    - [ ] Auto-advance turn
    - [ ] Auto-finish game if all players stood/busted
    - [ ] Response: `{message: String, is_finished: bool, results: Option<GameResult>}`
  - [ ] Update `GET /api/v1/games/:game_id` (protected)
    - [ ] Add `current_turn_player: String` to response
    - [ ] Add `player_states: HashMap<String, PlayerState>` to response
    - [ ] Add `turn_order: Vec<String>` to response

- [ ] **Middleware Updates**
  - [ ] Update `auth_middleware` to use `user_id` from claims
  - [ ] Update rate limiting to use `user_id` instead of `{game_id}:{email}`

#### Database Migrations

- [ ] **Create migrations for new tables**
  ```sql
  -- users table
  CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  
  -- game_invitations table
  CREATE TABLE game_invitations (
    id TEXT PRIMARY KEY,
    game_id TEXT NOT NULL REFERENCES games(id),
    inviter_id TEXT NOT NULL REFERENCES users(id),
    invitee_email TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('pending', 'accepted', 'declined', 'expired')),
    timeout_seconds INTEGER NOT NULL DEFAULT 300,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
  );
  
  -- Update games table
  ALTER TABLE games ADD COLUMN creator_id TEXT REFERENCES users(id);
  ALTER TABLE games ADD COLUMN current_turn_index INTEGER DEFAULT 0;
  
  -- Update players table
  ALTER TABLE players ADD COLUMN user_id TEXT REFERENCES users(id);
  ALTER TABLE players ADD COLUMN state TEXT NOT NULL DEFAULT 'active' 
    CHECK(state IN ('active', 'standing', 'busted'));
  ALTER TABLE players ADD COLUMN turn_order INTEGER NOT NULL DEFAULT 0;
  
  -- Indexes
  CREATE INDEX idx_invitations_game ON game_invitations(game_id);
  CREATE INDEX idx_invitations_invitee ON game_invitations(invitee_email);
  CREATE INDEX idx_invitations_expires ON game_invitations(expires_at) WHERE status = 'pending';
  CREATE INDEX idx_games_creator ON games(creator_id);
  CREATE INDEX idx_players_user ON players(user_id);
  ```

#### Testing

- [ ] **Core Tests**
  - [ ] Test turn order initialization
  - [ ] Test current player tracking
  - [ ] Test turn advancement (skips standing/busted players)
  - [ ] Test stand mechanism
  - [ ] Test auto-finish when all players done
  - [ ] Test `can_player_act` validation

- [ ] **Service Tests**
  - [ ] Test user registration (duplicate email detection)
  - [ ] Test user login (invalid credentials)
  - [ ] Test game creation requires authenticated user
  - [ ] Test invitation creation and acceptance flow
  - [ ] Test invitation with custom timeout (e.g., 60 seconds)
  - [ ] Test invitation with default timeout (no timeout_seconds specified)
  - [ ] Test invitation with timeout exceeding max returns error
  - [ ] Test invitation expiration (mock time advance)
  - [ ] Test accepting expired invitation returns error
  - [ ] Test get_pending_for_user filters expired invitations
  - [ ] Test cleanup_expired marks invitations as expired
  - [ ] Test invitation includes correct expires_at timestamp
  - [ ] Test draw card validates turn order
  - [ ] Test stand updates player state
  - [ ] Test concurrent invitation acceptance

- [ ] **API Integration Tests**
  - [ ] Test full flow: register → login → create game → invite → accept → play turns → stand → auto-finish
  - [ ] Test unauthorized access to protected endpoints
  - [ ] Test drawing card out of turn returns 403
  - [ ] Test invitation workflow (pending → accept/decline)
  - [ ] Test creating invitation with custom timeout
  - [ ] Test creating invitation without timeout uses default (300)
  - [ ] Test creating invitation with timeout > max returns 400 INVALID_TIMEOUT
  - [ ] Test accepting expired invitation returns 410 INVITATION_EXPIRED
  - [ ] Test pending invitations endpoint excludes expired ones
  - [ ] Test invitation response includes timeout_seconds, expires_at and expires_in_seconds
  - [ ] Test JWT claims with user_id

#### Documentation

- [ ] Update README.md with new game flow
- [ ] Document turn-based gameplay mechanics
- [ ] Document per-invitation timeout configuration (default 300s, max 3600s)
- [ ] Document how game creator can specify custom timeout when inviting players
- [ ] Update API examples with new endpoints
- [ ] Create sequence diagrams for:
  - [ ] User registration and login
  - [ ] Game creation and invitation flow
  - [ ] Turn-based gameplay sequence
- [ ] Update Postman collection with new endpoints
- [ ] Document password hashing strategy (placeholder for now)

### Acceptance Criteria

- [ ] Users can register with email and password
- [ ] Users can login and receive JWT with user_id
- [ ] Only authenticated users can create games
- [ ] Game creators can invite players by email
- [ ] Game creators can specify custom timeout for each invitation (default 300 seconds)
- [ ] Timeout cannot exceed configured maximum (3600 seconds)
- [ ] Invitations expire after specified timeout
- [ ] Expired invitations cannot be accepted (returns 410 error)
- [ ] Pending invitations endpoint excludes expired invitations
- [ ] Invited players can accept or decline invitations
- [ ] Players can only draw cards during their turn
- [ ] Players can stand to stop receiving cards
- [ ] Game automatically finishes when all players stood or busted
- [ ] Turn automatically advances to next active player
- [ ] All endpoints properly authenticated with new JWT structure
- [ ] Rate limiting works with user_id
- [ ] All new tests pass (estimate: 25+ new tests)
- [ ] Documentation updated with new flows
- [ ] Postman collection includes all new endpoints

### Migration Notes

This milestone introduces breaking changes to the API:
- JWT token structure changes (now includes `user_id` instead of `game_id`)
- Game creation endpoint requires authentication
- Game flow changes from simultaneous to turn-based
- New endpoints for user management and invitations

**Recommendation:** Implement as `/api/v2` to maintain backward compatibility with v1.

---

## Milestone 8: Security Hardening - Password Encryption and Access Control

**Status:** `planned`  
**Dependencies:** Milestone 7  
**Estimated Effort:** 10 hours

### Overview

Implement robust security measures including proper password hashing with modern cryptographic standards, user account management, and role-based access control to distinguish between game creators and invited players.

### Key Security Improvements

#### 1. User Account Registration
- **Current:** Placeholder user management (Milestone 7)
- **New:** Full user registration with secure password storage
- **Impact:** Production-ready user authentication system

#### 2. Password Encryption
- **Current:** Password stored in plaintext or with placeholder hashing
- **New:** Industry-standard password hashing using Argon2id
- **Security:** Protection against rainbow table, brute-force, and timing attacks
- **Standards:** OWASP recommended password hashing algorithm

#### 3. Role-Based Access Control
- **Current:** No distinction between game creator and invited players
- **New:** Explicit roles with permission validation
- **Impact:** Granular access control for game management operations

### Tasks

#### Core Layer Changes

- [ ] **Password Hashing**
  - [ ] Add dependency: `argon2 = "0.5"` to `blackjack-core/Cargo.toml`
  - [ ] Create `PasswordHasher` module with:
    - [ ] `hash_password(password: &str) -> Result<String, HashError>`
    - [ ] `verify_password(password: &str, hash: &str) -> Result<bool, HashError>`
    - [ ] Use Argon2id with OWASP recommended parameters:
      - [ ] Memory cost: 19456 KiB (19 MiB)
      - [ ] Time cost: 2 iterations
      - [ ] Parallelism: 1 thread
      - [ ] Salt: random 16 bytes (generated by argon2 crate)
  - [ ] Create `HashError` enum: `InvalidPassword, HashingFailed, VerificationFailed`
  - [ ] Add comprehensive tests for password hashing and verification

- [ ] **User Model Updates**
  - [ ] Update `User` struct:
    - [ ] Change `password_hash: String` to use Argon2 format
    - [ ] Add `is_active: bool` field (for account suspension)
    - [ ] Add `last_login: Option<DateTime>` field
  - [ ] Remove plain password from User struct (never store plaintext)
  - [ ] Add validation rules:
    - [ ] Email must be valid format (RFC 5322)
    - [ ] Password minimum length: 8 characters
    - [ ] Password must contain: uppercase, lowercase, number, special char

- [ ] **Game Role System**
  - [ ] Create `GameRole` enum: `Creator, Player, Spectator` (Spectator for future)
  - [ ] Create `GamePermission` enum: `InvitePlayers, KickPlayers, StartGame, FinishGame, ModifySettings`
  - [ ] Create `GameParticipant` struct:
    - [ ] Fields: `user_id: Uuid, email: String, role: GameRole, joined_at: DateTime`
  - [ ] Update `Game` struct:
    - [ ] Replace `players: HashMap<String, Player>` with `participants: HashMap<Uuid, GameParticipant>`
    - [ ] Keep game logic players separate from access control
  - [ ] Implement `GameRole::has_permission(permission: GamePermission) -> bool`
    - [ ] Creator has all permissions
    - [ ] Player has limited permissions (only their own actions)

- [ ] **Access Control Logic**
  - [ ] Implement `Game::get_participant_role(user_id: Uuid) -> Option<GameRole>`
  - [ ] Implement `Game::can_user_perform(user_id: Uuid, permission: GamePermission) -> bool`
  - [ ] Implement `Game::is_creator(user_id: Uuid) -> bool`
  - [ ] Implement `Game::is_participant(user_id: Uuid) -> bool`

#### Service Layer Changes

- [ ] **User Service Security**
  - [ ] Update `UserService::register(email, password)`:
    - [ ] Validate email format (use `regex` or `validator` crate)
    - [ ] Validate password complexity
    - [ ] Hash password using `PasswordHasher::hash_password()`
    - [ ] Return `ServiceError::WeakPassword` if validation fails
    - [ ] Return `ServiceError::InvalidEmail` if email invalid
    - [ ] Log registration attempts with email (not password!)
  - [ ] Update `UserService::login(email, password)`:
    - [ ] Retrieve user by email
    - [ ] Use `PasswordHasher::verify_password()` for constant-time comparison
    - [ ] Update `last_login` timestamp on successful login
    - [ ] Log failed login attempts (security monitoring)
    - [ ] Return `ServiceError::InvalidCredentials` on failure (don't reveal which field is wrong)
  - [ ] Implement `UserService::change_password(user_id, old_password, new_password)`:
    - [ ] Verify old password
    - [ ] Validate new password complexity
    - [ ] Hash and store new password
  - [ ] Add `ServiceError::WeakPassword`, `ServiceError::InvalidEmail`, `ServiceError::AccountInactive`

- [ ] **Game Service Access Control**
  - [ ] Update `GameService::create_game(creator_id)`:
    - [ ] Set creator with `GameRole::Creator`
    - [ ] Initialize participants map with creator
  - [ ] Update `GameService::invite_player()`:
    - [ ] Validate requester is creator using `Game::is_creator()`
    - [ ] Return `ServiceError::InsufficientPermissions` if not creator
  - [ ] Implement `GameService::kick_player(game_id, kicker_id, player_id)`:
    - [ ] Validate kicker is creator
    - [ ] Cannot kick creator
    - [ ] Remove player from game
    - [ ] Return kicked player's user_id
  - [ ] Update `GameService::finish_game()`:
    - [ ] Validate requester is creator
    - [ ] Only creator can manually finish game (auto-finish still works)
  - [ ] Implement `GameService::get_participant_role(game_id, user_id) -> Result<GameRole, ServiceError>`
  - [ ] Add `ServiceError::InsufficientPermissions`

- [ ] **Security Service**
  - [ ] Create `SecurityService` for audit logging
  - [ ] Implement `SecurityService::log_auth_attempt(email, success, ip)`:
    - [ ] Track failed login attempts
    - [ ] Implement rate limiting on failed attempts (5 failures = 15min lockout)
  - [ ] Implement `SecurityService::log_permission_denied(user_id, action, resource)`:
    - [ ] Audit trail for security events
  - [ ] Implement `SecurityService::is_account_locked(email) -> bool`

#### API Layer Changes

- [ ] **Authentication Updates**
  - [ ] Update `POST /api/v1/auth/register`:
    - [ ] Add password complexity validation
    - [ ] Return `ApiError {status: 400, code: "WEAK_PASSWORD", details: {requirements: [...]}}`
    - [ ] Return `ApiError {status: 400, code: "INVALID_EMAIL"}`
    - [ ] Don't reveal if email already exists (security best practice)
  - [ ] Update `POST /api/v1/auth/login`:
    - [ ] Use constant-time password verification
    - [ ] Track failed attempts per email
    - [ ] Return `ApiError {status: 429, code: "ACCOUNT_LOCKED"}` after 5 failures
    - [ ] Log IP address for security monitoring
    - [ ] Add `X-RateLimit-Remaining` header for auth attempts
  - [ ] Implement `POST /api/v1/auth/change-password` (protected):
    - [ ] Request: `{old_password: String, new_password: String}`
    - [ ] Validate old password
    - [ ] Apply same complexity rules as registration
    - [ ] Invalidate all existing JWT tokens (force re-login)
    - [ ] Response: `{message: String}`

- [ ] **Game Management with Access Control**
  - [ ] Update all game endpoints to check permissions:
    - [ ] Extract `user_id` from JWT claims
    - [ ] Verify user is participant in game
    - [ ] Check specific permissions for each action
  - [ ] Update `POST /api/v1/games/:game_id/invitations` (protected):
    - [ ] Return `ApiError {status: 403, code: "NOT_GAME_CREATOR"}` if not creator
  - [ ] Implement `DELETE /api/v1/games/:game_id/players/:player_id` (protected):
    - [ ] Only creator can kick players
    - [ ] Cannot kick self
    - [ ] Request: no body
    - [ ] Response: `{message: String, kicked_player_email: String}`
    - [ ] Return `ApiError {status: 403, code: "INSUFFICIENT_PERMISSIONS"}`
  - [ ] Implement `GET /api/v1/games/:game_id/participants` (protected):
    - [ ] Return list of participants with roles
    - [ ] Response: `{participants: Vec<ParticipantInfo>}` where `ParticipantInfo` includes `user_id, email, role, joined_at`
  - [ ] Update `GET /api/v1/games/:game_id` (protected):
    - [ ] Add `user_role: GameRole` to response (caller's role)
    - [ ] Add `creator_email: String` to response
  - [ ] Update `POST /api/v1/games/:game_id/finish` (protected):
    - [ ] Only creator can manually finish
    - [ ] Return `ApiError {status: 403, code: "NOT_GAME_CREATOR"}`

- [ ] **Security Headers**
  - [ ] Add security middleware for HTTP headers:
    - [ ] `X-Content-Type-Options: nosniff`
    - [ ] `X-Frame-Options: DENY`
    - [ ] `X-XSS-Protection: 1; mode=block`
    - [ ] `Strict-Transport-Security: max-age=31536000; includeSubDomains`
    - [ ] `Content-Security-Policy: default-src 'self'`

#### Configuration Updates

- [ ] Add to `config.toml`:
  ```toml
  [security]
  password_min_length = 8
  password_require_uppercase = true
  password_require_lowercase = true
  password_require_number = true
  password_require_special = true
  max_login_attempts = 5
  lockout_duration_minutes = 15
  
  [security.argon2]
  memory_cost = 19456  # 19 MiB
  time_cost = 2
  parallelism = 1
  ```

- [ ] Add environment variables:
  - [ ] `BLACKJACK_SECURITY_PASSWORD_MIN_LENGTH`
  - [ ] `BLACKJACK_SECURITY_MAX_LOGIN_ATTEMPTS`
  - [ ] `BLACKJACK_SECURITY_LOCKOUT_DURATION_MINUTES`

#### Database Migrations

- [ ] **Update users table**:
  ```sql
  -- Update users table for security
  ALTER TABLE users ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT 1;
  ALTER TABLE users ADD COLUMN last_login TIMESTAMP;
  ALTER TABLE users ADD COLUMN failed_login_attempts INTEGER DEFAULT 0;
  ALTER TABLE users ADD COLUMN locked_until TIMESTAMP;
  
  -- Add index for locked accounts
  CREATE INDEX idx_users_locked ON users(locked_until) WHERE locked_until IS NOT NULL;
  ```

- [ ] **Create game_participants table**:
  ```sql
  -- Replace implicit player membership with explicit roles
  CREATE TABLE game_participants (
    id TEXT PRIMARY KEY,
    game_id TEXT NOT NULL REFERENCES games(id),
    user_id TEXT NOT NULL REFERENCES users(id),
    role TEXT NOT NULL CHECK(role IN ('creator', 'player', 'spectator')),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(game_id, user_id)
  );
  
  CREATE INDEX idx_participants_game ON game_participants(game_id);
  CREATE INDEX idx_participants_user ON game_participants(user_id);
  ```

- [ ] **Create audit_log table**:
  ```sql
  -- Security audit log
  CREATE TABLE audit_log (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    event_type TEXT NOT NULL,  -- 'login_success', 'login_failure', 'permission_denied', etc.
    resource_type TEXT,  -- 'game', 'invitation', etc.
    resource_id TEXT,
    ip_address TEXT,
    user_agent TEXT,
    details TEXT,  -- JSON with additional context
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE INDEX idx_audit_user ON audit_log(user_id);
  CREATE INDEX idx_audit_type ON audit_log(event_type);
  CREATE INDEX idx_audit_created ON audit_log(created_at);
  ```

#### Testing

- [ ] **Password Security Tests**
  - [ ] Test password hashing produces different hashes for same password (salt randomization)
  - [ ] Test password verification succeeds for correct password
  - [ ] Test password verification fails for incorrect password
  - [ ] Test password verification is constant-time (timing attack resistance)
  - [ ] Test weak password validation (too short, no special chars, etc.)
  - [ ] Test password hash format is Argon2id PHC string format

- [ ] **Access Control Tests**
  - [ ] Test creator can invite players
  - [ ] Test non-creator cannot invite players
  - [ ] Test creator can kick players
  - [ ] Test player cannot kick other players
  - [ ] Test creator cannot kick themselves
  - [ ] Test only creator can manually finish game
  - [ ] Test participant role retrieval
  - [ ] Test permission checking logic

- [ ] **Authentication Tests**
  - [ ] Test successful registration with valid password
  - [ ] Test registration fails with weak password
  - [ ] Test registration fails with invalid email
  - [ ] Test login with correct credentials
  - [ ] Test login fails with incorrect password
  - [ ] Test account lockout after 5 failed attempts
  - [ ] Test lockout expires after configured duration
  - [ ] Test password change with correct old password
  - [ ] Test password change fails with incorrect old password

- [ ] **API Security Tests**
  - [ ] Test unauthorized user cannot access game endpoints
  - [ ] Test player cannot perform creator-only actions
  - [ ] Test security headers are present in all responses
  - [ ] Test rate limiting on login endpoint
  - [ ] Test audit log records security events

#### Documentation

- [ ] Document password requirements and security best practices
- [ ] Document role-based access control system
- [ ] Document permission model (who can do what)
- [ ] Update API documentation with new security endpoints
- [ ] Create security guide for deployment:
  - [ ] HTTPS/TLS requirements
  - [ ] Environment variable security
  - [ ] Password policy configuration
  - [ ] Monitoring failed login attempts
  - [ ] Audit log analysis
- [ ] Document Argon2id parameters and rationale
- [ ] Add examples for password change flow
- [ ] Update Postman collection with security headers

### Acceptance Criteria

- [ ] Passwords are hashed using Argon2id with OWASP recommended parameters
- [ ] Password verification uses constant-time comparison
- [ ] Weak passwords are rejected during registration
- [ ] Account locks after 5 failed login attempts
- [ ] Account automatically unlocks after configured duration
- [ ] Game creator role is distinct from player role
- [ ] Only creator can invite players to game
- [ ] Only creator can kick players from game
- [ ] Only creator can manually finish game
- [ ] API returns 403 FORBIDDEN for insufficient permissions
- [ ] All security events are logged to audit log
- [ ] Security headers are present in all HTTP responses
- [ ] JWT tokens include user_id for authorization
- [ ] All new tests pass (estimate: 30+ new tests)
- [ ] Zero plaintext passwords in code or logs
- [ ] Documentation includes security deployment guide

### Security Considerations

**Critical Security Requirements:**
1. **Never log passwords** - only log email/user_id for authentication events
2. **Constant-time comparison** - prevent timing attacks on password verification
3. **Random salt per password** - prevent rainbow table attacks
4. **Rate limit authentication** - prevent brute force attacks
5. **HTTPS in production** - encrypt credentials in transit (deployment guide)
6. **Secure session management** - JWT with appropriate expiration
7. **Input validation** - prevent injection attacks
8. **Error messages** - don't reveal whether email exists (registration/login)

**Compliance Notes:**
- Argon2id is recommended by OWASP as of 2024
- Password complexity requirements align with NIST guidelines
- Audit logging supports compliance requirements (GDPR, SOC2, etc.)
- Access control model supports principle of least privilege

---

## Future Enhancements (Out of Scope for v1.0)

### Hot Reload Configuration
- Implement config file watcher using `notify` crate
- Reload rate limits and CORS origins without server restart
- Useful for production environment dynamic adjustments

### Configuration Validation
- Create `Validate` trait for `AppConfig`
- Validate ranges at startup:
  - Port: 1024-65535
  - Rate limit: > 0
  - JWT expiration: > 0
  - Max players >= min players
- Fail fast with clear error messages

### Secrets Management
- Integrate with HashiCorp Vault or AWS Secrets Manager
- Replace plaintext env vars for `JWT_SECRET`
- Automatic secret rotation for database credentials
- Production-grade security for sensitive configuration

### Metrics and Observability
- Add `metrics` and `metrics-exporter-prometheus` dependencies
- Expose `GET /metrics` endpoint for Prometheus
- Track counters: games created, cards drawn, rate limits hit
- Track gauges: active games, total players
- Integration with Grafana dashboards

### WebSocket Real-Time Notifications
- Implement blueprint from `websocket.rs`
- Authenticate via first message with JWT
- Broadcast game events to subscribed players
- Support multiple concurrent connections per game

### SQLite Persistence
- Uncomment `sqlx` dependency
- Run migrations from `migrations/` directory
- Replace in-memory HashMap with database storage
- Add database connection to health check

### API Versioning Evolution
- Implement `/api/v2` alongside `/api/v1`
- Maintain v1 for 6 months (configurable deprecation period)
- Return deprecation headers in v1 responses
- Document migration guide for clients

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.2.0 | 2026-01-08 | Team | Added Milestone 8: Security hardening with password encryption and access control |
| 1.1.0 | 2026-01-08 | Team | Added Milestone 7: Turn-based gameplay and user management |
| 1.0.0 | 2025-12-23 | Team | Initial PRD creation with 6 milestones |
