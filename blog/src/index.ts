import express from 'express';
import path from 'path';
import request from 'request';
import querystring from 'querystring';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import generateRandomString from './utils/generateRandomString';
import encodeBasic from './utils/encodeBasic';
import scopesArray from './utils/scopesArray';

import playlistMock from './utils/mocks/playlist';

import config from './config';

const app = express();
const port = 3000;

// static files
app.use('/static', express.static(path.join(__dirname, 'public')));

// middlewares
app.use(cors());
app.use(cookieParser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// routes
app.get('/', async function (req, res) {
  res.render('posts', {
    posts: [
      {
        title: "Guillermo's playlist",
        description:
          'Creatine supplementation is the reference compound for increasing muscular creatine levels; there is variability in this increase, however, with some nonresponders.',
        author: 'Guillermo Rodas',
      },
    ],
  });
});

app.get('/login', function (req, res) {
  const state = generateRandomString(16);

  const queryString = querystring.stringify({
    response_type: 'code',
    client_id: config.spotify.clientId,
    scope: scopesArray.join(' '),
    redirect_uri: config.spotify.redirectUri,
    state,
  });

  res.cookie('auth_state', state, { httpOnly: true });
  res.redirect(`https://accounts.spotify.com/authorize?${queryString}`);
});

app.get('/callback', function (req, res, next) {
  const { code, state } = req.query;
  const { auth_state } = req.cookies;

  if (state === null || state !== auth_state) {
    next(new Error("The state doesn't match"));
  }

  res.clearCookie('auth_state');

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code,
      redirect_uri: config.spotify.redirectUri,
      grant_type: 'authorization_code',
    },
    headers: {
      Authorization: `Basic ${encodeBasic(config.spotify.clientId, config.spotify.clientSecret)}`,
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (error || response.statusCode !== 200) {
      next(new Error('The token is invalid'));
    }

    res.cookie('access_token', body.access_token, { httpOnly: true });
    res.redirect('/playlist');
  });
});

// server
app.listen(port, function () {
  console.log(`Listening http://localhost:${port}`);
});
