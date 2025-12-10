# Database Schema

This document describes the database schema for Zarish Sphere.

## Overview

Zarish Sphere uses MySQL/TiDB as the primary database. The schema is defined in `/schemas/db.ts` using Drizzle ORM.

## Tables

### users

Stores user account information.

| Column         | Type                  | Constraints                                   | Description                 |
| -------------- | --------------------- | --------------------------------------------- | --------------------------- |
| `id`           | INT                   | PRIMARY KEY, AUTO_INCREMENT                   | Unique user identifier      |
| `openId`       | VARCHAR(64)           | NOT NULL, UNIQUE                              | OAuth identifier from Manus |
| `name`         | TEXT                  |                                               | User's display name         |
| `email`        | VARCHAR(320)          |                                               | User's email address        |
| `loginMethod`  | VARCHAR(64)           |                                               | Authentication method used  |
| `role`         | ENUM('user', 'admin') | NOT NULL, DEFAULT 'user'                      | User's role in the system   |
| `createdAt`    | TIMESTAMP             | NOT NULL, DEFAULT CURRENT_TIMESTAMP           | Account creation time       |
| `updatedAt`    | TIMESTAMP             | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update time            |
| `lastSignedIn` | TIMESTAMP             | NOT NULL, DEFAULT CURRENT_TIMESTAMP           | Last login time             |

**Indexes:**

- `openId` (UNIQUE)
- `email`
- `createdAt`

**Example Query:**

```sql
SELECT * FROM users WHERE openId = 'user-123';
```

### applications

Stores application definitions created in the GUI Builder.

| Column        | Type                                   | Constraints                                   | Description                          |
| ------------- | -------------------------------------- | --------------------------------------------- | ------------------------------------ |
| `id`          | VARCHAR(36)                            | PRIMARY KEY                                   | Unique application identifier (UUID) |
| `userId`      | INT                                    | NOT NULL, FOREIGN KEY                         | Owner of the application             |
| `name`        | VARCHAR(255)                           | NOT NULL                                      | Application name                     |
| `description` | TEXT                                   |                                               | Application description              |
| `components`  | JSON                                   | NOT NULL                                      | Application component structure      |
| `status`      | ENUM('draft', 'published', 'archived') | DEFAULT 'draft'                               | Application status                   |
| `createdAt`   | TIMESTAMP                              | NOT NULL, DEFAULT CURRENT_TIMESTAMP           | Creation time                        |
| `updatedAt`   | TIMESTAMP                              | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update time                     |
| `publishedAt` | TIMESTAMP                              |                                               | Publication time                     |

**Indexes:**

- `userId`
- `status`
- `createdAt`

**Foreign Keys:**

- `userId` → `users.id`

**Example Query:**

```sql
SELECT * FROM applications WHERE userId = 1 AND status = 'published';
```

### components

Stores reusable component definitions.

| Column          | Type         | Constraints                                   | Description                          |
| --------------- | ------------ | --------------------------------------------- | ------------------------------------ |
| `id`            | VARCHAR(36)  | PRIMARY KEY                                   | Unique component identifier          |
| `applicationId` | VARCHAR(36)  | NOT NULL, FOREIGN KEY                         | Parent application                   |
| `type`          | VARCHAR(64)  | NOT NULL                                      | Component type (button, input, etc.) |
| `label`         | VARCHAR(255) |                                               | Component display label              |
| `properties`    | JSON         |                                               | Component configuration              |
| `position`      | JSON         |                                               | Component position on canvas         |
| `size`          | JSON         |                                               | Component dimensions                 |
| `parentId`      | VARCHAR(36)  | FOREIGN KEY                                   | Parent component (for nesting)       |
| `order`         | INT          |                                               | Display order                        |
| `createdAt`     | TIMESTAMP    | NOT NULL, DEFAULT CURRENT_TIMESTAMP           | Creation time                        |
| `updatedAt`     | TIMESTAMP    | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update time                     |

**Indexes:**

- `applicationId`
- `parentId`
- `type`

**Foreign Keys:**

- `applicationId` → `applications.id`
- `parentId` → `components.id`

**Example Query:**

```sql
SELECT * FROM components WHERE applicationId = 'app-123' ORDER BY `order`;
```

### deployments

Stores deployment records for applications.

| Column          | Type                                                  | Constraints                         | Description                  |
| --------------- | ----------------------------------------------------- | ----------------------------------- | ---------------------------- |
| `id`            | VARCHAR(36)                                           | PRIMARY KEY                         | Unique deployment identifier |
| `applicationId` | VARCHAR(36)                                           | NOT NULL, FOREIGN KEY               | Deployed application         |
| `userId`        | INT                                                   | NOT NULL, FOREIGN KEY               | User who deployed            |
| `environment`   | ENUM('staging', 'production')                         | NOT NULL                            | Deployment environment       |
| `status`        | ENUM('pending', 'in-progress', 'completed', 'failed') | NOT NULL                            | Deployment status            |
| `url`           | VARCHAR(255)                                          |                                     | Deployment URL               |
| `logs`          | TEXT                                                  |                                     | Deployment logs              |
| `error`         | TEXT                                                  |                                     | Error message if failed      |
| `createdAt`     | TIMESTAMP                                             | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Deployment start time        |
| `completedAt`   | TIMESTAMP                                             |                                     | Deployment completion time   |

**Indexes:**

- `applicationId`
- `userId`
- `status`
- `createdAt`

**Foreign Keys:**

- `applicationId` → `applications.id`
- `userId` → `users.id`

**Example Query:**

```sql
SELECT * FROM deployments
WHERE applicationId = 'app-123'
ORDER BY createdAt DESC
LIMIT 10;
```

### forms

Stores form definitions for data collection.

| Column          | Type         | Constraints                                   | Description            |
| --------------- | ------------ | --------------------------------------------- | ---------------------- |
| `id`            | VARCHAR(36)  | PRIMARY KEY                                   | Unique form identifier |
| `applicationId` | VARCHAR(36)  | NOT NULL, FOREIGN KEY                         | Parent application     |
| `name`          | VARCHAR(255) | NOT NULL                                      | Form name              |
| `description`   | TEXT         |                                               | Form description       |
| `fields`        | JSON         | NOT NULL                                      | Form field definitions |
| `settings`      | JSON         |                                               | Form configuration     |
| `createdAt`     | TIMESTAMP    | NOT NULL, DEFAULT CURRENT_TIMESTAMP           | Creation time          |
| `updatedAt`     | TIMESTAMP    | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update time       |

**Indexes:**

- `applicationId`
- `createdAt`

**Foreign Keys:**

- `applicationId` → `applications.id`

**Example Query:**

```sql
SELECT * FROM forms WHERE applicationId = 'app-123';
```

### submissions

Stores form submissions.

| Column      | Type        | Constraints                         | Description                                 |
| ----------- | ----------- | ----------------------------------- | ------------------------------------------- |
| `id`        | VARCHAR(36) | PRIMARY KEY                         | Unique submission identifier                |
| `formId`    | VARCHAR(36) | NOT NULL, FOREIGN KEY               | Form being submitted                        |
| `userId`    | INT         | FOREIGN KEY                         | User who submitted (nullable for anonymous) |
| `data`      | JSON        | NOT NULL                            | Submitted form data                         |
| `ipAddress` | VARCHAR(45) |                                     | Submitter's IP address                      |
| `userAgent` | TEXT        |                                     | Submitter's user agent                      |
| `createdAt` | TIMESTAMP   | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Submission time                             |

**Indexes:**

- `formId`
- `userId`
- `createdAt`

**Foreign Keys:**

- `formId` → `forms.id`
- `userId` → `users.id`

**Example Query:**

```sql
SELECT * FROM submissions
WHERE formId = 'form-123'
ORDER BY createdAt DESC;
```

## Relationships

```
users (1) ──→ (many) applications
users (1) ──→ (many) deployments
applications (1) ──→ (many) components
applications (1) ──→ (many) forms
components (1) ──→ (many) components (self-referencing for nesting)
forms (1) ──→ (many) submissions
users (1) ──→ (many) submissions
```

## JSON Columns

Several columns store JSON data for flexibility:

### applications.components

```json
[
  {
    "id": "comp-1",
    "type": "button",
    "label": "Submit",
    "properties": {
      "color": "blue",
      "size": "large"
    },
    "position": { "x": 100, "y": 50 },
    "size": { "width": 200, "height": 50 }
  }
]
```

### components.properties

```json
{
  "color": "blue",
  "disabled": false,
  "tooltip": "Click to submit"
}
```

### forms.fields

```json
[
  {
    "id": "field-1",
    "type": "text",
    "label": "Name",
    "required": true,
    "validation": {
      "minLength": 3,
      "maxLength": 100
    }
  },
  {
    "id": "field-2",
    "type": "email",
    "label": "Email",
    "required": true
  }
]
```

## Migrations

Database migrations are managed with Drizzle-kit. To apply migrations:

```bash
pnpm db:push
```

To generate new migrations:

```bash
pnpm db:generate
```

## Performance Considerations

### Indexing Strategy

- Foreign keys are indexed for join performance
- Status columns are indexed for filtering
- Timestamps are indexed for sorting and range queries
- User IDs are indexed for access control

### Query Optimization

- Use indexes for WHERE clauses
- Limit JSON column queries to specific keys when possible
- Use pagination for large result sets
- Consider denormalization for frequently accessed data

### Scaling

For large-scale deployments:

- Implement database replication
- Use read replicas for reporting queries
- Archive old deployments and submissions
- Partition large tables by date

## Backup and Recovery

Regular backups are essential:

```bash
# Backup database
mysqldump -u user -p database > backup.sql

# Restore database
mysql -u user -p database < backup.sql
```

---

For more information, see the [Architecture Guide](architecture.md).

## Backlinks

- [Zarish Sphere Platform](../index.md)
