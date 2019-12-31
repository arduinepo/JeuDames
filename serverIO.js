var app = require('express')();                   //express app
var server = require('http').createServer(app);   //passed to http server
// Création du serveur
var io = require('socket.io')(server);            //http server passed to socket.io
var userManagement = require('./node_modules/UserManagement/index'); 


io.on('connection', function(socket){
  
  // Ajout le socket à la liste des clients actuellement connectés 
  userconnection(socket);// TODO : vérifier si c'est une reconnection et update le state game

  // Deconnection
  io.on('disconnect', function(){
    console.log('Utilisateur déconnecté');
    // TODO : le client s'est déconnecté
    opponentDisconnect();
    // TODO : save game state, emit un message à l'adversaire, et event de forfait
  });


  // Reception event de forfait
  socket.on('opponentLeave', function(){
    // TODO : Verification que l'adversaire est bien déconnecté
    if ( verifyopponentDisconnect() ){// TODO : L'adversaire ne s'est pas reconnecté
      surrenderOpponent(); // TODO : event victoire et save défaite pour adversaire
    }
  });

  socket.on('surrender', function(){
    surrender(socket);
  });
  
  socket.on('setPseudo', function(pseudo){
    console.log("Serveur setPseudo :"+pseudo);
    setPseudo(pseudo,socket);
  });

  socket.on('join', function(msg){
    console.log(msg);
    io.emit('Utilisateur message :', msg);
  });
  
  socket.on('broadcast', function(msg){
    console.log(socket.id+ " : envoi à tout le monde :"+msg);
    io.emit('receiveMessage', msg);
  });
  
  socket.on('classement', function(){
    console.log("recoit d'une demande de classement");
    getclassement(socket);
  });

  // Lancement de la Game
  socket.on('searchGame', function(){
    addToWaitingFile(socket);
    
    if ( searchplayer(socket) ){
      updateWaitingFile(socket);
      sendMessageToGame(socket,"Votre adversaire est : "); 
    }

  });

  // Déplacement d'un pion
  socket.on('movePion', function(){
    
  });

  // endGame
  socket.on('endGame', function(){
    
  });

});

server.listen(8000,'10.188.92.235');
