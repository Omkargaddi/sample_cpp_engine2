const router = require("express").Router();
const Contest = require("../models/Contest");

router.get("/upcoming", async (req, res) => {
  const filter = {
    startTime: { $gte: new Date() }
  };

  if (req.query.platform) {
    filter.platform = req.query.platform.toUpperCase();
  }

  const contests = await Contest.find(filter).sort({ startTime: 1 });
  res.json(contests);
});


module.exports = router;
