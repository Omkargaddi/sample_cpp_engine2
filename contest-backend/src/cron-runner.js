require("dotenv").config();
const connectDB = require("./config/db");

const fetchCodeforces = require("./services/codeforces.service");
const { fetchAtCoderContests } = require("./services/atcoder.service");
const fetchCodeChef = require("./services/codechef.service");
const fetchLeetCode = require("./services/leetcode.service");
const cleanupPastContests = require("./jobs/cleanupPastContests.job");

(async () => {
  await connectDB();
  console.log("GitHub Action connected to DB");

  const hour = new Date().getUTCHours();
  const minute = new Date().getUTCMinutes();

  // Every 30 minutes → fetch
  if (minute === 0 || minute === 30) {
    await Promise.allSettled([
      fetchCodeforces(),
      fetchAtCoderContests(),
      fetchCodeChef(),
      fetchLeetCode()
    ]);
    console.log("Fetch completed");
  }

  // Daily cleanup at 03:00 UTC
  if (hour === 3 && minute === 0) {
    await cleanupPastContests();
    console.log("Cleanup completed");
  }

  process.exit(0);
})();
