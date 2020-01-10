"use strict";
import {Jeu} from "./games/DamierGraphique.js";



export class Websocket {

    constructor(adresseServeur,portServeur,socket){
        console.log("New Object Websocket");
        this.adresseServeur = adresseServeur;
        this.portServeur = portServeur;
        this.socket = socket;
    }

    sendMessage(msg)
    {
        console.log("click on message")
        socket.emit('join', msg);
    }

    sendMessageAll(msg)
    {
        console.log("click on message broadcast")
        socket.emit('broadcast', msg);
    }

    setPseudo(pseudo,password)
    {
        sessionStorage.setItem("pseudo",pseudo);
        sessionStorage.setItem("password",password);
        console.log("Pseudo : "+pseudo,"Password : "+password);
        //socket.emit('setPseudo', pseudo, password);
    }

    surrender()
    {
        console.log("click on surrender")
        socket.emit('surrender');
    }

    endGame()
    {
        console.log("click on victory")
        socket.emit('endGame');
    }

    searchGame(){
        document.getElementById("modal-damier").style.visibility = "visible";
        this.socket.emit("searchGame");
    }

    classement()
    {
        console.log("Demande de classement");
        socket.emit("classement");
    }

    /*------------- On envoie le déplacement d'un joueur -------------*/
    deplacerPion(l,c,newline,newcolumn,tour){
        this.socket.emit("movePion",l,c,newline,newcolumn,tour);
    }
    /*------------- On envoie la prise d'un pion ---------------------*/
    prisePion(l,c,newline,newcolumn,tour){
        this.socket.emit("takePion",l,c,newline,newcolumn,tour);
    }
    /*------------- On envoie la fin de la prise multiple ------------*/
    finPriseMiltiple(tour){
        this.socket.emit("endTurn",tour);
    }
    writeToScreen(message)
    {
        var pre = document.createElement("p");
        pre.style.wordWrap = "break-word";
        pre.innerHTML = message;

    }
}
