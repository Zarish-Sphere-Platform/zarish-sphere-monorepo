// apps/api-gateway/server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// Future reference to the core engine package for logic
// const coreEngine = require('@zarish/core-engine');

const app = express();
const port = 3000;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// ----------------------------------------------------
// Core Routing Endpoints
// ----------------------------------------------------

app.get("/", (req, res) => {
  res.send("Zarish Sphere API Gateway Operational. Version 1.0");
});

// Endpoint for fetching available "Lego Blocks" (UI components/modules)
app.get("/api/v1/modules", (req, res) => {
  // TODO: Implement logic to read available modules/packages from the schema-registry
  const availableModules = [
    { id: "1", name: "User Registration Form", type: "Form" },
    { id: "2", name: "Donor Dashboard Widget", type: "Widget" },
  ];
  res.status(200).json(availableModules);
});

// Endpoint for saving a dynamically built application schema
app.post("/api/v1/app/deploy", (req, res) => {
  // TODO: Add schema validation against packages/schema-registry/app.schema.json
  const appDefinition = req.body;

  // NOTE: This triggers the validation and deployment flow
  console.log(
    "Received App Definition for Deployment: ",
    appDefinition.appName
  );

  res.status(202).json({
    status: "Deployment Accepted",
    appId: "APP-" + Math.floor(Math.random() * 9999),
  });
});

app.listen(port, () => {
  console.log(`API Gateway running on http://localhost:${port}`);
});
