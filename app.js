const express = require('express');
const path = require('path');
const logger = require('morgan');
const io = require('socket.io')();
const crypto = require('crypto');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/javascripts', express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));

io.on('connection', (socket) => {
  socket.on('submit', (url) => {
    const base64 = crypto.createHmac('md5', url).digest('base64');
    socket.emit('shortened', base64);
  });
});

app.set('socket.io', io);

module.exports = app;
