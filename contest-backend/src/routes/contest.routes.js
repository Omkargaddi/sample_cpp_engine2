const router = require("express").Router();
const Contest = require("../models/Contest");

router.get("/upcoming", async (req, res) => {
  const now = new Date();
  
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  const filter = {
    startTime: { $gte: yesterday } 
  };
  
  if (req.query.platform) {
    filter.platform = req.query.platform.toUpperCase();
  }

  const contests = await Contest.find(filter).sort({ startTime: 1 });
  res.json(contests);
});

module.exports = router;
