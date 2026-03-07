const fs = require("fs");
const path = require("path");

const csvPath = path.join(process.cwd(), "components_docs", "components.csv");
const catalogComponentsDir = path.join(
  process.cwd(),
  "apps",
  "brickslab_catalog",
  "src",
  "app",
  "components"
);
const uiWebComponentsDir = path.join(process.cwd(), "packages", "ui-web", "src", "components");
const uiWebIndexPath = path.join(process.cwd(), "packages", "ui-web", "src", "index.tsx");
const uiMobileComponentsDir = path.join(process.cwd(), "packages", "ui-mobile", "src", "components");
const uiMobileIndexPath = path.join(process.cwd(), "packages", "ui-mobile", "src", "index.ts");
const logsDir = path.join(process.cwd(), "logs");
const logPath = path.join(logsDir, "components-test-log.csv");

// Ensure logs directory exists
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Initialize CSV header if needed
function ensureLogHeader() {
  if (!fs.existsSync(logPath)) {
    fs.writeFileSync(logPath, "component,date_iso,percentage\n");
  }
}

function logResult(component, percentage) {
  ensureLogHeader();
  const now = new Date().toISOString();
  fs.appendFileSync(logPath, `${component},${now},${percentage}\n`);
}

function loadComponentsData() {
  if (!fs.existsSync(csvPath)) {
    console.error(`CSV not found at ${csvPath}`);
    return [];
  }
  const raw = fs.readFileSync(csvPath, "utf8").trim();
  const lines = raw.split("\n");
  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const cols = line.split(",");
    const obj = {};
    headers.forEach((h, i) => (obj[h] = cols[i] ? cols[i].trim() : ""));
    return obj;
  });
}

function listDirs(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath)
    .filter((entry) => fs.statSync(path.join(dirPath, entry)).isDirectory());
}

function listFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath)
    .filter((entry) => fs.statSync(path.join(dirPath, entry)).isFile());
}

function readFileIfExists(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
}

// Catalog mode checks (tools/lib repos with app pages).
function lintCatalogComponent(componentSlug) {
  const pagePath = path.join(catalogComponentsDir, componentSlug, "page.tsx");
  const checks = {
    fileExists: fs.existsSync(pagePath),
    hasExportDefault: false,
    hasComponentHeader: false,
    hasPropsTable: false,
    hasCodeBlock: false,
  };

  if (checks.fileExists) {
    const content = fs.readFileSync(pagePath, "utf8");
    checks.hasExportDefault =
      /export\s+default\s+function/.test(content) ||
      /export\s+default\s+(const|let)/.test(content);
    checks.hasComponentHeader = /ComponentHeader/.test(content);
    checks.hasPropsTable = /PropsTable/.test(content);
    checks.hasCodeBlock = /CodeBlock/.test(content);
  }

  const passedChecks = Object.values(checks).filter((v) => v).length;
  const totalChecks = Object.keys(checks).length;
  const percentage = Math.round((passedChecks / totalChecks) * 100);

  return { checks, percentage, passedChecks, totalChecks };
}

function collectLibraryEntries(baseDir, layer) {
  const entries = [];
  const categories = listDirs(baseDir);
  for (const category of categories) {
    const categoryDir = path.join(baseDir, category);
    const componentDirs = listDirs(categoryDir);
    for (const componentDirName of componentDirs) {
      const componentDir = path.join(categoryDir, componentDirName);
      const files = listFiles(componentDir);
      const tsxFiles = files.filter((file) => file.endsWith(".tsx"));
      if (tsxFiles.length === 0) continue;
      const mainFile = tsxFiles[0];
      const mainPath = path.join(componentDir, mainFile);
      const componentName = path.basename(mainFile, ".tsx");
      const hasTypeFile =
        files.includes(`${componentName}.type.ts`) || files.some((file) => file.endsWith(".type.ts"));

      entries.push({
        key: `${layer}:${category}/${componentDirName}`,
        layer,
        componentName,
        mainPath,
        hasTypeFile,
      });
    }
  }
  return entries;
}

function lintLibraryComponent(entry, indexContent) {
  const checks = {
    sourceExists: fs.existsSync(entry.mainPath),
    hasTypeFile: entry.hasTypeFile,
    exportedFromIndex: new RegExp(`\\b${entry.componentName}\\b`).test(indexContent),
  };

  const passedChecks = Object.values(checks).filter(Boolean).length;
  const totalChecks = Object.keys(checks).length;
  const percentage = Math.round((passedChecks / totalChecks) * 100);

  return { checks, percentage, passedChecks, totalChecks };
}

function runCatalogTests() {
  const components = loadComponentsData();
  if (components.length === 0) {
    console.error("❌ No components found in CSV");
    process.exit(1);
  }

  const results = [];
  let totalPercentage = 0;
  let passCount = 0;
  let failCount = 0;

  components.forEach((comp) => {
    const slug = comp.href ? comp.href.replace("/components/", "").trim() : comp.label?.toLowerCase().trim() || "";
    if (!slug) return;

    const lintResult = lintCatalogComponent(slug);
    logResult(slug, lintResult.percentage);

    if (lintResult.percentage >= 80) {
      console.log(`✅ ${slug.padEnd(30)} ${lintResult.percentage}% (${lintResult.passedChecks}/${lintResult.totalChecks})`);
      passCount++;
    } else {
      console.log(`⚠️  ${slug.padEnd(30)} ${lintResult.percentage}% (${lintResult.passedChecks}/${lintResult.totalChecks})`);
      failCount++;
    }

    totalPercentage += lintResult.percentage;
    results.push({ component: slug, percentage: lintResult.percentage, ...lintResult });
  });

  const averagePercentage = Math.round(totalPercentage / components.length);
  console.log(`\n📊 Summary:\n   Average: ${averagePercentage}%\n   Passed: ${passCount}\n   Warnings: ${failCount}\n`);

  return { mode: "catalog", results, average: averagePercentage, passed: passCount, warnings: failCount };
}

function runLibCoreTests() {
  const uiWebIndexContent = readFileIfExists(uiWebIndexPath);
  const uiMobileIndexContent = readFileIfExists(uiMobileIndexPath);
  const uiWebEntries = collectLibraryEntries(uiWebComponentsDir, "web");
  const uiMobileEntries = collectLibraryEntries(uiMobileComponentsDir, "mobile");
  const entries = [...uiWebEntries, ...uiMobileEntries];

  if (entries.length === 0) {
    console.error("❌ No library components found in packages/ui-web or packages/ui-mobile");
    process.exit(1);
  }

  const results = [];
  let totalPercentage = 0;
  let passCount = 0;
  let failCount = 0;

  entries.forEach((entry) => {
    const lintResult = lintLibraryComponent(entry, entry.layer === "web" ? uiWebIndexContent : uiMobileIndexContent);
    logResult(entry.key, lintResult.percentage);

    if (lintResult.percentage >= 67) {
      console.log(
        `✅ ${entry.key.padEnd(30)} ${lintResult.percentage}% (${lintResult.passedChecks}/${lintResult.totalChecks})`
      );
      passCount++;
    } else {
      console.log(
        `⚠️  ${entry.key.padEnd(30)} ${lintResult.percentage}% (${lintResult.passedChecks}/${lintResult.totalChecks})`
      );
      failCount++;
    }

    totalPercentage += lintResult.percentage;
    results.push({ component: entry.key, percentage: lintResult.percentage, ...lintResult });
  });

  const averagePercentage = Math.round(totalPercentage / entries.length);
  console.log(`\n📊 Summary:\n   Average: ${averagePercentage}%\n   Passed: ${passCount}\n   Warnings: ${failCount}\n`);

  return { mode: "lib-core", results, average: averagePercentage, passed: passCount, warnings: failCount };
}

// Main test runner
function runTests() {
  console.log("\n📋 Starting Component Lint Tests...\n");

  if (fs.existsSync(catalogComponentsDir)) {
    return runCatalogTests();
  }
  return runLibCoreTests();
}

module.exports = { runTests, loadComponentsData, logResult, logPath, logsDir };
