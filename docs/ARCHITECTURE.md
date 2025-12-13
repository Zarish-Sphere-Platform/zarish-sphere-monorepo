# Zarish Sphere PaaS Architecture: Single Source of Truth

This document serves as the **Single Source of Truth (SSOT)** for the high-level architecture of the Zarish Sphere Platform-as-a-Service (PaaS). All design decisions, technology choices, and component interactions are defined here.

## 1. Core Architectural Principles

The Zarish Sphere PaaS is built on a set of principles designed for scalability, resilience, and maintainability, aligning with the monorepo's SSOT philosophy:

| Principle | Description | Monorepo Implementation |
| :--- | :--- | :--- |
| **Microservices** | Independent, small services, each responsible for a specific business domain (e.g., Identity, Data Storage, AI Engine). | Each microservice is a separate project within the `apps/` directory. |
| **Data Ownership** | Each microservice owns its data and exposes it via APIs/Events. No direct database access between services. | Dedicated database configuration for each service, defined within its `apps/<service-name>` directory. |
| **API-First** | All services expose well-defined APIs, with schemas managed centrally. | All API schemas (OpenAPI/JSON Schema) are version-controlled in `packages/schema-registry`. |
| **Lego-Blocks Ecosystem** | Reusable components are shared across all applications. | Reusable components (UI, Core Logic) are defined in `packages/` and imported by `apps/`. |

## 2. Technology Stack (The SSOT for Tech Choices)

The platform is designed for high performance and scalability, leveraging modern open-source technologies:

| Layer | Component | Technology | Rationale |
| :--- | :--- | :--- | :--- |
| **Backend Services** | Core Logic, APIs | **Go (Golang) with Gin** | Exceptional speed, concurrency, and efficiency for high-throughput PaaS operations. |
| **Frontend UI** | User Interfaces, Studio Builder | **SvelteKit** | Compiles to highly optimized JavaScript for superior performance and fast page loads. |
| **Data Persistence** | Relational Data | **PostgreSQL** | Robust, feature-rich, and highly scalable for mission-critical data integrity. |
| **Inter-Service Comms** | Asynchronous Events | **NATS** | High-performance, lightweight messaging for event-driven microservices. |
| **Containerization** | Packaging | **Docker** | Standard for packaging applications and dependencies. |
| **Orchestration** | Deployment, Scaling | **Kubernetes** | Automates deployment, scaling, and management for enterprise-grade availability. |

## 3. High-Level Component Diagram

The Zarish Sphere PaaS is composed of the following key components, all version-controlled within this monorepo:

1.  **Zarish-UI (`apps/zarish-ui`):** The SvelteKit-based web application that hosts the GUI, including the "Lego-Blocks" Studio Builder.
2.  **Zarish-API-Gateway (`apps/zarish-api-gateway`):** The single entry point for all external traffic, routing requests to the appropriate microservice.
3.  **Zarish-Identity (`apps/zarish-identity`):** The core microservice for user authentication and authorization (AuthN/AuthZ).
4.  **Zarish-Engine (`apps/zarish-engine`):** The core PaaS runtime that executes the low-code applications built in the Studio.
5.  **Zarish-Core-Lib (`packages/zarish-core-lib`):** Reusable Go and TypeScript libraries shared by all services and applications.
6.  **Schema-Registry (`packages/schema-registry`):** The SSOT for all data contracts (JSON Schemas, OpenAPI specs).

## 4. Deployment and CI/CD

The monorepo structure enables a unified, "smart" CI/CD pipeline:

*   **Smart Builds:** GitHub Actions are configured to only build, test, and deploy projects in `apps/` that have been affected by the changes in a given commit.
*   **Deployment Target:** All services are deployed as Docker containers to a managed Kubernetes cluster.
*   **Configuration SSOT:** All deployment manifests (e.g., Kubernetes YAML, Helm charts) are stored in a dedicated `infra/` directory (to be created) within this monorepo, ensuring that the infrastructure is version-controlled alongside the code.
