"use strict";
import {Prise, Mouvement, Case} from "./Action.js";
import {
    CASE_VIDE,
    PION_BLANC,
    PION_NOIR,
    DAME_BLANC,
    DAME_NOIR,
    NUL,
    VICTOIRE_BLANC,
    VICTOIRE_NOIR,
    BLANC
} from "./Constantes.js";

const HAUT_GAUCHE = 1, HAUT_DROIT = 2, BAS_DROIT = 3, BAS_GAUCHE = 4, HAUT = -1, GAUCHE = -1, BAS = 1, DROITE = 1;

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
    constructor(damier) {
        if (damier !== undefined) {
            this.grille = damier.grille.slice(0, 10);
            this.tourBlanc = damier.tourBlanc;
            this.nombrePionsBlancs = damier.nombrePionsBlancs;
            this.nombreDamesBlancs = damier.nombreDamesBlancs;
            this.nombrePionsNoirs = damier.nombrePionsNoirs;
            this.nombreDamesNoirs = damier.nombreDamesNoirs;
        } else {
            this.grille = DAMIER_TAILLE_10.slice(0, 10);
            this.nombrePionsBlancs = this.nombrePionsNoirs = 20;
            this.nombreDamesBlancs = this.nombreDamesNoirs = 0;
            this.tourBlanc = BLANC;
            this.actionsPossibles = [];
        }
    }

    /*
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

    prendre(l1, c1, l2, c2) {
        this.deplacer1Case(l1, c1, l2, c2);
        let l3,c3;
        if (Math.abs(this.grille[l2][c2]) === 2) {
            let pos = this.positionRelative(l1, c1, l2, c2);
            l3 = this.getLigneVoisine(l1, pos), c3 = this.getColonneVoisine(c1, pos);
            for (; !this.pionsAdverses(l2, c2, l3, c3); l3 = this.getLigneVoisine(l3, pos), c3 = this.getColonneVoisine(c3, pos)) {
            }
        } else
            l3=l1 > l2 ? l1 - 1 : l1 + 1,c3=c1 > c2 ? c1 - 1 : c1 + 1;
        switch (this.grille[l3][c3]) {
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
        }
        this.grille[l3][c3] = CASE_VIDE;
    }

    pionsAdverses(l1, c1, l2, c2) {
        return (this.grille[l1][c1] > 0 && this.grille[l2][c2] < 0) || (this.grille[l1][c1] < 0 && this.grille[l2][c2] > 0);
    }

    pionAppartientAJoueur(ligne, colonne, joueurBlanc) {
        return (joueurBlanc && this.grille[ligne][colonne] < 0) || (!joueurBlanc && this.grille[ligne][colonne] > 0);
    }

    pionAdverseEntreCases(caseDepart, caseArrivee) {
        let pos = this.positionRelative(caseDepart, caseArrivee);
        let l = this.getLigneVoisine(caseDepart.ligne, HAUT_GAUCHE),
            c = this.getColonneVoisine(caseDepart.colonne, HAUT_GAUCHE),
            pion = this.grille[caseDepart.ligne][caseDepart.colonne];
        for (; l != caseArrivee.ligne && c != caseArrivee.colonne; l = this.getLigneVoisine(l, pos), c = this.getColonneVoisine(c, pos))
            if (this.caseOccupeeParAdversaire(pion, l, c))
                return true;
        return false;
    }

    casesAccessiblesDepuis(l, c) {
        let cases = [];
        /*let l = caze.ligne, c = caze.colonne;
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
        });*/
        switch (this.grille[l][c]) {
            case DAME_NOIR:
            case DAME_BLANC:
                cases.push(...this.casesAccessiblesDame(l, c));
                break;
            case PION_NOIR:
            case PION_BLANC:
                cases.push(...this.casesAccessiblesPion(l, c));
        }
        return cases;
    }

    casesAccessiblesPion(l, c) {
        let cases = [];
        const couleur = this.grille[l][c] < 0;
        for (let pos = couleur ? HAUT_GAUCHE : BAS_DROIT; pos <= couleur ? HAUT_DROIT : BAS_GAUCHE; pos++) {
            let l2 = this.getLigneVoisine(l, pos), c2 = this.getColonneVoisine(c, pos);
            if (l2 >= 0 && l2 <= 9 && c2 >= 0 && c2 <= 9 && this.grille[l2][c2] === CASE_VIDE)
                cases.push(new Case(l2, c2));
        }
        for (let pos = HAUT_GAUCHE; pos <= BAS_GAUCHE; pos++) {
            let l2 = this.getLigneVoisine(l, pos), c2 = this.getColonneVoisine(c, pos);
            if (l2 >= 0 && l2 <= 9 && c2 >= 0 && c2 <= 9) {
                switch (this.grille[l2][c2]) {
                    case PION_BLANC:
                    case DAME_BLANC:
                        if (!couleur) {
                            let l3 = this.getLigneVoisine(l2, pos), c3 = this.getColonneVoisine(c2, pos);
                            if (this.grille[l3][c3] === CASE_VIDE)
                                cases.push(new Case(l3, c3));
                        }
                        break;
                    case PION_NOIR:
                    case DAME_NOIR:
                        if (couleur) {
                            let l3 = this.getLigneVoisine(l2, pos), c3 = this.getColonneVoisine(c2, pos);
                            if (this.grille[l3][c3] === CASE_VIDE)
                                cases.push(new Case(l3, c3));
                        }
                }
            }
        }
        return cases;
    }

    casesAccessiblesDame(l, c) {
        let cases = [];
        for (let pos = HAUT_GAUCHE; pos <= BAS_GAUCHE; pos++) {
            let l2 = this.getLigneVoisine(l, pos), c2 = this.getColonneVoisine(c, pos);
            while (l2 >= 0 && l2 <= 9 && c2 >= 0 && c2 <= 9 && this.grille[l2][c2] === CASE_VIDE) {
                cases.push(new Case(l2, c2));
                l2 = this.getLigneVoisine(l2, pos);
                c2 = this.getColonneVoisine(c2, pos);
            }
            if (l2 >= 0 && l2 <= 9 && c2 >= 0 && c2 <= 9) {
                switch (this.grille[l][c]) {
                    case DAME_NOIR:
                        switch (this.grille[l2][c2]) {
                            case PION_BLANC:
                            case DAME_BLANC:
                                cases.push(...this.casesVidesApresPriseDame(l2, c2, pos));
                        }
                        break;
                    case DAME_BLANC:
                        switch (this.grille[l2][c2]) {
                            case PION_NOIR:
                            case DAME_NOIR:
                                cases.push(...this.casesVidesApresPriseDame(l2, c2, pos));
                        }
                        break;
                }
            }
        }
        return cases;
    }

    casesVidesApresPriseDame(l, c, pos) {
        let cases = [];
        let l2 = this.getLigneVoisine(l2, pos), c2 = this.getColonneVoisine(c2, pos);
        while (this.grille[l2][c2] === CASE_VIDE) {
            cases.push(new Case(l2, c2));
            l2 = this.getLigneVoisine(l2, pos);
            c2 = this.getColonneVoisine(c2, pos);
        }
        return cases;
    }

    deplacer1Case(l1, c1, l2, c2) {
        if ((this.grille[l1][c1] === PION_BLANC && l2 === 0)) {
            this.grille[l2][c2] = DAME_BLANC;
        } else if (this.grille[l1][c1] === PION_NOIR && l2 === this.grille.length - 1) {
            this.grille[l2][c2] = DAME_NOIR;
        } else {
            this.grille[l2][c2] = this.grille[l1][c1];
        }
        this.grille[l1][c1] = CASE_VIDE;
    }

    positionRelative(l1, c1, l2, c2) {
        if (l2 - l1 <= HAUT) {
            if (c2 - c1 <= GAUCHE) {
                return HAUT_GAUCHE;
            } else return HAUT_DROIT;
        } else {
            if (c2 - c1 <= GAUCHE) {
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
            return VICTOIRE_BLANC;
        else if (this.nombrePionsBlancs + this.nombreDamesBlancs === 0)
            return VICTOIRE_NOIR;
        else {
            if (this.actionsPossibles != null && this.actionsPossibles.length === 0) {
                this.tourBlanc = !this.tourBlanc;
                this.genereActionsPossibles();
                if (this.actionsPossibles != null && this.actionsPossibles.length === 0)
                    return NUL;
                if (this.tourBlanc)
                    return VICTOIRE_BLANC;
                return VICTOIRE_NOIR;
            }
        }
        return NUL;
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
        if (this.tourBlanc === BLANC) {
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
        if (this.tourBlanc === BLANC) {
            for (let i = 0; i < this.grille.length; i++)
                for (let j = (i % 2 === 0) ? 0 : 1; j < this.grille.length; j = j + 2)
                    if (this.grille[i][j] === PION_BLANC || this.grille[i][j] === DAME_BLANC)
                        this.prisesPion(i, j);
        } else
            for (let i = 0; i < this.grille.length; i++)
                for (let j = (i % 2 === 0) ? 0 : 1; j < this.grille.length; j = j + 2)
                    if (this.grille[i][j] === PION_NOIR || this.grille[i][j] === DAME_NOIR)
                        this.prisesPion(i, j);
        this.triePrisesDames();
    }

    /* Génère toutes les prises possibles d'un pion. */
    prisesPion(ligne, colonne) {
        let prisesEnCours = [], prisesEtendues = [];
        prisesEnCours.push(new Prise(ligne, colonne, Math.abs(this.grille[ligne][colonne]) === 2));
        do {
            let p = prisesEnCours.shift();
            prisesEnCours.push(...this.etendrePrise(p));
            prisesEtendues.push(p);
        } while (prisesEnCours.length > 0);
        prisesEtendues.shift();
        this.actionsPossibles.push(...prisesEtendues);
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
                    prises.push(Prise.prise(p, this.getLigneVoisine(ligne, position), this.getColonneVoisine(col, position)));
            }
        }
        return prises;
    }

    triePrisesDames() {
        let prises = [];
        this.actionsPossibles.forEach(p => {
            if (p.dame)
                prises.push(p)
        });
        for (let i = 0; i < prises.length; i++) {
            for (let j = prises.length - 1; j >i; j--) {
                let p1 = prises[i], p2 = prises[j];
                if (p1.prendMemePionsMemeOrdre(p2))
                    this.actionsPossibles.filter(p3 => p3 != p2);
            }
        }
    }

    caseOccupeeParAdversaire(pion, ligneCase, colCase) {
        let pionCase = this.grille[ligneCase][colCase];
        return (pion < 0 && pionCase > 0) || (pion > 0 && pionCase < 0);
    }

    caseApresSautLibreOuContientPionPreneur(p, l, c, pos) {
        const ligne = this.getLigneVoisine(l, pos), col = this.getColonneVoisine(c, pos);
        if (ligne < 0 || ligne >= this.grille.length || col < 0 || col >= this.grille.length)
            return false;
        return this.grille[ligne][col] === 0 || (ligne === p.ligneDepart() && col === p.colonneDepart());
    }

    static casesSuivent(l1, c1, l2, c2, l3, c3) {
        return ((l1 === l2 + 1 && l2 === l3 + 1) || (l1 === l2 - 1 && l2 === l3 - 1))
            && ((c1 === c2 + 1 && c2 === c3 + 1) || (c1 === c2 - 1 && c2 === c3 - 1));
    }

    peutEtendrePrise(p, positionCase) {
        return this.contientPionAdverse(this.grille[p.ligneDepart()][p.colonneDepart()], p.ligneArrivee(), p.colonneArrivee(),
            positionCase) && this.caseApresSautLibreOuContientPionPreneur(p, this.getLigneVoisine(p.ligneArrivee(), positionCase), this.getColonneVoisine(p.colonneArrivee(), positionCase), positionCase);
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
