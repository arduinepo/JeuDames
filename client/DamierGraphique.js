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

        } else this.ia = new JoueurAutomatiqueIntelligent(!couleurJoueur, 10);
    }

    prendre1Pion(l1, c1, l2, c2) {
        this.damier.prendre1Pion(l1, c1, l2, c2);

    }

    deplacer1Case(l1, c1, l2, c2) {
        this.damier.deplacer1Case(l1, c1, l2, c2);

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

    actionAdverse(damier) {
        let action;
        if (this.ia !== undefined) {
            action = this.ia.choisirAction(damier);
            this.damier.realiserAction(action);
        }
        this.updateGraphique(action);
    }

    updateGraphique(action) {
        let pion = this.damier.grille[action.ligneDepart()][action.colonneDepart()];
        if (action instanceof Mouvement) {

        }
    }

    addListeners() {
        const jeu = this;
        document.getElementsByTagName('svg')[0].onclick = function (event) {

            if ((jeu.couleurJoueur && jeu.damier.tourBlanc) || (!jeu.couleurJoueur && !jeu.damier.tourBlanc)) {
                const ligne1 = parseInt(event.target.parentNode.getAttribute('id')),
                    colonne1 = parseInt(event.target.getAttribute('id'));

                if (jeu.damier.pionAppartientAJoueur(ligne1, colonne1, jeu.damier.tourBlanc)) {
                    let cases = jeu.damier.casesAccessiblesDepuis(ligne1, colonne1);
                    let estDame = Math.abs(jeu.damier.grille[ligne1][colonne1]) === DAME_BLANC;
                    jeu.surlignerCasesAccessibles(cases);

                    document.getElementsByTagName('svg')[0].onclick = function (event) {
                        const ligne2 = parseInt(event.target.parentNode.getAttribute('id')),
                            colonne2 = parseInt(event.target.getAttribute('id'));

                        if (jeu.damier.estAccessible(ligne2, colonne2, cases)) {
                            let action;
                            if (jeu.damier.pionAdverseEntreCases(ligne1, colonne1, ligne2, colonne2)) {
                                jeu.prendre1Pion(ligne1, colonne1, ligne2, colonne2);
                                action = new Prise(ligne1, colonne1, estDame);
                                action.ajouteCase(ligne2, colonne2);
                                cases = jeu.damier.casesAccessiblesPourPriseDepuis(ligne2, colonne2);
                                jeu.surlignerCasesAccessibles(cases);

                                while (cases.length > 0) {
                                    document.getElementsByTagName('svg')[0].onclick = function (event) {
                                        const ligne2 = parseInt(event.target.parentNode.getAttribute('id')),
                                            colonne2 = parseInt(event.target.getAttribute('id'));
                                        if (jeu.damier.estAccessible(ligne2, colonne2, cases)) {
                                            jeu.prendre1Pion(ligne1, colonne1, ligne2, colonne2);
                                            if(estDame){
                                                const c=jeu.damier.casePionPris(ligne1,colonne1,ligne2,colonne2);
                                                action.ajouteCase(c.ligne,c.colonne);
                                            }
                                            action.ajouteCase(ligne2,colonne2);
                                            jeu.surlignerCasesAccessibles(cases);
                                            cases = jeu.damier.casesAccessiblesPourPriseDepuis(ligne2, colonne2);
                                        }
                                    }
                                }






                                jeu.actionAdverse(jeu.damier);
                            } else {
                                action = new Mouvement(ligne1, colonne1, ligne2, colonne2);
                                jeu.deplacer1Case(ligne1, colonne1, ligne2, colonne2);





                            }
                        }

                    }

                }
            }
        }
    }


}
