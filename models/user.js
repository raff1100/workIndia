const pool = require('../config/database');
const bcrypt = require('bcrypt');

async function createUser(username, password, role = 'user') {
  const hashedPassword = await bcrypt.hash(password, 10); 
  const [result] = await pool.execute('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, role]);
  return result.insertId;
}

async function getUserByUsername(username) {
  const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0]; 
}

module.exports = { createUser, getUserByUsername };