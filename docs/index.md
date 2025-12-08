# Zarish Sphere Platform

Welcome to **Zarish Sphere**, an Enterprise-Grade, Open-Source, AI-powered Platform-as-a-Service (PaaS) that revolutionizes non-profit operations by enabling non-coders to rapidly build, implement, and deploy full-stack applications through a Graphical User Interface (GUI).

## What is Zarish Sphere?

Zarish Sphere functions as a **"Lego-Blocks development ecosystem"** to rewire NGO operations globally. It empowers non-technical users to:

- **Build** full-stack applications without writing code
- **Deploy** applications to production with a single click
- **Collaborate** with team members in real-time
- **Automate** repetitive business processes
- **Scale** applications as your organization grows

## Key Features

### 🎨 Drag-and-Drop GUI Builder
Create applications by dragging and dropping components onto a canvas. No coding required.

### 🧩 Pre-built Component Library
Access a comprehensive library of pre-built components for common use cases (forms, tables, charts, dashboards).

### 🤖 AI-Powered Assistance
Get intelligent suggestions for components and workflows based on your intent.

### 📊 Data Integration
Seamlessly connect to databases, APIs, and external data sources.

### ⚡ One-Click Deployment
Deploy your applications to production with a single click.

### 🔄 Real-Time Collaboration
Work with team members simultaneously on building applications.

### 📱 Responsive Design
Applications automatically adapt to different screen sizes and devices.

### 🔐 Enterprise Security
Built-in authentication, authorization, and data encryption.

## Getting Started

### Quick Start (5 minutes)

1. **Install Dependencies**
   ```bash
   git clone https://github.com/Zarish-Sphere-Platform/zarish-sphere-ssot.git
   cd zarish-sphere-ssot
   pnpm install
   ```

2. **Start Development Server**
   ```bash
   pnpm dev
   ```

3. **Open GUI Builder**
   Navigate to `http://localhost:3000` and start building!

For detailed setup instructions, see the [Getting Started Guide](getting-started.md).

## Documentation

- **[Getting Started](getting-started.md)** - Setup and first steps
- **[Architecture](architecture.md)** - System design and structure
- **[API Reference](api-reference.md)** - Available endpoints and procedures
- **[Database Schema](database-schema.md)** - Data models and relationships
- **[Building Applications](guides/building-apps.md)** - How to create applications
- **[Deploying Applications](guides/deploying-apps.md)** - Deployment guide
- **[Contributing](contributing.md)** - How to contribute to the project

## Architecture Overview

Zarish Sphere is built on a **Single Source of Truth (SSOT)** principle:

```
┌─────────────────────────────────────────────┐
│         GUI Builder (Non-Coders)            │
└────────────────────┬────────────────────────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
    ┌────▼──┐  ┌─────▼──┐  ┌────▼──┐
    │ Apps  │  │Services│  │Schemas│ ← SSOT
    └────┬──┘  └────┬───┘  └────┬──┘
         │          │           │
         └──────────┼───────────┘
                    │
            ┌───────▼────────┐
            │   Database     │
            └────────────────┘
```

The platform enforces consistency through:
- **Schema-Driven Development** - All code is generated from schemas
- **Automated Validation** - PR checks ensure generated files are up-to-date
- **Auto-Publishing** - Documentation is automatically published to GitHub Pages

## Technology Stack

- **Frontend** - React 19, Tailwind CSS 4, TypeScript
- **Backend** - Express 4, tRPC 11, Node.js
- **Database** - MySQL/TiDB with Drizzle ORM
- **DevOps** - GitHub Actions, GitHub Pages
- **AI** - Integrated LLM services for intelligent suggestions

## Use Cases

### Non-Profit Operations
- Volunteer management systems
- Donation tracking and reporting
- Program management dashboards
- Beneficiary case management

### Small Business
- Customer relationship management (CRM)
- Inventory management
- Invoice and billing systems
- Employee scheduling

### Community Organizations
- Event management
- Member directories
- Resource sharing platforms
- Community feedback systems

## Community

- **GitHub** - [Zarish-Sphere-Platform](https://github.com/Zarish-Sphere-Platform)
- **Issues** - Report bugs and request features
- **Discussions** - Join community conversations
- **Contributing** - See [Contributing Guidelines](contributing.md)

## License

Zarish Sphere is open-source and licensed under the MIT License. See LICENSE file for details.

## Support

- 📖 **Documentation** - Check the guides and API reference
- 🐛 **Report Issues** - Use GitHub Issues
- 💬 **Discussions** - Join GitHub Discussions
- 📧 **Email** - Contact the team

## Roadmap

See [Project TODO](TODO.md) for planned features and current development status.

## Contributing

We welcome contributions from the community! See [Contributing Guidelines](contributing.md) for how to get started.

---

**Ready to build?** Start with the [Getting Started Guide](getting-started.md)! 🚀
