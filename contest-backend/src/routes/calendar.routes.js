const router = require("express").Router();
const { default: ical } = require("ical-generator");
const Contest = require("../models/Contest");

router.get("/calendar.ics", async (req, res) => {
  const calendar = ical({
    name: "Competitive Programming Contests",
    timezone: "UTC",
    prodId: {
      company: "contest-aggregator",
      product: "contest-calendar"
    }
  });

  const contests = await Contest.find({
    startTime: { $gte: new Date() }
  }).sort({ startTime: 1 });

  for (const contest of contests) {
    calendar.createEvent({
      start: contest.startTime,
      end: new Date(
        contest.startTime.getTime() +
          contest.durationMinutes * 60000
      ),
      summary: `[${contest.platform}] ${contest.name}`,
      description: `Platform: ${contest.platform}\n${contest.url}`,
      url: contest.url,
      uid: `${contest.platform}-${contest.platformId}@contest-aggregator`
    });
  }

 res.setHeader("Content-Type", "text/calendar; charset=utf-8");



  res.send(calendar.toString());
});

module.exports = router;
