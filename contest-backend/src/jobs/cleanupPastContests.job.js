const Contest = require("../models/Contest");

module.exports = async function cleanupPastContests() {
  const now = new Date();

  const result = await Contest.deleteMany({
    durationMinutes: { $gt: 0 },
    $expr: {
      $lt: [
        { $add: ["$startTime", { $multiply: ["$durationMinutes", 60000] }] },
        now
      ]
    }
  });

  console.log(`Cleanup removed ${result.deletedCount} contests`);
};
