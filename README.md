# Vercel-Deployment-Service

A custom deployment service inspired by Vercel, designed to handle file uploads, build processes, and serve deployed projects efficiently. This project comprises three core services and a React-based frontend to manage the deployment lifecycle.

## Features

- **File Management**: Upload files from GitHub repositories to a local server, then push them to Cloudflare R2 storage.
- **Build and Deployment**: Convert uploaded files into `HTML`, `CSS`, and `JS` on the local server, then deploy the output to Cloudflare R2.
- **URL Generation**: Generate unique URLs for deployed files.
- **Status Management**: APIs to check deployment status (e.g., `uploaded` or `deployed`).
- **Redis Queue Integration**: Efficient task management using Redis for queuing and processing deployment jobs.

---

## Architecture

### 1. **Main Service**
   - Fetches files and folders from a GitHub repository.
   - Temporarily stores the files on a local server.
   - Pushes the files to Cloudflare R2 storage.

### 2. **Deployment Service**
   - Pulls files from Cloudflare R2 storage.
   - Builds the files into static assets (`HTML`, `CSS`, and `JS`) on the local server.
   - Pushes the generated static files back to Cloudflare R2.

### 3. **Request Handler Service**
   - Provides the status of the deployment process (`uploaded`, `deployed`, etc.).
   - Handles URL requests by resolving the ID from the generated URL.
   - Fetches the corresponding `index.html` file from Cloudflare R2 storage and serves it.

### 4. **Frontend (React)**
   - Displays the deployment status (e.g., `uploaded`, `deployed`).
   - Generates a unique URL for deployed projects.
   - Checks the deployment status before URL generation.

---

## Technologies Used

- **Backend Services**: 
  - Built with `TypeScript` for all three services.
  - Uses `Redis` for status storage and queue management.
- **Frontend**: 
  - Developed using `React` with `TypeScript`.
  - Styled using `TailwindCSS`.
- **Storage**: 
  - Cloudflare R2 for storing uploaded files and deployment artifacts.
- **Queue Management**:
  - Redis Queue for efficiently managing deployment tasks.

---

## Workflow

1. **Upload Files**:
   - The `Main Service` fetches files from a GitHub repository.
   - Files are uploaded to Cloudflare R2 storage.

2. **Deployment Process**:
   - The `Deployment Service` pulls files from R2.
   - Builds the files into static assets (HTML, CSS, JS).
   - Pushes the built files back to R2.

3. **Status Tracking**:
   - A status-checking API ensures visibility into the process:
     - `uploaded` - Files are uploaded to R2.
     - `deployed` - Files are built and deployed successfully.

4. **URL Generation**:
   - The frontend checks if the deployment is complete.
   - If `deployed`, a unique URL is generated.
   - The `Request Handler Service` resolves requests using the ID from the URL and serves the `index.html`.

---

## APIs

### **Main Service**
- **Upload Files**
  - Endpoint: `/upload`
  - Description: Fetches files from a GitHub repo and uploads them to R2.
  - Response: `{ status: "uploaded", id: <unique_id> }`

### **Deployment Service**
- **Deploy Files**
  - Endpoint: `/deploy`
  - Description: Processes files from R2, builds them, and redeploys.
  - Response: `{ status: "deployed", id: <unique_id> }`

### **Request Handler Service**
- **Check Status**
  - Endpoint: `/status/<id>`
  - Description: Checks if files are `uploaded` or `deployed`.
  - Response: `{ id: <unique_id>, status: "deployed" }`

- **Serve Deployed Files**
  - Endpoint: `/serve/<id>`
  - Description: Resolves the ID, fetches the `index.html` file, and serves it.

---

## Redis Queue Workflow

1. **Push to Queue**:
   - When a file is uploaded, its ID is pushed to the Redis queue.

2. **Pop from Queue**:
   - The Deployment Service pops the ID from the queue, builds the files, and pushes them to R2.

3. **Status Update**:
   - After deployment, the status in Redis is updated to `deployed`.

---

## Installation and Setup

### Prerequisites
- `Node.js` and `npm`/`yarn`
- `Redis`
- Cloudflare R2 credentials

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/khalekarakash05/Vercel-Deployment_service.git
   cd Vercel-Deployment_service

# Install dependencies for each service:

    cd frontend
    npm install
    cd ../vercel-Main
    npm install
    cd ../vercel-deploy-service
    npm install
    cd ../vercel-main-request-handler
    npm install

# Set up environment variables:
- **Create a .env file for each service and configure**:
    - Redis connection details.
    - Cloudflare R2 credentials.
    - GitHub API token (if required).

# Start Redis
  - redis-server

# Run the services:
   # Main Service
cd vercel-Main
npm start

# Deployment Service
cd ../vercel-deploy-service
npm start

# Request Handler Service
cd ../vercel-main-request-handler
npm start

# Frontend
cd ../frontend
npm start


# Future Improvements
 - Add support for more cloud storage providers (e.g., AWS S3).
 - Implement a CI/CD pipeline for automating deployment.
 - Enhance error handling and logging for better debugging.
 - Introduce authentication and role-based access control for secure usage