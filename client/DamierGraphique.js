"use strict";
import {Damier} from "./Damier.js";
import {JoueurAutomatiqueIntelligent} from "./Joueurs.js";
import {Mouvement, Prise} from "./Action.js";
import {CASE_VIDE, DAME_BLANC} from "./Constantes.js";

export class Jeu {
    constructor(couleurJoueur, vsHumain) { 
        this.damier = new Damier();
        this.couleurJoueur = couleurJoueur;
        this.addListeners();
        if (vsHumain) {

        } else this.ia = new JoueurAutomatiqueIntelligent(!couleurJoueur, 3);
    }

    prendre1Pion(l1, c1, l2, c2) {
        this.damier.prendre1Pion(l1, c1, l2, c2);
        var ligneD = document.getElementsByTagName('g').item(l1);
        var jetonD = ligneD.querySelector('circle#' + CSS.escape(c1));
        var ligneA = document.getElementsByTagName('g').item(l2); // Ligne d'arrivée
        var caseA = ligneA.querySelector('rect#' + CSS.escape(c2)); // Case d'arrivée
        if (l1 > l2 && c1 < c2) {
            var lignePrise = document.getElementsByTagName('g').item(l1-1);
            var jetonPris = lignePrise.querySelector('circle#' + CSS.escape(c1+1));
            
        }
        if (l1 > l2 && c1 > c2) {
            var lignePrise = document.getElementsByTagName('g').item(l1-1);
            var jetonPris = lignePrise.querySelector('circle#' + CSS.escape(c1-1));
            
        }
        if (l1 < l2 && c1 < c2) {
            var lignePrise = document.getElementsByTagName('g').item(l1+1);
            var jetonPris = lignePrise.querySelector('circle#' + CSS.escape(c1+1));
            
        }
        if (l1 < l2 && c1 > c2) {
            var lignePrise = document.getElementsByTagName('g').item(l1+1);
            var jetonPris = lignePrise.querySelector('circle#' + CSS.escape(c1-1));
            
        }
        lignePrise.removeChild(jetonPris);
        this.afficherDeplacement(l1, c1, l2, c2);


    }

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

    afficherPrise(l1, c1, l2, c2) {
        var ligneD = document.getElementsByTagName('g').item(l1);
        var jetonD = ligneD.querySelector('circle#' + CSS.escape(c1));
        var ligneA = document.getElementsByTagName('g').item(l2); // Ligne d'arrivée
        var caseA = ligneA.querySelector('rect#' + CSS.escape(c2)); // Case d'arrivée
        if (l1 > l2 && c1 < c2) {
            var lignePrise = document.getElementsByTagName('g').item(l1-1);
            var jetonPris = lignePrise.querySelector('circle#' + CSS.escape(c1+1));
            
        }
        if (l1 > l2 && c1 > c2) {
            var lignePrise = document.getElementsByTagName('g').item(l1-1);
            var jetonPris = lignePrise.querySelector('circle#' + CSS.escape(c1-1));
            
        }
        if (l1 < l2 && c1 < c2) {
            var lignePrise = document.getElementsByTagName('g').item(l1+1);
            var jetonPris = lignePrise.querySelector('circle#' + CSS.escape(c1+1));
            
        }
        if (l1 < l2 && c1 > c2) {
            var lignePrise = document.getElementsByTagName('g').item(l1+1);
            var jetonPris = lignePrise.querySelector('circle#' + CSS.escape(c1-1));
            
        }
        lignePrise.removeChild(jetonPris);
        this.afficherDeplacement(l1, c1, l2, c2);
    }

    deplacer1Case(l1, c1, l2, c2) {
        this.damier.deplacer1Case(l1, c1, l2, c2);
        this.afficherDeplacement(l1, c1, l2, c2);


    }

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

    actionAdverse() {
        let action;
        if (window.game.ia !== undefined) {
            action = window.game.ia.choisirAction(window.game.damier);
            window.game.damier.realiserAction(action);
            console.log(window.game.damier.toString());
        }
        window.game.updateGraphique(action);
       
    }

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
        document.getElementsByTagName('svg')[0].onclick = function (event) {
            console.log(jeu.couleurJoueur + ' ' + jeu.damier.tourBlanc);
            if ((jeu.couleurJoueur && jeu.damier.tourBlanc) || (!jeu.couleurJoueur && !jeu.damier.tourBlanc)) {
                if (jeu.ligne1 === undefined && jeu.colonne1 === undefined) {
                    jeu.ligne1 = parseInt(event.target.parentNode.getAttribute('id'));
                    jeu.colonne1 = parseInt(event.target.getAttribute('id'));

                    if (jeu.damier.pionAppartientAJoueur(jeu.ligne1, jeu.colonne1, jeu.damier.tourBlanc)) {
                        jeu.cases = jeu.damier.casesAccessiblesDepuis(jeu.ligne1, jeu.colonne1);
                        jeu.surlignerCasesAccessibles(jeu.cases);
                    }
                    else {
                        jeu.ligne1 = undefined;
                        jeu.colonne1 = undefined;
                    }
                }    
                else {
                    jeu.ligne2 = parseInt(event.target.parentNode.getAttribute('id'));
                    jeu.colonne2 = parseInt(event.target.getAttribute('id'));

                    if (jeu.damier.estAccessible(jeu.ligne2, jeu.colonne2, jeu.cases)) {
                        let action;
                        let estDame = Math.abs(jeu.damier.grille[jeu.ligne1][jeu.colonne1]) === DAME_BLANC;
                        if (jeu.damier.pionAdverseEntreCases(jeu.ligne1, jeu.colonne1, jeu.ligne2, jeu.colonne2)) {
                            console.log(estDame);
                            jeu.enleverSurlignement(jeu.cases);
                            jeu.prendre1Pion(jeu.ligne1, jeu.colonne1, jeu.ligne2, jeu.colonne2);
                            action = new Prise(jeu.ligne1, jeu.colonne1, estDame);
                            action.ajouteCase(jeu.ligne2, jeu.colonne2);
                            jeu.cases = jeu.damier.casesAccessiblesPourPriseDepuis(jeu.ligne2, jeu.colonne2);
                            jeu.surlignerCasesAccessibles(jeu.cases);

                            while (jeu.cases.length > 0) {
                                document.getElementsByTagName('svg')[0].onclick = function (event) {
                                    jeu.ligne2 = parseInt(event.target.parentNode.getAttribute('id')),
                                    jeu.colonne2 = parseInt(event.target.getAttribute('id'));
                                    if (jeu.damier.estAccessible(jeu.ligne2, jeu.colonne2, jeu.cases)) {
                                        jeu.prendre1Pion(jeu.ligne1, jeu.colonne1, jeu.ligne2, colonne2);
                                        if(estDame){
                                            const c=jeu.damier.casePionPris(jeu.ligne1,jeu.colonne1,jeu.ligne2,colonne2);
                                            action.ajouteCase(c.ligne,c.colonne);
                                        }
                                        action.ajouteCase(jeu.ligne2,colonne2);
                                        jeu.surlignerCasesAccessibles(jeu.cases);
                                        jeu.cases = jeu.damier.casesAccessiblesPourPriseDepuis(jeu.ligne2, colonne2);
                                    }
                                }
                            }

                        } else {
                            jeu.enleverSurlignement(jeu.cases);
                            jeu.deplacer1Case(jeu.ligne1, jeu.colonne1, jeu.ligne2, jeu.colonne2);
                            console.log(jeu.damier.toString());




                        }
                        jeu.ligne1 = undefined;
                        jeu.ligne2 = undefined;
                        jeu.colonne1 = undefined;
                        jeu.colonne2 = undefined;
                        console.log("poupou");
                        window.game = jeu;
                        setTimeout(jeu.actionAdverse, 1000);
                    }
                    else {
                        jeu.ligne2 = undefined;
                        jeu.colonne2 = undefined;
                    }
                }

                
            }
        }
    }


}