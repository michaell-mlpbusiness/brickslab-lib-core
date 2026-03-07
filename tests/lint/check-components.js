const fs = require("fs");
const path = require("path");

const csvPath = path.join(process.cwd(), "components_docs", "components.csv");
const componentsDir = path.join(
  process.cwd(),
  "apps",
  "brickslab_catalog",
  "src",
  "app",
  "components"
);
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

// Basic lint checks for a component
function lintComponent(componentSlug) {
  const pagePath = path.join(componentsDir, componentSlug, "page.tsx");
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

// Main test runner
function runTests() {
  console.log("\n📋 Starting Component Lint Tests...\n");

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

    const lintResult = lintComponent(slug);
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

  return { results, average: averagePercentage, passed: passCount, warnings: failCount };
}

module.exports = { runTests, loadComponentsData, lintComponent, logResult, logPath, logsDir };
