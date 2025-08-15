# Global Marine Safety - America

This project is a full-stack application built with **React** on the frontend and **Laravel Lumen** on the backend.

## Getting Started

### Prerequisites

To set up the project, ensure the following are installed on your system:

- **Laragon** or **XAMPP**: A local development environment for PHP projects.
- **PHP**: Version 8.1 <> 8.2.
- **Composer**: Dependency manager for PHP.
- **Node.js**: For managing frontend dependencies.

### Installation Steps

#### 1. Set Up Laragon or XAMPP

1. Install **Laragon** or **XAMPP** on your system:

   - [Download Laragon](https://laragon.org/download/)
   - [Download XAMPP](https://www.apachefriends.org/index.html)

2. Configure your local server:
   - Place the project folder in the **www** directory for Laragon or the **htdocs** directory for XAMPP.
   - Start the local server using the Laragon or XAMPP control panel.

#### 2. Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd ./api
   ```

2. Install dependencies using Composer:

   ```bash
   composer install
   ```

3. Migrate the database:

   ```bash
   php artisan migrate
   ```

4. Seed the database:

   - **Control Access Seeder**:
     ```bash
     php artisan db:seed --class=ControlAccessSeeder
     ```
   - **Company and Branch Seeder**:
     ```bash
     php artisan db:seed --class=CompanyAndBranchSeeder
     ```
   - **Document Type Seeder**:
     ```bash
     php artisan db:seed --class=DocumentTypeSeeder
     ```
   - **User Permission Seeder**:
     ```bash
     php artisan db:seed --class=UserPermissionSeeder
     ```
   - **User Seeder**:
     ```bash
     php artisan db:seed --class=UserSeeder
     ```

5. Start the backend server:
   ```bash
   php -S localhost:8000 -t public
   ```

#### 3. Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd ./frontend
   ```

2. Install dependencies using npm:

   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

### Summary of Commands

#### Backend Commands

```bash
cd ./api
composer install
php artisan migrate
php artisan db:seed --class=ControlAccessSeeder
php artisan db:seed --class=CompanyAndBranchSeeder
php artisan db:seed --class=DocumentTypeSeeder
php artisan db:seed --class=UserPermissionSeeder
php artisan db:seed --class=UserSeeder
php -S localhost:8000 -t public
```

#### Frontend Commands

```bash
cd ./frontend
npm install
npm run dev
```

### Setup Github Secret Variables

```
BASE_PATH=/staging/gms
API_URL=https://dev82.bharmalsystems.net/staging/gms/api
APP_KEY=
FTP_HOST=
FTP_USERNAME=
FTP_PASSWORD=
```
