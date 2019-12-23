"use strict";
import {Action} from "./Action";
import {Case} from "./Case";

export class Mouvement extends Action {

    constructor(l1, c1, l2, c2) {
        super(l1, c1);
        this.caseArrivee = new Case(l2, c2);
    }

    ligneArrivee() {
        return this.caseArrivee.ligne;
    }

    colonneArrivee() {
        return this.caseArrivee.colonne;
    }

}
