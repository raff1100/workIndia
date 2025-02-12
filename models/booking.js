const pool = require('../config/db');

async function createBooking(userId, trainId) {
    const [result] = await pool.execute('INSERT INTO bookings (user_id, train_id) VALUES (?, ?)', [userId, trainId]);
    return result.insertId;
}

async function getBookingById(bookingId, userId) {
    const [rows] = await pool.execute('SELECT b.id, b.booking_date, t.train_name, t.source, t.destination ' +
        'FROM bookings b ' +
        'JOIN trains t ON b.train_id = t.id ' +
        'WHERE b.id = ? AND b.user_id = ?', [bookingId, userId]);
    return rows[0];
}

module.exports = { createBooking, getBookingById };