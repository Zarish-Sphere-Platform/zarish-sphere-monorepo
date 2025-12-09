# Contributing to Zarish Sphere Monorepo

Welcome! We are thrilled you are considering contributing to the Zarish Sphere Platform-as-a-Service (PaaS). As the **Single Source of Truth (SSOT)** for the entire platform, this monorepo contains all code, documentation, and configuration.

## 1. Getting Started

1.  **Fork and Clone:** Fork the `Zarish-Sphere-Platform/zarish-sphere-monorepo` repository and clone your fork locally.
2.  **Install Dependencies:** We use `pnpm` for package management.
    ```bash
    pnpm install
    ```
3.  **Local Development:** All projects are located in `apps/` (deployable services) and `packages/` (reusable components).
    *   To run a specific application, refer to its local `README.md` file.

## 2. Monorepo Principles (SSOT for Code)

*   **Atomic Commits:** All related changes across different packages (e.g., a change in a core package and its usage in an app) must be included in a single commit.
*   **Shared Dependencies:** Always use the shared dependencies defined in the root `package.json` or a common package in `packages/`. Avoid installing duplicate dependencies.
*   **Tooling:** Use the scripts defined in the root `package.json` (e.g., `pnpm run lint`, `pnpm run test`).

## 3. Documentation is Code (SSOT for Knowledge)

*   **Architecture:** All major design decisions and architectural changes must be documented in the `docs/` directory.
*   **READMEs:** Every application in `apps/` and package in `packages/` must have a comprehensive `README.md` explaining its purpose, usage, and local setup.
*   **TODOs:** Use the standard `// TODO: [Your Task]` format in code. The `pnpm run todo` script will automatically sync these to the master list.

## 4. Submitting a Pull Request

1.  **Create a Branch:** Create a new branch for your feature or fix.
2.  **Commit Message:** Use clear, descriptive commit messages.
3.  **Run Checks:** Ensure all local checks pass: `pnpm run lint` and `pnpm run test` (when available).
4.  **Open PR:** Open a Pull Request against the `main` branch of the main repository. The CI pipeline will automatically run validation checks and update the master index and TODO list.

Thank you for helping us build the future of non-profit technology!
