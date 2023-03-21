const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');

const authenticateUser = async (email, password, done) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];
  if (!user) {
    return done(null, false, { message: 'User not found' });
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return done(null, false, { message: 'Incorrect password' });
  }
  return done(null, user);
};

const verifyToken = (payload, done) => {
  const user = { user_id: payload.user_id, email: payload.email };
  return done(null, user);
};

const registerUser = async (email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING user_id, email', [email, hashedPassword]);
  return result.rows[0];
};

const generateToken = (user) => {
  const payload = { user_id: user.user_id, email: user.email };
  return jwt.sign(payload, 'mysecret', { expiresIn: '1h' });
};

module.exports = {
  authenticateUser,
  verifyToken,
  registerUser,
  generateToken,
};
