var app = require('express')();                   //express app
var server = require('http').createServer(app);   //passed to http server
// Création du serveur
var io = require('socket.io')(server);            //http server passed to socket.io
var userManagement = require('./node_modules/UserManagement/index'); 



io.on('connection', function(socket){
  
  // Ajout le socket à la liste des clients actuellement connectés 
  userconnection(socket);

  io.on('disconnect', function(){
      console.log('Utilisateur déconnecté');
  });

  socket.on('join', function(msg){
    console.log(msg);
    io.emit('Utilisateur message :', msg);
  });
  
  socket.on('broadcast', function(msg){
    console.log(socket.id+ " : envoi à tout le monde :"+msg);
    io.emit('receiveMessage', msg);
  });
  
  // Lancement de la Game
  socket.on('play', function(){
    addToWaitingFile(socket);
    
    if ( searchplayer(socket) ){
      updateWaiting(socket);
      sendMessageToGame(socket,"Votre adversaire est : "); 
    }

  });

});

server.listen(8100);
