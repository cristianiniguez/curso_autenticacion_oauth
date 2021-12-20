import express from 'express';
import jwt from 'jsonwebtoken';

import config from './config';

const app = express();
const port = 5000;

// body-parser
app.use(express.json());

app.post('/api/auth/token', (req, res) => {
  const { email, username, name } = req.body;
  const token = jwt.sign({ sub: username, email, name }, config.authJwtSecret);
  res.json({ token });
});

app.get('/api/auth/verify', (req, res, next) => {
  const { access_token } = req.query;

  try {
    const decoded = jwt.verify(access_token as string, config.authJwtSecret);
    res.json({ message: 'Valid Access Token', username: decoded.sub });
  } catch (error) {
    next(error);
  }
});

app.listen(port, () => console.log(`Listening on localhost:${port}`));
