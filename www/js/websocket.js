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

function classement(){
    console.log("Demande de classement");
    socket.emit("classement");
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
    document.querySelector('.pseudo').textContent = pseudo;
    writeToScreen(pseudo);
});

// Reception du Classement
socket.on('receiveClassement',function(clients){
    let obj = JSON.parse(clients);
    console.log("On recoit :"+clients[0]);
    console.log("On recoit :"+obj[0]);
    let i = 0;
    obj.forEach(element => {
        writeToScreen(element);
    });

});


/*---------------- Style -------------------------*/

function writeToScreen(message)
{
    var pre = document.createElement("p");
    pre.style.wordWrap = "break-word";
    pre.innerHTML = message;
    output.appendChild(pre);
}
