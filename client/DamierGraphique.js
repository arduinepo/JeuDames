"use strict";
import {Damier} from "./Damier.js";
import {JoueurAutomatiqueIntelligent} from "./Joueurs";

export class Jeu {
    constructor(couleurJoueur, vsHumain) {
        this.damier = new Damier();
        this.couleurJoueur = couleurJoueur;
        this.addListeners();
        if (vsHumain) {

        }
        else this.ia = new JoueurAutomatiqueIntelligent(!couleurJoueur, 10);
    }


    prendre1Pion(l1, c1, l2, c2) {
        this.damier.prendre1Pion(l1, c1, l2, c2);

    }

    deplacer1Case(l1, c1, l2, c2) {
        this.damier.deplacer1Case(l1, c1, l2, c2);

    }

    surlignerCasesAccessibles(cases) {

    }

    actionAdverse(damier){
        if(this.ia!==undefined)
            this.damier.realiserAction(this.ia.choisirAction(damier));

        this.updateGraphique();
    }

    updateGraphique(){

    }

    addListeners() {
        const jeu = this;
        document.getElementsByTagName('svg')[0].onclick = function (event) {
            if ((jeu.couleurJoueur && jeu.damier.tourBlanc) || (!jeu.couleurJoueur && !jeu.damier.tourBlanc)) {
                const ligne1 = parseInt(event.target.parentNode.getAttribute('id')),
                    colonne1 = parseInt(event.target.getAttribute('id'));
                if (jeu.damier.pionAppartientAJoueur(ligne1, colonne1, jeu.damier.tourBlanc)) {
                    let cases = jeu.damier.casesAccessiblesDepuis(ligne1, colonne1);
                    jeu.surlignerCasesAccessibles(cases);

                    document.getElementsByTagName('svg')[0].onclick = function (event) {
                        const ligne2 = parseInt(event.target.parentNode.getAttribute('id')),
                            colonne2 = parseInt(event.target.getAttribute('id'));
                        if (jeu.damier.estAccessible(ligne2, colonne2, cases)) {
                            if (jeu.damier.pionAdverseEntreCases(ligne1, colonne1, ligne2, colonne2)) {
                                jeu.prendre1Pion(ligne1, colonne1, ligne2, colonne2);
                                cases = jeu.damier.casesAccessiblesPourPriseDepuis(ligne2, colonne2);
                                jeu.surlignerCasesAccessibles(cases);
                                while (cases.length > 0) {
                                    document.getElementsByTagName('svg')[0].onclick = function (event) {
                                        const ligne2 = parseInt(event.target.parentNode.getAttribute('id')),
                                            colonne2 = parseInt(event.target.getAttribute('id'));
                                        if (jeu.damier.estAccessible(ligne2, colonne2, cases)) {
                                            jeu.prendre1Pion(ligne1, colonne1, ligne2, colonne2);
                                            jeu.surlignerCasesAccessibles(cases);
                                            cases = jeu.damier.casesAccessiblesPourPriseDepuis(ligne2, colonne2);
                                        }
                                    }
                                }

                                jeu.actionAdverse(jeu.damier);

                            } else jeu.deplacer1Case(ligne1, colonne1, ligne2, colonne2);
                        }

                    }

                }
            }
        }
    }


}
