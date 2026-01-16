# Multi-stage Dockerfile for Blackjack API
# This Dockerfile will be fully implemented in Phase 6

FROM rust:1.75-slim as builder

WORKDIR /app

# Copy workspace configuration
COPY Cargo.toml ./
COPY crates ./crates

# Build release binary
RUN cargo build --release -p blackjack-api

# Runtime stage
FROM debian:bookworm-slim

# Install runtime dependencies
RUN apt-get update && \
    apt-get install -y ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/target/release/blackjack-api /usr/local/bin/blackjack-api

# Copy configuration files
COPY crates/blackjack-api/config.toml /app/config.toml

EXPOSE 8080

CMD ["blackjack-api"]
