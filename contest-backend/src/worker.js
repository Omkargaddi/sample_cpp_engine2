require("dotenv").config();
const connectDB = require("./config/db");

// Start DB first
(async () => {
  await connectDB();
  console.log("Worker connected to MongoDB");

  // Register cron jobs AFTER DB connection
  require("./jobs/fetchContests.job");
})();
