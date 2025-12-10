#!/usr/bin/env node

/**
 * Auto TODO Sync Workflow for Zarish Sphere SSOT
 *
 * This script scans the repository for TODO.md files and aggregates them,
 * optionally syncing with GitHub Issues/Projects for visibility and tracking.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// Type definitions for JSDoc
// @typedef {Object} TodoItem
// @property {string} text
// @property {boolean} completed
// @property {string} file
// @property {number} line

// @typedef {Object} TodoFile
// @property {string} path
// @property {TodoItem[]} items

function findTodoFiles(dir = rootDir) {
  const todoFiles = [];

  function walk(currentDir) {
    try {
      const files = fs.readdirSync(currentDir);

      for (const file of files) {
        if (["node_modules", ".git", "dist", "build"].includes(file)) continue;

        const fullPath = path.join(currentDir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          walk(fullPath);
        } else if (file === "TODO.md" || file === "todo.md") {
          todoFiles.push(fullPath);
        }
      }
    } catch (error) {
      // Silently skip inaccessible directories
    }
  }

  walk(dir);
  return todoFiles;
}

function parseTodoFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const items = [];

  lines.forEach((line, index) => {
    // Match checkbox patterns: - [ ] or - [x]
    const match = line.match(/^[\s]*-\s+\[([\sx])\]\s+(.+)$/i);
    if (match) {
      items.push({
        text: match[2].trim(),
        completed: match[1].toLowerCase() === "x",
        file: filePath,
        line: index + 1,
      });
    }
  });

  return {
    path: filePath,
    items,
  };
}

function generateAggregatedReport(todoFiles) {
  const allItems = [];
  const fileReports = [];

  for (const todoFile of todoFiles) {
    const report = parseTodoFile(todoFile);
    fileReports.push(report);
    allItems.push(...report.items);
  }

  const completedCount = allItems.filter(item => item.completed).length;
  const totalCount = allItems.length;
  const completionPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return {
    allItems,
    fileReports,
    summary: {
      totalFiles: todoFiles.length,
      totalItems: totalCount,
      completedCount,
      completionPercentage,
    },
  };
}

function formatReport(report) {
  const { allItems, fileReports, summary } = report;

  let markdown = `# Zarish Sphere - TODO Aggregation Report

**Generated:** ${new Date().toISOString()}

## Summary

- **Total TODO Files:** ${summary.totalFiles}
- **Total Items:** ${summary.totalItems}
- **Completed:** ${summary.completedCount} / ${summary.totalItems}
- **Completion Rate:** ${summary.completionPercentage}%

## Progress

\`\`\`
${"█".repeat(Math.floor(summary.completionPercentage / 5))}${"░".repeat(20 - Math.floor(summary.completionPercentage / 5))} ${summary.completionPercentage}%
\`\`\`

## By File

`;

  for (const fileReport of fileReports) {
    const relativePath = path.relative(rootDir, fileReport.path);
    const completed = fileReport.items.filter(item => item.completed).length;
    const total = fileReport.items.length;

    markdown += `\n### ${relativePath}\n\n`;
    markdown += `**Progress:** ${completed}/${total} items completed\n\n`;

    if (fileReport.items.length === 0) {
      markdown += "*(No TODO items)*\n";
    } else {
      for (const item of fileReport.items) {
        const checkbox = item.completed ? "✅" : "⬜";
        markdown += `- ${checkbox} ${item.text}\n`;
      }
    }
  }

  markdown += `\n## All Items\n\n`;

  // Group by completion status
  const pending = allItems.filter(item => !item.completed);
  const completed = allItems.filter(item => item.completed);

  if (pending.length > 0) {
    markdown += `### Pending (${pending.length})\n\n`;
    for (const item of pending) {
      const relativePath = path.relative(rootDir, item.file);
      markdown += `- [ ] **${item.text}** *(${relativePath}:${item.line})*\n`;
    }
  }

  if (completed.length > 0) {
    markdown += `\n### Completed (${completed.length})\n\n`;
    for (const item of completed) {
      const relativePath = path.relative(rootDir, item.file);
      markdown += `- [x] ~~${item.text}~~ *(${relativePath}:${item.line})*\n`;
    }
  }

  return markdown;
}

function syncWithGitHub(report) {
  try {
    // Check if gh CLI is available
    execSync("gh --version", { stdio: "ignore" });

    const { summary } = report;

    console.log("📤 Syncing with GitHub...");

    // Get repository info
    const repoInfo = execSync("gh repo view --json nameWithOwner", {
      encoding: "utf-8",
    });
    const { nameWithOwner } = JSON.parse(repoInfo);

    console.log(`✅ Connected to repository: ${nameWithOwner}`);
    console.log(`   Total items: ${summary.totalItems}`);
    console.log(`   Completion: ${summary.completionPercentage}%`);

    // In a real implementation, you would:
    // 1. Create/update a GitHub Project
    // 2. Create issues for pending items
    // 3. Update issue status based on completion
  } catch (error) {
    console.log("⚠️  GitHub CLI not available or not authenticated");
    console.log(
      "   To enable GitHub sync, install and authenticate with: gh auth login"
    );
  }
}

function main() {
  console.log("🔄 Starting TODO Sync Workflow...\n");

  const todoFiles = findTodoFiles();

  if (todoFiles.length === 0) {
    console.log("⚠️  No TODO.md files found in the repository");
    return;
  }

  console.log(`📋 Found ${todoFiles.length} TODO file(s):`);
  todoFiles.forEach(file => {
    console.log(`   - ${path.relative(rootDir, file)}`);
  });
  console.log("");

  // Generate report
  const report = generateAggregatedReport(todoFiles);

  // Save report
  const reportPath = path.join(rootDir, "TODO_REPORT.md");
  const reportContent = formatReport(report);
  fs.writeFileSync(reportPath, reportContent, "utf-8");
  console.log(`✅ Report saved to: ${reportPath}\n`);

  // Display summary
  const { summary } = report;
  console.log("📊 Summary:");
  console.log(`   Total items: ${summary.totalItems}`);
  console.log(`   Completed: ${summary.completedCount}`);
  console.log(`   Pending: ${summary.totalItems - summary.completedCount}`);
  console.log(`   Completion: ${summary.completionPercentage}%\n`);

  // Try to sync with GitHub
  syncWithGitHub(report);
}

try {
  main();
  process.exit(0);
} catch (error) {
  console.error("❌ Error in TODO sync:", error.message);
  process.exit(1);
}
