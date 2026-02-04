const router = require("express").Router();
const Question = require("../models/Question");
const dayjs = require("dayjs");

// ⚠️ Ensure this matches your desired start date
const START_DATE = "2026-02-04"; 

// 1. Get ALL questions with their assigned dates
router.get("/all", async (req, res) => {
  try {
    const questions = await Question.find().sort({ sequenceIndex: 1 });
    
    // Calculate the date for every question dynamically
    const mappedQuestions = questions.map((q) => {
      // Logic: 2 questions per day. 
      // Floor(0/2) = Day 0, Floor(1/2) = Day 0
      // Floor(2/2) = Day 1, Floor(3/2) = Day 1
      const dayOffset = Math.floor(q.sequenceIndex / 2);
      const date = dayjs(START_DATE).add(dayOffset, 'day').format("YYYY-MM-DD");
      
      return {
        ...q.toObject(),
        assignedDate: date
      };
    });

    res.json(mappedQuestions);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// 2. Toggle Status (Existing logic)
router.patch("/:id/toggle", async (req, res) => {
  try {
    const q = await Question.findById(req.params.id);
    if (!q) return res.status(404).send("Not found");

    q.isCompleted = !q.isCompleted;
    await q.save();

    res.json(q);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;