import express from 'express';
import { ping } from './services.js';

const app = express.Router();

app.get('/whoami', (req, res) => {
  res.send('You are a winner');
});

app.post('/hello', (req, res) => ping('hello', msg => res.json({ msg })));

module.exports = app;
