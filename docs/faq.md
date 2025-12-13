# Frequently Asked Questions (FAQ)

## General Questions

### What is Zarish Sphere?

Zarish Sphere is an Enterprise-Grade, Open-Source, AI-powered Platform-as-a-Service (PaaS) that enables non-coders to rapidly build, implement, and deploy full-stack applications through a Graphical User Interface (GUI).

### Who should use Zarish Sphere?

Zarish Sphere is designed for:

- **Non-profit organizations** - Streamline operations without technical expertise
- **Small businesses** - Build custom applications without hiring developers
- **Community organizations** - Create tools for community engagement
- **Enterprises** - Rapid prototyping and internal tool development

### Is Zarish Sphere free?

Yes, Zarish Sphere is open-source and free to use. You can host it on your own infrastructure or use our managed hosting service.

### What are the system requirements?

- Node.js 18 or higher
- pnpm 10 or higher
- MySQL/TiDB database
- Modern web browser

## Technical Questions

### Can I use Zarish Sphere offline?

The GUI Builder requires an internet connection to access the platform. However, you can build and deploy applications that work offline.

### What databases does Zarish Sphere support?

Currently, Zarish Sphere supports MySQL and TiDB. Support for PostgreSQL and other databases is planned.

### Can I customize components?

Yes, you can extend the component library by:

1. Creating custom components in `/packages/ui-components`
2. Adding them to the component palette
3. Updating the schema in `/schemas`

### How do I deploy applications?

Applications built with Zarish Sphere can be deployed to:

- **Manus Platform** - One-click deployment
- **Docker** - Containerized deployment
- **Traditional Hosting** - Any Node.js hosting provider
- **Serverless** - AWS Lambda, Google Cloud Functions, etc.

## Security Questions

### Is my data secure?

Yes, Zarish Sphere includes:

- End-to-end encryption for sensitive data
- Role-based access control (RBAC)
- Input validation and sanitization
- Regular security audits

### How is authentication handled?

Zarish Sphere uses OAuth 2.0 for authentication. You can also integrate with:

- SAML
- LDAP
- Custom authentication providers

### Can I use Zarish Sphere in production?

Yes, Zarish Sphere is designed for production use. However, you should:

- Conduct security audits
- Set up monitoring and logging
- Implement backup and disaster recovery
- Follow best practices for deployment

## Development Questions

### How do I contribute to Zarish Sphere?

See the [Contributing Guidelines](contributing.md) for detailed instructions.

### How do I report a bug?

1. Check if the bug has already been reported
2. Create a new GitHub issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

### How do I request a feature?

1. Check if the feature has already been requested
2. Create a new GitHub issue with:
   - Clear description
   - Use case
   - Proposed solution
   - Why it's important

### How do I get help?

- **Documentation** - Check the `/docs` directory
- **Issues** - Search existing GitHub issues
- **Discussions** - Join GitHub Discussions
- **Email** - Contact the team

## Performance Questions

### How many users can Zarish Sphere handle?

Zarish Sphere can handle thousands of concurrent users. Performance depends on:

- Server resources
- Database configuration
- Application complexity
- Network bandwidth

### How do I optimize performance?

- Use indexes on frequently queried fields
- Implement caching strategies
- Optimize component rendering
- Use lazy loading for large datasets
- Monitor performance metrics

### What's the typical load time?

- Initial page load: 2-3 seconds
- Component rendering: <100ms
- API responses: <200ms

## Scaling Questions

### Can I scale Zarish Sphere?

Yes, Zarish Sphere is designed to scale:

- **Horizontal scaling** - Add more servers
- **Database scaling** - Use database replication
- **Caching** - Implement Redis caching
- **CDN** - Use CDN for static assets

### What's the maximum number of applications?

There's no hard limit. Performance depends on:

- Server resources
- Database capacity
- Application complexity

## Troubleshooting

### The GUI Builder is slow

- Clear browser cache
- Check network connection
- Reduce number of components
- Optimize database queries

### Applications won't deploy

- Check server logs
- Verify database connection
- Ensure all dependencies are installed
- Check for validation errors

### I'm getting authentication errors

- Verify OAuth credentials
- Check session cookies
- Clear browser cache
- Try logging in again

### Database connection fails

- Verify connection string
- Check database is running
- Verify credentials
- Check network connectivity

## More Questions?

If you have questions not covered here:

1. **Check Documentation** - Review the `/docs` directory
2. **Search Issues** - Look for similar questions in GitHub Issues
3. **Ask in Discussions** - Post in GitHub Discussions
4. **Contact Team** - Email the development team

---

Last Updated: 2025-12-07
