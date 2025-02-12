const pool = require('../config/db');
const bcrypt = require('bcrypt');

async function createUser(username, password, role) { 
  try {
    let hashedPassword = await bcrypt.hash(password, 12);
        let query = 'INSERT INTO users (username, password';
        let values = [username, hashedPassword];

        if (role) {
            query += ', role';
            values.push(role);
        }

        query += ') VALUES (?, ?';
        if (role) {
            query += ', ?';
        }
        query += ')';
    const [result] = await pool.execute(query,values);

    return result.insertId;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user: ' + error.message);
  }
}

async function getUserByUsername(username) {
  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0] || null;
  } catch (error) {
    console.error('Error getting user by username:', error);
    throw new Error('Failed to get user by username: ' + error.message);
  }
}

module.exports = { createUser, getUserByUsername };