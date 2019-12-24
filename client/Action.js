"use strict";
import {Damier} from "./Damier";

export class Case {
    constructor(l, c) {
        this.ligne = l;
        this.colonne = c;
    }

}

class Action {
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

export class Mouvement extends Action {
    constructor(l1, c1, l2, c2) {
        super(l1, c1);
        this.caseArrivee = new Case(l2, c2);
    }

    caseArrivee() {
        return this.caseArrivee;
    }

    ligneArrivee() {
        return this.caseArrivee.ligne;
    }

    colonneArrivee() {
        return this.caseArrivee.colonne;
    }

}

export class Prise extends Action {
    constructor(l1, c1, dame) {
        super(l1, c1);
        this.cases = [];
        this.dame = dame;
    }

    static Prise(p, l, c) {
        let prise = new Prise(p.caseDepart.ligne, p.caseDepart.colonne, p.dame);
        prise.ajouteCase(l, c);
        return prise;
    }

    ajouteCase(l, c) {
        this.cases.push(new Case(l, c));
    }

    caseArrivee() {
        return this.cases[this.cases.length - 1];
    }

    ligneArrivee() {
        return this.cases[this.cases.length - 1].ligne;
    }

    colonneArrivee() {
        return this.cases[this.cases.length - 1].colonne;
    }

    pionVirtuellementPris(casePion) {
        if (this.cases.length == 0)
            return false;
        if (this.dame) {
            for (let i = 0; i < this.cases.length; i += 2)
                if (casePion == this.cases[i])
                    return true;
        } else {
            let caseDepart = this.caseDepart;
            for (let i = 0; i < this.cases.length; i++) {
                if (Damier.casesSuivent(caseDepart.ligne, caseDepart.colonne, casePion.ligne, casePion.colonne, this.cases[i].ligne, this.cases[i].colonne))
                    return true;
                caseDepart = this.cases[i];
            }
        }
        return false;
    }

}
