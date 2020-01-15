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

  // Reception event de forfait après un certains temps
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

  socket.on('startGame',function(clients){
   
  });
  // Lancement de la Game
  socket.on('searchGame', function(){
    
    addToWaitingFile(socket);
    
    if ( searchplayer(socket) ){
      updateWaitingFile(socket);
      sendMessageToGame(socket,"Votre adversaire est : ");
      startGame(socket); 
    }

  });
  // Déplacement d'un pion
  socket.on('movePion', function(l,c,newline,newcolumn,tour){
    movePion(socket,l,c,newline,newcolumn,tour);
  });
  // Prise d'un pion
  socket.on('takePion', function(l,c,newline,newcolumn,tour){
    takePion(socket,l,c,newline,newcolumn,tour);
  });
  socket.on('endTurn', function(tour){
    endTurn(socket,tour);
  });
  // endGame
  socket.on('endGame', function(){
    endGame(socket);
  });

});

// TODO : Gestion de la deconnection
server.listen(3000,"192.168.43.179");
