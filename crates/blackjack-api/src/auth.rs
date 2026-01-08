use serde::{Deserialize, Serialize};

/// JWT (JSON Web Token) claims structure
///
/// This structure represents the payload of a JWT token used for authenticating
/// players in the Blackjack API. Each token binds a player's email to a specific
/// game and includes an expiration timestamp.
///
/// # Security
///
/// - Tokens are signed using HMAC-SHA256 with a secret key (configured in `AppConfig`)
/// - The `exp` field enforces automatic token expiration
/// - Tokens are validated on every protected endpoint request
///
/// # Token Lifecycle
///
/// 1. Player requests token via `POST /api/v1/auth/login` with email and game_id
/// 2. Server validates that player exists in the game
/// 3. Server generates JWT with these claims and signs it
/// 4. Client includes token in `Authorization: Bearer <token>` header
/// 5. Middleware validates token and extracts claims for each protected request
/// 6. Token automatically expires after `expiration_hours` (default: 24h)
///
/// # Example
///
/// ```
/// use blackjack_api::auth::Claims;
///
/// let claims = Claims {
///     email: "player@example.com".to_string(),
///     game_id: "550e8400-e29b-41d4-a716-446655440000".to_string(),
///     exp: 1704672000, // Unix timestamp
/// };
/// ```
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Claims {
    /// Player's email address
    ///
    /// This uniquely identifies the player within a game. It's used to:
    /// - Look up the player's state in game operations
    /// - Form the rate limiting key: `{game_id}:{email}`
    /// - Ensure players can only act on their own behalf
    pub email: String,
    
    /// Game UUID as a string
    ///
    /// Binds the token to a specific game session. Players cannot use a token
    /// from one game to perform actions in another game.
    ///
    /// Format: UUID v4 string (e.g., "550e8400-e29b-41d4-a716-446655440000")
    pub game_id: String,
    
    /// Token expiration time as Unix timestamp (seconds since epoch)
    ///
    /// The JWT library automatically validates this field. Once the current time
    /// exceeds this timestamp, the token is considered invalid and authentication
    /// will fail with a 401 error.
    ///
    /// Example: 1704672000 represents January 8, 2024, 00:00:00 UTC
    pub exp: usize,
}
