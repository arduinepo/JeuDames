var socket = io("http://localhost:8100");

function sendMessage(msg)
{
    console.log("click on message")
    socket.emit('join', msg);
}

function sendMessageAll(msg)
{
    console.log("click on message broadcast")
    socket.emit('broadcast', msg);
}

function setPseudo(pseudo)
{
    socket.emit('setPseudo', pseudo);
}

function surrender()
{
    console.log("click on surrender")
    socket.emit('surrender');
}

// Client side event listener.  It takes new messages from the server and appends it to HTML.  
socket.on('receiveMessage',function(msg){
    console.log('receiveMessage -- client side', msg);
    writeToScreen(msg);
});
// Client side event listener.  Affichage victoire.  
socket.on('receiveEndGame',function(stateWin){
   
    console.log('EndGame receive-- client side');
    stateWin ? writeToScreen("Victoire") : writeToScreen("Défaite");
});

// Client side event listener.  Reception de son pseudo 
socket.on('receivePseudo',function(pseudo){
    console.log('receivePseudo -- client side', pseudo);
    writeToScreen(pseudo);
});

function searchGame(){
    socket.emit("searchGame");
}

// Ecrit à l'écran
function writeToScreen(message)
{
    var pre = document.createElement("p");
    pre.style.wordWrap = "break-word";
    pre.innerHTML = message;
    output.appendChild(pre);
}

//window.addEventListener("load", init, false);