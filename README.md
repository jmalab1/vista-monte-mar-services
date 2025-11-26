# Vista Monte Mar Services

This repository serves as the infrastructure and orchestration layer for the Vista Monte Mar project. It manages the deployment configuration for both the backend and frontend services, including Docker Compose setups for local development and Helm charts for Kubernetes deployment.

## Prerequisites

To work with this repository, you should have the following installed:

*   **Docker** & **Docker Compose**
*   **Node.js** & **npm**
*   **Helm** (for Kubernetes deployment)

### Local Development Requirements
For local development and building images from source, this repository expects the application source code to be located in sibling directories:

*   `../vista-monte-mar-services` (This repository)
*   `../vista-monte-mar-be` (Backend API)
*   `../vista-monte-mar-app` (Frontend Application)

> **Note:** The Helm charts are designed to pull pre-built images and do not require the sibling repositories to be present for deployment.

## Local Development

You can run the entire stack locally using the provided helper script or Docker Compose directly.

### Using the Build Script
The `devBuild.sh` script automates the process of installing dependencies, building Docker images from the sibling repositories, and starting the services.

```bash
./devBuild.sh
```

This script performs the following:
1.  Installs dependencies in `../vista-monte-mar-be`.
2.  Builds the `vista-monte-mar-server` Docker image.
3.  Installs dependencies and builds the frontend in `../vista-monte-mar-app`.
4.  Builds the `vista-monte-mar-app` Docker image.
5.  Starts the services using `docker compose`.

### Manual Docker Compose
If images are already built, you can simply run:

```bash
docker compose up -d
```

The services will be available at:
*   **Frontend**: http://localhost:8080
*   **Backend**: http://localhost:8135
*   **Postgres**: Port 5432

## Deployment

This repository contains a Helm chart for deploying the application to a Kubernetes cluster.

### Helm Chart
The chart is located in the `helm/` directory.

*   **Chart.yaml**: Defines the chart metadata and dependencies (cert-manager, keel).
*   **values.template.yaml**: A template for configuration values.

To deploy, you would typically use `helm install` or `helm upgrade` with your specific values file.

## Utilities

### Key Generation
The `generateKey` directory contains a utility script for generating secure keys (e.g., for `AUTH_SECRET_KEY`).

```bash
node generateKey/generate.js
```