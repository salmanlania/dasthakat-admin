# CI/CD Pipeline Documentation

This document provides comprehensive guidance for setting up and managing the CI/CD pipeline for the Global Marine Safety (GMS) project using GitHub Actions and cPanel hosting.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step-by-Step Pipeline Setup](#step-by-step-pipeline-setup)
4. [GitHub Actions Workflows](#github-actions-workflows)
5. [Environment Configuration](#environment-configuration)
6. [Deployment Process](#deployment-process)
7. [Monitoring and Maintenance](#monitoring-and-maintenance)
8. [Troubleshooting](#troubleshooting)
9. [Best Practices](#best-practices)

## Overview

The GMS project uses GitHub Actions for automated CI/CD deployment to cPanel hosting via FTP. The pipeline supports multiple environments (development and testing) with automatic builds, deployments, and database migrations.

### Architecture
- **Frontend**: React application built with Vite
- **Backend**: Laravel Lumen API
- **Database**: MySQL on cPanel
- **Deployment**: FTP to cPanel hosting
- **CI/CD**: GitHub Actions

## Prerequisites

Before setting up the pipeline, ensure you have:

- cPanel hosting account with FTP access
- GitHub repository with appropriate branch structure
- Database creation permissions in cPanel
- Basic knowledge of GitHub Actions and environment variables

## Step-by-Step Pipeline Setup

### Step 1: Server Folder Structure Creation

1. **Access your cPanel File Manager** or connect via FTP client
2. **Navigate to your public_html directory**
3. **Create the main application folder structure**:
   ```
   public_html/
   └── gms/
       ├── dev/          # Development environment
       │   └── api/      # Backend API files
       └── testing/      # Testing environment
           └── api/      # Backend API files
   ```

4. **Set proper permissions**:
   - Folders: 755
   - PHP files: 644

### Step 2: GitHub Actions Pipeline Creation

1. **Create workflow files** in your repository under `.github/workflows/`:

   **Development Workflow** (`dev_deploy.yml`):
   ```yaml
   name: Deploy to Development Server
   
   on:
     push:
       branches: [ develope ]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         # Frontend build and deployment
         # Backend deployment
         # Database operations
   ```

   **Testing Workflow** (`testing_deploy.yml`):
   ```yaml
   name: Deploy to Testing Server
   
   on:
     push:
       branches: [ testing ]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         # Similar structure to dev workflow
   ```

2. **Configure workflow triggers**:
   - Development: Triggers on push to `develope` branch
   - Testing: Triggers on push to `testing` branch

### Step 3: GitHub Secrets Configuration

Navigate to your GitHub repository → Settings → Secrets and variables → Actions, then add:

#### FTP Configuration
- `FTP_HOST`: Your cPanel FTP hostname
- `FTP_USERNAME`: FTP username
- `FTP_PASSWORD`: FTP password

#### Deployment Tokens
- `DEV_APP_KEY`: Secure token for development environment
- `TEST_APP_KEY`: Secure token for testing environment

#### Database Configuration (Optional)
- `DEV_DB_HOST`: Development database host
- `DEV_DB_NAME`: Development database name
- `DEV_DB_USERNAME`: Development database username
- `DEV_DB_PASSWORD`: Development database password
- `TEST_DB_HOST`: Testing database host
- `TEST_DB_NAME`: Testing database name
- `TEST_DB_USERNAME`: Testing database username
- `TEST_DB_PASSWORD`: Testing database password

### Step 4: cPanel Database Creation

1. **Access cPanel Dashboard**
2. **Navigate to MySQL Databases**
3. **Create databases**:
   - Development: `your_prefix_gms_dev`
   - Testing: `your_prefix_gms_test`
4. **Create database users** with appropriate privileges
5. **Note down connection details** for environment configuration

### Step 5: Initial Deployment

1. **Prepare your code**:
   - Ensure all environment files are properly configured
   - Verify frontend build process works locally
   - Test backend API endpoints locally

2. **Push to trigger deployment**:
   ```bash
   git add .
   git commit -m "Initial deployment setup"
   git push origin develope  # For development
   # or
   git push origin testing   # For testing
   ```

3. **Monitor GitHub Actions**:
   - Go to your repository → Actions tab
   - Watch the workflow execution
   - Check for any errors in the logs

### Step 6: Post-Deployment Configuration

After the initial deployment completes:

1. **Configure Backend Environment**:
   - Access your server's `api` folder via cPanel File Manager
   - Edit the `.env` file with correct database credentials:
     ```env
     DB_HOST=localhost
     DB_DATABASE=your_database_name
     DB_USERNAME=your_db_username
     DB_PASSWORD=your_db_password
     APP_URL=https://yourdomain.com/gms/dev
     ```

2. **Upload Frontend Configuration**:
   - Check if `config.json` exists in the frontend public folder
   - If missing, create and upload:
     ```json
     {
       "API_BASE_URL": "https://yourdomain.com/gms/dev/api"
     }
     ```

### Step 7: Migration Execution

1. **Trigger workflow again**:
   ```bash
   git commit --allow-empty -m "Trigger migration execution"
   git push origin develope
   ```

2. **Verify migration execution**:
   - Check GitHub Actions logs for migration status
   - Verify database tables are created in cPanel

### Step 8: Application Access and Verification

1. **Access your application**:
   - Development: `https://yourdomain.com/gms/dev/`
   - Testing: `https://yourdomain.com/gms/testing/`

2. **Verify functionality**:
   - Frontend loads correctly
   - API endpoints respond
   - Database connectivity works
   - Authentication functions properly

## GitHub Actions Workflows

### Development Workflow Features
- **Frontend Build**: React app built with Vite
- **FTP Deployment**: Code uploaded to `/public_html/gms/dev/`
- **Backend Setup**: Composer dependencies and API deployment
- **Database Operations**: Automatic migrations via HTTP endpoints
- **Asset Management**: Proper handling of static assets and routing

### Testing Workflow Features
- **Similar to development** but deploys to `/public_html/gms/testing/`
- **Separate environment variables** and database
- **Independent deployment pipeline**

### Workflow Steps Breakdown

1. **Checkout Code**: Repository code checkout
2. **Setup Node.js**: Frontend build environment
3. **Frontend Build**: React application compilation
4. **Frontend Deploy**: Upload to server via FTP
5. **Setup PHP**: Backend environment preparation
6. **Backend Deploy**: API files upload (excluding vendor)
7. **Vendor Upload**: Compressed vendor directory upload
8. **Live Actions**: Remote vendor extraction and migrations

### Automatic Deployment Triggers
- **Development**: Push to `develope` branch
- **Testing**: Push to `testing` branch

### Manual Deployment
1. Navigate to GitHub Actions tab
2. Select the appropriate workflow
3. Click "Run workflow"
4. Choose the branch and trigger manually

### Deployment Verification
- Monitor GitHub Actions logs
- Check server file timestamps
- Verify application functionality
- Test API endpoints
- Confirm database connectivity

## Monitoring and Maintenance

### Regular Monitoring Tasks
- **GitHub Actions Status**: Check for failed deployments
- **Server Resources**: Monitor disk space and performance
- **Database Health**: Regular backup and optimization
- **Security Updates**: Keep dependencies updated

### Log Monitoring
- **GitHub Actions Logs**: Deployment process monitoring
- **Server Error Logs**: cPanel error log review
- **Application Logs**: Laravel/Lumen log monitoring

### Performance Monitoring
- **Frontend Load Times**: Monitor application performance
- **API Response Times**: Backend performance tracking
- **Database Query Performance**: Optimize slow queries

## Troubleshooting

### Common Issues and Solutions

#### Deployment Failures
**Issue**: FTP connection timeout
**Solution**: 
- Verify FTP credentials in GitHub Secrets
- Check server FTP service status
- Ensure firewall allows FTP connections

**Issue**: Build failures
**Solution**:
- Check Node.js/PHP version compatibility
- Verify package.json and composer.json syntax
- Review dependency conflicts

#### Database Issues
**Issue**: Migration failures
**Solution**:
- Verify database credentials
- Check database user permissions
- Ensure database exists and is accessible

**Issue**: Connection refused
**Solution**:
- Confirm database host and port
- Verify firewall settings
- Check database service status

#### Frontend Issues
**Issue**: Blank page or routing errors
**Solution**:
- Verify .htaccess file upload
- Check frontend build configuration
- Ensure API base URL is correct

### Debug Mode
Enable debug mode temporarily for troubleshooting:
```env
APP_DEBUG=true
```
**Remember to disable after debugging**

### Log Analysis
- Check GitHub Actions workflow logs
- Review cPanel error logs
- Monitor Laravel/Lumen application logs

## Best Practices

### Security
- **Rotate Credentials**: Regularly update FTP and database passwords
- **Secure Tokens**: Use strong deployment tokens
- **Environment Variables**: Never commit sensitive data to repository
- **Access Control**: Limit FTP account permissions

### Performance
- **Optimize Builds**: Minimize frontend bundle size
- **Database Indexing**: Proper database index management
- **Caching**: Implement appropriate caching strategies
- **Asset Optimization**: Compress images and static assets

### Maintenance
- **Regular Backups**: Automated database and file backups
- **Dependency Updates**: Keep packages updated
- **Security Patches**: Apply security updates promptly
- **Documentation**: Keep deployment documentation current

### Development Workflow
- **Branch Strategy**: Use feature branches for development
- **Code Review**: Implement pull request reviews
- **Testing**: Comprehensive testing before deployment
- **Rollback Plan**: Maintain rollback procedures

---

## Support and Documentation

For additional support:
- Review GitHub Actions documentation
- Check Laravel/Lumen deployment guides
- Consult cPanel hosting documentation
- Monitor project-specific logs and metrics

This pipeline documentation should be updated as the deployment process evolves and new requirements emerge.
