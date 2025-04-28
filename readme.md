
# Project Boycott

Die Boycott App ermöglicht Nutzern, Produkte und deren Hersteller zu dokumentieren und zu bewerten, um informierte Kaufentscheidungen zu treffen. 



## Authors

- [Anton](https://github.com/Another0Noob)
- [Mai](https://github.com/maile000)



## Documentation

[Documentation](https://linktodocumentation)

### 2. Simple Express App
We created a basic Express application following Chapter 01 from the textbook:

Created an Express app in index.js.

#### 2b
Problem: Opening http://localhost:3001/ gives 404 error because no / route is defined.
Why: Only /hello is handled, not /.
Fix: Add a route for /:

### 3. Docker Setup
Dockerfile: Created to build a simple image for the Express app.

Docker Compose:

Added a docker-compose.yml file.

Configured two services: app (Express app) and nginx (proxy server).

NGINX:

Configured default.conf.template to serve static files from public_html at the path /doc.

NGINX acts as a reverse proxy for the Express app.

#### 3e
Updated to use a multi-stage build:
- Builder stage: Installs dependencies and prepares the application.
- Production stage: Creates a lightweight image with only the necessary files for running the app.