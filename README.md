# Yiondev.me 

Welcome to my portfolio repository. This project is structured as a **monorepo**, combining a blazing-fast React/Next.js frontend with an isolated Python-based REST API backend and a persistent PostgreSQL database.

---

## 🏗️ Project Architecture

The repository is split into two main application directories orchestrated top-down by Docker Compose:

* **`/frontend`**: Built with **Next.js (App Router)**. Optimized for performance (achieving 95+ Lighthouse metrics) and styled dynamically. Deployed automatically via **Vercel**.
* **`/backend`**: A high-performance REST API built with **Python (FastAPI/Flask)**. Containers are built on minimal Alpine Linux images.
* **Database**: **PostgreSQL**, completely containerized with persistent data volume mapping to ensure data survives container restarts.

---

## 🛠️ Local Development Setup

Thanks to Docker, you can spin up the entire full-stack ecosystem (Frontend, Backend, and Database) locally with a single command.

### Prerequisites
Ensure you have [Docker and Docker Compose](https://docs.docker.com/get-docker/) installed on your machine.

### Getting Started

1.  Clone the repository:
    ```bash
    git clone [https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git)
    cd YOUR_REPO_NAME
    ```

2.  Spin up the entire stack:
    ```bash
    docker compose up --build
    ```

3.  Access the local services:
    * **Frontend web app:** [http://localhost:3000](http://localhost:3000) (Supports Hot-Reload / Fast Refresh)
    * **Backend REST API:** [http://localhost:8000](http://localhost:8000)
    * **Interactive API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs) *(If using FastAPI)*

---

## 🚀 CI/CD & Automation

This project utilizes automated pipelines to ensure code quality and stability before deployment:
* **GitHub Actions (`eslint.yml`)**: Automatically triggers Next.js's native framework-optimized linter on every push to the `main` branch.
* **Production Deployments**: 
    * The frontend automatically compiles and shifts live onto **Vercel** via root-directory branch tracking.
    * The backend and database run seamlessly within isolated Docker container networks on a dedicated cloud virtual private server.