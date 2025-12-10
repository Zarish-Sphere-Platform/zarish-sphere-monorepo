# Contributing to Zarish Sphere

Thank you for your interest in contributing to Zarish Sphere! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please be respectful and constructive in all interactions.

## Getting Started

1. **Fork the Repository** - Create a fork of the repository on GitHub
2. **Clone Your Fork** - Clone your fork locally
3. **Create a Branch** - Create a feature branch for your changes
4. **Make Changes** - Implement your changes following the guidelines below
5. **Test** - Run tests to ensure your changes work correctly
6. **Commit** - Commit your changes with clear messages
7. **Push** - Push your changes to your fork
8. **Create PR** - Create a pull request with a clear description

## Development Workflow

### Setting Up Your Environment

```bash
# Clone the repository
git clone https://github.com/Zarish-Sphere-Platform/zarish-sphere-ssot.git
cd zarish-sphere-ssot

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Making Changes

1. **Update Schema** (if needed) - Modify `/schemas` files
2. **Generate Code** - Run `pnpm run generate` to regenerate files
3. **Implement Feature** - Add your implementation
4. **Write Tests** - Add tests for your changes
5. **Update Docs** - Document your changes in `/docs`

### Code Style

- **TypeScript** - Use TypeScript for type safety
- **Formatting** - Run `pnpm format` to auto-format code
- **Linting** - Run `pnpm lint` to check for issues
- **Comments** - Add comments for complex logic

### Commit Messages

Use clear, descriptive commit messages:

```
feat: Add new component type (Button)
fix: Resolve issue with drag-and-drop
docs: Update architecture documentation
test: Add tests for form builder
chore: Update dependencies
```

## Pull Request Process

1. **Create PR** - Create a pull request with a clear title and description
2. **Link Issues** - Link related GitHub issues
3. **Wait for Review** - Wait for maintainers to review your changes
4. **Address Feedback** - Make requested changes
5. **Merge** - Once approved, your PR will be merged

### PR Checklist

- [ ] Code follows the style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] Commit messages are clear
- [ ] No breaking changes (or clearly documented)

## Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

### Writing Tests

- Use Vitest for unit tests
- Place tests next to the code they test
- Use descriptive test names
- Test both happy and error paths

Example:

```typescript
import { describe, it, expect } from "vitest";
import { validateComponent } from "./validator";

describe("validateComponent", () => {
  it("should validate a valid component", () => {
    const component = { type: "button", label: "Click me" };
    expect(validateComponent(component)).toBe(true);
  });

  it("should reject invalid component type", () => {
    const component = { type: "invalid", label: "Click me" };
    expect(validateComponent(component)).toBe(false);
  });
});
```

## Documentation

### Writing Documentation

- Use clear, concise language
- Include examples where helpful
- Keep documentation up-to-date with code
- Use Markdown for all documentation

### Updating Documentation

1. Edit `.md` files in `/docs`
2. Run `pnpm run generate:docs` to update indexes
3. Preview with `pnpm run docs:serve`
4. Commit documentation changes

## Reporting Issues

### Bug Reports

Include the following information:

- **Description** - Clear description of the bug
- **Steps to Reproduce** - How to reproduce the issue
- **Expected Behavior** - What should happen
- **Actual Behavior** - What actually happens
- **Environment** - OS, Node version, etc.
- **Screenshots** - If applicable

### Feature Requests

Include the following information:

- **Description** - Clear description of the feature
- **Use Case** - Why this feature is needed
- **Proposed Solution** - How you envision the feature
- **Alternatives** - Other approaches considered

## Project Structure

Familiarize yourself with the project structure:

```
zarish-sphere-ssot/
├── apps/              # User-facing applications
├── services/          # Backend microservices
├── packages/          # Shared libraries
├── schemas/           # Data contracts (SSOT)
├── docs/              # Documentation
├── tools/             # Automation scripts
└── .github/           # CI/CD workflows
```

## SSOT Principle

This project follows the Single Source of Truth (SSOT) principle:

1. **Schemas are the source** - Define data contracts in `/schemas`
2. **Code is generated** - Generate code from schemas
3. **Everything is committed** - Commit all generated files
4. **PR validation enforces it** - Automated checks ensure consistency

When contributing:

- Update the source (schema, code, or docs)
- Run `pnpm run generate` to regenerate outputs
- Commit all changes including generated files
- PR validation will check that everything is in sync

## Areas for Contribution

### High Priority

- **GUI Builder Enhancements** - Improve the drag-and-drop builder
- **Component Library** - Add new pre-built components
- **Documentation** - Improve guides and API documentation
- **Bug Fixes** - Fix reported issues

### Medium Priority

- **Performance Optimization** - Improve load times and responsiveness
- **Testing** - Improve test coverage
- **Accessibility** - Improve accessibility features
- **Internationalization** - Add support for multiple languages

### Low Priority

- **Code Refactoring** - Improve code quality
- **Dependencies** - Update to newer versions
- **Examples** - Create example applications

## Questions?

- **Documentation** - Check the `/docs` directory
- **Issues** - Search existing GitHub issues
- **Discussions** - Join GitHub Discussions
- **Email** - Contact the team

## License

By contributing to Zarish Sphere, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Zarish Sphere! 🚀

## Backlinks

- [Frequently Asked Questions (FAQ)](../faq.md)
- [Getting Started with Zarish Sphere](../getting-started.md)
- [Building Applications with Zarish Sphere](../guides/building-apps.md)
- [Extending Zarish Sphere](../guides/extending-platform.md)
- [Zarish Sphere Platform](../index.md)
