var socket = io("http://10.188.92.235:8000/");

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
window.onload=classement();

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


    // Création du tableau
    var table = document.createElement("table");
    table.setAttribute("id", "classement");
    document.getElementById("containerTable").appendChild(table);
  
    // Création de l'entete
    var header = document.createElement("thead");
    document.getElementById("classement").appendChild(header);

    // Ajout de ligne de l'en tete
    var line1 = document.createElement("tr");

    // Ajout des colonnes
    var col = document.createElement("th");
    var t = document.createTextNode("Classement");
    var col2 = document.createElement("th");
    var t2 = document.createTextNode("Pseudo");
    var col3 = document.createElement("th");
    var t3 = document.createTextNode("Score");
    //
    col.appendChild(t);
    col2.appendChild(t2);
    col3.appendChild(t3);
    //
    line1.appendChild(col);
    line1.appendChild(col2);
    line1.appendChild(col3);
    //
    header.appendChild(line1);


     // Création du tableau
     var content = document.createElement("tbody");
     content.setAttribute("id", "classementContent");
     document.getElementById("classement").appendChild(content);

    console.log("On recoit :"+clients[0]);
    console.log("On recoit :"+obj[0]);
    let i = 0;
    obj.forEach(element => {
        // Ajout de ligne de l'en tete
        var line = document.createElement("tr");

        // Ajout des colonnes
        var colcontent = document.createElement("td");
        var t = document.createTextNode(i);
        colcontent.appendChild(t);
        line.appendChild(colcontent);

        var colcontent2 = document.createElement("td");
        var tpseudo = document.createTextNode(element);
        colcontent2.appendChild(tpseudo);
        line.appendChild(colcontent2);

        var colcontent3 = document.createElement("td");
        var score = document.createTextNode(i);
        colcontent3.appendChild(score);
        line.appendChild(colcontent3);

        document.getElementById("classement").appendChild(line);

        i ++;

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
