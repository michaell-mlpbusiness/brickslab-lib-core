const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const { runTests, loadComponentsData, logPath } = require("../lint/check-components.js");

const csvPath = path.join(process.cwd(), "components_docs", "components.csv");
const componentsDir = path.join(
  process.cwd(),
  "apps",
  "brickslab_catalog",
  "src",
  "app",
  "components"
);
const isCatalogMode = fs.existsSync(componentsDir);

test("component presence and integrity checks", async (t) => {
  const testResults = runTests();
  
  await t.test("components should be loaded from CSV", () => {
    const components = loadComponentsData();
    assert.ok(components.length > 0, "Should have components from CSV");
  });

  await t.test("mode-specific component integrity checks", () => {
    const results = testResults.results;
    assert.ok(results.length > 0, "Should have test results");
    if (isCatalogMode) {
      assert.ok(
        testResults.passed >= testResults.results.length * 0.8,
        "At least 80% of components should have pages"
      );
    } else {
      assert.equal(testResults.mode, "lib-core", "Should run in lib-core mode");
      assert.ok(
        testResults.passed >= testResults.results.length * 0.5,
        "At least 50% of library components should pass structure checks"
      );
    }
  });

  await t.test("test log CSV should have entries", () => {
    assert.ok(fs.existsSync(logPath), "Test log CSV should exist");
    const content = fs.readFileSync(logPath, "utf8");
    const lines = content.split("\n").filter((l) => l.trim());
    assert.ok(lines.length > 1, "Log CSV should have data rows");
  });

  await t.test("average test score should be reasonable", () => {
    const threshold = isCatalogMode ? 50 : 60;
    assert.ok(
      testResults.average >= threshold,
      `Average score ${testResults.average}% should be >= ${threshold}%`
    );
  });
});
