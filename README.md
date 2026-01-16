# Curelo Landing Page Project

This project is a React-based landing page system with a built-in CMS and LeadSquared integration. It features multiple templates, an admin dashboard, and automated lead submission.

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) (optional, for containerized setup)

---

## 💻 Local Installation

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
    Ensure the following files exist in the `data/` directory (created automatically on first run, but useful to know):
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

## 🐳 Docker Installation

If you prefer using Docker, you can spin up the entire environment with a single command:

1.  **Build and Start:**
    ```bash
    docker-compose up --build
    ```
    This will:
    - Synchronize your local files with the container.
    - Install dependencies inside the container.
    - Start the development servers on ports **5173** (frontend) and **3001** (API).

---

---

## 💾 Data Persistence

This project uses file-based storage for CMS data and user credentials. To ensure your changes are not lost:

- **Local:** Data is saved directly to `data/cms_data.json` and `data/users.json`. Ensure you don't delete these files or the `data/` directory.
- **Docker:** The `docker-compose.yml` file is configured with a bind mount (`- .:/app`), which links your host machine's directory to the container. This ensures that any data saved by the CMS *inside* the container is written back to your local `data/` folder and persists even if the container is stopped or removed.

---

## 🛠 Project Structure

- `src/`: React frontend source code.
  - `pages/`: Page components (Home, Admin, Dashboard).
  - `templates/`: Configurable landing page templates.
  - `context/`: CMS and Authentication contexts.
- `api/`: Express.js backend for lead submission and CMS persistence.
- `data/`: JSON files for persistent data storage.
- `Dockerfile` & `docker-compose.yml`: Containerization configuration.

---

## 🚢 Production Build

To build the project for production:

1.  **Generate Build Assets:**
    ```bash
    npm run build
    ```
    The optimized files will be available in the `dist/` directory.

2.  **Using Docker for Production:**
    The provided `Dockerfile` uses a multi-stage build to serve the application using Nginx:
    ```bash
    docker build -t curelo-landing-page .
    docker run -p 80:80 curelo-landing-page
    ```

---

## 🔑 Admin Access

Access the admin dashboard at `/admin` to manage landing page content, change templates, and manage users. Default credentials can be found or configured in `data/users.json`.
