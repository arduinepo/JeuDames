"use strict";
import {Damier} from "./Damier.js";

export class Case {
    constructor(l, c) {
        this.ligne = l;
        this.colonne = c;
    }

    equals(c) {
        return this.ligne === c.ligne && this.colonne === c.colonne;
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

    static prise(p, l, c) {
        let prise = new Prise(p.caseDepart.ligne, p.caseDepart.colonne, p.dame);
        prise.cases = p.cases.slice();
        prise.ajouteCase(l, c);
        return prise;
    }

    nombrePionsPris() {
        return this.dame ? this.cases.length / 2 : this.cases.length;
    }

    ajouteCase(l, c) {
        this.cases.push(new Case(l, c));
    }

    caseArrivee() {
        return this.cases.length > 0 ? this.cases[this.cases.length - 1] : this.caseDepart;
    }

    ligneArrivee() {
        return this.caseArrivee().ligne;
    }

    colonneArrivee() {
        return this.caseArrivee().colonne;
    }

    pionVirtuellementPris(l, c) {
        if (this.cases.length === 0)
            return false;
        if (this.dame) {
            for (let i = 0; i < this.cases.length; i += 2)
                if (l === this.cases[i].ligne && c === this.cases[i].colonne)
                    return true;
        } else {
            let caseDepart = this.caseDepart;
            for (let i = 0; i < this.cases.length; i++) {
                if (Damier.casesSuivent(caseDepart.ligne, caseDepart.colonne, l, c, this.cases[i].ligne, this.cases[i].colonne))
                    return true;
                caseDepart = this.cases[i];
            }
        }
        return false;
    }

    prendMemePionsMemeOrdre(prise) {
        if (!this.caseDepart.equals(prise.caseDepart) || this.cases.length !== prise.cases.length
            || !this.cases[this.cases.length - 1].equals(prise.cases[prise.cases.length - 1]))
            return false;
        let i = 0;
        for (; i < this.cases.length && this.cases[i].equals(prise.cases[i]); i += 2) {
        }
        return i === this.cases.length;
    }

}
