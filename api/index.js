const express = require('express');
const jwt = require('jsonwebtoken');

const { config } = require('./config');

const app = express();
const port = 5000;

// body-parser
app.use(express.json());

app.post('/api/auth/token', (req, res) => {
  const { email, username, name } = req.body;
  const token = jwt.sign({ sub: username, email, name }, config.authJwtSecret);
  res.json({ token });
});

app.listen(port, () => console.log(`Listening on localhost:${port}`));
