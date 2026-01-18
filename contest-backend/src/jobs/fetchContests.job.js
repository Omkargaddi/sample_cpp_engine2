const cron = require("node-cron");
const fetchCodeforces = require("../services/codeforces.service");
const fetchAtCoder = require("../services/atcoder.service");
const fetchCodeChef = require("../services/codechef.service");
const fetchLeetCode = require("../services/leetcode.service");
const cleanupPastContests = require("./cleanupPastContests.job");

cron.schedule("*/30 * * * *", async () => {
  console.log("Fetching contests...");

  try { await fetchCodeforces(); } catch (e) {
    console.error("Codeforces failed:", e.message);
  }

  try { await fetchAtCoder(); } catch (e) {
    console.error("AtCoder failed:", e.message);
  }

  try { await fetchCodeChef(); } catch (e) {
    console.error("CodeChef failed:", e.message);
  }

  try { await fetchLeetCode(); } catch (e) {
    console.error("LeetCode failed:", e.message);
  }
});

/**
 * Cleanup job – runs daily at 03:00 AM
 */
cron.schedule("0 3 * * *", async () => {
  try {
    await cleanupPastContests();
  } catch (e) {
    console.error("Cleanup failed:", e.message);
  }
});
