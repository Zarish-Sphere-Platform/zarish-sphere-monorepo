// scripts/sync-todos.js
const fs = require("fs");
const path = require("path");

// Simple grep-like search for TODOs
function scanTodos(dir, todoList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    if (["node_modules", ".git", "dist"].includes(file)) return;
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      scanTodos(fullPath, todoList);
    } else {
      const content = fs.readFileSync(fullPath, "utf8");
      const lines = content.split("\n");
      lines.forEach((line, index) => {
        if (line.includes("TODO:") || line.includes("- [ ]")) {
          const relativePath = path.relative(process.cwd(), fullPath);
          todoList.push(
            `- [ ] **${relativePath}:${index + 1}**: ${line.trim()}`
          );
        }
      });
    }
  });
  return todoList;
}

const allTodos = scanTodos(process.cwd());
const output = `# Zarish Sphere Master TODOs\n\nTotal Open Tasks: ${allTodos.length}\n\n${allTodos.join("\n")}`;
fs.writeFileSync("MASTER_TODO.md", output);
console.log("TODOs Synced.");
