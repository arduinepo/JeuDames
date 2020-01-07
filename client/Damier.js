"use strict";
import {Prise, Mouvement, Case} from "./Action.js";
import {
    CASE_VIDE, PION_BLANC, PION_NOIR, DAME_BLANC, DAME_NOIR,
    NUL, VICTOIRE_BLANC, VICTOIRE_NOIR,
    BLANC, NOIR
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

    /* Déplace le pion situé en l1-c1, sur la case l2-c2, et prend le pion adverse situé entre ces deux cases en passant. */
    prendre1Pion(l1, c1, l2, c2) {
        this.deplacer1Case(l1, c1, l2, c2);
        let l3, c3;
        if (Math.abs(this.grille[l2][c2]) === 2) {
            let pos = this.positionRelative(l1, c1, l2, c2);
            l3 = this.getLigneVoisine(l1, pos), c3 = this.getColonneVoisine(c1, pos);
            for (; !this.pionsAdverses(l2, c2, l3, c3); l3 = this.getLigneVoisine(l3, pos), c3 = this.getColonneVoisine(c3, pos)) {
            }
        } else
            l3 = l1 > l2 ? l1 - 1 : l1 + 1, c3 = c1 > c2 ? c1 - 1 : c1 + 1;
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
<<<<<<< HEAD
        //this.tourBlanc=!this.tourBlanc;
=======
        //this.tourBlanc=!this.tourBlanc;
>>>>>>> 07f1c70f46f7d75d68175fde40d82401f4aae972
    }

    /* Déplace le pion situé en l1-c1 sur la case l2-c2, et le promeut en dame si l2 est la ligne de fond adverse du pion déplacé. */
    deplacer1Case(l1, c1, l2, c2) {
        this.grille[l2][c2] = this.grille[l1][c1];
        this.grille[l1][c1] = CASE_VIDE;
        //this.tourBlanc=!this.tourBlanc;
    }

    /* Renvoie les cases accessibles par le pion, simple ou dame, situé en l-c. */
    casesAccessiblesDepuis(l, c) {
        let cases = [];
        switch (this.grille[l][c]) {
            case DAME_NOIR:
            case DAME_BLANC:
                cases.push(...this.casesAccessiblesDame(l, c));
                break;
            case PION_NOIR:
            case PION_BLANC:
                cases.push(...this.casesAccessiblesPion(l, c));
                break;
        }
        return cases;
    }

    casesAccessiblesPourPriseDepuis(l, c) {
        let cases = [];
        switch (this.grille[l][c]) {
            case DAME_NOIR:
            case DAME_BLANC:
                cases.push(...this.casesAccessiblesPriseDame(l, c));
                break;
            case PION_NOIR:
            case PION_BLANC:
                cases.push(...this.casesAccessiblesPrisePion(l, c));
                break;
        }
        return cases;
    }

    estAccessible(l, c, cases) {
        return cases.some(caze => caze.ligne === l && caze.colonne === c);
    }

    casePionPris(l1, c1, l2, c2) {
        let pos = this.positionRelative(l1, c1, l2, c2), pion = this.grille[l1][c1];
        while (l1 >= 0 && l1 < 10 && c1 >= 0 && c1 < 10) {
            l1 = this.getLigneVoisine(l1, pos);
            c1 = this.getColonneVoisine(c1, pos);
            if (this.caseOccupeeParAdversaire(pion, l1, c1))
                return new Case(l1, c1);
        }
    }

    /* Promeut le pion situé en l-c en dame. */
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

    /* Renvoie vrai si les deux pions situés en l1-c1 et l2-c2 sont adversaires. */
    pionsAdverses(l1, c1, l2, c2) {
        return (this.grille[l1][c1] > 0 && this.grille[l2][c2] < 0) || (this.grille[l1][c1] < 0 && this.grille[l2][c2] > 0);
    }

    /* Renvoie vrai si le pion situé en ligne-colonne appartient au joueur de la couleur passé en paramètre joueurBlanc. */
    pionAppartientAJoueur(ligne, colonne, joueurBlanc) {
        return (joueurBlanc === BLANC && this.grille[ligne][colonne] < 0) || (joueurBlanc === NOIR && this.grille[ligne][colonne] > 0);
    }

    /* Renvoie vrai si un pion adversaire du pion situé en caseDepart se trouve entre ce dernier et caseArrivee. */
    pionAdverseEntreCases(l1, c1, l2, c2) {
        let pos = this.positionRelative(l1, c1, l2, c2), pion = this.grille[l1][c1];
        do {
            l1 = this.getLigneVoisine(l1, pos),
                c1 = this.getColonneVoisine(c1, pos);
            if (this.caseOccupeeParAdversaire(pion, l1, c1))
                return true;
        } while (l1 !== l2 && c1 !== c2);
        return false;
    }

    /* Renvoie les cases accessibles par le pion situé en l-c. */
    casesAccessiblesPion(l, c) {
        let cases = [];
        const couleur = this.grille[l][c] < 0;
        for (let pos = (couleur ? HAUT_GAUCHE : BAS_DROIT); pos <= (couleur ? HAUT_DROIT : BAS_GAUCHE); pos++) {
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
                        break;
                }
            }
        }
        return cases;
    }

    /* Renvoie les cases accessibles par la dame située en l-c.*/
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

    /* Renvoie les cases accessibles par le pion situé en l-c. */
    casesAccessiblesPrisePion(l, c) {
        let cases = [];
        const couleur = this.grille[l][c] < 0;
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
                        break;
                }
            }
        }
        return cases;
    }

    /* Renvoie les cases accessibles par la dame située en l-c.*/
    casesAccessiblesPriseDame(l, c) {
        let cases = [];
        for (let pos = HAUT_GAUCHE; pos <= BAS_GAUCHE; pos++) {
            let l2 = this.getLigneVoisine(l, pos), c2 = this.getColonneVoisine(c, pos);
            while (l2 >= 0 && l2 <= 9 && c2 >= 0 && c2 <= 9 && this.grille[l2][c2] === CASE_VIDE) {
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

    /* Renvoie toutes les cases libres après la prise du pion situé en l-c par une dame, dans la direction donnée par pos (position relative entre la dame et le pion pris).*/
    casesVidesApresPriseDame(l, c, pos) {
        let cases = [];
        let l2 = this.getLigneVoisine(l, pos), c2 = this.getColonneVoisine(c, pos);
        while (l2 >= 0 && l2 < 10 && c2 >= 0 && c2 < 10 && this.grille[l2][c2] === CASE_VIDE) {
            cases.push(new Case(l2, c2));
            l2 = this.getLigneVoisine(l2, pos);
            c2 = this.getColonneVoisine(c2, pos);
        }
        return cases;
    }

    /* Donne la position relative entre les cases l1-c1 et l2-c2. */
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

    /* Renvoie VICTOIRE_BLANC/NOIR, si tous les pions noirs/blancs ont été pris ou ne peuvent pas se déplacer ;
        renvoie NUL si aucun des deux joueurs ne peut déplacer un seul pion. */
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

    joueurAGagne(joueurBlanc, actions) {
        return (joueurBlanc ? (this.nombrePionsNoirs === 0 && this.nombreDamesNoirs === 0)
            : (this.nombrePionsBlancs === 0 && this.nombreDamesBlancs === 0))
            || (joueurBlanc !== this.tourBlanc && actions.length === 0);
    }

    /*Génère toutes les actions, mouvements et prises, possibles dans la configuration courante, suivant le tour des joueurs.*/
    genereActionsPossibles() {
        this.actionsPossibles = this.renvoitActionsPossibles();
    }

    renvoitActionsPossibles() {
        let as = this.prises().slice();
        as.push(...this.mouvementsPossibles());
        return as;
    }

    /* Réalise l'action a, et promeut le pion en dame si nécessaire. Bascule le tour des joueurs.*/
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

    /* Réalise le mouvement m, renvoie vrai si le pion doit être promu en dame. */
    deplacer(m) {
        this.grille[m.ligneArrivee()][m.colonneArrivee()] = this.grille[m.ligneDepart()][m.colonneDepart()];
        this.grille[m.ligneDepart()][m.colonneDepart()] = 0;
        return (m.ligneArrivee() === this.grille.length - 1 && this.grille[m.ligneArrivee()][m.colonneArrivee()] === 1)
            || (m.ligneArrivee() === 0 && this.grille[m.ligneArrivee()][m.colonneArrivee()] === -1);
    }

    distancePionLigneFondAdverse(i, j) {
        return this.grille[i][j] < 0 ? i : this.grille.length - i - 1;
    }

    /* Réalise la prise p ; met à jour le nombre de pions/dames restants. Renvoie vrai le pion preneur doit être promu en dame. */
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

    /*Génère tous les mouvements possibles dans le configuration courante suivant le tour des joueurs :
    * parcourt les cases voisines immédiates des pions simples, et les cases situées sur les diagonales des dames.
    */
    mouvementsPossibles() {
        let mouvements = [];
        if (this.tourBlanc === BLANC) {
            for (let i = 0; i < this.grille.length; i++)
                for (let j = (i % 2 === 0) ? 0 : 1; j < this.grille.length; j = j + 2)
                    if (this.grille[i][j] === PION_BLANC)
                        for (let pos = HAUT_GAUCHE; pos <= HAUT_DROIT; pos++) {
                            let l = this.getLigneVoisine(i, pos), c = this.getColonneVoisine(j, pos);
                            if (l >= 0 && l < this.grille.length && c >= 0 && c < this.grille.length && this.grille[l][c] === CASE_VIDE)
                                mouvements.push(new Mouvement(i, j, l, c));
                        }
                    else if (this.grille[i][j] === DAME_BLANC)
                        for (let pos = HAUT_GAUCHE; pos <= BAS_GAUCHE; pos++) {
                            let ligne = this.getLigneVoisine(i, pos), col = this.getColonneVoisine(j, pos);
                            while (ligne >= 0 && ligne < this.grille.length && col >= 0 && col < this.grille.length
                            && this.grille[ligne][col] === CASE_VIDE) {
                                mouvements.push(new Mouvement(i, j, ligne, col));
                                ligne = this.getLigneVoisine(ligne, pos);
                                col = this.getColonneVoisine(col, pos);
                            }
                        }
        } else
            for (let i = 0; i < this.grille.length; i++)
                for (let j = (i % 2 === 0) ? 0 : 1; j < this.grille.length; j = j + 2)
                    if (this.grille[i][j] === PION_NOIR)
                        for (let pos = BAS_DROIT; pos <= BAS_GAUCHE; pos++) {
                            let l = this.getLigneVoisine(i, pos), c = this.getColonneVoisine(j, pos);
                            if (l >= 0 && l < this.grille.length && c >= 0 && c < this.grille.length && this.grille[l][c] === CASE_VIDE)
                                mouvements.push(new Mouvement(i, j, l, c));
                        }
                    else if (this.grille[i][j] === DAME_NOIR)
                        for (let pos = HAUT_GAUCHE; pos <= BAS_GAUCHE; pos++) {
                            let ligne = this.getLigneVoisine(i, pos), col = this.getColonneVoisine(j, pos);
                            while (ligne >= 0 && ligne < this.grille.length && col >= 0 && col < this.grille.length
                            && this.grille[ligne][col] === CASE_VIDE) {
                                mouvements.push(new Mouvement(i, j, ligne, col));
                                ligne = this.getLigneVoisine(ligne, pos);
                                col = this.getColonneVoisine(col, pos);
                                console.log("))");
                            }
                        }
        return mouvements;
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
        let prises = [];
        if (this.tourBlanc === BLANC) {
            for (let i = 0; i < this.grille.length; i++)
                for (let j = (i % 2 === 0) ? 0 : 1; j < this.grille.length; j = j + 2)
                    if (this.grille[i][j] === PION_BLANC || this.grille[i][j] === DAME_BLANC)
                        prises = this.prisesPion(i, j);
        } else
            for (let i = 0; i < this.grille.length; i++)
                for (let j = (i % 2 === 0) ? 0 : 1; j < this.grille.length; j = j + 2)
                    if (this.grille[i][j] === PION_NOIR || this.grille[i][j] === DAME_NOIR)
                        prises = this.prisesPion(i, j);
        return this.triePrisesDames(prises);
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
        return prisesEtendues;
    }

    /* Etend la prise p : renvoie toutes les prises résultant de son extension aux pions adverses voisins du pion preneur ou situés sur la diagonale de la dame preneuse, si une case libre se trouve derrière eux. */
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
                    if (this.grille[ligne][col] !== CASE_VIDE) {
                        if (premierPionNonRencontre) {
                            premierPionNonRencontre = false;
                            if (this.caseOccupeeParAdversaire(this.grille[p.ligneDepart()][p.colonneDepart()], ligne, col)
                                && this.caseApresSautLibreOuContientPionPreneur(p, ligne, col, position)
                                && !p.pionVirtuellementPris(ligne, col))
                                priseD = Prise.prise(p, ligne, col);
                            else
                                secondPionNonRencontre = false;
                        } else
                            secondPionNonRencontre = false;
                    } else if (!premierPionNonRencontre && priseD != null)
                        prises.push(Prise.prise(priseD, ligne, col));
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

    /* Supprime les prises "doublons" : les prises du même pion preneur, prenant les mêmes pions adverses dans le même ordre, se terminant sur la même case, et caractérisées par des cases étapes/intermédiaires différentes. */
    triePrisesDames(prises) {
        let prises2 = [];
        for (let i = 0; i < this.prises.length; i++) {
            let p1 = this.prises[i];
            if (p1.dame)
                for (let j = this.prises.length - 1; j > i; j--) {
                    let p2 = this.prises[j];
                    if (p2.dame && p1.prendMemePionsMemeOrdre(p2))
                        prises2.push(p2);
                }
        }
        return prises.filter(p => !prises2.includes(p));
    }

    caseOccupeeParAdversaire(pion, ligneCase, colCase) {
        let pionCase = this.grille[ligneCase][colCase];
        return (pion < 0 && pionCase > 0) || (pion > 0 && pionCase < 0);
    }

    caseApresSautLibreOuContientPionPreneur(p, l, c, pos) {
        const ligne = this.getLigneVoisine(l, pos), col = this.getColonneVoisine(c, pos);
        if (ligne < 0 || ligne >= this.grille.length || col < 0 || col >= this.grille.length)
            return false;
        return this.grille[ligne][col] === CASE_VIDE || (ligne === p.ligneDepart() && col === p.colonneDepart());
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
