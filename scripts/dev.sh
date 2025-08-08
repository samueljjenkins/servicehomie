#!/bin/bash

# Kill any processes using port 3000
echo "Checking for processes on port 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Start the development server
echo "Starting development server..."
pnpm dev
