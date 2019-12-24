"use strict";
import {Damier} from "./Damier";

export class DamierGraphique extends Damier {
    constructor() {
        super();
    }

    addListeners() {
        const damier=this;
        document.getElementsByTagName('svg')[0].onclick = function(event){
            const ligne=parseInt(event.target.parentNode.getAttribute('LIGNE')), colonne=parseInt(event.target.getAttribute('COLONNE'));
            if(damier.pionAppartientJoueur(ligne, colonne,damier.tourBlanc)){

            }

        }
    }


}
