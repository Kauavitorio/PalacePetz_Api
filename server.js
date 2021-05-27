const _HTTP = require('http');
const _APP = require('./app')

//  Server can have 2 ports (port informed by the provider or 3000)
const _PORT = process.env.PORT || 3000;

//  Building from app-based server
const _SERVER = _HTTP.createServer(_APP);

//  Putting the server to listen to the port informed by the provider or the fixed one
var port_number = _SERVER.listen(process.env.PORT || 3000);
_APP.listen(port_number);
//  Server run on Heroku