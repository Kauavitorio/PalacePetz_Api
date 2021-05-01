const _HTTP = require('http');
const _APP = require('./app')

//  Server can have 2 ports (port informed by the provider or 3000)
const _PORT = process.env.PORT || 3000;

//  Building from app-based server
const _SERVER = _HTTP.createServer(_APP);

//  Putting the server to listen to the port informed by the provider or the fixed one
_SERVER.listen(_PORT);
//  Server run on Heroku