
const socket = (server) => {
  const io = require('socket.io')(server, {
    "serveClient": false,
    "pingInterval": 10000,
    "pingTimeout": 5000,
    "cookie": false
  });
  console.log('Socket is ready to recieve connections')
  const clients = {};
  let classMessage = [{from:'fred',msg:'Hi'},{from:'okpe',msg:'wadup'}]
  const nsp = io.of('/classrooms');
  nsp.on('connection', function (socket) {
    console.log(`New socket connection to \\classroom with id ${socket.id}`);
    
    // register current client  
    clients[socket.id] = socket.client

    socket.on('aRequestToAddUser', data => {

      socket.username = data.username;
      socket.room = data.classroom_id
      socket.join(data.classroom_id,(err) => {
        for (const key in socket.rooms) {
          if (socket.rooms.hasOwnProperty(key)) {
            const element = socket.rooms[key];
            console.log(`${key} - ${element}`)
          }
        }
      })  
      //send prevous message to socket
      socket.emit('updateMsg','SERVER',classMessage)
      // broadcast to existing sockets that someone joined
      socket.broadcast.to(data.classroom_id).emit('someoneJoined','SERVER',data.username+ ' has connected to this room')

      console.log(`joined ${data.classroom_id}`);
      
    });
  
    socket.on('leave', data => {
      console.log('left',socket.room);

      socket.leave(socket.room,(err) => {
        for (const key in socket.rooms) {
          if (socket.rooms.hasOwnProperty(key)) {
            const element = socket.rooms[key];
            console.log(`${key} - ${element}`)
          }
        }
      })
      socket.broadcast.to(socket.room).emit('updatechat_left','SERVER',socket.username + ' has left this room')
      
    });

    socket.on('disconnect',function(){
      delete clients[socket.id]
      socket.leave(socket.room)
      console.log(`${socket.id} disconnected`)
    });
  });
  
}

module.exports = { socket };