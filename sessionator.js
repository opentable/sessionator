#!/usr/bin/env node

const server = require('./lib/server.js');

server.start((err) => {
  if (err) {
    throw err;
  }

  console.log('Server Started.');
});
