"use strict";

import {Etat} from "./Etats.js";
import {PION_BLANC, PION_NOIR, BLANC, NOIR} from './Constantes.js';

const VALEUR_DAME = 54, VALEUR_PION = 27;

class Joueur {
    constructor(joueurBlanc) {
        this.joueurBlanc = joueurBlanc;
    }
}

class JoueurAutomatique extends Joueur {
    constructor(joueurBlanc) {
        super(joueurBlanc);
    }
}

export class JoueurAutoAleatoire extends JoueurAutomatique {
    constructor(joueurBlanc) {
        super(joueurBlanc);
    }

    choisirAction(damier) {
        return damier.actionsPossibles[Math.floor(Math.random() * damier.actionsPossibles.length)];
    }
}

export class JoueurHumain extends Joueur {
    constructor(joueurBlanc, nom) {
        super(joueurBlanc);
        this.nom = nom;
    }
}

export class JoueurAutomatiqueIntelligent extends JoueurAutomatique {
    constructor(joueurBlanc, profondeur) {
        super(joueurBlanc);
        this.profondeur=profondeur;
        this.heuristique = joueurBlanc ? new HeuristiqueBlancs() : new HeuristiqueNoirs();
    }

    choisirAction(damier) {
        return new Etat(damier,this.heuristique).rechercheMeilleurCoup(this.profondeur, this.heuristique);
    }

}

class HeuristiqueBlancs {
    evalue(etat) {
        let total = 0;
        for (let i = 0; i < etat.grille.length; i++)
            for (let j = (i % 2 === 0) ? 0 : 1; j < etat.grille.length; j += 2)
                switch (etat.grille[i][j]) {
                    case PION_BLANC:
                        total += (VALEUR_PION - etat.distancePionLigneFondAdverse(i, j));
                        break;
                    case PION_NOIR:
                        total -= (VALEUR_PION - etat.distancePionLigneFondAdverse(i, j));
                }
        return total + (etat.nombreDamesBlancs - etat.nombreDamesNoirs) * VALEUR_DAME;
    }

    gagne(etat,actions) {
        return etat.joueurAGagne(BLANC,actions);
    }
}

class HeuristiqueNoirs {
    evalue(etat) {
        let total = 0;
        for (let i = 0; i < etat.grille.length; i++)
            for (let j = (i % 2 === 0) ? 0 : 1; j < etat.grille.length; j += 2)
                switch (etat.grille[i][j]) {
                    case PION_BLANC:
                        total -= (VALEUR_PION - etat.distancePionLigneFondAdverse(i, j));
                        break;
                    case PION_NOIR:
                        total += (VALEUR_PION - etat.distancePionLigneFondAdverse(i, j));
                }
        return total + (etat.nombreDamesNoirs - etat.nombreDamesBlancs) * VALEUR_DAME;
    }

    gagne(etat,actions) {
        return etat.joueurAGagne(NOIR,actions);
    }
}
