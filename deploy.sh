#!/bin/bash

echo "🚀 Starting deployment..."

# Pull latest code
echo "📥 Pulling latest code from GitHub..."
git pull origin main

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start containers
echo "🔨 Building and starting containers..."
docker-compose up -d --build

# Wait for containers to start
echo "⏳ Waiting for containers to start..."
sleep 10

# Check container status
echo "✅ Checking container status..."
docker-compose ps

# Check backend health
echo "🏥 Checking backend health..."
curl -s http://localhost:5001/health || echo "Backend not responding yet"

# Clean up old images
echo "🧹 Cleaning up old images..."
docker system prune -f

echo "✨ Deployment complete!"
echo "🌐 Access your application at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
