# Curelo Landing Page Project

This project is a React-based landing page system with a built-in CMS and LeadSquared integration. It features multiple templates, an admin dashboard, and automated lead submission.

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) (Required for production/server setup)

---

## 💻 Local Development

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <project-folder>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Copy the example environment file and fill in your LeadSquared credentials:
    ```bash
    cp .env.example .env
    ```
    Edit `.env` and provide:
    - `LEADSQUARED_ACCESS_KEY`
    - `LEADSQUARED_SECRET_KEY`

4.  **Initialize Data Files:**
    Ensure the following files exist in the `data/` directory (created automatically on first run):
    - `data/cms_data.json`: Stores all landing page configurations.
    - `data/users.json`: Stores administrator credentials.

5.  **Run the Development Server:**
    This command starts both the Vite frontend and the Express dev-server:
    ```bash
    npm run dev
    ```
    - Frontend: `http://localhost:5173`
    - API Server: `http://localhost:3001`

---

## 🐳 Docker Deployment (Server/Production)

For servers and production environments, the project uses a robust dual-container architecture:

### Architecture Overview
- **Nginx (web)**: Serves the built frontend assets and acts as a **Reverse Proxy** on port **80**.
- **Node.js (api)**: Handles authentication, CMS data, and lead submissions on port **3001**.

### 1. Build and Start
On your server, run the following command to pull changes and start the stack:
```bash
docker-compose up --build -d
```

### 2. Accessing the App
- **Public URL**: `http://<your-server-ip>`
- **Admin Dashboard**: `http://<your-server-ip>/admin`

---

## 💾 Data Persistence

This project uses file-based storage for CMS data and user credentials. 

- **Local Development:** Data is saved directly to the `data/` directory.
- **Docker/Server:** The `docker-compose.yml` file uses a volume mount (`./data:/app/data`). This ensures that your CMS changes and user settings persist on the host server even if the containers are removed or rebuilt.

---

## � Admin Access

Access the admin dashboard at `/admin` to manage landing page content, change templates, and manage users.

**Default Credentials:**
- **Username**: `admin`
- **Password**: `curelo@2026`

---

## 🛠 Project Structure

- `src/`: React frontend source code.
- `api/`: Express.js backend for lead submission and CMS persistence.
- `data/`: JSON files for persistent data storage.
- `Dockerfile`: Multi-stage build for the Nginx frontend.
- `Dockerfile.api`: Dockerfile for the Node.js API server.
- `nginx.conf`: Reverse proxy and static file configuration.
- `docker-compose.yml`: Multi-container orchestration.
