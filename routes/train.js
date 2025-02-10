const express = require('express');
const router = express.Router();
const trainModel = require('../models/train');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const verifyApiKey = require('../middleware/apiKeyMiddleware');


router.post('/', verifyApiKey, authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { train_name, source, destination, total_seats } = req.body;
    const trainId = await trainModel.createTrain(train_name, source, destination, total_seats);
    res.status(201).json({ message: 'Train added successfully', trainId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add train', error: error.message });
  }
});


router.get('/', authenticateToken, async (req, res) => {
  try {
    const { source, destination } = req.query;
    const trains = await trainModel.getTrainsByRoute(source, destination);
    res.json(trains);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch train availability', error: error.message });
  }
});

module.exports = router;