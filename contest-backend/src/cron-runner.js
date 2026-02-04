require("dotenv").config();
const connectDB = require("./config/db");

const fetchCodeforces = require("./services/codeforces.service");
const { fetchAtCoderContests } = require("./services/atcoder.service");
const fetchCodeChef = require("./services/codechef.service");
const fetchLeetCode = require("./services/leetcode.service");

(async () => {
  try {
    await connectDB();
    console.log("GitHub Action connected to DB");

    console.log("Starting fetch...");
    // Always fetch, regardless of the exact minute
    await Promise.allSettled([
      fetchCodeforces(),
      fetchAtCoderContests(),
      fetchCodeChef(),
      fetchLeetCode()
    ]);
    console.log("Fetch completed");

  } catch (error) {
    console.error("Cron Runner Error:", error);
    process.exit(1); // Exit with error so GitHub Actions marks it as failed
  }

  process.exit(0);
})();