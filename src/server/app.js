import express from 'express';
import { ping } from './services.js';
import { replaceUser, getUser } from './db.js';

// NOTE: this module does not hot-reload!!

const app = express.Router();

app.get('/whoami', (req, res) => {
  res.send('You are a winner');
});

app.post('/hello', (req, res) => ping('hello', msg => res.json({ msg })));

app.post('/sync', (req, res) => { 
  //console.log('got body: ', req.body);
  const user = req.body;
  //console.log(user);
  replaceUser(user, (err) => {
    if (err) throw err;

    getUser(user.id, (err, user) => {
      if (err) {
        res.json({ status: 'not found' });
      } else {
        res.json({ status: 'ok' });
      }
    });
  });
});

module.exports = app;
