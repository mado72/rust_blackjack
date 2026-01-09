# Milestone 7 Implementation - Turn-Based Gameplay and User Management

**Status:** 🟡 Partially Implemented (Infrastructure Only)  
**Date:** January 8, 2026

## ⚠️ IMPORTANTE - LEIA PRIMEIRO

**O M7 está em desenvolvimento parcial:**
- ✅ **Infraestrutura Backend Completa** - Core, Service Layer implementados
- ❌ **Endpoints HTTP NÃO Disponíveis** - API handlers ainda não criados
- ❌ **Não Testável via Postman/cURL** - Nenhum endpoint M7 está acessível

**Endpoints atuais (M6) continuam funcionando normalmente.**

## Summary

Milestone 7 introduces the foundation for turn-based gameplay and user management. The core infrastructure has been implemented, including:

- User authentication structures (backend only)
- Game invitation system (backend only)
- Turn-based game state management (backend only)
- Player state tracking (Active/Standing/Busted) (backend only)

## What Was Implemented

### Core Layer (`blackjack-core`)

1. **User Management**
   - `User` struct with email and password_hash
   - Placeholder password hashing (to be replaced in M8)

2. **Invitation System**
   - `GameInvitation` struct with timeout support
   - `InvitationStatus` enum (Pending, Accepted, Declined, Expired)
   - Configurable timeouts (default: 300s, max: 3600s)
   - Automatic expiration checking

3. **Game State Extensions**
   - `PlayerState` enum (Active, Standing, Busted)
   - Turn order tracking (`turn_order: Vec<String>`)
   - Current turn index (`current_turn_index: usize`)
   - Game creator tracking (`creator_id: Uuid`)

4. **Turn Management**
   - `get_current_player()` - Returns current player's email
   - `advance_turn()` - Moves to next active player
   - `can_player_act()` - Validates player's turn
   - `stand()` - Marks player as standing
   - `check_auto_finish()` - Auto-finishes when all players done
   - `add_player()` - Adds player from invitation acceptance

### Service Layer (`blackjack-service`)

1. **UserService**
   - User registration with placeholder password hashing
   - User login with credential verification
   - User lookup by ID or email

2. **InvitationService**
   - Create invitations with custom timeout
   - Accept/decline invitations
   - Get pending invitations (auto-filters expired)
   - Cleanup expired invitations
   - Timeout validation against maximum

3. **GameService Updates**
   - `create_game(creator_id, emails)` - Requires creator ID
   - `stand(game_id, email)` - Player stands
   - `add_player_to_game()` - Add player from invitation
   - `is_game_creator()` - Check creator permission

4. **Configuration**
   - `InvitationConfig` with default and max timeouts
   - Environment variable support for invitation settings

### API Layer (`blackjack-api`)

1. **AppState Updates**
   - Added `user_service: Arc<UserService>`
   - Added `invitation_service: Arc<InvitationService>`

2. **Claims Structure** 
   - Updated to include `user_id: String`
   - Kept `game_id: Option<String>` for backward compatibility
   - Rate limiting now uses `user_id` instead of `{game_id}:{email}`

3. **Configuration**
   - Added `[invitations]` section to `config.toml`
   - `default_timeout_seconds = 300`
   - `max_timeout_seconds = 3600`

## Backward Compatibility

The implementation maintains backward compatibility with M6:

- `Claims` struct has optional `game_id` field
- Existing endpoints continue to work
- New `user_id` field populated from email temporarily
- Helper function `get_game_id_from_claims()` extracts game_id safely

## What Needs to Be Completed

### ❌ API Endpoints (NOT YET AVAILABLE via HTTP)

The following M7 features have **backend infrastructure ready** but **NO HTTP endpoints**:

#### 1. User Authentication Endpoints (PENDING)
   - ❌ `POST /api/v1/auth/register` - Register new user
   - ❌ `POST /api/v1/auth/login` - Login with email/password (update existing)
   
   **Status:** UserService exists in backend, but no handler created

#### 2. Game Management Updates (PENDING)
   - ❌ Update `POST /api/v1/games` to require authentication
   - ❌ Return `turn_order` in create game response
   
   **Status:** GameService updated, but handlers not modified

#### 3. Invitation Endpoints (PENDING)
   - ❌ `POST /api/v1/games/:game_id/invitations` - Create invitation
   - ❌ `GET /api/v1/invitations/pending` - Get pending invitations
   - ❌ `POST /api/v1/invitations/:id/accept` - Accept invitation
   - ❌ `POST /api/v1/invitations/:id/decline` - Decline invitation
   
   **Status:** InvitationService exists, but no routes in main.rs

#### 4. Gameplay Endpoints (PENDING)
   - ❌ Update `POST /api/v1/games/:game_id/draw` to validate turn
   - ❌ `POST /api/v1/games/:game_id/stand` - Stand endpoint
   - ❌ Update `GET /api/v1/games/:game_id` to include turn info
   
   **Status:** Game.can_player_act() exists, but not used in handlers

### Testing

No tests have been added yet for M7 features. Tests need to cover:

- User registration and login
- Invitation creation, acceptance, and expiration
- Turn-based game flow
- Stand mechanism
- Auto-finish logic

## Migration Path

To fully enable M7 features:

1. **Complete API Handlers**: Implement the new endpoints listed above
2. **Update Tests**: Add comprehensive test coverage
3. **Update Postman Collection**: Add new endpoints and workflows
4. **Update Documentation**: Document new API flows and examples
5. **Remove Backward Compatibility**: Once stable, remove optional `game_id` from Claims

## Configuration

### Environment Variables (New)

```bash
# Invitation timeouts
BLACKJACK_INVITATIONS_DEFAULT_TIMEOUT_SECONDS=300
BLACKJACK_INVITATIONS_MAX_TIMEOUT_SECONDS=3600
```

### config.toml (New Section)

```toml
[invitations]
default_timeout_seconds = 300  # 5 minutes default
max_timeout_seconds = 3600     # 1 hour maximum
```

## Technical Decisions

1. **Chrono Dependency**: Added `chrono` crate for proper DateTime handling in invitations
2. **Backward Compatibility**: Maintained optional `game_id` in Claims for gradual migration
3. **Placeholder Authentication**: Simple password hashing for M7, proper Argon2 in M8
4. **Auto-Finish Logic**: Game automatically finishes when all players stand or bust
5. **Turn Advancement**: Automatically advances to next active player after draw/stand

## Next Steps (Priority Order)

1. Complete API handler implementations for new endpoints
2. Add integration tests for turn-based gameplay
3. Update Postman collection with new workflows
4. Update README with M7 features and examples
5. Create sequence diagrams for new flows

## Known Limitations

- Password hashing is placeholder (to be fixed in M8)
- API endpoints are infrastructure only (handlers not fully implemented)
- No tests for new functionality
- Documentation is incomplete for new features
- Some handlers still use email as user_id temporarily

## Breaking Changes (When Fully Enabled)

- Game creation will require authentication
- JWT tokens will require `user_id` (no more game_id-only tokens)
- Turn-based flow means players can only act on their turn
- Rate limiting now per-user instead of per-game-player
