# 🌟 Zarish Sphere: Enterprise-Grade Platform-as-a-Service (SSOT)

Welcome to the **Single Source of Truth (SSOT)** Monorepo for Zarish Sphere.

Zarish Sphere is an AI-powered PaaS designed as a "Lego-Blocks development ecosystem" to revolutionize non-profit operations globally by enabling rapid, low-code application development through a Graphical User Interface (GUI).

---

## 🧭 Quick Links

- **[📝 Live Documentation Site (GitHub Pages)](https://zarish-sphere-platform.github.io/zarish-sphere-monorepo/)**
- **[📋 Master TODO List](./MASTER_TODO.md)** (Auto-synced tasks across all files)
- **[🗺️ Master Index & File Structure](./MASTER_INDEX.md)** (Auto-generated deep index)

---

## 🏗️ Monorepo Structure Overview

This repository is organized to separate deployable applications (`apps/`) from reusable component libraries (`packages/`) and documentation (`docs/`).

| Directory                   | Purpose                                                                           |
| :-------------------------- | :-------------------------------------------------------------------------------- |
| `apps/`                     | Contains all deployable applications (e.g., the Studio Builder, API Gateway).     |
| `packages/`                 | Contains reusable "Lego Blocks" (UI components, Core Engine, Schema Definitions). |
| `docs/`                     | The primary location for static documentation (Architecture, Design Decisions).   |
| `scripts/`                  | Automation scripts for indexing, TODO sync, and CI/CD validation.                 |
| `packages/schema-registry/` | **The Data Truth.** All JSON Schemas and OpenAPI specifications reside here.      |

---

## 🛠️ Development & Automation

This project leverages GitHub Actions for continuous integration, automatic documentation publishing, and enforcing code quality.

- **PR-Mode Automation:** All index and TODO list updates are committed automatically by the CI pipeline, ensuring the SSOT is always current.
- **Validation:** Pushes and Pull Requests trigger linters, schema validation, and (eventually) unit tests.
