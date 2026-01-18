const Contest = require("../models/Contest");

async function cleanupPastContests() {
  const now = new Date();

  const result = await Contest.deleteMany({
    $expr: {
      $lt: [
        {
          $add: [
            "$startTime",
            { $multiply: ["$durationMinutes", 60000] }
          ]
        },
        now
      ]
    }
  });

  console.log(`Cleanup: removed ${result.deletedCount} past contests`);
}

module.exports = cleanupPastContests;
