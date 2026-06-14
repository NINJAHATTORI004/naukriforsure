#!/bin/bash
# NaukriForSure Quick Start Script
# Run this to get started immediately!

echo "🚀 NaukriForSure - Quick Start Setup"
echo "===================================="
echo ""

# Check Node.js
echo "📋 Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    echo "Download from: https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js $(node -v) found"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Create .env file if not exists
echo ""
echo "⚙️  Setting up configuration..."
if [ ! -f .env ]; then
    cat > .env << EOF
# NaukriForSure Configuration
PORT=3000
API_PORT=3001

# Optional: AI Services
# GEMINI_API_KEY=your_key_here
# OPENAI_API_KEY=your_key_here
# ANTHROPIC_API_KEY=your_key_here

# Email Integration (optional)
# GMAIL_CLIENT_ID=your_id_here
# GMAIL_CLIENT_SECRET=your_secret_here

# Database
DATABASE_PATH=./data/jobs.db
EOF
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# Create data directory
mkdir -p data
mkdir -p logs

echo ""
echo "✅ Setup complete!"
echo ""
echo "📚 Available Commands:"
echo "  npm start              - Start servers (main + API)"
echo "  npm run scraper        - Run job scraper manually"
echo "  npm run build          - Build static assets"
echo "  npm run generate:sitemap - Generate sitemap"
echo ""
echo "🌐 URLs after starting:"
echo "  Main Portal:    http://localhost:3000"
echo "  Jobs Page:      http://localhost:3000/jobs-new.html"
echo "  Dashboard:      http://localhost:3000/dashboard.html"
echo "  API Server:     http://localhost:3001/api"
echo ""
echo "📖 Documentation:"
echo "  Quick Setup:           SETUP_GUIDE.md"
echo "  Complete Features:     README_COMPLETE.md"
echo "  Roadmap:              AUTONOMOUS_CAREER_AGENT_ROADMAP.md"
echo "  Implementation Report: IMPLEMENTATION_COMPLETE.md"
echo ""
echo "🚀 Ready to start? Run: npm start"
echo ""
