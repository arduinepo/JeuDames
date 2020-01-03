"use strict";

import {DamierGraphique} from "./DamierGraphique.js";
import {JoueurAutoAleatoire, JoueurAutomatiqueIntelligent} from './Joueurs.js';
import {BLANC} from "./Constantes";

onload = function () {
    const damier = new DamierGraphique();
    let joueurCourant = BLANC;
    let nombreToursSansPrise = 0;

    document.getElementById("launch").onclick = function () {

    };
};