"use strict";
import {Damier} from "./Damier.js";

const PLUS_INFINI = Number.POSITIVE_INFINITY, MOINS_INFINI = Number.NEGATIVE_INFINITY;

class Etat extends Damier {
    constructor(damier, action) {
        super(damier);
        this.genereActionsPossibles();
        if (action !== undefined)
            this.realiserAction(action);
    }
}

export class EtatRacine extends Etat {
    constructor(damier) {
        super(damier);
        this.successeurs = [];
    }

    rechercheMeilleurCoup(profondeur, heuristique) {
        this.valeur = MOINS_INFINI;
        let alpha = MOINS_INFINI, beta = PLUS_INFINI;
        for (let i = 0; i < this.actionsPossibles.length; i++) {
            let actionCourante = this.actionsPossibles[i];
            let valeurFils = new EtatMin(this, actionCourante).rechercheMeilleurCoup(profondeur - 1, heuristique, alpha, beta);
            if (valeurFils > this.valeur) {
                this.successeurs = [];
                this.valeur = valeurFils;
            }
            if (valeurFils === this.valeur)
                this.successeurs.push(actionCourante);
            if (alpha < this.valeur)
                alpha = this.valeur;
        }
        return this.successeurs[Math.floor(Math.random() * this.successeurs.length)];
    }

}

class EtatMin extends Etat {
    rechercheMeilleurCoup(profondeur, heuristique, alpha, beta) {
        if (this.partieFinie()) {
            return heuristique.gagne(this) ? PLUS_INFINI : MOINS_INFINI;
        } else if (profondeur === 0)
            return heuristique.evalue(this);
        else {
            this.valeur = PLUS_INFINI;
            for (let i = 0; i < this.actionsPossibles.length; i++) {
                this.minimum(new EtatMax(this, this.actionsPossibles[i]).rechercheMeilleurCoup(heuristique, profondeur - 1, alpha, beta));
                if (alpha >= this.valeur)
                    return this.valeur;
                if (beta > this.valeur)
                    beta = this.valeur;
            }
            return this.valeur;
        }
    }

    minimum(valeurFils) {
        if (valeurFils < this.valeur)
            this.valeur = valeurFils;
    }

}

class EtatMax extends Etat {
    rechercheMeilleurCoup(profondeur, heuristique, alpha, beta) {
        if (this.partieFinie()) {
            return heuristique.gagne(this) ? PLUS_INFINI : MOINS_INFINI;
        } else if (profondeur === 0)
            return heuristique.evalue(this);
        else {
            this.valeur = MOINS_INFINI;
            for (let i = 0; i < this.actionsPossibles.length; i++) {
                this.maximum(new EtatMin(this, this.actionsPossibles[i]).rechercheMeilleurCoup(heuristique, profondeur - 1, alpha, beta));
                if (beta <= this.valeur)
                    return this.valeur;
                if (alpha < this.valeur)
                    alpha = this.valeur;
            }
            return this.valeur;
        }
    }

    maximum(valeurFils) {
        if (valeurFils > this.valeur)
            this.valeur = valeurFils;
    }

}