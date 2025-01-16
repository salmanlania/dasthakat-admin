# Global Marine Safety - America

This project is a full-stack application built with **React** on the frontend and **Laravel Lumen** on the backend.

## Getting Started

### Prerequisites

To set up the project, ensure the following are installed on your system:

-   **PHP**: Version 8.1 or higher.
-   **Composer**: Dependency manager for PHP.
-   **Node.js**: For managing frontend dependencies.

### Installation Steps

#### 1. Backend Setup

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

#### 2. Frontend Setup

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
