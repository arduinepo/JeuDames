"use strict";

function connexionForm() { //Génère le formulaire de connexion

    //Création d'un div général :
    var laConnexion = document.createElement("div");
    laConnexion.setAttribute('id',"Connexion");
    
    //Création du form :
    var f = document.createElement("form");
    f.setAttribute('method',"post");
    f.setAttribute('action', "");
    var titreCo = document.createElement("h1");
    titreCo.innerHTML = "CONNEXION";
    f.appendChild(titreCo);

    laConnexion.appendChild(f);

    //Création  des différents input :
    var iPseudo = document.createElement("input");
    iPseudo.setAttribute('type',"text");
    iPseudo.setAttribute('placeholder',"Pseudo");
    iPseudo.setAttribute('id',"lesInputs");

    var iMdp = document.createElement("input");
    iMdp.setAttribute('type',"text");
    iMdp.setAttribute('placeholder',"Mot de passe");
    iMdp.setAttribute('id',"lesInputs");
    
    var iConnexion = document.createElement("input");
    iConnexion.setAttribute('type',"submit");
    iConnexion.setAttribute('value',"Se connecter");
    iConnexion.setAttribute('id',"bouton");
    iConnexion.setAttribute('onclick', "choixPartie()");

    //Ajout des différents éléments enfants aux éléments parents :                
    f.appendChild(iPseudo);
    f.appendChild(iMdp);
    f.appendChild(iConnexion);

    document.getElementsByTagName('body')[0].appendChild(laConnexion);

    document.getElementById('boutons').style.display = "none";

}

function inscriptionForm() { //Génère le formulaire d'inscription
    
    //Création d'un div général :
    var Inscription = document.createElement("div");
    Inscription.setAttribute('id',"Inscription");
    
    //Création du form :
    var f = document.createElement("form");
    f.setAttribute('method',"post");
    f.setAttribute('action',"");
    var titreCo = document.createElement("h1");
    titreCo.innerHTML = "INSCRIPTION";
    f.appendChild(titreCo);

    Inscription.appendChild(f);
   

    //Création  des différents input :
    var iPseudo = document.createElement("input");
    iPseudo.setAttribute('type',"text");
    iPseudo.setAttribute('placeholder',"Pseudo");
    iPseudo.setAttribute('id',"lesInputs");

    var iMdp = document.createElement("input");
    iMdp.setAttribute('type',"text");
    iMdp.setAttribute('placeholder',"Mot de passe");
    iMdp.setAttribute('id',"lesInputs");

    var iInscription = document.createElement("input");
    iInscription.setAttribute('type',"submit");
    iInscription.setAttribute('value',"S'inscrire");
    iInscription.setAttribute('id', "bouton");
    iInscription.setAttribute("onclick", "choixPartie()");
    
    //Ajout des différents éléments enfants aux éléments parents :                 
    f.appendChild(iPseudo);
    f.appendChild(iMdp);
    f.appendChild(iInscription);

    document.getElementsByTagName('body')[0].appendChild(Inscription);

    document.getElementById('boutons').style.display = "none";
    
}

function choixPartie() { 

    //Création d'un div général pour les boutons :
    var ChoixPartie = document.createElement("div");
    ChoixPartie.setAttribute('id',"ChoixPartie");
    
    //Création du bouton Partie Réseau :
    var partieR = document.createElement("button");
    partieR.setAttribute('id', "PartieReseau");
    partieR.innerHTML = "Jouer avec un humain";

    //Création du bouton Partie Locale :
    var partieL = document.createElement("button");
    partieL.setAttribute('id', "PartieLocale");
    partieL.innerHTML = "Jouer avec un robot débile"

    var saut = document.createElement("br");

    //Ajout des différents éléments enfants aux éléments parents :
    ChoixPartie.appendChild(partieR);
    ChoixPartie.appendChild(saut);
    ChoixPartie.appendChild(partieL);
    document.getElementsByTagName('body')[0].appendChild(ChoixPartie);

    //On enlève le formulaire : 
    var connexion = document.getElementById("Connexion");
    var inscription = document.getElementById("Inscription");
    if (connexion != null) {          
        connexion.remove();
    }
    else {
        inscription.remove();
    }

}