# Getting Started with Zarish Sphere

Welcome to Zarish Sphere! This guide will help you get up and running with the platform.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (v10 or higher) - Package manager
- **Git** - Version control
- **GitHub CLI** (optional) - For GitHub integration

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Zarish-Sphere-Platform/zarish-sphere-monorepo.git
cd zarish-sphere-monorepo
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Setup Environment Variables

Copy the example environment file and configure your settings:

```bash
cp .env.example .env.local
```

Update the following variables:
- `DATABASE_URL` - Your database connection string
- `VITE_APP_ID` - Your OAuth application ID
- `OAUTH_SERVER_URL` - OAuth server URL

### 4. Setup Database

Run the database migrations:

```bash
pnpm db:push
```

## Running the Application

### Development Mode

Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
pnpm build
pnpm start
```

## Using the GUI Builder

### Accessing the Builder

1. Open your browser and navigate to `http://localhost:3000`
2. Click on "GUI Builder" in the navigation
3. You'll see the builder interface with three main areas:
   - **Component Palette** (left) - Available components to drag
   - **Canvas** (center) - Where you build your application
   - **Properties Panel** (right) - Configure selected components

### Building Your First Application

1. **Add Components** - Click on components in the palette to add them to the canvas
2. **Arrange Components** - Drag components to arrange them on the canvas
3. **Configure Properties** - Select a component and edit its properties in the right panel
4. **Preview** - Click "Preview" to see how your application looks
5. **Export** - Click "Export" to download your application as JSON

### Component Types

The GUI Builder includes the following component types:

- **Button** - Interactive buttons for user actions
- **Input Field** - Text input for user data
- **Text** - Static text content
- **Heading** - Section headings
- **Card** - Container for grouped content
- **Container** - Layout container for organizing components
- **Form** - Complete form with validation
- **Image** - Display images

## Project Structure

Familiarize yourself with the project structure:

```
zarish-sphere-ssot/
├── apps/                 # User-facing applications
│   └── gui-builder/      # The GUI builder application
├── services/             # Backend microservices
├── packages/             # Shared libraries
├── schemas/              # Data contracts (SSOT)
├── docs/                 # Documentation
├── tools/                # Automation scripts
└── .github/              # CI/CD workflows
```

See `architecture.md` for a detailed explanation of the structure.

## Common Tasks

### Adding a New Component Type

1. Update the component schema in `/schemas`
2. Implement the component in `/packages/ui-components`
3. Add rendering logic in the GUI Builder
4. Run `pnpm run generate` to update generated files

### Creating a New Service

1. Create a new directory in `/services`
2. Implement the service logic
3. Add tRPC procedures to expose the service
4. Update the API schema in `/schemas/api.yaml`

### Updating Documentation

1. Edit or create `.md` files in `/docs`
2. Run `pnpm run generate:docs` to update the index
3. Run `pnpm run docs:serve` to preview locally

## Running Tests

### Unit Tests

```bash
pnpm test
```

### Watch Mode

```bash
pnpm test:watch
```

### Coverage Report

```bash
pnpm test:coverage
```

## Building Documentation

### Generate Documentation

```bash
pnpm run generate:docs
```

### Serve Documentation Locally

```bash
pnpm run docs:serve
```

The documentation will be available at `http://localhost:8000`

## SSOT Integrity

The platform enforces Single Source of Truth (SSOT) integrity through automated validation:

### Before Creating a Pull Request

1. Update source files (code, schemas, or documentation)
2. Run `pnpm run generate` to regenerate all outputs
3. Commit all changes including generated files

### PR Validation

When you create a pull request, the following checks run automatically:

- **Schema Validation** - Ensures schemas are valid
- **Generated Files Check** - Verifies all generated files are committed
- **Tests** - Runs all unit and integration tests
- **Linting** - Checks code style

If any check fails, the PR cannot be merged. Fix the issues and push the changes.

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, you can specify a different port:

```bash
PORT=3001 pnpm dev
```

### Database Connection Error

Ensure your `DATABASE_URL` is correct and the database is running:

```bash
# Test the connection
pnpm db:push
```

### Dependencies Not Installing

Clear the cache and reinstall:

```bash
pnpm store prune
pnpm install
```

### Build Errors

Check for TypeScript errors:

```bash
pnpm check
```

## Next Steps

- Read the **Architecture Guide** (`architecture.md`) to understand the system design
- Explore the **API Reference** (`api-reference.md`) for available endpoints
- Check out **Contributing Guidelines** (`contributing.md`) to contribute to the project
- Review the **TODO List** (`TODO.md`) to see planned features

## Getting Help

- **Documentation** - Check the `/docs` directory for comprehensive guides
- **Issues** - Search existing GitHub issues for answers
- **Discussions** - Join community discussions on GitHub
- **Contributing** - See `contributing.md` for how to report bugs and request features

## Quick Links

- [GitHub Repository](https://github.com/Zarish-Sphere-Platform/zarish-sphere-monorepo)
- [Architecture Guide](./architecture.md)
- [API Reference](./api-reference.md)
- [Contributing Guidelines](./contributing.md)
- [Project TODO](./TODO.md)

---

Happy building! 🚀
