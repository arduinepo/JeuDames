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

function searchGame(){
    socket.emit("searchGame");
}

/*------------------------ Client side event listener. -----------------------*/  

// It takes new messages from the server and appends it to HTML.  
socket.on('receiveMessage',function(msg){
    console.log('receiveMessage -- client side', msg);
    writeToScreen(msg);
});

// Affichage victoire.  
socket.on('receiveEndGame',function(stateWin){
   
    console.log('EndGame receive-- client side');
    stateWin ? writeToScreen("Victoire") : writeToScreen("Défaite");
});

// Reception changement de pseudo 
socket.on('receivePseudo',function(pseudo){
    console.log('receivePseudo -- client side', pseudo);
    writeToScreen(pseudo);
});


/*---------------- Style -------------------------*/

function writeToScreen(message)
{
    var pre = document.createElement("p");
    pre.style.wordWrap = "break-word";
    pre.innerHTML = message;
    output.appendChild(pre);
}
