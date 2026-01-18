const axios = require("axios");
const Contest = require("../models/Contest");

async function fetchCodeChefContests() {
  const { data } = await axios.get(
    "https://www.codechef.com/api/list/contests/all",
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) Chrome/120.0.0.0",
        "Accept": "application/json"
      }
    }
  );

  const contests = [
    ...(data.future_contests || []),
    ...(data.present_contests || [])
  ];

  console.log("CodeChef contests found:", contests.length);

  for (const c of contests) {
    const startTime = new Date(c.contest_start_date_iso);
    const endTime = new Date(c.contest_end_date_iso);

    console.log("Saving CodeChef:", c.contest_code);

    await Contest.updateOne(
      {
        platform: "CODECHEF",
        platformId: c.contest_code
      },
      {
        platform: "CODECHEF",
        platformId: c.contest_code,
        name: c.contest_name,
        startTime,
        durationMinutes: (endTime - startTime) / 60000,
        url: `https://www.codechef.com/${c.contest_code}`
      },
      { upsert: true }
    );
  }

  console.log(`CodeChef saved: ${contests.length}`);
}

module.exports = fetchCodeChefContests;
