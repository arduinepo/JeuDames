"use strict";
import {Action} from "./Action";
import {Case} from "./Case";

export class Action {

    constructor(l, c) {
        this.caseDepart = new Case(l, c);
    }

    ligneDepart() {
        return this.caseDepart.ligne;
    }

    colonneDepart() {
        return this.caseDepart.colonne;
    }

}
