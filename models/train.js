const pool = require('../config/db');

async function createTrain(trainName, source, destination, totalSeats) {
  try {
    const [result] = await pool.execute(
      'INSERT INTO trains (name, source, destination, total_seats, available_seats) VALUES (?, ?, ?, ?, ?)',
      [trainName, source, destination, totalSeats, totalSeats]
    );
    return result.insertId;
  } catch (error) {
    console.error('Error creating train:', error);
    throw error; 
  }
}

async function getTrainsByRoute(source, destination) {
  try {
    const [rows] = await pool.execute('SELECT * FROM trains WHERE source = ? AND destination = ?', [source, destination]);
    return rows;
  } catch (error) {
    console.error('Error getting trains by route:', error);
    throw error; 
  }
}

async function getTrainById(trainId) {
  try {
    const [rows] = await pool.execute('SELECT * FROM trains WHERE id = ?', [trainId]);
    return rows[0];
  } catch (error) {
    console.error('Error getting train by ID:', error);
    throw error; 
  }
}

async function updateTrainSeats(trainId, newAvailableSeats) {
  try {
    await pool.execute('UPDATE trains SET available_seats = ? WHERE id = ?', [newAvailableSeats, trainId]);
  } catch (error) {
    console.error('Error updating train seats:', error);
    throw error; 
  }
}

module.exports = { createTrain, getTrainsByRoute, getTrainById, updateTrainSeats };