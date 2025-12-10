// scripts/generate-index.js
const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");
const IGNORE_DIRS = [".git", "node_modules", ".github", "dist"];

function generateTree(dir, depth = 0) {
  const stats = fs.statSync(dir);
  if (!stats.isDirectory()) return "";

  const files = fs.readdirSync(dir);
  let output = "";

  files.forEach(file => {
    if (IGNORE_DIRS.includes(file)) return;

    const fullPath = path.join(dir, file);
    const fileStats = fs.statSync(fullPath);
    const indent = "  ".repeat(depth);
    const link = path.relative(ROOT_DIR, fullPath).replace(/\\/g, "/");

    if (fileStats.isDirectory()) {
      output += `${indent}- 📂 [**${file}**](./${link}/README.md)\n`;
      // Recursively create a README inside folders if missing (Canonical list)
      createFolderReadme(fullPath, file);
      output += generateTree(fullPath, depth + 1);
    } else {
      output += `${indent}- 📄 [${file}](./${link})\n`;
    }
  });
  return output;
}

function createFolderReadme(dirPath, folderName) {
  const readmePath = path.join(dirPath, "README.md");
  if (!fs.existsSync(readmePath)) {
    const content = `# ${folderName}\n\n## Contents\n\n*Auto-generated index.*\n`;
    fs.writeFileSync(readmePath, content);
    console.log(`Created README for ${folderName}`);
  }
}

const tree = `# Zarish Sphere Master Index\n\nGenerated on: ${new Date().toISOString()}\n\n${generateTree(ROOT_DIR)}`;
fs.writeFileSync(path.join(ROOT_DIR, "MASTER_INDEX.md"), tree);
console.log("Master Index Generated.");
