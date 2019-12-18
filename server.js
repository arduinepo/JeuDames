var WebSocketServer = require("ws").Server;
var ws = new WebSocketServer( { port: 8100 } );

console.log("Server started...");
/*
var sockets = [];
ws.on('connection', function(w){
  
  var id = w.upgradeReq.headers['sec-websocket-key'];
  console.log('New Connection id :: ', id);
  w.send(id);
  w.on('message', function(msg){
    var id = w.upgradeReq.headers['sec-websocket-key'];
    var message = JSON.parse(msg);
    
    sockets[message.to].send(message.message);

    console.log('Message on :: ', id);
    console.log('On message :: ', msg);
  });
  
  w.on('close', function() {
    var id = w.upgradeReq.headers['sec-websocket-key'];
    console.log('Closing :: ', id);
  });

  sockets[id] = w;
});
*/

var clients = [];

ws.on('connection', function (ws,req) {

  console.log("Client :"+req.headers['sec-websocket-key']+ " est connecté.");

  // Envoie d'un message Provenant du serveur
  ws.send("Hello du server");

  // Gestion des différents clients
  var id = req.headers['sec-websocket-key'];
  clients.push(ws);


  // On recoit un message
  ws.on("message", function (msg) {
    console.log("Le client "+req.headers['sec-websocket-key']+" vous à envoyé ::"+msg);
    ws.send("La réponse du serveur :"+msg);
    // On envoie a tous les clients
    clients.forEach( 
      element =>   element.send("ALL :"+msg)
    );
  });

  

  // Gestion de la deconnection
  ws.on("close", function() {
    console.log("Closing connection : le client "+req.headers['sec-websocket-key']+" s'est déconnecté.")
  });

});
