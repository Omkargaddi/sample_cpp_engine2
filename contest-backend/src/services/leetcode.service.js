const axios = require("axios");
const Contest = require("../models/Contest");

const LEETCODE_API = "https://leetcode.com/graphql";

async function fetchLeetCodeContests() {
  const { data } = await axios.post(
    LEETCODE_API,
    {
      query: `
        query upcomingContests {
          upcomingContests {
            title
            titleSlug
            startTime
            duration
          }
        }
      `
    },
    {
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) Chrome/120.0.0.0"
      }
    }
  );

  const contests = data?.data?.upcomingContests || [];

  console.log("LeetCode contests found:", contests.length);

  for (const contest of contests) {
    await Contest.updateOne(
      {
        platform: "LEETCODE",
        platformId: contest.titleSlug
      },
      {
        platform: "LEETCODE",
        platformId: contest.titleSlug,
        name: contest.title,
        startTime: new Date(contest.startTime * 1000),
        durationMinutes: contest.duration / 60,
        url: `https://leetcode.com/contest/${contest.titleSlug}`
      },
      { upsert: true }
    );
  }

  console.log(`LeetCode saved: ${contests.length}`);
}

module.exports = fetchLeetCodeContests;
