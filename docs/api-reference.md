# API Reference

This document describes the available API endpoints and procedures in Zarish Sphere.

## Overview

Zarish Sphere uses **tRPC** for type-safe RPC calls. All API calls are made through the `/api/trpc` endpoint.

## Authentication

All protected endpoints require authentication via OAuth 2.0. Include the session cookie with requests:

```bash
curl -X POST http://localhost:3000/api/trpc/auth.me \
  -H "Content-Type: application/json" \
  --cookie "session=<session_token>"
```

## Base URL

```
http://localhost:3000/api/trpc
```

## Procedures

### Authentication

#### `auth.me`

Get the current authenticated user.

**Type:** Public Query

**Response:**

```typescript
{
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
  lastSignedIn: Date;
}
```

**Example:**

```typescript
const user = await trpc.auth.me.useQuery();
```

#### `auth.logout`

Logout the current user.

**Type:** Public Mutation

**Response:**

```typescript
{
  success: boolean;
}
```

**Example:**

```typescript
const { mutate } = trpc.auth.logout.useMutation();
mutate();
```

### Builder Operations

#### `builder.createApplication`

Create a new application.

**Type:** Protected Mutation

**Input:**

```typescript
{
  name: string;
  description?: string;
  components: GUIComponent[];
}
```

**Response:**

```typescript
{
  id: string;
  name: string;
  description: string | null;
  components: GUIComponent[];
  createdAt: Date;
  updatedAt: Date;
}
```

**Example:**

```typescript
const { mutate } = trpc.builder.createApplication.useMutation();
mutate({
  name: "My First App",
  description: "A test application",
  components: [],
});
```

#### `builder.getApplication`

Get an application by ID.

**Type:** Protected Query

**Input:**

```typescript
{
  id: string;
}
```

**Response:**

```typescript
{
  id: string;
  name: string;
  description: string | null;
  components: GUIComponent[];
  createdAt: Date;
  updatedAt: Date;
}
```

**Example:**

```typescript
const { data } = trpc.builder.getApplication.useQuery({ id: "app-123" });
```

#### `builder.updateApplication`

Update an application.

**Type:** Protected Mutation

**Input:**

```typescript
{
  id: string;
  name?: string;
  description?: string;
  components?: GUIComponent[];
}
```

**Response:**

```typescript
{
  id: string;
  name: string;
  description: string | null;
  components: GUIComponent[];
  createdAt: Date;
  updatedAt: Date;
}
```

**Example:**

```typescript
const { mutate } = trpc.builder.updateApplication.useMutation();
mutate({
  id: "app-123",
  name: "Updated Name",
});
```

#### `builder.deleteApplication`

Delete an application.

**Type:** Protected Mutation

**Input:**

```typescript
{
  id: string;
}
```

**Response:**

```typescript
{
  success: boolean;
}
```

**Example:**

```typescript
const { mutate } = trpc.builder.deleteApplication.useMutation();
mutate({ id: "app-123" });
```

#### `builder.listApplications`

List all applications for the current user.

**Type:** Protected Query

**Input:**

```typescript
{
  limit?: number;
  offset?: number;
}
```

**Response:**

```typescript
{
  applications: Array<{
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  }>;
  total: number;
}
```

**Example:**

```typescript
const { data } = trpc.builder.listApplications.useQuery({ limit: 10 });
```

### Component Operations

#### `components.getLibrary`

Get the available component library.

**Type:** Public Query

**Response:**

```typescript
{
  components: Array<{
    type: string;
    label: string;
    icon: string;
    description: string;
    properties: Record<string, any>;
  }>;
}
```

**Example:**

```typescript
const { data } = trpc.components.getLibrary.useQuery();
```

#### `components.validateComponent`

Validate a component definition.

**Type:** Public Query

**Input:**

```typescript
{
  component: GUIComponent;
}
```

**Response:**

```typescript
{
  valid: boolean;
  errors?: string[];
}
```

**Example:**

```typescript
const { data } = trpc.components.validateComponent.useQuery({
  component: { type: "button", label: "Click me" },
});
```

### Deployment Operations

#### `deployment.deploy`

Deploy an application.

**Type:** Protected Mutation

**Input:**

```typescript
{
  applicationId: string;
  environment: "staging" | "production";
}
```

**Response:**

```typescript
{
  deploymentId: string;
  status: "pending" | "in-progress" | "completed" | "failed";
  url: string;
  createdAt: Date;
}
```

**Example:**

```typescript
const { mutate } = trpc.deployment.deploy.useMutation();
mutate({
  applicationId: "app-123",
  environment: "production",
});
```

#### `deployment.getStatus`

Get deployment status.

**Type:** Protected Query

**Input:**

```typescript
{
  deploymentId: string;
}
```

**Response:**

```typescript
{
  deploymentId: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  progress: number;
  logs: string[];
  url?: string;
}
```

**Example:**

```typescript
const { data } = trpc.deployment.getStatus.useQuery({
  deploymentId: "deploy-123",
});
```

## Data Types

### GUIComponent

```typescript
interface GUIComponent {
  id: string;
  type:
    | "button"
    | "input"
    | "text"
    | "card"
    | "container"
    | "form"
    | "image"
    | "heading";
  label?: string;
  placeholder?: string;
  children?: GUIComponent[];
  props?: Record<string, any>;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}
```

## Error Handling

All endpoints return errors in the following format:

```typescript
{
  code: string;
  message: string;
  data?: Record<string, any>;
}
```

Common error codes:

- `UNAUTHORIZED` - User is not authenticated
- `FORBIDDEN` - User does not have permission
- `NOT_FOUND` - Resource not found
- `BAD_REQUEST` - Invalid input
- `INTERNAL_SERVER_ERROR` - Server error

## Rate Limiting

API calls are rate-limited to prevent abuse:

- **Authenticated users** - 1000 requests per hour
- **Anonymous users** - 100 requests per hour

## Pagination

List endpoints support pagination:

```typescript
{
  limit: number; // Items per page (default: 10, max: 100)
  offset: number; // Number of items to skip (default: 0)
}
```

Response includes:

```typescript
{
  items: Array<T>;
  total: number;
  limit: number;
  offset: number;
}
```

## Webhooks

Zarish Sphere supports webhooks for deployment events:

### Deployment Events

- `deployment.started` - Deployment has started
- `deployment.completed` - Deployment completed successfully
- `deployment.failed` - Deployment failed

**Webhook Payload:**

```typescript
{
  event: string;
  timestamp: Date;
  data: {
    deploymentId: string;
    applicationId: string;
    status: string;
    url?: string;
    error?: string;
  }
}
```

## Examples

### Building an Application with TypeScript

```typescript
import { trpc } from "@/lib/trpc";

async function buildAndDeploy() {
  // Create application
  const app = await trpc.builder.createApplication.mutate({
    name: "My App",
    description: "A test app",
    components: [
      {
        id: "1",
        type: "button",
        label: "Click me",
      },
    ],
  });

  // Deploy application
  const deployment = await trpc.deployment.deploy.mutate({
    applicationId: app.id,
    environment: "production",
  });

  console.log(`Deployed to: ${deployment.url}`);
}
```

### Fetching Application Data

```typescript
import { useQuery } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc';

export function ApplicationList() {
  const { data, isLoading } = trpc.builder.listApplications.useQuery({
    limit: 20
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <ul>
      {data?.applications.map(app => (
        <li key={app.id}>{app.name}</li>
      ))}
    </ul>
  );
}
```

## OpenAPI Specification

The full OpenAPI specification is available at `/api/openapi.json`

---

For more information, see the [Architecture Guide](architecture.md).

## Backlinks

- [Zarish Sphere Architecture](architecture.md)
- [Getting Started with Zarish Sphere](getting-started.md)
- [Zarish Sphere Platform](index.md)
