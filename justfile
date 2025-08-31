# List all available commands
default:
    just --list

# Setup project dependencies and build
setup:
    pnpm install
    pnpm run build

# Run tests
test:
    pnpm run test

# Clean up build artifacts
teardown:
    rm -rf dist node_modules .vite

# Development server
dev:
    pnpm run dev

# Build for production
build:
    pnpm run build
