//! Blackjack API Server Entry Point
//!
//! This binary starts the HTTP server for the Blackjack multi-player game API.
//!
//! # Configuration
//!
//! The server loads configuration from multiple sources (in order of precedence):
//! 1. Environment variables prefixed with `BLACKJACK_`
//! 2. `config.toml` file
//! 3. `.env` file (if present)
//!
//! # Logging
//!
//! Structured logging is controlled by the `RUST_LOG` environment variable:
//! - `RUST_LOG=debug` - Detailed logs including auth attempts
//! - `RUST_LOG=info` - Standard operational logs (default)
//! - `RUST_LOG=warn` - Only warnings and errors
//!
//! # Running the Server
//!
//! ```bash
//! # Development with debug logs
//! RUST_LOG=debug cargo run -p blackjack-api
//!
//! # Production with custom port
//! BLACKJACK_SERVER_PORT=3000 cargo run -p blackjack-api --release
//! ```

use blackjack_api::config::AppConfig;
use blackjack_api::handlers::login;
use blackjack_api::middleware::version_deprecation_middleware;
use blackjack_api::rate_limiter::RateLimiter;
use blackjack_api::AppState;
use axum::routing::post;
use axum::Router;
use blackjack_service::{GameService, ServiceConfig};
use std::sync::Arc;
use tower_http::cors::CorsLayer;

#[tokio::main]
async fn main() {
    // Load .env file if it exists (for local development)
    // This is optional and won't fail if the file doesn't exist
    dotenv::dotenv().ok();

    // Initialize structured logging with tracing
    // Reads RUST_LOG environment variable for filter configuration
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| tracing_subscriber::EnvFilter::new("info")),
        )
        .init();

    tracing::info!("Starting Blackjack API server");

    // Load application configuration from config.toml with env var overrides
    // Panics if configuration is invalid (fail-fast on startup)
    let app_config = AppConfig::from_file().expect("Failed to load configuration");
    let app_config = Arc::new(app_config);

    tracing::info!(
        host = app_config.server.host,
        port = app_config.server.port,
        "Server configuration loaded"
    );

    // Create game service with configuration from environment variables
    // Service manages all active games with thread-safe concurrent access
    let service_config = ServiceConfig::from_env();
    let game_service = Arc::new(GameService::new(service_config));

    // Create rate limiter with configured requests per minute
    // Uses sliding window algorithm to track requests per player
    let rate_limiter = RateLimiter::new(app_config.rate_limit.requests_per_minute);

    // Build shared application state
    // This state is cloned for each request and provides access to services
    let state = AppState {
        game_service,
        config: app_config.clone(),
        rate_limiter,
    };

    // Configure CORS (Cross-Origin Resource Sharing)
    // Currently permissive for development; will be properly configured in Phase 5
    let cors = CorsLayer::permissive();

    // Build the application router with all routes and middleware
    let app = Router::new()
        // Public routes (no authentication required)
        .route("/api/v1/auth/login", post(login))
        // Apply version deprecation middleware to add X-API-Deprecated headers
        .layer(axum::middleware::from_fn_with_state(
            state.clone(),
            version_deprecation_middleware,
        ))
        // Apply CORS middleware
        .layer(cors)
        // Attach shared state to all handlers
        .with_state(state);

    // Bind TCP listener to configured host and port
    // Panics if binding fails (e.g., port already in use)
    let addr = format!("{}:{}", app_config.server.host, app_config.server.port);
    let listener = tokio::net::TcpListener::bind(&addr)
        .await
        .expect("Failed to bind server");

    tracing::info!(address = addr, "Server listening");

    // Start the HTTP server
    // This blocks until the server is shut down (e.g., via SIGTERM/SIGINT)
    axum::serve(listener, app)
        .await
        .expect("Server error");
}
