"use strict";
export class Controller {

    constructor(jeu,ws){
        console.log("New Object Controller");
        this.jeu = jeu;
        this.ws = ws;
        this.receiveServer(jeu,ws,this);
        this.emitterServer(jeu,ws);
        
  
    } 

     /*------------------------ Client side event emitter. -----------------------*/  
    emitterServer(jeu,ws){
        // Envoie aux server une demande de connection
        document.getElementById('sendPseudo').onclick = function () {
            console.log("emitterServer :: sendPseudo");
            document.getElementById('afterConnexion').style.visibility = 'visible'; 
            document.getElementById('connexion').style.visibility = 'hidden';
            ws.setPseudo( document.getElementById('pseudoInput').value, document.getElementById('passwordInput').value );
        };

        // Envoie aux server une recherche de partie 
        document.getElementById('searchGame').onclick = function () {
            console.log("emitterServer :: searchGame");
            ws.searchGame( ws );
        }
    }
    /*------------------------ Client side event listener. -----------------------*/  
    receiveServer(jeu,ws,c) {
        // Reception de connection 
        ws.socket.on('receiveConnection',function(){
            // TODO : condition : reco,en game etc
            console.log("Connection :"+sessionStorage.getItem("pseudo"),sessionStorage.getItem("password"));
            //ws.socket.emit("searchGame");
        });

        // Reception du début de la game mis en place des listenners
        ws.socket.on('receiveStartGame',function (couleurPion,tour) {
            couleurPion ? console.log("Vous etes les pions noirs") : console.log("Vous etes les pions blancs");  
            jeu.tour = tour;
            console.log("StartGame par :"+ jeu.tour);
            c.versusOnline(jeu,ws,couleurPion);
            c.couleurPion = couleurPion;
          
        });
        
        // Reception prise Pion
        ws.socket.on('receiveTakePion',function (l,c,newline,newcolumn,tour) {
            // Prise du pion 
           if ( !jeu.priseMultiple ) {
            jeu.prendre1Pion(l,c,newline, newcolumn);
            jeu.tour = !tour;
           }else if( jeu.tour != tour){
            jeu.prendre1Pion(l,c,newline, newcolumn);
           }
        });

        ws.socket.on('receiveEndTurn',function (tour) {
            jeu.priseMultiple = false;
            jeu.tour = tour;
        });
        ws.socket.on('receiveMovePion',function (l,c,newline,newcolumn,tour) {
            jeu.deplacer1Case(l,c,newline, newcolumn);
            //  On passe le tour à l'adversaire :
            console.log("TOUR :"+jeu.tour)
            jeu.tour = tour;
            jeu.damier.tourBlanc ? console.log("Au tours des noirs") : console.log("Au tours des blancs");
        });

        // It takes new messages from the server and appends it to HTML.  
        ws.socket.on('receiveMessage',function(msg){
            console.log('receiveMessage -- client side', msg);
            //this.writeToScreen(msg);
        });
        
        // Affichage victoire.  
        ws.socket.on('receiveEndGame',function(stateWin){
            console.log('EndGame receive-- client side');
            stateWin ? notification("Victoire") : notification("Défaite");
        });

        // Reception changement de pseudo 
        ws.socket.on('receivePseudo',function(pseudo){
            console.log('receivePseudo -- client side', pseudo);
            document.querySelector('.pseudo').textContent = pseudo;
            //writeToScreen(pseudo);
        });

        // Reception du Classement
        ws.socket.on('receiveClassement',function(clients){
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

        // Reception des alertes 
        ws.socket.on('receiveAlert',function(msg){
            console.log(msg);
            notification(msg);
        });


    }

    versusOnline(jeu,ws,couleurPion){
        var constant_couleur_Joueur = couleurPion;
        var tableCasesAccessibles = []; // tableau contenant les cases acesibles
        var tableCasesPrisesMultiples = []; // 

        var priseMultiple = false;



        document.getElementsByTagName('svg')[0].onclick = function (event) {
            couleurPion ? console.log("Vous etes les pions noirs") : console.log("Vous etes les pions blancs");  
            // Remise à zéro du plateau lors d'un nouveau click
            if ( tableCasesAccessibles !== undefined ) tableCasesAccessibles = jeu.resetSurlignement(tableCasesAccessibles);
            
            jeu.ligne1 = undefined;
            jeu.colonne1 = undefined;
            console.log("Prise Multiple en cours ? : "+priseMultiple);
            console.log("Tour de :"+jeu.tour+" et "+couleurPion);
            // Votre Tour de Jeu
            if ( jeu.tour == couleurPion ){
                // La case selectionné
                jeu.ligne1 = parseInt(event.target.parentNode.getAttribute('id'));
                jeu.colonne1 = parseInt(event.target.getAttribute('id'));

                // Pion déja selectionné
                if ( jeu.pionEstselectionne ) {
                    // Prise Multiple en cours
                    if( jeu.priseMultiple ){ 
                        // Vérification de la case selectionné fais bien partie des cases de la prise multiple en cours
                        if( jeu.damier.estAccessible(jeu.ligne1, jeu.colonne1, jeu.cases) ){
                            // update graphique
                            jeu.enleverSurlignement(jeu.cases);
                            // Prise du pion 
                            ws.prisePion(jeu.pionLigneSelectionne,jeu.pionColonneSelectionne,jeu.ligne1, jeu.colonne1,jeu.tour);
                            jeu.prendre1Pion(jeu.pionLigneSelectionne,jeu.pionColonneSelectionne,jeu.ligne1, jeu.colonne1);

                            // update des cases accesibles 
                            jeu.cases = jeu.damier.casesAccessiblesPourPriseDepuis(jeu.ligne1, jeu.colonne1);
                            // Fin de la prise multiple
                            if ( jeu.cases.length === 0 || jeu.cases.length === undefined ){
                                ws.finPriseMiltiple(jeu.tour);
                            }else{
                            // Prise multiple toujours en cours
                                // On garde on mémoire la position du pion pour la prochaine prise
                                jeu.pionLigneSelectionne = parseInt(event.target.parentNode.getAttribute('id'));
                                jeu.pionColonneSelectionne = parseInt(event.target.getAttribute('id'));
                                // update graphique
                                jeu.surlignerCasesAccessibles(jeu.cases);
                                // ajout des cases de la prise multiple
                                tableCasesPrisesMultiples.push(jeu.cases);
                            }
                        }
                    }else{
                    // Pas de prise Multiple en cours
                        if ( jeu.damier.estAccessible(jeu.ligne1, jeu.colonne1, jeu.cases) ) {
                            // Prise d'un pion
                            if ( jeu.damier.pionAdverseEntreCases(jeu.pionLigneSelectionne,jeu.pionColonneSelectionne,jeu.ligne1, jeu.colonne1) ) {
                                // udpdate graphique
                                jeu.enleverSurlignement(jeu.cases);
                                // Prise simple d'un pion
                                ws.prisePion(jeu.pionLigneSelectionne,jeu.pionColonneSelectionne,jeu.ligne1, jeu.colonne1,jeu.tour);
                                jeu.prendre1Pion(jeu.pionLigneSelectionne,jeu.pionColonneSelectionne,jeu.ligne1, jeu.colonne1);
                                jeu.cases = jeu.damier.casesAccessiblesPourPriseDepuis(jeu.ligne1, jeu.colonne1);
                                // Pas de prise multiple disponible
                                if( jeu.cases.length === 0 || jeu.cases.length === undefined ){
                                    jeu.pionLigneSelectionne = parseInt(event.target.parentNode.getAttribute('id'));
                                    jeu.pionColonneSelectionne =  parseInt(event.target.getAttribute('id'));
                                }else{
                                    jeu.pionLigneSelectionne = parseInt(event.target.parentNode.getAttribute('id'));
                                    jeu.pionColonneSelectionne =  parseInt(event.target.getAttribute('id'));
                                    jeu.priseMultiple = true;
                                    jeu.surlignerCasesAccessibles(jeu.cases);
                                    jeu.cases = jeu.damier.casesAccessiblesPourPriseDepuis(jeu.ligne1, jeu.colonne1);
                                }
                            }else{
                            // Déplacement d'un pion
                                // Déplace le pion à la nouvelle position
                                ws.deplacerPion(jeu.pionLigneSelectionne,jeu.pionColonneSelectionne,jeu.ligne1, jeu.colonne1,jeu.tour);
                            }        
                        }else{
                        // Déselection d'un Pion
                            jeu.pionEstselectionne = false;
                            console.log("Case Inaccessible");
                        }
                    }
                   
                }else if ( jeu.damier.pionAppartientAJoueur(jeu.ligne1, jeu.colonne1, constant_couleur_Joueur) ) {
                // Selection d'un Pion
                    // On garde la position du pion qu'on déplace en mémoire
                    jeu.pionLigneSelectionne =  parseInt(event.target.parentNode.getAttribute('id'));
                    jeu.pionColonneSelectionne = parseInt(event.target.getAttribute('id'));
                    // Vérification des cases disponibles
                    jeu.cases = jeu.damier.casesAccessiblesDepuis(jeu.ligne1, jeu.colonne1);
                    // Preview des déplacemnt disponibles
                    jeu.surlignerCasesAccessibles(jeu.cases);
                    // On garde en mémoire ces cases disponibles
                    tableCasesAccessibles.push(jeu.cases);
                    jeu.pionEstselectionne = true;
                }
            }
        }
    }
}