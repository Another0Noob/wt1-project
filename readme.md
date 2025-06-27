# Project Boycott

Die Boycott App ermöglicht Nutzern, Produkte und deren Hersteller zu dokumentieren und zu bewerten, um informierte Kaufentscheidungen zu treffen.

## Authors

- [Anton](https://github.com/Another0Noob)
- [Mai](https://github.com/maile000)

### 2. Migrated to Next.js

- Uninstalled Express.
- Installed Next.js as described in the course book.
- Updated `package.json` to include Next.js, React, and TypeScript dependencies and scripts.
- Added `tsconfig.json` for TypeScript configuration.
- Moved all template files to the `components` and `pages` directories according to Next.js conventions.
- All routes and pages are now handled by Next.js.
- Development: Use `npm run dev` to start the Next.js development server.

### 3. Docker Setup

**Dockerfile:**
- Changed `WORKDIR` to set the working directory for the app.
- Added `npm run build` to build the Next.js app during the build stage.

**Docker Compose:**
- Removed volumes from the `application` service to prevent source code from overwriting the build.