# Deployment Guide for Customer Management Portal

This document provides instructions for deploying the Customer Management Portal to a production environment.

## Prerequisites

- Node.js 14+ and npm
- Access to your Azure AD tenant admin portal
- Access to your web hosting environment

## Azure AD Configuration

Before deploying to production, you need to update your Azure AD app registration:

1. Go to the [Azure Portal](https://portal.azure.com)
2. Navigate to Azure Active Directory → App Registrations
3. Select your application (ID: cb0bf946-05a3-4740-be9b-0d4fa03b3c78)
4. Under "Authentication":
   - Add your production URL in the "Redirect URIs" section (e.g., `https://your-production-domain.com`)
   - Make sure "Single-page application" is selected as the platform type
   - Ensure "Access tokens" and "ID tokens" are checked
   - Save changes

## Environment Variables

Create a `.env.production` file in the root of your project with the following variables:

```
REACT_APP_BASE_URL=https://your-production-domain.com
PUBLIC_URL=/
REACT_APP_VERSION=1.0.0
```

Replace `https://your-production-domain.com` with your actual production domain.

## Building for Production

Run the following commands to build the application for production:

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

This will create a `build` folder with the production-ready files.

## Cache Busting for Updates

To prevent browser caching issues when deploying updates:

1. **Increment the version number**: 
   - Before each deployment, increment the `REACT_APP_VERSION` in your `.env.production` file.
   - Example: Change from `1.0.0` to `1.0.1` for a minor update.

2. **Server cache control**:
   - Configure your web server to send proper cache control headers.
   - Add the following headers to your server configuration:

   For Apache (.htaccess):
   ```
   <FilesMatch "index\.html$">
     Header set Cache-Control "no-cache, no-store, must-revalidate"
     Header set Pragma "no-cache"
     Header set Expires "0"
   </FilesMatch>
   
   <FilesMatch "\.(js|css)$">
     Header set Cache-Control "public, max-age=31536000"
   </FilesMatch>
   ```

   For Nginx:
   ```
   location / {
     add_header Cache-Control "no-cache, no-store, must-revalidate";
     add_header Pragma "no-cache";
     add_header Expires "0";
     try_files $uri $uri/ /index.html;
   }
   
   location ~* \.(js|css)$ {
     add_header Cache-Control "public, max-age=31536000";
     try_files $uri =404;
   }
   ```

3. **Force a hard refresh for all users**:
   - The application now includes a mechanism to detect version changes and force refresh.
   - When users load the application with a new version, their browser cache will be cleared.

## Deploying to Web Server

1. Upload the contents of the `build` folder to your web server's public directory
2. Configure your web server to serve the application:
   - Set up proper HTTPS with a valid SSL certificate
   - Configure the server to redirect all routes to `index.html` for client-side routing

### Apache Configuration

If using Apache, add the following to your `.htaccess` file:

```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Nginx Configuration

If using Nginx, add the following to your server block:

```
location / {
  try_files $uri $uri/ /index.html;
}
```

## Post-Deployment Verification

After deploying, verify:

1. The application loads without errors
2. Authentication works correctly
3. You can successfully log in and access protected routes
4. Test the application in an incognito/private window to ensure caching isn't affecting new users

## Troubleshooting

If you encounter issues after deployment:

- Check browser console for any errors
- Verify the `redirectUri` in the Azure Portal matches exactly what's in your deployed application
- Ensure all URLs are using HTTPS
- Verify CORS settings if your API is on a different domain

### Resolving Caching Issues

If users are still seeing an old version of the app:

1. **Increment version and redeploy**: 
   - Increase the `REACT_APP_VERSION` number in `.env.production` and rebuild/redeploy.

2. **Clear server cache**:
   - If using a CDN or caching proxy, purge the cache for your domain.

3. **Manual cache clearing instructions for users**:
   - Instruct users to perform a hard refresh (Ctrl+Shift+R or Cmd+Shift+R).
   - Or clear their browser cache through browser settings.

## Production Logging

In production, the logging level is automatically reduced to avoid performance issues. If you need to troubleshoot issues in production, you can temporarily increase the logging level by modifying the `logLevel` in `src/envConfig.js`.

## Security Considerations

- Always use HTTPS in production
- Regularly rotate client secrets (if used)
- Monitor authentication failures in Azure AD
- Implement proper session timeout handling 