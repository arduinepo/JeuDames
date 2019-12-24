"use strict";
import {Prise, Mouvement} from "./Action";

const CASE_VIDE = 0, PION_BLANC = -1, DAME_BLANC = -2, PION_NOIR = 1, DAME_NOIR = 2;
const HAUT_GAUCHE = 1, HAUT_DROIT = 2, BAS_DROIT = 3, BAS_GAUCHE = 4, HAUT = -1, GAUCHE = -1, BAS = 1, DROITE = 1;

export const RESULTATS = {
    NUL: 0,
    VICTOIRE_BLANC: -1,
    VICTOIRE_NOIR: 1
};

const DAMIER_TAILLE_10 = [
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [-1, 0, -1, 0, -1, 0, -1, 0, -1, 0],
    [0, -1, 0, -1, 0, -1, 0, -1, 0, -1],
    [-1, 0, -1, 0, -1, 0, -1, 0, -1, 0],
    [0, -1, 0, -1, 0, -1, 0, -1, 0, -1]
];

export class Damier {
    constructor() {
        this.grille = DAMIER_TAILLE_10.slice(0, 10);
        this.nombrePionsBlancs = this.nombrePionsNoirs = 20;
        this.nombreDamesBlancs = this.nombreDamesNoirs = 0;
        this.tourBlanc = true;
        this.actionsPossibles = [];
    }

    /*
    refaire prises plus simplement
    partie, joueurs, IA,


    clic premiere case :
     si voisine et vide : si deplacement possible, deplacer;FIN
     si arrivee derriere pion adverse :
     demande si prise possible, si oui prend ; si prise encore possible depuis case courante, continue;
     si voisine et adversaire : si 1 case vide à l'arrivee, prend; si dame et plusieurs case vides, RIEN

     si accessible :
     - si arrivee apres pris :
     - sinon

    - renvoyer cases accessibles depuis position initiale, depuis position courant après première prise
    - renvoyer dernier mouvement
    */

    pionAppartientAjoueur(ligne,colonne,joueurBlanc){
        return (joueurBlanc && this.grille[ligne][colonne]<0)||(!joueurBlanc && this.grille[ligne][colonne]>0);
    }

    pionAdverseEntreCases(caseDepart, caseArrivee) {
        let pos = this.positionRelative(caseDepart, caseArrivee);
        let l = this.getLigneVoisine(caseDepart.ligne, HAUT_GAUCHE),
            c = this.getColonneVoisine(caseDepart.colonne, HAUT_GAUCHE),
            pion = this.grille[caseDepart.ligne][caseDepart.colonne];
        for (; l != caseArrivee.ligne && c != caseArrivee.colonne; l = this.getLigneVoisine(caseDepart.ligne, pos), c = this.getColonneVoisine(caseDepart.colonne, pos))
            if (this.caseOccupeeParAdversaire(pion, caseArrivee.ligne, caseArrivee.colonne))
                return true;
        return false;
    }

    casesAccessiblesDepuis(caze) {
        let cases = [];
        let l = caze.ligne, c = caze.colonne;
        this.actionsPossibles.forEach((action) => {
            if (action.caseDepart === caze) {
                if (action instanceof Mouvement)
                    cases.push(action.caseArrivee);
                else {
                    if (action.dame)
                        cases.push(action.cases[1]);
                    else cases.push(action.cases[0]);
                }
            }
        });
        /*switch (this.grille[l][c]) {
            case DAME_NOIR:
                for (let pos = HAUT_GAUCHE; pos <= BAS_GAUCHE; pos++) {
                    let l2 = this.getLigneVoisine(l, pos), c2 = this.getColonneVoisine(c, pos);
                    while (l2 >= 0 && l2 <= 9 && c2 >= 0 && c2 <= 9 && this.grille[l2][c2] === CASE_VIDE) {
                        cases.push(new Case(l2, c2));
                        l2 = this.getLigneVoisine(l2, pos);
                        c2 = this.getColonneVoisine(c2, pos);
                    }
                    if (l2 >= 0 && l2 <= 9 && c2 >= 0 && c2 <= 9) {
                        switch (this.grille[l2][c2]) {
                            case PION_BLANC:
                            case DAME_BLANC:
                                l2 = this.getLigneVoisine(l2, pos);
                                c2 = this.getColonneVoisine(c2, pos);
                                while (this.grille[l2][c2] === CASE_VIDE) {
                                    cases.push(new Case(l2, c2));
                                    l2 = this.getLigneVoisine(l2, pos);
                                    c2 = this.getColonneVoisine(c2, pos);
                                }
                                break;
                        }
                    }
                }
                break;
            case DAME_BLANC:
                for (let pos = HAUT_GAUCHE; pos <= BAS_GAUCHE; pos++) {
                    let l2 = this.getLigneVoisine(l, pos), c2 = this.getColonneVoisine(c, pos);
                    while (l2 >= 0 && l2 <= 9 && c2 >= 0 && c2 <= 9 && this.grille[l2][c2] === CASE_VIDE) {
                        cases.push(new Case(l2, c2));
                        l2 = this.getLigneVoisine(l2, pos);
                        c2 = this.getColonneVoisine(c2, pos);
                    }
                    if (l2 >= 0 && l2 <= 9 && c2 >= 0 && c2 <= 9) {
                        switch (this.grille[l2][c2]) {
                            case PION_NOIR:
                            case DAME_NOIR:
                                l2 = this.getLigneVoisine(l2, pos);
                                c2 = this.getColonneVoisine(c2, pos);
                                while (this.grille[l2][c2] === CASE_VIDE) {
                                    cases.push(new Case(l2, c2));
                                    l2 = this.getLigneVoisine(l2, pos);
                                    c2 = this.getColonneVoisine(c2, pos);
                                }
                                break;
                        }
                    }
                }
                break;
            case PION_NOIR:
                for (let pos = BAS_DROIT; pos <= BAS_GAUCHE; pos++) {
                    let l2 = this.getLigneVoisine(l, pos), c2 = this.getColonneVoisine(c, pos);
                    if (l2 >= 0 && l2 <= 9 && c2 >= 0 && c2 <= 9) {
                        switch (this.grille[l2][c2]) {
                            case CASE_VIDE:
                                cases.push(new Case(l2, c2));
                                break;
                            case PION_BLANC:
                            case DAME_BLANC:
                                let l3 = this.getLigneVoisine(l2, pos), c3 = this.getColonneVoisine(c2, pos);
                                if (this.grille[l3][c3] === CASE_VIDE)
                                    cases.push(new Case(l3, c3));
                        }
                    }
                }
                break;
            case PION_BLANC:
                for (let pos = HAUT_GAUCHE; pos <= HAUT_DROIT; pos++) {
                    let l2 = this.getLigneVoisine(l, pos), c2 = this.getColonneVoisine(c, pos);
                    if (l2 >= 0 && l2 <= 9 && c2 >= 0 && c2 <= 9) {
                        switch (this.grille[l2][c2]) {
                            case CASE_VIDE:
                                cases.push(new Case(l2, c2));
                                break;
                            case PION_NOIR:
                            case DAME_NOIR:
                                let l3 = this.getLigneVoisine(l2, pos), c3 = this.getColonneVoisine(c2, pos);
                                if (this.grille[l3][c3] === CASE_VIDE)
                                    cases.push(new Case(l3, c3));
                        }
                    }
                }
        }*/
        return cases;
    }

    prendre1Pion(casePion, casePionAdverse) {
        this.grille[casePionAdverse.ligne][casePionAdverse.colonne] = 0;
        const pos = this.positionRelative(casePion, casePionAdverse);
        this.grille[this.getLigneVoisine(casePionAdverse.ligne, pos)]
            [this.getColonneVoisine(casePionAdverse.colonne, pos)] = this.grille[casePion.ligne][casePion.colonne];
        this.grille[casePion.ligne][casePion.colonne] = 0;
    }

    deplacer1Case(casePion, caseArrivee) {
        if ((casePion === PION_BLANC && caseArrivee.ligne === 0)) {
            this.grille[caseArrivee.ligne][caseArrivee.colonne] = DAME_BLANC;
        } else if (casePion === PION_NOIR && caseArrivee.ligne === this.grille.length - 1) {
            this.grille[caseArrivee.ligne][caseArrivee.colonne] = DAME_NOIR;
        } else {
            this.grille[caseArrivee.ligne][caseArrivee.colonne] = this.grille[casePion.ligne][casePion.colonne];
        }
        this.grille[casePion.ligne][casePion.colonne] = 0;
    }

    positionRelative(case1, case2) {
        if (case2.ligne - case1.ligne <= HAUT) {
            if (case2.colonne - case2.colonne <= GAUCHE) {
                return HAUT_GAUCHE;
            } else return HAUT_DROIT;
        } else {
            if (case2.colonne - case2.colonne <= GAUCHE) {
                return BAS_GAUCHE;
            } else return BAS_DROIT;
        }
    }

    toString() {
        let s = "";
        for (let i = 0; i < this.grille.length; i++) {
            for (let j = 0; j < this.grille.length; j++) {
                switch (this.grille[i][j]) {
                    case (DAME_BLANC):
                        s += " B ";
                        break;
                    case (PION_BLANC):
                        s += " b ";
                        break;
                    case (CASE_VIDE):
                        s += " - ";
                        break;
                    case (PION_NOIR):
                        s += " n ";
                        break;
                    case (DAME_NOIR):
                        s += " N ";
                        break;
                }
            }
            s += "\n";
        }
        return s;
    }

    nombrePionsJoueur(blancs) {
        return blancs ? this.nombrePionsBlancs + this.nombreDamesBlancs : this.nombrePionsNoirs + this.nombreDamesNoirs;
    }

    resultat() {
        if (this.nombrePionsNoirs + this.nombreDamesNoirs === 0)
            return RESULTATS.VICTOIRE_BLANC;
        else if (this.nombrePionsBlancs + this.nombreDamesBlancs === 0)
            return RESULTATS.VICTOIRE_NOIR;
        else {
            if (this.actionsPossibles != null && this.actionsPossibles.length === 0) {
                this.tourBlanc = !this.tourBlanc;
                this.genereActionsPossibles();
                if (this.actionsPossibles != null && this.actionsPossibles.length === 0)
                    return RESULTATS.NUL;
                if (this.tourBlanc)
                    return RESULTATS.VICTOIRE_BLANC;
                return RESULTATS.VICTOIRE_NOIR;
            }
        }
        return RESULTATS.NUL;
    }

    partieFinie() {
        return (this.nombrePionsBlancs === 0 && this.nombreDamesBlancs === 0) || (this.nombrePionsNoirs === 0 && this.nombreDamesNoirs === 0)
            || (this.actionsPossibles != null && this.actionsPossibles.length === 0);
    }

    joueurAGagne(joueurBlanc) {
        return (joueurBlanc ? (this.nombrePionsNoirs === 0 && this.nombreDamesNoirs === 0)
            : (this.nombrePionsBlancs === 0 && this.nombreDamesBlancs === 0))
            || (joueurBlanc !== this.tourBlanc && this.actionsPossibles.length === 0);
    }

    /*Génère toutes les actions, mouvements et prises, possibles dans la configuration courante, suivant le tour des joueurs.*/
    genereActionsPossibles() {
        this.actionsPossibles = [];
        this.prises();
        this.mouvementsPossibles();
    }

    prisePossible() {
        return this.actionsPossibles.length > 0 && this.actionsPossibles[0] instanceof Prise;
    }

    prisePossibleDepuis(l, c) {
        this.actionsPossibles.forEach(p => {
            if (l === p.ligneDepart && c === p.colonneDepart)
                return true;
        });
        return false;
    }

    realiserAction(a) {
        let promotion;
        if (a instanceof Prise)
            promotion = this.prendre(a);
        else
            promotion = this.deplacer(a);
        if (promotion)
            this.ennoblir(a.ligneArrivee(), a.colonneArrivee());
        this.tourBlanc = !this.tourBlanc;
    }

    deplacer(m) {
        this.grille[m.ligneArrivee()][m.colonneArrivee()] = this.grille[m.ligneDepart][m.colonneDepart];
        this.grille[m.ligneDepart][m.colonneDepart] = 0;
        return (m.ligneArrivee() === this.grille.length - 1 && this.grille[m.ligneArrivee()][m.colonneArrivee()] === 1)
            || (m.ligneArrivee() === 0 && this.grille[m.ligneArrivee()][m.colonneArrivee()] === -1);
    }

    deplacementPossibleDepuis(l, c) {
        switch (this.grille[l][c]) {
            case (PION_NOIR):
                for (let pos = BAS_DROIT; pos <= BAS_GAUCHE; pos++) {
                    let l2 = this.getLigneVoisine(l, pos), c2 = this.getColonneVoisine(c, pos);
                    if (l2 >= 0 && l2 < this.grille.length && c2 >= 0 && c2 < this.grille.length && this.grille[l2][c2] === 0)
                        return true;
                }
                break;
            case (PION_BLANC):
                for (let pos = HAUT_GAUCHE; pos <= HAUT_DROIT; pos++) {
                    let l2 = this.getLigneVoisine(l, pos), c2 = this.getColonneVoisine(c, pos);
                    if (l2 >= 0 && l2 < this.grille.length && c2 >= 0 && c2 < this.grille.length && this.grille[l2][c2] === 0)
                        return true;
                }
                break;
            case (DAME_NOIR):
            case (DAME_BLANC):
                for (let pos = HAUT_GAUCHE; pos <= BAS_GAUCHE; pos++) {
                    let l2 = this.getLigneVoisine(l, pos), c2 = this.getColonneVoisine(c, pos);
                    if (l2 >= 0 && l2 < this.grille.length && c2 >= 0 && c2 < this.grille.length && this.grille[l2][c2] === 0)
                        return true;
                }
                break;
        }
        return false;
    }

    distancePionLigneFondAdverse(i, j) {
        return this.grille[i][j] < 0 ? i : this.grille.length - i - 1;
    }

    prendre(p) {
        let c = null;
        if (p.dame) {
            for (let i = 0; i < p.cases.length; i += 2) {
                c = p.cases[i];
                switch (this.grille[c.ligne][c.colonne]) {
                    case (PION_BLANC):
                        this.nombrePionsBlancs--;
                        break;
                    case (DAME_BLANC):
                        this.nombreDamesBlancs--;
                        break;
                    case (PION_NOIR):
                        this.nombrePionsNoirs--;
                        break;
                    case (DAME_NOIR):
                        this.nombreDamesNoirs--;
                        break;
                }
                this.grille[c.ligne][c.colonne] = 0;
            }
            this.grille[c.ligne][c.colonne] = this.grille[p.ligneDepart()][p.colonneDepart()];
            this.grille[p.ligneDepart()][p.colonneDepart()] = 0;
        } else {
            let casePrec = p.caseDepart;
            for (let i = 0; i < p.cases.length; i++) {
                c = p.cases[i];
                let lignePion = casePrec.ligne > c.ligne ? casePrec.ligne - 1 : c.ligne - 1,
                    colPion = casePrec.colonne > c.colonne ? casePrec.colonne - 1 : c.colonne - 1;
                switch (this.grille[lignePion][colPion]) {
                    case (PION_BLANC):
                        this.nombrePionsBlancs--;
                        break;
                    case (DAME_BLANC):
                        this.nombreDamesBlancs--;
                        break;
                    case (PION_NOIR):
                        this.nombrePionsNoirs--;
                        break;
                    case (DAME_NOIR):
                        this.nombreDamesNoirs--;
                        break;
                }
                this.grille[lignePion][colPion] = 0;
                casePrec = c;
            }
            this.grille[c.ligne][c.colonne] = this.grille[p.ligneDepart()][p.colonneDepart()];
            this.grille[p.ligneDepart()][p.colonneDepart()] = 0;
        }
        return (c.ligne === this.grille.length - 1 && this.grille[c.ligne][c.colonne] === PION_NOIR) ||
            (c.ligne === 0 && this.grille[c.ligne][c.colonne] === PION_BLANC);
    }

    ennoblir(l, c) {
        if (this.grille[l][c] === PION_BLANC) {
            this.grille[l][c] = DAME_BLANC;
            this.nombrePionsBlancs--;
            this.nombreDamesBlancs++;
        } else {
            this.grille[l][c] = DAME_NOIR;
            this.nombrePionsNoirs--;
            this.nombreDamesNoirs++;
        }
    }

    /*Génère tous les mouvements possibles dans le configuration courante suivant le tour des joueurs :
    * parcourt les cases voisines immédiates des pions simples, et les cases situées sur les diagonales des dames.
    */
    mouvementsPossibles() {
        if (this.tourBlanc) {
            for (let i = 0; i < this.grille.length; i++)
                for (let j = (i % 2 === 0) ? 0 : 1; j < this.grille.length; j = j + 2)
                    if (this.grille[i][j] === PION_BLANC)
                        for (let pos = HAUT_GAUCHE; pos <= HAUT_DROIT; pos++) {
                            let l = this.getLigneVoisine(i, pos), c = this.getColonneVoisine(j, pos);
                            if (l >= 0 && l < this.grille.length && c >= 0 && c < this.grille.length && this.grille[l][c] === CASE_VIDE)
                                this.actionsPossibles.push(new Mouvement(i, j, l, c));
                        }
                    else if (this.grille[i][j] === DAME_BLANC)
                        for (let pos = HAUT_GAUCHE; pos <= BAS_GAUCHE; pos++) {
                            let ligne = this.getLigneVoisine(i, pos), col = this.getColonneVoisine(j, pos);
                            while (ligne >= 0 && ligne < this.grille.length && col >= 0 && col < this.grille.length
                            && this.grille[ligne][col] === CASE_VIDE) {
                                this.actionsPossibles.push(new Mouvement(i, j, ligne, col));
                                ligne = this.getLigneVoisine(ligne, pos);
                                col = this.getColonneVoisine(col, pos);
                            }
                        }
        } else
            for (let i = 0; i < this.grille.length; i++)
                for (let j = (i % 2 === 0) ? 0 : 1; j < this.grille.length; j = j + 2)
                    if (this.grille[i][j] === PION_NOIR)
                        for (let pos = BAS_GAUCHE; pos <= BAS_DROIT; pos++) {
                            let l = this.getLigneVoisine(i, pos), c = this.getColonneVoisine(j, pos);
                            if (l >= 0 && l < this.grille.length && c >= 0 && c < this.grille.length && this.grille[l][c] === CASE_VIDE)
                                this.actionsPossibles.push(new Mouvement(i, j, l, c));
                        }
                    else if (this.grille[i][j] === DAME_NOIR)
                        for (let pos = HAUT_GAUCHE; pos <= BAS_GAUCHE; pos++) {
                            let ligne = this.getLigneVoisine(i, pos), col = this.getColonneVoisine(j, pos);
                            while (ligne >= 0 && ligne < this.grille.length && col >= 0 && col < this.grille.length
                            && this.grille[ligne][col] === CASE_VIDE) {
                                this.actionsPossibles.push(new Mouvement(i, j, ligne, col));
                                ligne = this.getLigneVoisine(ligne, pos);
                                col = this.getColonneVoisine(col, pos);
                            }
                        }
    }

    getLigneVoisine(ligne, position) {
        switch (position) {
            case (HAUT_GAUCHE):
            case (HAUT_DROIT):
                return ligne + HAUT;
            case (BAS_DROIT):
            case (BAS_GAUCHE):
                return ligne + BAS;
        }
    }

    getColonneVoisine(col, position) {
        switch (position) {
            case (HAUT_GAUCHE):
            case (BAS_GAUCHE):
                return col + GAUCHE;
            case (HAUT_DROIT):
            case (BAS_DROIT):
                return col + DROITE;
        }
    }

    /* Génère toutes les prises possibles de tous les pions du joueur qui a le tour. */
    prises() {
        if (this.tourBlanc) {
            for (let i = 0; i < this.grille.length; i++)
                for (let j = (i % 2 === 0) ? 0 : 1; j < this.grille.length; j = j + 2)
                    if (this.grille[i][j] === PION_BLANC || this.grille[i][j] === DAME_BLANC)
                        this.prisesPion(i, j);
        } else
            for (let i = 0; i < this.grille.length; i++)
                for (let j = (i % 2 === 0) ? 0 : 1; j < this.grille.length; j = j + 2)
                    if (this.grille[i][j] === PION_NOIR || this.grille[i][j] === DAME_NOIR)
                        this.prisesPion(i, j);
    }

    /* Génère toutes les prises possibles d'un pion. */
    prisesPion(ligne, colonne) {
        let prisesEnCours, prisesEtendues = [];
        let n;
        let prisesPion = [];
        prisesPion.push(new Prise(ligne, colonne, Math.abs(this.grille[ligne][colonne]) === 2));
        do {
            prisesEnCours = [];
            prisesPion.forEach(function (p) {
                if (prisesEnCours.push(this.etendrePrise(p)))
                    prisesEtendues.push(p);
            });
            prisesPion.filter(p => !prisesEtendues.some(p2 => p2 === p));
        } while (prisesPion.length < prisesPion.push(prisesEnCours));
        prisesPion.push(prisesEtendues);
        prisesPion.forEach(p => {
            if (p.nombrePionsPris() >= 1)
                this.actionsPossibles.push(p)
        });
        prisesPion.pop();
    }

    etendrePrise(p) {
        let prises = [];
        let ligneArrivee = p.ligneArrivee(), colArrivee = p.colonneArrivee();
        if (p.dame) {
            for (let position = HAUT_GAUCHE; position <= BAS_GAUCHE; position++) {
                let premierPionNonRencontre = true, secondPionNonRencontre = true;
                let priseD = null;
                for (let ligne = this.getLigneVoisine(ligneArrivee, position), col = this.getColonneVoisine(colArrivee,
                    position); ligne >= 0 && ligne < this.grille.length && col >= 0 && col < this.grille.length
                     && secondPionNonRencontre; ligne = this.getLigneVoisine(ligne,
                    position), col = this.getColonneVoisine(col, position)) {
                    if (this.grille[ligne][col] !== 0) {
                        if (premierPionNonRencontre) {
                            premierPionNonRencontre = false;
                            if (this.caseOccupeeParAdversaire(this.grille[p.ligneDepart][p.colonneDepart], ligne, col)
                                && this.caseApresSautLibreOuContientPionPreneur(p, ligne, col, position)
                                && !p.pionVirtuellementPris(ligne, col))
                                priseD = Prise.Prise(p, ligne, col);
                            else
                                secondPionNonRencontre = false;
                        } else
                            secondPionNonRencontre = false;
                    } else if (!premierPionNonRencontre && priseD != null)
                        prises.push(Prise.Prise(priseD, ligne, col));
                }
            }
        } else {
            for (let position = HAUT_GAUCHE; position <= BAS_GAUCHE; position++) {
                let ligne = this.getLigneVoisine(ligneArrivee, position);
                let col = this.getColonneVoisine(colArrivee, position);
                if (this.peutEtendrePrise(p, position) && !p.pionVirtuellementPris(ligne, col))
                    prises.push(Prise.Prise(p, this.getLigneVoisine(ligne, position), this.getColonneVoisine(col, position)));
            }
        }
        return prises;
    }

    /*    triePrisesDames() {
            let l: Prise[] = [];
            this.actionsPossibles.forEach(p => {
                if ((<Prise>p).dame)
                    l.push(<Prise>p)
            });
            l.forEach(p => {
                l.slice().reverse().forEach(p2 => {
                    if (p2===p)
                        break;
                    if (p.prendMemePionsDifferentOrdre(p2) && p.ligneDepart == p2.ligneDepart
                        && p.colonneDepart == p2.colonneDepart)
                        this.actionsPossibles.filter(p3 => p3!=p2);
                });
            });
        }*/

    caseOccupeeParAdversaire(pion, ligneCase, colCase) {
        let pionCase = this.grille[ligneCase][colCase];
        return (pion < 0 && pionCase > 0) || (pion > 0 && pionCase < 0);
    }

    caseApresSautLibreOuContientPionPreneur(p, n) {
        if (n.length === 3) {
            let ligne = this.getLigneVoisine(n[0], n[2]), col = this.getColonneVoisine(n[1], n[2]);
            if (ligne < 0 || ligne >= this.grille.length || col < 0 || col >= this.grille.length)
                return false;
            let pion = this.grille[ligne][col];
            return pion === 0 || (ligne === p.ligneDepart && col === p.colonneDepart);
        } else {
            let l = this.getLigneVoisine(this.getLigneVoisine(p.ligneArrivee(), n[0]), n[0]),
                c = this.getColonneVoisine(this.getColonneVoisine(p.colonneArrivee(), n[0]), n[0]);
            if (l < 0 || l >= this.grille.length || c < 0 || c >= this.grille.length)
                return false;
            let pion = this.grille[l][c];
            return pion === 0 || (l === p.ligneDepart && c === p.colonneDepart);
        }
    }

    static casesSuivent(l1, c1, l2, c2, l3, c3) {
        return ((l1 === l2 + 1 && l2 === l3 + 1) || (l1 === l2 - 1 && l2 === l3 - 1))
            && ((c1 === c2 + 1 && c2 === c3 + 1) || (c1 === c2 - 1 && c2 === c3 - 1));
    }

    peutEtendrePrise(p, positionCase) {
        return this.contientPionAdverse(this.grille[p.ligneDepart][p.colonneDepart], p.ligneArrivee(), p.colonneArrivee(),
            positionCase) && this.caseApresSautLibreOuContientPionPreneur(p, positionCase);
    }

    contientPionAdverse(pion, ligne, col, position) {
        switch (position) {
            case (HAUT_GAUCHE):
                return ligne + HAUT >= 0 && col + GAUCHE >= 0 && ((pion > 0 && this.grille[ligne + HAUT][col + GAUCHE] < 0)
                    || (pion < 0 && this.grille[ligne + HAUT][col + GAUCHE] > 0));
            case (HAUT_DROIT):
                return ligne + HAUT >= 0 && col + DROITE < this.grille.length
                    && ((pion > 0 && this.grille[ligne + HAUT][col + DROITE] < 0)
                        || (pion < 0 && this.grille[ligne + HAUT][col + DROITE] > 0));
            case (BAS_DROIT):
                return ligne + BAS < this.grille.length && col + DROITE < this.grille.length
                    && ((pion > 0 && this.grille[ligne + BAS][col + DROITE] < 0)
                        || (pion < 0 && this.grille[ligne + BAS][col + DROITE] > 0));
            case (BAS_GAUCHE):
                return ligne + BAS < this.grille.length && col + GAUCHE >= 0
                    && ((pion > 0 && this.grille[ligne + BAS][col + GAUCHE] < 0)
                        || (pion < 0 && this.grille[ligne + BAS][col + GAUCHE] > 0));
        }
        return false;
    }

}
