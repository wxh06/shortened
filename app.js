const express = require('express');
const path = require('path');
const logger = require('morgan');
const io = require('socket.io')();
const crypto = require('crypto');
const fs = require('fs');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/javascripts', express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));


let urls;
try {
  urls = JSON.parse(fs.readFileSync('urls.json'));
} catch (e) {
  urls = {};
}

io.on('connection', (socket) => {
  socket.on('submit', (url) => {
    let base64 = urls[url];
    if (base64) {
      base64 = urls.url;
    } else {
      base64 = crypto.createHmac('md5', url).digest('base64');
      urls[url] = base64;
    }
    fs.promises.writeFile('urls.json', JSON.stringify(urls));
    socket.emit('shortened', base64);
  });
});

app.set('socket.io', io);


module.exports = app;
