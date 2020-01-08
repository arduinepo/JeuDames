"use strict";
import {Damier} from "./Damier.js";
import {JoueurAutomatiqueIntelligent} from "./Joueurs.js";
import {Mouvement, Prise, Case} from "./Action.js";
import {CASE_VIDE, DAME_BLANC, BLANC} from "./Constantes.js";

export class Jeu {
    constructor(couleurJoueur, vsHumain) { 
        this.damier = new Damier();
        this.couleurJoueur = couleurJoueur;
        this.addListeners();
        if (vsHumain) {

        } else this.ia = new JoueurAutomatiqueIntelligent(!couleurJoueur, 3);
    }

    /* ------ Réalise un déplacement ------ */
    deplacer1Case(l1, c1, l2, c2) {
        this.damier.deplacer1Case(l1, c1, l2, c2);
        this.afficherDeplacement(l1, c1, l2, c2);
        this.damier.tourBlanc = !this.damier.tourBlanc;

    }

    /* ------ Réalise une prise ------ */
    prendre1Pion(l1, c1, l2, c2) {
        this.damier.prendre1Pion(l1, c1, l2, c2);
        this.afficherPrise(l1, c1, l2, c2);

    }

    /* ------ Affiche un déplacement ------ */ 
    afficherDeplacement(l1, c1, l2, c2) {
        var ligneD = document.getElementsByTagName('g').item(l1);
        var jetonD = ligneD.querySelector('circle#' + CSS.escape(c1));
        var ligneA = document.getElementsByTagName('g').item(l2); // Ligne d'arrivée
        var caseA = ligneA.querySelector('rect#' + CSS.escape(c2)); // Case d'arrivée
        var cx = parseInt(caseA.getAttribute('x')) + 17.5; // Nouvelle position x du jeton
        var cy = parseInt(caseA.getAttribute('y')) + 17.5; // Nouvelle position y du jeton
        caseA.after(jetonD); // Insertion du jeton juste après la case d'arrivée dans le svg
        jetonD.setAttribute('id', c2);
        jetonD.setAttribute('cx', cx.toString());
        jetonD.setAttribute('cy', cy.toString());
    }

    /* ------ Affiche une prise ------ */
    afficherPrise(l1, c1, l2, c2) {
        var ligneD = document.getElementsByTagName('g').item(l1);
        var jetonD = ligneD.querySelector('circle#' + CSS.escape(c1));
        var ligneA = document.getElementsByTagName('g').item(l2); // Ligne d'arrivée
        var caseA = ligneA.querySelector('rect#' + CSS.escape(c2)); // Case d'arrivée
        if (l1 > l2 && c1 < c2) {
            var lignePrise = document.getElementsByTagName('g').item(l1-1);
            var jetonPris = lignePrise.querySelector('circle#' + CSS.escape(c1+1));
            jetonPris.remove();
        }
        if (l1 > l2 && c1 > c2) {
            var lignePrise = document.getElementsByTagName('g').item(l1-1);
            var jetonPris = lignePrise.querySelector('circle#' + CSS.escape(c1-1));
            //lignePrise.removeChild(jetonPris);
            jetonPris.remove();
        }
        if (l1 < l2 && c1 < c2) {
            var lignePrise = document.getElementsByTagName('g').item(l1+1);
            var jetonPris = lignePrise.querySelector('circle#' + CSS.escape(c1+1));
            //lignePrise.removeChild(jetonPris);
            jetonPris.remove();
        }
        if (l1 < l2 && c1 > c2) {
            var lignePrise = document.getElementsByTagName('g').item(l1+1);
            var jetonPris = lignePrise.querySelector('circle#' + CSS.escape(c1-1));
            //lignePrise.removeChild(jetonPris);
            jetonPris.remove();
        }
        this.afficherDeplacement(l1, c1, l2, c2);
    }



    /* ------ Surligne les cases jouables ------ */
    surlignerCasesAccessibles(cases) {
        for (var i = 0; i < cases.length; i++) {
            var laLigne = document.getElementsByTagName('g').item(cases[i].ligne).children;
            for (var j = 0; j < laLigne.length; j++) {
                if (parseInt(laLigne.item(j).getAttribute("id")) === cases[i].colonne) {
                    laLigne.item(j).style.fill = "red";
                }
            }
        }
    }

    /* ------ Enlève le surlignement des cases jouables ------ */
    enleverSurlignement(cases) {
        for (var i = 0; i < cases.length; i++) {
            var laLigne = document.getElementsByTagName('g').item(cases[i].ligne).children;
            for (var j = 0; j < laLigne.length; j++) {
                if (parseInt(laLigne.item(j).getAttribute("id")) === cases[i].colonne) {
                    laLigne.item(j).style.fill = "#3b2314";
                }
            }
        }
    }

    /* ------ Enlève le surlignement des cases jouables ------ */
    resetSurlignement(tablecases) {
        for (var i = 0; i < tablecases.length; i++) {
            this.enleverSurlignement(tablecases[i]);
        }
        return [];
    }

    /* ------ Réalise l'action de l'adversaire ------ */
    actionAdverse() {
        let action;
        console.log("Case Inaccessible");
        if (window.game.ia !== undefined) {
            action = window.game.ia.choisirAction(window.game.damier);
            window.game.damier.realiserAction(action);
            console.log(window.game.damier.toString());
        }
        window.game.updateGraphique(action);

    }

    /* ------ Met à jour le damier pour le tour adverse ------ */
    updateGraphique(action) {
        let pion = this.damier.grille[action.ligneDepart()][action.colonneDepart()];
        if (action instanceof Mouvement) {
            window.game.afficherDeplacement(action.ligneDepart(), action.colonneDepart(), action.ligneArrivee(), action.colonneArrivee());
        }
        if (action instanceof Prise) {
            window.game.afficherPrise(action.ligneDepart(), action.colonneDepart(), action.ligneArrivee(), action.colonneArrivee());
        }
    }

    addListeners() {
        const jeu = this;
        var constant_couleur_Joueur = true;
        var tableCasesAccessibles = []; // tableau contenant les cases acesibles
        var tableCasesPrisesMultiples = []; // 
        var pionEstselectionne = false;
        var priseMultiple = false;
        var pionLigneSelectionne;
        var pionCollonneSelectionne;


        document.getElementsByTagName('svg')[0].onclick = function (event) {

            // Remise à zéro du plateau lors d'un nouveau click
            if ( tableCasesAccessibles !== undefined ) tableCasesAccessibles = jeu.resetSurlignement(tableCasesAccessibles);
            
            jeu.ligne1 = undefined;
            jeu.colonne1 = undefined;
            
            
            if ( !( jeu.damier.tourBlanc ) ) {// Pas votre Tour de Jeu

                 console.log("Pas votre tour");
            }else{// Votre Tour de Jeu
                // La case selectionné
                jeu.ligne1 = parseInt(event.target.parentNode.getAttribute('id'));
                jeu.colonne1 = parseInt(event.target.getAttribute('id'));

                if ( pionEstselectionne ) {// Pion déja selectionné
                    if( priseMultiple ){ // Prise Multiple
                        
                        console.log("priseMultiple :"+jeu.ligne1+" | "+jeu.colonne1);

                        if( jeu.damier.estAccessible(jeu.ligne1, jeu.colonne1, jeu.cases) ){//Si la case selectionné est une cases de la prise multiple
                            //
                            jeu.enleverSurlignement(jeu.cases);
                            jeu.prendre1Pion(pionLigneSelectionne,pionCollonneSelectionne,jeu.ligne1, jeu.colonne1);
                            jeu.cases = jeu.damier.casesAccessiblesPourPriseDepuis(jeu.ligne1, jeu.colonne1);
                            if ( jeu.cases.length === 0 || jeu.cases.length === undefined ){// Plus de prise multiple
                                priseMultiple = false;
                                constant_couleur_Joueur = !constant_couleur_Joueur;
                            }else{
                                pionLigneSelectionne = parseInt(event.target.parentNode.getAttribute('id'));
                                pionCollonneSelectionne = parseInt(event.target.getAttribute('id'));
                                jeu.surlignerCasesAccessibles(jeu.cases);
                                tableCasesPrisesMultiples.push(jeu.cases);
                            }

                        }else{
                            console.log("LES CASES ROUGES BOUFFONS");
                        }
                         
                    }else{
                        if ( jeu.damier.estAccessible(jeu.ligne1, jeu.colonne1, jeu.cases) ) {
                            console.log("Case accessible");
                            if ( jeu.damier.pionAdverseEntreCases(pionLigneSelectionne,pionCollonneSelectionne,jeu.ligne1, jeu.colonne1) ) {// Cas où il s'agit d'une prise
                                jeu.enleverSurlignement(jeu.cases);
                                jeu.prendre1Pion(pionLigneSelectionne,pionCollonneSelectionne,jeu.ligne1, jeu.colonne1);
                                jeu.cases = jeu.damier.casesAccessiblesPourPriseDepuis(jeu.ligne1, jeu.colonne1);

                                console.log("On test jeu.cases.lenght === 0 :"+jeu.cases.length);
                                if( jeu.cases.length === 0 || jeu.cases.length === undefined ){// Pas de prise multiple
                                    console.log("prise simple changement de tour"+jeu.cases);
                                    pionLigneSelectionne = parseInt(event.target.parentNode.getAttribute('id'));
                                    pionCollonneSelectionne =  parseInt(event.target.getAttribute('id'));
                                    pionEstselectionne = false;
                                    //  On passe le tour à l'adversaire :
                                    //jeu.damier.tourBlanc = !jeu.damier.tourBlanc;
                                    constant_couleur_Joueur = !constant_couleur_Joueur;
                                }else{// prise Multiple
                                    console.log("prise Multiple"+jeu.cases);
                                    pionLigneSelectionne = parseInt(event.target.parentNode.getAttribute('id'));
                                    pionCollonneSelectionne =  parseInt(event.target.getAttribute('id'));
                                    priseMultiple = true;
                                    jeu.surlignerCasesAccessibles(jeu.cases);
                                    jeu.cases = jeu.damier.casesAccessiblesPourPriseDepuis(jeu.ligne1, jeu.colonne1);
                                }
                            }else{// Cas où il s'agit d'un déplacement
                                jeu.deplacer1Case(pionLigneSelectionne,pionCollonneSelectionne,jeu.ligne1, jeu.colonne1);
                                pionEstselectionne = false;
                                //  On passe le tour à l'adversaire :
                                jeu.damier.tourBlanc = !jeu.damier.tourBlanc;
                                constant_couleur_Joueur = !constant_couleur_Joueur;
                            }        
    
                            //window.game = jeu;
                            //setTimeout(jeu.actionAdverse, 1000);
                        }else{
                            pionEstselectionne = false;
                            console.log("Case Inaccessible");
                        }
                    }
                   
                }else if ( jeu.damier.pionAppartientAJoueur(jeu.ligne1, jeu.colonne1, constant_couleur_Joueur) ) {// Selection d'un Pion
                    // On garde la position du pion qu'on déplace en mémoire
                    pionLigneSelectionne =  parseInt(event.target.parentNode.getAttribute('id'));
                    pionCollonneSelectionne = parseInt(event.target.getAttribute('id'));
                    jeu.cases = jeu.damier.casesAccessiblesDepuis(jeu.ligne1, jeu.colonne1);
                    jeu.surlignerCasesAccessibles(jeu.cases);
                    tableCasesAccessibles.push(jeu.cases);
                    pionEstselectionne = true;

                }

            }

            //switch (  ){}
        }
    }


}