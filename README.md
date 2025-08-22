# Global Marine Safety - America (GMS)

A comprehensive full-stack application built with **React** frontend and **Laravel Lumen** backend for marine safety management.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Project Structure](#project-structure)
- [Environment Configuration](#environment-configuration)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🚀 Project Overview

The GMS application manages marine safety operations including:
- Service orders and job orders
- Purchase and sale invoicing
- Stock management and returns
- Event dispatching and scheduling
- Sales team management
- Document generation and tracking

## 📋 Prerequisites

### System Requirements

- **PHP**: Version 8.1 - 8.2
- **Node.js**: Version 16.x or higher
- **Composer**: Latest version
- **MySQL**: Version 8.0 or higher
- **Git**: For version control

### Development Environment Options

Choose one of the following:

#### Option 1: Laragon (Recommended for Windows)
- [Download Laragon](https://laragon.org/download/)
- Includes Apache, MySQL, PHP, and phpMyAdmin

#### Option 2: XAMPP (Cross-platform)
- [Download XAMPP](https://www.apachefriends.org/index.html)
- Includes Apache, MySQL, PHP, and phpMyAdmin

#### Option 3: Docker (Advanced)
- Docker Desktop
- Docker Compose

## 🛠️ Local Development Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-organization/php_gms.git
cd php_gms
```

### Step 2: Backend Setup (Laravel Lumen API)

#### 2.1 Navigate to API Directory
```bash
cd api
```

#### 2.2 Install PHP Dependencies
```bash
composer update
```

#### 2.3 Environment Configuration
```bash
# Copy environment file
cp .env.example .env

# Generate application key (if needed)
php artisan key:generate
```

#### 2.4 Configure Database
Edit `.env` file with your database credentials:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=gms_database
DB_USERNAME=root
DB_PASSWORD=
```

#### 2.5 Create Database
```sql
-- Connect to MySQL and create database
CREATE DATABASE gms_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### 2.6 Run Database Migrations
```bash
php artisan migrate
```

#### 2.7 Seed Database (Execute in Order)
```bash
# Essential seeders (run in this order)
php artisan db:seed --class=ControlAccessSeeder
php artisan db:seed --class=CompanyAndBranchSeeder
php artisan db:seed --class=DocumentTypeSeeder
php artisan db:seed --class=UserPermissionSeeder
php artisan db:seed --class=UserSeeder

# Optional: Run all seeders at once
php artisan db:seed
```

#### 2.8 Start Backend Server
```bash
# Option 1: Built-in PHP server
php -S localhost:8000 -t public
```

### Step 3: Frontend Setup (React)

#### 3.1 Navigate to Frontend Directory
```bash
cd ../frontend
```

#### 3.2 Install Node Dependencies
```bash
npm install
```

#### 3.3 Configure Frontend Environment
```bash
# Copy environment file
cp .env.example .env
```

Edit `.env` file:
```env
VITE_BASE_URL=/gms
VITE_API_URL=http://localhost:8000
```

#### 3.4 Start Frontend Development Server
```bash
npm run dev
```

### Step 4: Access the Application

- **Frontend**: http://localhost:5173/gms
- **Backend API**: http://localhost:8000

## 📁 Project Structure

```
php_gms/
├── api/                          # Laravel Lumen Backend
│   ├── app/
│   │   ├── Http/Controllers/     # API Controllers
│   │   ├── Models/              # Database Models
│   │   └── ...
│   ├── database/
│   │   ├── migrations/          # Database Migrations
│   │   └── seeders/            # Database Seeders
│   ├── routes/                  # API Routes
│   └── public/                  # Public Assets
├── frontend/                    # React Frontend
│   ├── src/
│   │   ├── components/         # React Components
│   │   ├── hooks/             # Custom Hooks
│   │   ├── services/          # API Services
│   │   └── ...
│   ├── public/                # Static Assets
│   └── build/                 # Production Build
├── gms-automation-script/      # Test Automation
├── tools/                      # Development Tools
└── .github/workflows/          # CI/CD Pipelines
```

## 🔧 Environment Configuration

### Backend Environment Variables

```env
# Application
APP_NAME=GMS
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000
APP_TIMEZONE=Asia/Karachi
LOG_CHANNEL=stack
LOG_SLACK_WEBHOOK_URL=

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=gms_database
DB_USERNAME=root
DB_PASSWORD=

# Disable login OTP verification
DISABLE_LOGIN_VERIFICATION=true

# WhatsApp Integration (Optional)
WHATSAPP_SERVICES=false

# Cache and Queue
CACHE_DRIVER=file
QUEUE_CONNECTION=sync

# Site URLs
SITE_URL=http://localhost:8000
VENDOR_URL=http://localhost:5173/vendor-platform/
SITE_ADDRESS=localhost:8000

# Mail Configuration
MAIL_MAILER=smtp
MAIL_DRIVER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=
MAIL_FROM_NAME=
```

### Frontend Environment Variables

```env
VITE_BASE_URL=/gms
VITE_API_URL=http://localhost:8000
```

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. Composer Update Fails
```bash
# Clear composer cache
composer clear-cache

# Update with verbose output
composer update -v
```

#### 2. Database Connection Issues
- Verify database credentials in `.env`
- Check if MySQL service is running
- Ensure database exists

#### 3. Frontend Build Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 4. API CORS Issues
- Check CORS configuration in backend
- Verify API URL in frontend environment

### Log Files

- **Backend Logs**: `api/storage/logs/laravel.log`
- **Frontend Logs**: Browser Developer Console

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make changes and commit
4. Push to branch
5. Create Pull Request

### Code Standards

- **PHP**: Follow PSR-12 coding standards
- **JavaScript**: Use ESLint configuration
- **Commit Messages**: Use conventional commit format

---

**Last Updated**: August 2025
**Version**: 2.0.0
