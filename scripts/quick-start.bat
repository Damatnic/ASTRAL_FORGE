@echo off
REM Astral Power Quick Start Script for Windows

echo.
echo ============================
echo Astral Power Setup Script
echo ============================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit /b 1
)

echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Failed to install dependencies
    pause
    exit /b 1
)
echo Dependencies installed successfully!
echo.

REM Check if .env exists
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo.
    echo IMPORTANT: Please edit .env and add your DATABASE_URL
    echo You can use a local PostgreSQL or a managed service like Neon
    echo.
    pause
)

echo Generating Prisma client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo Failed to generate Prisma client
    pause
    exit /b 1
)
echo.

echo Running database migrations...
call npx prisma migrate dev --name init
if %errorlevel% neq 0 (
    echo Failed to run migrations
    echo Make sure your DATABASE_URL in .env is correct
    pause
    exit /b 1
)
echo.

echo Seeding database...
call npm run db:seed
if %errorlevel% neq 0 (
    echo Failed to seed database
    pause
    exit /b 1
)
echo.

echo ========================================
echo Setup complete!
echo ========================================
echo.
echo To start the development server:
echo   npm run dev
echo.
echo Demo credentials:
echo   Email: demo@astralpower.app
echo   Password: demo123
echo.
echo Open http://localhost:3000 in your browser
echo.
pause

