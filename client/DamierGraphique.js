"use strict";
import {Damier} from "./Damier.js";

export class DamierGraphique extends Damier {
    constructor() {
        super();
        this.addListeners();
    }

    addListeners() {
        const damier=this;
        document.getElementsByTagName('svg')[0].onclick = function(event){
            const ligne=parseInt(event.target.parentNode.getAttribute('LIGNE')), colonne=parseInt(event.target.getAttribute('COLONNE'));
            if(damier.pionAppartientAJoueur(ligne, colonne,damier.tourBlanc)){

            }

        }
    }


}
