const express = require('express');
const Session = require('../models/Session');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const sessions = await Session.find().sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch sessions' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { wpm, accuracy, durationSeconds, mistakes, targetText, typedText } = req.body;

    const session = new Session({
      wpm,
      accuracy,
      durationSeconds,
      mistakes,
      targetText,
      typedText,
    });

    const saved = await session.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Unable to save session' });
  }
});

module.exports = router;
