import express from 'express';
import path from 'path';

// const express = require("express");
// const path = require("path");

const app = express();
const port = 3000;

// static files
app.use('/static', express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// routes
app.get('/', async function (req, res, next) {
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

// server
app.listen(port, function () {
  console.log(`Listening http://localhost:${port}`);
});
