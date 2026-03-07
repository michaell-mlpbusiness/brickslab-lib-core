const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const { runTests, loadComponentsData, logPath, logsDir } = require("./check-components.js");

const componentsDir = path.join(
  process.cwd(),
  "apps",
  "brickslab_catalog",
  "src",
  "app",
  "components"
);
const isCatalogMode = fs.existsSync(componentsDir);

test("components structure and lint checks", async (t) => {
  // Ensure logs directory exists
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  // Run the lint tests and log results
  const testResults = runTests();

  // Test that all components have at least 50% lint score
  await t.test("all components should have minimum lint score", () => {
    const results = testResults.results;
    const threshold = isCatalogMode ? 50 : 60;
    assert.ok(results.length > 0, "Should have test results");
    assert.ok(testResults.average >= threshold, `Average score ${testResults.average}% should be >= ${threshold}%`);
  });

  // Test that most components pass checks
  await t.test("majority of components should pass checks", () => {
    const results = testResults.results;
    const passRate = (testResults.passed / results.length) * 100;
    const threshold = isCatalogMode ? 50 : 60;
    assert.ok(passRate >= threshold, `Pass rate ${passRate}% should be >= ${threshold}%`);
  });

  // Test that log file was created
  await t.test("test results should be logged to CSV", () => {
    assert.ok(fs.existsSync(logPath), "Log file should exist");
    const content = fs.readFileSync(logPath, "utf8");
    assert.ok(content.includes("component,date_iso,percentage"), "CSV should have header");
  });
});

test("components directory structure", async (t) => {
  const components = loadComponentsData();

  await t.test("components CSV should exist", () => {
    assert.ok(components.length > 0, "Components CSV should have entries");
  });

  await t.test("each component should have an href", () => {
    components.forEach((comp) => {
      assert.ok(comp.href, `Component ${comp.label} should have href`);
    });
  });
});
