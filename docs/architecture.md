# Zarish Sphere Architecture

## Overview

Zarish Sphere is an Enterprise-Grade, Open-Source, AI-powered Platform-as-a-Service (PaaS) that revolutionizes non-profit operations by enabling non-coders to rapidly build, implement, and deploy full-stack applications through a Graphical User Interface (GUI). It functions as a "Lego-Blocks development ecosystem" to rewire NGO operations globally.

## Core Principles

### 1. Single Source of Truth (SSOT)

The entire platform is built on the SSOT principle, where:

- **Schemas** in `/schemas` are the definitive source for all data contracts
- **Code** is generated from schemas, ensuring consistency
- **Documentation** is auto-generated from code and schemas
- **CI/CD validation** enforces that all generated files are up-to-date

### 2. Schema-Driven Development

All development starts with defining schemas:

- **Database Schema** (`/schemas/db.ts`) - Drizzle ORM definitions
- **API Schema** (`/schemas/api.yaml`) - OpenAPI specifications
- **Validation Schema** (`/schemas/json-validation/`) - JSON Schemas

Code and types are generated from these schemas, eliminating the need for manual synchronization.

### 3. Microservices & Microfrontends

The platform is composed of independent, loosely-coupled services:

- **Microservices** in `/services` handle specific business logic
- **Microfrontends** in `/apps` provide user interfaces
- **Shared Packages** in `/packages` provide common utilities and components

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Zarish Sphere Platform                    │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
        ┌───────▼────────┐ ┌──▼──────────┐ ┌──▼──────────┐
        │   GUI Builder  │ │ App Builder │ │ Docs Portal │
        │   (Microfrontend)│ │(Microfrontend)│ │(Microfrontend)│
        └────────────────┘ └─────────────┘ └─────────────┘
                │             │                   │
                └─────────────┼───────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   API Gateway     │
                    │   (tRPC Router)   │
                    └─────────┬─────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
    ┌───▼──────────┐  ┌───────▼──────┐  ┌──────────▼──┐
    │ AI Logic     │  │ Data Service │  │ Auth Service│
    │ (Microservice)│  │(Microservice)│  │(Microservice)│
    └──────────────┘  └──────────────┘  └─────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   Database        │
                    │   (MySQL/TiDB)    │
                    └───────────────────┘
```

## Directory Structure

### `/apps` - User-Facing Applications

```
apps/
├── gui-builder/          # Core GUI for non-coders to build applications
│   ├── src/
│   │   ├── components/
│   │   │   ├── GUIBuilder.tsx      # Main builder component
│   │   │   ├── Canvas.tsx          # Drag-and-drop canvas
│   │   │   ├── ComponentPalette.tsx # Available components
│   │   │   └── PropertiesPanel.tsx # Component properties editor
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── store/                  # Zustand state management
│   └── package.json
├── app-builder/          # Application scaffolding interface
│   ├── src/
│   ├── components/
│   └── pages/
└── docs-portal/          # Auto-generated documentation site
    └── public/           # Built documentation
```

### `/services` - Backend Microservices

```
services/
├── api-gateway/          # Main entry point (tRPC router)
│   ├── routers/
│   │   ├── builder.ts    # GUI builder operations
│   │   ├── apps.ts       # Application management
│   │   ├── forms.ts      # Form operations
│   │   └── auth.ts       # Authentication
│   └── procedures.ts     # tRPC procedures
├── ai-logic/             # AI-powered services
│   ├── block-suggester/  # Suggest components based on intent
│   ├── code-generator/   # Generate code from UI
│   └── analyzer/         # Analyze and optimize applications
└── data-service/         # Database operations
    ├── queries/
    ├── mutations/
    └── validators/
```

### `/packages` - Shared Libraries

```
packages/
├── ui-components/        # Reusable React components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   └── DragDropContainer.tsx
├── shared-types/         # Generated TypeScript types
│   ├── api.ts            # Generated from /schemas/api.yaml
│   ├── database.ts       # Generated from /schemas/db.ts
│   └── validation.ts     # Generated from JSON Schemas
├── utility-functions/    # Common utilities
│   ├── validation.ts
│   ├── formatting.ts
│   └── api-helpers.ts
└── constants/            # Shared constants
    ├── colors.ts
    ├── sizes.ts
    └── messages.ts
```

### `/schemas` - Data Contracts (SSOT)

```
schemas/
├── db.ts                 # Drizzle ORM database schema
│   ├── users table
│   ├── applications table
│   ├── components table
│   └── deployments table
├── api.yaml              # OpenAPI specification
│   ├── /api/builder/*    # Builder endpoints
│   ├── /api/apps/*       # Application endpoints
│   ├── /api/forms/*      # Form endpoints
│   └── /api/deploy/*     # Deployment endpoints
└── json-validation/      # JSON Schemas for validation
    ├── component.schema.json
    ├── application.schema.json
    └── form.schema.json
```

### `/docs` - Documentation (SSOT)

```
docs/
├── index.md              # Documentation index
├── architecture.md       # This file
├── getting-started.md    # Quick start guide
├── api-reference.md      # Auto-generated API docs
├── database-schema.md    # Auto-generated database docs
├── contributing.md       # Contribution guidelines
├── TODO.md               # Project roadmap
└── guides/
    ├── building-apps.md
    ├── deploying-apps.md
    └── extending-platform.md
```

### `/tools` - Automation Scripts

```
tools/
├── check-generated.sh    # PR-mode validation script
├── generate-index.mjs    # Master Index Generator
├── todo-sync.mjs         # Auto TODO Sync workflow
└── README.md             # Tools documentation
```

### `/.github` - CI/CD Workflows

```
.github/
├── workflows/
│   ├── ci.yml            # Main CI pipeline
│   ├── pr-validate.yml   # PR validation (runs check-generated.sh)
│   ├── gh-pages.yml      # Auto-publish to GitHub Pages
│   └── deploy.yml        # Deployment workflow
└── ISSUE_TEMPLATE/
    ├── bug_report.md
    ├── feature_request.md
    └── documentation.md
```

## Data Flow

### Building an Application

```
1. User opens GUI Builder
   ↓
2. Drags components onto canvas
   ↓
3. Configures component properties
   ↓
4. Connects to data sources (forms, APIs)
   ↓
5. Previews application
   ↓
6. Exports as JSON (application definition)
   ↓
7. System generates code from JSON
   ↓
8. Code is deployed to production
```

### SSOT Integrity Flow

```
1. Developer updates schema (/schemas/db.ts)
   ↓
2. Runs `pnpm run generate`
   ↓
3. Code is generated from schema
   ↓
4. Documentation is auto-generated
   ↓
5. Index is updated
   ↓
6. Developer commits all files
   ↓
7. PR validation checks that all generated files are committed
   ↓
8. If valid, PR can be merged
```

## Technology Stack

### Frontend
- **React 19** - UI framework
- **Tailwind CSS 4** - Styling
- **Zustand** - State management
- **React DnD** - Drag-and-drop functionality
- **TypeScript** - Type safety

### Backend
- **Express 4** - HTTP server
- **tRPC 11** - Type-safe RPC
- **Drizzle ORM** - Database access
- **Node.js** - Runtime

### Database
- **MySQL/TiDB** - Primary database

### DevOps
- **GitHub Actions** - CI/CD
- **GitHub Pages** - Documentation hosting
- **Docker** - Containerization (future)

## Key Features

### 1. GUI Builder
Non-coders can drag-and-drop components to build applications without writing code.

### 2. Component Library
Pre-built components for common use cases (forms, tables, charts, etc.).

### 3. Data Binding
Automatic binding between UI components and backend data sources.

### 4. Workflow Automation
Create workflows to automate repetitive tasks.

### 5. AI-Powered Suggestions
AI suggests components and code based on user intent.

### 6. One-Click Deployment
Deploy built applications with a single click.

### 7. Real-Time Collaboration
Multiple users can collaborate on building applications simultaneously.

## Development Workflow

### For Feature Development

1. **Update Schema** - Define new data structures in `/schemas`
2. **Generate Code** - Run `pnpm run generate` to create types and code
3. **Implement Feature** - Add business logic in `/services` or `/apps`
4. **Write Tests** - Add unit and integration tests
5. **Update Docs** - Document the feature
6. **Create PR** - PR validation ensures SSOT integrity
7. **Merge** - Once validated, merge to main branch

### For Documentation

1. **Write Markdown** - Add or update `.md` files in `/docs`
2. **Run Generator** - `pnpm run generate:docs` updates indexes
3. **Preview** - Run `pnpm run docs:serve` to preview locally
4. **Commit** - Commit documentation changes
5. **Auto-Publish** - GitHub Actions publishes to GitHub Pages

## Deployment

### Development
```bash
pnpm dev
```

### Production Build
```bash
pnpm build
pnpm start
```

### Documentation
```bash
pnpm run docs:build
pnpm run docs:serve
```

## Extensibility

### Adding a New Microservice

1. Create a new directory in `/services`
2. Define the service interface
3. Implement the service logic
4. Add tRPC procedures to expose the service
5. Update documentation

### Adding a New Microfrontend

1. Create a new directory in `/apps`
2. Implement the React application
3. Connect to tRPC backend
4. Update main router in `/client/src/App.tsx`
5. Document the feature

### Adding a New Component Type

1. Define the component schema in `/schemas`
2. Implement the component in `/packages/ui-components`
3. Add rendering logic in GUI Builder
4. Update component palette
5. Document the component

## Security

- **Authentication** - OAuth 2.0 via Manus
- **Authorization** - Role-based access control (RBAC)
- **Data Validation** - JSON Schema validation on all inputs
- **API Security** - tRPC with type safety
- **Database Security** - Parameterized queries via Drizzle ORM

## Performance

- **Lazy Loading** - Components loaded on demand
- **Code Splitting** - Separate bundles for each app
- **Caching** - Browser and server-side caching
- **Database Optimization** - Indexed queries
- **CDN** - Static assets served via CDN

## Monitoring & Logging

- **Application Logs** - Structured logging via Winston/Pino
- **Error Tracking** - Sentry integration
- **Performance Monitoring** - New Relic/Datadog
- **User Analytics** - Segment integration

## Contributing

See `contributing.md` for guidelines on contributing to Zarish Sphere.

---

*Last Updated: 2025-12-07*

## Backlinks

- [API Reference](../api-reference.md)
- [Database Schema](../database-schema.md)
- [Getting Started with Zarish Sphere](../getting-started.md)
- [Deploying Applications with Zarish Sphere](../guides/deploying-apps.md)
- [Extending Zarish Sphere](../guides/extending-platform.md)
- [Zarish Sphere Platform](../index.md)
