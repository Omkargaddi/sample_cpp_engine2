const axios = require("axios");
const Contest = require("../models/Contest");

const CODEFORCES_API =
  "https://codeforces.com/api/contest.list";

async function fetchCodeforcesContests() {
  const { data } = await axios.get(CODEFORCES_API);

  if (data.status !== "OK") {
    throw new Error("Codeforces API failed");
  }

  const upcoming = data.result.filter(
    c => c.phase === "BEFORE"
  );

  for (const contest of upcoming) {
    await Contest.updateOne(
      {
        platform: "CODEFORCES",
        platformId: contest.id.toString()
      },
      {
        platform: "CODEFORCES",
        platformId: contest.id.toString(),
        name: contest.name,
        startTime: new Date(contest.startTimeSeconds * 1000),
        durationMinutes: contest.durationSeconds / 60,
        url: `https://codeforces.com/contest/${contest.id}`
      },
      { upsert: true }
    );
  }

  console.log(`Codeforces: ${upcoming.length} contests updated`);
}

module.exports = fetchCodeforcesContests;
