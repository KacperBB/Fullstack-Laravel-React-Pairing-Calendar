# Fullstack-Laravel-React-Pairing-Calendar

App made for me and my partner to have our own calendar app - Made with Laravel as backend providing API endpoints for React App

## Tech Stack

- **Backend**: Laravel 12 with Sanctum authentication
- **Frontend**: React with Vite
- **Database**: MySQL/SQLite
- **Features**: 
  - User authentication and registration
  - Partner pairing system with unique codes
  - Shared calendar events
  - Event comments
  - Real-time updates

## Setup

### Backend (Laravel)
```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### Frontend (React)
```bash
cd calendar-frontend
npm install
npm run dev
```
