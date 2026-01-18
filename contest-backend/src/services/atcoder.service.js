const axios = require("axios");
const cheerio = require("cheerio");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

const Contest = require("../models/Contest");

dayjs.extend(utc);
dayjs.extend(timezone);

const ATCODER_URL = "https://atcoder.jp/contests/";
const JST = "Asia/Tokyo";

async function fetchAtCoderContests() {
  console.log("Starting AtCoder scrape...");
  try {
    const { data: html } = await axios.get(ATCODER_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) Chrome/120.0.0.0"
      },
      timeout: 10000
    });

    const $ = cheerio.load(html);
    const rows = $("#contest-table-upcoming tbody tr");

    console.log(`Found ${rows.length} upcoming AtCoder rows.`);

    let saved = 0;
    let updated = 0;

    for (const row of rows) {
      const tds = $(row).find("td");
      
      // Scraped format: "2026-01-24 21:00:00+0900"
      const rawTime = $(tds[0]).find("time").text().trim() || $(tds[0]).text().trim();
      
      console.log(`Processing row - Raw Time: ${rawTime}`);

      // Parse directly since the string contains date, time, and offset
      const startTimeUTC = dayjs(rawTime).utc().toDate();

      if (!dayjs(startTimeUTC).isValid()) {
        console.log(`Failed to parse date for: ${rawTime}`);
        continue;
      }

      const titleEl = $(tds[1]).find("a");
      const name = titleEl.text().trim();
      const contestPath = titleEl.attr("href");
      const platformId = contestPath.split("/").pop();

      const durationText = $(tds[2]).text().trim();
      const [h, m] = durationText.split(":").map(Number);
      const durationMinutes = h * 60 + m;

      console.log(`Parsed Contest: ${platformId} | UTC Start: ${startTimeUTC.toISOString()}`);

      const result = await Contest.updateOne(
        { platform: "ATCODER", platformId },
        {
          platform: "ATCODER",
          platformId,
          name,
          startTime: startTimeUTC,
          durationMinutes,
          url: `https://atcoder.jp${contestPath}`
        },
        { upsert: true }
      );

      if (result.upsertedId) {
        console.log(`New record created: ${platformId}`);
        saved++;
      } else if (result.modifiedCount > 0) {
        console.log(`Updated record: ${platformId}`);
        updated++;
      } else {
        console.log(`No changes needed: ${platformId}`);
      }
    }

    console.log(`Summary: ${saved} inserted, ${updated} updated.`);
  } catch (err) {
    console.error("AtCoder scrape failed:", err.message);
  }
}

module.exports = { fetchAtCoderContests };
