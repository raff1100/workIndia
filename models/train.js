const pool = require('../config/database');

async function createTrain(trainName, source, destination, totalSeats) {
  const [result] = await pool.execute(
    'INSERT INTO trains (train_name, source, destination, total_seats, available_seats) VALUES (?, ?, ?, ?, ?)',
    [trainName, source, destination, totalSeats, totalSeats]
  );
  return result.insertId;
}

async function getTrainsByRoute(source, destination) {
  const [rows] = await pool.execute('SELECT * FROM trains WHERE source = ? AND destination = ?', [source, destination]);
  return rows;
}

async function getTrainById(trainId) {
    const [rows] = await pool.execute('SELECT * FROM trains WHERE id = ?', [trainId]);
    return rows[0];
}

async function updateTrainSeats(trainId, newAvailableSeats) {
  await pool.execute('UPDATE trains SET available_seats = ? WHERE id = ?', [newAvailableSeats, trainId]);
}


module.exports = { createTrain, getTrainsByRoute, getTrainById, updateTrainSeats };