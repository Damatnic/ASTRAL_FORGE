#!/bin/bash

# Astral Power Setup Script
# This script helps you get started quickly with Astral Power

echo "🌟 Astral Power Setup Script"
echo "=============================="
echo ""

# Check Node.js version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Node.js 18 or higher is required. You have version $NODE_VERSION."
  echo "Please upgrade Node.js: https://nodejs.org/"
  exit 1
fi
echo "✅ Node.js version check passed"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
  echo "❌ Failed to install dependencies"
  exit 1
fi
echo "✅ Dependencies installed"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
  echo "⚠️  No .env file found. Creating from template..."
  cp .env.example .env
  echo "✅ Created .env file"
  echo ""
  echo "⚠️  IMPORTANT: Please edit .env and add your DATABASE_URL"
  echo "   You can use a local PostgreSQL or a managed service like Neon (https://neon.tech)"
  echo ""
  read -p "Press Enter when you've updated your .env file..."
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate
if [ $? -ne 0 ]; then
  echo "❌ Failed to generate Prisma client"
  exit 1
fi
echo "✅ Prisma client generated"
echo ""

# Run database migrations
echo "🗄️  Running database migrations..."
npx prisma migrate dev --name init
if [ $? -ne 0 ]; then
  echo "❌ Failed to run migrations"
  echo "   Make sure your DATABASE_URL in .env is correct and the database is accessible"
  exit 1
fi
echo "✅ Migrations complete"
echo ""

# Seed database
echo "🌱 Seeding database..."
npm run db:seed
if [ $? -ne 0 ]; then
  echo "❌ Failed to seed database"
  exit 1
fi
echo "✅ Database seeded"
echo ""

# Success message
echo "✨ Setup complete! ✨"
echo ""
echo "🚀 To start the development server:"
echo "   npm run dev"
echo ""
echo "📖 Demo credentials:"
echo "   Email: demo@astralpower.app"
echo "   Password: demo123"
echo ""
echo "🎯 Next steps:"
echo "   1. Start the dev server: npm run dev"
echo "   2. Open http://localhost:3000"
echo "   3. Sign in with demo credentials"
echo "   4. Start your first workout!"
echo ""
echo "📚 Documentation:"
echo "   - README.md for general info"
echo "   - DEPLOYMENT.md for deployment guide"
echo "   - CONTRIBUTING.md for contribution guidelines"
echo ""
echo "Happy training! 💪"

