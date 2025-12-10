# Extending Zarish Sphere

This guide explains how to extend Zarish Sphere with custom components, services, and features.

## Architecture Overview

Zarish Sphere is designed to be extensible:

```
┌─────────────────────────────────────────┐
│      Custom Components & Services       │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│         Core Zarish Sphere              │
│  (GUI Builder, Services, Database)      │
└─────────────────────────────────────────┘
```

## Adding Custom Components

### Step 1: Create Component

Create a new component in `/packages/ui-components`:

```typescript
// packages/ui-components/CustomButton.tsx
import React from 'react';
import { Button } from './ui/button';

interface CustomButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  onClick,
  variant = 'primary'
}) => {
  return (
    <Button
      onClick={onClick}
      variant={variant === 'primary' ? 'default' : 'outline'}
    >
      {label}
    </Button>
  );
};
```

### Step 2: Register Component

Update the component registry in `/packages/ui-components/index.ts`:

```typescript
export { CustomButton } from "./CustomButton";

export const COMPONENT_REGISTRY = {
  "custom-button": {
    component: CustomButton,
    label: "Custom Button",
    icon: "🔘",
    description: "A custom button component",
    properties: {
      label: { type: "string", default: "Click me" },
      variant: { type: "select", options: ["primary", "secondary"] },
    },
  },
};
```

### Step 3: Update GUI Builder

Update the GUI Builder to include your component:

```typescript
// client/src/components/GUIBuilder.tsx
const COMPONENT_PALETTE = [
  // ... existing components
  { type: "custom-button", label: "Custom Button", icon: "🔘" },
];
```

### Step 4: Add Rendering Logic

Update the component renderer:

```typescript
// client/src/components/GUIBuilder.tsx
const RenderComponent: React.FC<{ component: GUIComponent }> = ({ component }) => {
  switch (component.type) {
    // ... existing cases
    case 'custom-button':
      return (
        <CustomButton
          label={component.label || 'Button'}
          variant={component.props?.variant || 'primary'}
        />
      );
    default:
      return <div>{component.label || component.type}</div>;
  }
};
```

### Step 5: Update Schema

Update the schema to include your component:

```typescript
// schemas/db.ts
export const componentTypes = [
  "button",
  "input",
  "text",
  "custom-button", // Add your component
  // ... other types
];
```

## Creating Custom Services

### Step 1: Create Service

Create a new service in `/services`:

```typescript
// services/custom-service/index.ts
import { Router } from "express";

const router = Router();

router.post("/process", async (req, res) => {
  try {
    const { data } = req.body;

    // Process data
    const result = processData(data);

    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

function processData(data: any) {
  // Your processing logic
  return data;
}

export default router;
```

### Step 2: Register Service

Register the service in the API gateway:

```typescript
// server/routers.ts
import customService from "../services/custom-service";

export const appRouter = router({
  // ... existing routers
  custom: publicProcedure
    .input(z.object({ data: z.any() }))
    .mutation(async ({ input }) => {
      // Call custom service
      return processData(input.data);
    }),
});
```

### Step 3: Add tRPC Procedure

Expose the service through tRPC:

```typescript
// server/routers.ts
export const appRouter = router({
  custom: router({
    process: publicProcedure
      .input(z.object({ data: z.any() }))
      .mutation(async ({ input }) => {
        return processData(input.data);
      }),
  }),
});
```

## Adding Database Tables

### Step 1: Define Schema

Add new table to the database schema:

```typescript
// drizzle/schema.ts
export const customData = mysqlTable("custom_data", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  data: json("data").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
```

### Step 2: Generate Migration

```bash
pnpm db:generate
```

### Step 3: Apply Migration

```bash
pnpm db:push
```

### Step 4: Create Query Helper

Add helper function in `/server/db.ts`:

```typescript
export async function saveCustomData(userId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(customData).values({
    userId,
    data,
  });
}
```

## Creating Workflows

### Step 1: Define Workflow

Create a workflow definition:

```typescript
// services/workflows/types.ts
export interface Workflow {
  id: string;
  name: string;
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
}

export interface WorkflowTrigger {
  type: "form-submit" | "button-click" | "schedule";
  config: any;
}

export interface WorkflowAction {
  type: "send-email" | "save-data" | "call-api";
  config: any;
}
```

### Step 2: Implement Workflow Engine

```typescript
// services/workflows/engine.ts
export async function executeWorkflow(workflow: Workflow, context: any) {
  for (const action of workflow.actions) {
    switch (action.type) {
      case "send-email":
        await sendEmail(action.config, context);
        break;
      case "save-data":
        await saveData(action.config, context);
        break;
      case "call-api":
        await callAPI(action.config, context);
        break;
    }
  }
}
```

## Adding Integrations

### Step 1: Create Integration

Create an integration module:

```typescript
// services/integrations/slack.ts
import axios from "axios";

export async function sendSlackMessage(webhookUrl: string, message: string) {
  return axios.post(webhookUrl, {
    text: message,
  });
}
```

### Step 2: Register Integration

Register in the integration registry:

```typescript
// services/integrations/registry.ts
export const INTEGRATIONS = {
  slack: {
    name: "Slack",
    icon: "💬",
    handler: sendSlackMessage,
    config: {
      webhookUrl: { type: "string", required: true },
    },
  },
};
```

### Step 3: Expose via API

```typescript
// server/routers.ts
export const appRouter = router({
  integrations: router({
    send: protectedProcedure
      .input(
        z.object({
          integration: z.string(),
          config: z.any(),
          message: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const handler = INTEGRATIONS[input.integration]?.handler;
        if (!handler) throw new Error("Integration not found");
        return handler(input.config.webhookUrl, input.message);
      }),
  }),
});
```

## Adding AI Features

### Step 1: Create AI Service

```typescript
// services/ai/suggestions.ts
import { invokeLLM } from "../../server/_core/llm";

export async function suggestComponents(userIntent: string) {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content:
          "You are a UI/UX expert. Suggest components for building applications.",
      },
      {
        role: "user",
        content: `User wants to: ${userIntent}. What components would you suggest?`,
      },
    ],
  });

  return response.choices[0]?.message.content;
}
```

### Step 2: Expose via API

```typescript
// server/routers.ts
export const appRouter = router({
  ai: router({
    suggestComponents: publicProcedure
      .input(z.object({ intent: z.string() }))
      .query(async ({ input }) => {
        return suggestComponents(input.intent);
      }),
  }),
});
```

## Testing Extensions

### Unit Tests

```typescript
// services/custom-service/__tests__/index.test.ts
import { describe, it, expect } from "vitest";
import { processData } from "../index";

describe("Custom Service", () => {
  it("should process data correctly", () => {
    const input = { value: 10 };
    const result = processData(input);
    expect(result).toBeDefined();
  });
});
```

### Integration Tests

```typescript
// __tests__/integration/custom-service.test.ts
import { describe, it, expect } from "vitest";
import { appRouter } from "../../server/routers";

describe("Custom Service Integration", () => {
  it("should process data via API", async () => {
    const caller = appRouter.createCaller({});
    const result = await caller.custom.process({ data: { value: 10 } });
    expect(result).toBeDefined();
  });
});
```

## Documentation

When extending Zarish Sphere, document your changes:

1. **Update API Reference** - Document new endpoints
2. **Update Architecture Guide** - Explain new components
3. **Create Usage Guide** - Show how to use new features
4. **Add Examples** - Provide example code

## Publishing Extensions

To share your extensions with the community:

1. **Create Package** - Package your extension
2. **Publish to npm** - Make it available
3. **Create Documentation** - Write comprehensive docs
4. **Share on GitHub** - Open-source your extension

## Best Practices

- **Follow SSOT Principle** - Keep schemas as source of truth
- **Write Tests** - Test all new functionality
- **Document Changes** - Document all extensions
- **Maintain Compatibility** - Don't break existing features
- **Use TypeScript** - Maintain type safety
- **Follow Code Style** - Match existing code style
- **Performance** - Optimize for performance
- **Security** - Follow security best practices

---

For more help, see the [Architecture Guide](../architecture.md) or [Contributing Guidelines](../contributing.md).

## Backlinks

- [Zarish Sphere Architecture](../architecture.md)
- [Contributing to Zarish Sphere](../contributing.md)
