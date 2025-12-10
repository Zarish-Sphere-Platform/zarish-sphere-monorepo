# Deploying Applications with Zarish Sphere

This guide explains how to deploy applications built with Zarish Sphere to production.

## Deployment Options

Zarish Sphere applications can be deployed to multiple platforms:

### Manus Platform (Recommended)

One-click deployment with automatic scaling and monitoring.

**Advantages:**

- No infrastructure setup required
- Automatic SSL certificates
- Built-in monitoring and logging
- Automatic backups
- Global CDN

### Docker

Deploy using Docker containers for maximum flexibility.

**Advantages:**

- Works on any Docker-compatible platform
- Full control over environment
- Easy to integrate with existing systems
- Scalable with container orchestration

### Traditional Hosting

Deploy to any Node.js hosting provider.

**Advantages:**

- Wide variety of providers
- Familiar deployment process
- Cost-effective options available

### Serverless

Deploy to serverless platforms for pay-per-use pricing.

**Advantages:**

- No server management
- Automatic scaling
- Pay only for what you use

## Deploying to Manus Platform

### Prerequisites

- Zarish Sphere account
- Application built and tested
- Custom domain (optional)

### Step 1: Prepare Your Application

1. **Test Thoroughly**
   - Test all features
   - Verify forms work correctly
   - Check data persistence
   - Test on mobile devices

2. **Configure Environment**
   - Set environment variables
   - Configure database connection
   - Setup email notifications
   - Configure API integrations

3. **Review Settings**
   - Check application name
   - Review description
   - Verify privacy settings
   - Check permissions

### Step 2: Deploy

1. **Click "Deploy" Button**
   - Select "Manus Platform"
   - Choose environment (staging/production)
   - Review deployment settings

2. **Configure Deployment**
   - Set custom domain (optional)
   - Configure SSL certificate
   - Set environment variables
   - Configure backups

3. **Start Deployment**
   - Click "Deploy Now"
   - Monitor deployment progress
   - Wait for completion

### Step 3: Verify Deployment

1. **Check Deployment Status**
   - View deployment logs
   - Verify all services running
   - Check database connection

2. **Test Application**
   - Visit deployed URL
   - Test all features
   - Verify data persistence
   - Check performance

3. **Monitor Performance**
   - View analytics dashboard
   - Check error logs
   - Monitor resource usage
   - Review user feedback

## Deploying with Docker

### Prerequisites

- Docker installed locally
- Docker Hub account
- Application built and tested

### Step 1: Create Dockerfile

Create a `Dockerfile` in your project root:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy application code
COPY . .

# Build application
RUN pnpm build

# Expose port
EXPOSE 3000

# Start application
CMD ["pnpm", "start"]
```

### Step 2: Create Docker Compose File

Create a `docker-compose.yml` for local testing:

```yaml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: mysql://user:password@db:3306/zarish_sphere
      NODE_ENV: production
    depends_on:
      - db

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: zarish_sphere
      MYSQL_USER: app_user
      MYSQL_PASSWORD: app_password
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:
```

### Step 3: Build and Test Locally

```bash
# Build Docker image
docker build -t zarish-sphere:latest .

# Run with Docker Compose
docker-compose up

# Test application
curl http://localhost:3000
```

### Step 4: Push to Docker Registry

```bash
# Tag image
docker tag zarish-sphere:latest your-registry/zarish-sphere:latest

# Login to registry
docker login

# Push image
docker push your-registry/zarish-sphere:latest
```

### Step 5: Deploy to Production

Deploy using your container orchestration platform:

**Kubernetes:**

```bash
kubectl apply -f deployment.yaml
```

**Docker Swarm:**

```bash
docker service create --name zarish-sphere your-registry/zarish-sphere:latest
```

## Deploying to Traditional Hosting

### Prerequisites

- SSH access to server
- Node.js installed on server
- MySQL database setup
- Domain name configured

### Step 1: Prepare Server

```bash
# SSH into server
ssh user@your-server.com

# Install Node.js (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Create application directory
mkdir -p /var/www/zarish-sphere
cd /var/www/zarish-sphere
```

### Step 2: Deploy Application

```bash
# Clone repository
git clone https://github.com/your-org/zarish-sphere-app.git .

# Install dependencies
pnpm install --frozen-lockfile

# Build application
pnpm build

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration
nano .env
```

### Step 3: Setup Process Manager

Use PM2 to manage the Node.js process:

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start "pnpm start" --name "zarish-sphere"

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### Step 4: Setup Reverse Proxy

Configure Nginx as a reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Step 5: Setup SSL Certificate

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot certonly --nginx -d your-domain.com

# Update Nginx configuration
sudo certbot --nginx -d your-domain.com
```

### Step 6: Verify Deployment

```bash
# Check application status
pm2 status

# View logs
pm2 logs zarish-sphere

# Test application
curl https://your-domain.com
```

## Deploying to Serverless

### AWS Lambda

1. **Prepare Application**

   ```bash
   pnpm build
   ```

2. **Create Lambda Function**
   - Use Node.js 18 runtime
   - Upload built application
   - Configure environment variables

3. **Setup API Gateway**
   - Create HTTP API
   - Route to Lambda function
   - Configure CORS

### Google Cloud Functions

1. **Prepare Application**

   ```bash
   pnpm build
   ```

2. **Deploy to Cloud Functions**
   ```bash
   gcloud functions deploy zarish-sphere \
     --runtime nodejs18 \
     --trigger-http \
     --allow-unauthenticated
   ```

## Post-Deployment

### Monitoring

1. **Setup Monitoring**
   - Configure error tracking (Sentry)
   - Setup performance monitoring (New Relic)
   - Configure logging (CloudWatch, Stackdriver)

2. **Monitor Metrics**
   - Response time
   - Error rate
   - CPU usage
   - Memory usage
   - Database connections

### Maintenance

1. **Regular Updates**
   - Update dependencies
   - Apply security patches
   - Review logs regularly

2. **Backups**
   - Configure automatic backups
   - Test backup restoration
   - Store backups securely

3. **Scaling**
   - Monitor resource usage
   - Scale horizontally if needed
   - Optimize database queries

## Troubleshooting

### Application Won't Start

- Check logs for errors
- Verify environment variables
- Check database connection
- Verify file permissions

### High Memory Usage

- Check for memory leaks
- Optimize queries
- Implement caching
- Scale horizontally

### Slow Performance

- Check database indexes
- Implement caching
- Optimize images
- Use CDN for static assets

### Database Connection Issues

- Verify connection string
- Check database is running
- Verify credentials
- Check network connectivity

## Best Practices

- **Test before deploying** - Test thoroughly in staging
- **Use environment variables** - Don't hardcode secrets
- **Monitor performance** - Setup monitoring before deploying
- **Plan for scaling** - Design for horizontal scaling
- **Implement backups** - Backup data regularly
- **Use HTTPS** - Always encrypt data in transit
- **Keep logs** - Maintain detailed logs for debugging
- **Document deployment** - Document your deployment process

---

For more help, see the [FAQ](../faq.md) or [Architecture Guide](../architecture.md).

## Backlinks

- [Zarish Sphere Architecture](../architecture.md)
- [Frequently Asked Questions (FAQ)](../faq.md)
- [Building Applications with Zarish Sphere](building-apps.md)
- [Zarish Sphere Platform](../index.md)
