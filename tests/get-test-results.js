const fs = require("fs");
const path = require("path");

const logPath = path.join(process.cwd(), "logs", "components-test-log.csv");

/**
 * Reads the test log CSV and returns the latest test results
 * for each component
 */
function getLatestTestResults(limit = 10) {
  if (!fs.existsSync(logPath)) {
    return [];
  }

  const content = fs.readFileSync(logPath, "utf8");
  const lines = content
    .split("\n")
    .filter((l) => l.trim())
    .slice(1); // Skip header

  if (lines.length === 0) {
    return [];
  }

  // Parse CSV (simple format: component,date_iso,percentage)
  const entries = lines.map((line) => {
    const [component, dateIso, percentage] = line.split(",");
    return {
      component: component?.trim() || "",
      dateIso: dateIso?.trim() || "",
      percentage: parseInt(percentage?.trim() || "0", 10),
    };
  });

  // Group by component and get the latest entry for each
  const latestByComponent = {};
  entries.forEach((entry) => {
    if (
      !latestByComponent[entry.component] ||
      new Date(entry.dateIso) > new Date(latestByComponent[entry.component].dateIso)
    ) {
      latestByComponent[entry.component] = entry;
    }
  });

  // Return sorted by date (newest first) and limit
  return Object.values(latestByComponent)
    .sort((a, b) => new Date(b.dateIso) - new Date(a.dateIso))
    .slice(0, limit);
}

/**
 * Gets the average test percentage across all latest tests
 */
function getAverageTestScore() {
  const results = getLatestTestResults(999); // Get all
  if (results.length === 0) return 0;
  const sum = results.reduce((acc, r) => acc + r.percentage, 0);
  return Math.round(sum / results.length);
}

/**
 * Gets test results sorted by component name (for dashboard display)
 */
function getTestResultsSorted(limit = 5) {
  const results = getLatestTestResults(999);
  return results
    .sort((a, b) => a.component.localeCompare(b.component))
    .slice(0, limit);
}

if (require.main === module) {
  // CLI usage: node get-test-results.js [limit]
  const limit = parseInt(process.argv[2] || "5", 10);
  const results = getLatestTestResults(limit);
  console.log(JSON.stringify(results, null, 2));
}

module.exports = {
  getLatestTestResults,
  getAverageTestScore,
  getTestResultsSorted,
  logPath,
};
