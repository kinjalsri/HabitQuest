const express = require("express");
const router = express.Router();
const Quest = require("../models/Quest");
const { calculateStats } = require("../services/questsService");
const protect = require("../middleware/authMiddleware");

//  Protect ALL routes below this line
router.use(protect);


//view all quests for a user
router.get("/quests", async (req, res) => {
  try {
    const quests = await Quest.find({ userId: req.userId });
    res.status(200).json(quests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch quests" });
  }
});


//create a new quest
router.post("/quests", async (req, res) => {
  try {
    const { title, targetDaysPerWeek, reward, xpPerCompletion } = req.body;

    const newQuest = new Quest({
      userId: req.userId,   //  from token, not body
      title,
      targetDaysPerWeek,
      reward,
      xpPerCompletion,
    });

    const savedQuest = await newQuest.save();
    res.status(201).json(savedQuest);

  } catch (err) {
    res.status(500).json({ error: "Failed to create quest" });
  }
});


//mark quest complete for today
router.post("/quests/:id/complete", async (req, res) => {
  try {
    const questId = req.params.id;

    const quest = await Quest.findOne({
      _id: questId,
      userId: req.userId,   //  from token
    });

    if (!quest) {
      return res.status(404).json({ error: "Quest not found or unauthorized" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const alreadyCompleted = quest.completedDates.some(date => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime();
    });

    if (alreadyCompleted) {
      return res.status(400).json({
        error: "Quest already marked as completed today",
      });
    }

    quest.completedDates.push(today);
    await quest.save();

    res.json(quest);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// UPDATE QUEST

router.put("/quests/:id", async (req, res) => {
  try {
    const questId = req.params.id;

    const quest = await Quest.findOne({
      _id: questId,
      userId: req.userId,   //  from token
    });

    if (!quest) {
      return res.status(404).json({ error: "Quest not found or unauthorized" });
    }

    const { title, targetDaysPerWeek, reward, xpPerCompletion } = req.body;

    if (title !== undefined) quest.title = title;
    if (targetDaysPerWeek !== undefined)
      quest.targetDaysPerWeek = targetDaysPerWeek;
    if (reward !== undefined) quest.reward = reward;
    if (xpPerCompletion !== undefined)
      quest.xpPerCompletion = xpPerCompletion;

    const updatedQuest = await quest.save();
    res.json(updatedQuest);

  } catch (err) {
    res.status(500).json({ error: "Failed to update quest" });
  }
});



//  DELETE QUEST

router.delete("/quests/:id", async (req, res) => {
  try {
    const questId = req.params.id;

    const quest = await Quest.findOneAndDelete({
      _id: questId,
      userId: req.userId,   //  from token
    });

    if (!quest) {
      return res.status(404).json({ error: "Quest not found or unauthorized" });
    }

    res.json({ message: "Quest deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: "Failed to delete quest" });
  }
});



//  QUEST STATS

router.get("/quests/stats", async (req, res) => {
  try {
    const quests = await Quest.find({ userId: req.userId });  // from token

    const stats = calculateStats(quests);

    res.json(stats);

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;





