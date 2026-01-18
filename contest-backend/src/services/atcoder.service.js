const axios = require("axios");
const cheerio = require("cheerio");
const Contest = require("../models/Contest");

async function fetchAtCoderContests() {
  const { data: html } = await axios.get(
    "https://atcoder.jp/contests/",
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) Chrome/120.0.0.0"
      }
    }
  );

  const $ = cheerio.load(html);
  const rows = $("#contest-table-upcoming tbody tr");

  console.log("AtCoder upcoming rows:", rows.length);

  for (const row of rows) {
    const tds = $(row).find("td");

    const startTime = new Date($(tds[0]).text().trim() + " UTC");
    const titleEl = $(tds[1]).find("a");
    const name = titleEl.text().trim();
    const contestPath = titleEl.attr("href");
    const platformId = contestPath.split("/").pop();

    const durationText = $(tds[2]).text().trim(); // HH:MM
    const [h, m] = durationText.split(":").map(Number);
    const durationMinutes = h * 60 + m;

    await Contest.updateOne(
      {
        platform: "ATCODER",
        platformId
      },
      {
        platform: "ATCODER",
        platformId,
        name,
        startTime,
        durationMinutes,
        url: `https://atcoder.jp${contestPath}`
      },
      { upsert: true }
    );
  }

  console.log(`AtCoder saved: ${rows.length}`);
}

module.exports = fetchAtCoderContests;
