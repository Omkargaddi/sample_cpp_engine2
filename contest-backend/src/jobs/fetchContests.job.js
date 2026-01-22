// jobs/contestFetcher.job.js

const cron = require("node-cron");

const fetchCodeforces = require("../services/codeforces.service");
const { fetchAtCoderContests } = require("../services/atcoder.service");
const fetchCodeChef = require("../services/codechef.service");
const fetchLeetCode = require("../services/leetcode.service");

// Fetch contests every 30 minutes
cron.schedule("*/30 * * * *", async () => {
  console.log("Fetching contests...");

  try {
    await fetchCodeforces();
  } catch (e) {
    console.error("Codeforces failed:", e.message);
  }

  try {
    await fetchAtCoderContests();
  } catch (e) {
    console.error("AtCoder failed:", e.message);
  }

  try {
    await fetchCodeChef();
  } catch (e) {
    console.error("CodeChef failed:", e.message);
  }

  try {
    await fetchLeetCode();
  } catch (e) {
    console.error("LeetCode failed:", e.message);
  }
});
