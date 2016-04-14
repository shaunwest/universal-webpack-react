import express from 'express';
import { ping } from './services.js';
import { replaceUser, getUser, open, close } from './db.js';

// NOTE: this module does not hot-reload!!

const app = express.Router();

app.get('/whoami', (req, res) => {
  res.send('You are a winner');
});

app.post('/hello', (req, res) => ping('hello', msg => res.json({ msg })));

app.post('/sync', (req, res) => { 
  const user = req.body;

  open();

  replaceUser(user, (err) => {
    if (err) throw err;

    getUser(user.id, (err, user) => {
      close();

      if (err) {
        res.json({ status: 'not found' });
      } else {
        res.json({ status: 'ok', user });
      }
    });
  });
});

module.exports = app;
