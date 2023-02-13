const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

// Connect to SQLite database
const db = new sqlite3.Database('./db.sqlite', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

// Create users and credits table if they don't already exist
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE
)`);
db.run(`CREATE TABLE IF NOT EXISTS credits (
  user_id INTEGER,
  credits INTEGER,
  FOREIGN KEY (user_id) REFERENCES users (id)
)`);

// Middleware function to check user's credit before allowing the API call
const checkCredit = (req, res, next) => {
  const userId = req.params.userId;
  db.get(`SELECT credits FROM credits WHERE user_id = ?`, [userId], (err, row) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({error: 'Internal server error'});
    }
    if (!row) {
      return res.status(400).json({error: 'User not found'});
    }
    if (row.credits < 1) {
      return res.status(400).json({error: 'Not enough credits'});
    }
    req.credits = row.credits;
    next();
  });
};

// Endpoint to send message
app.get("/api/sendMessage/:userId", checkCredit, (req, res) => {
  const userId = req.params.userId;
  // Relay the request to other API
  // ...

  // Consume 1 credit
  db.run(`UPDATE credits SET credits = credits - 1 WHERE user_id = ?`, [userId], (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({error: 'Internal server error'});
    }
    res.json({message: 'API call successful'});
  });
});

// Add endpoint to add credit for user
app.post('/api/addCredit/:userId/:amount', (req, res) => {
  const userId = req.params.userId;
  const amount = req.params.amount;
  // Update user's credit balance
  db.run(`UPDATE users SET credit = credit + ? WHERE userId = ?`, [amount, userId], function(err) {
    if (err) {
      return console.error(err.message);
    }
    return res.status(200).send({ message: 'Credit added successfully.' });
  });
});
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

