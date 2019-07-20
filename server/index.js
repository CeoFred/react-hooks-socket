const app = require('./app');
const http = require('http').createServer(app)

const socket = require('./socket');
socket.socket(http);

http.listen(8000,() => {
  console.log('listening on  port '+8000)
});
