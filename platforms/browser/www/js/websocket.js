var socket = io("http://localhost:8100");

function init()
{
    socket.on('news', function (data) {
        console.log(data);
        socket.emit('my other event', { my: 'data' });
    });
}
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

// Client side event listener.  It takes new messages from the server and appends it to HTML.  
socket.on('receiveMessage',function(msg){
    console.log('receiveMessage -- client side', msg);
    writeToScreen(msg);
});

function play(){
    socket.emit("play");
}

// Ecrit à l'écran
function writeToScreen(message)
{
    var pre = document.createElement("p");
    pre.style.wordWrap = "break-word";
    pre.innerHTML = message;
    output.appendChild(pre);
}

window.addEventListener("load", init, false);