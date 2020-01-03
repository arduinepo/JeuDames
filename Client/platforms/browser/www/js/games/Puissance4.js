"use strict";

import {DamierGraphique} from "./DamierGraphique.js";
import {JoueurAutoAleatoire, JoueurHumain, JoueurAutomatiqueIntelligent} from './Joueurs.js';

onload = function () {
    const BLANC = true, NOIR = false;
    const damier = new DamierGraphique();
    let joueurCourant = BLANC;
    let nombreToursSansPrise = 0;

    document.getElementById("launch").onclick = function () {
        // switch : contre IA, aléatoire ou intelligente ; contre humain
        // préférence blancs ou noirs
        const joueur1 = new JoueurHumain(Math.random() < 0.5 ? BLANC : NOIR,
            document.getElementById("inputNomJoueur").value);
    };
};