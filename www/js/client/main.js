import {Damier} from './Damier.js';
import {Prise} from "./Action.js";
import {JoueurAutomatiqueIntelligent} from "./Joueurs.js";

let d=new Damier();
d.grille=[
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
let j=new JoueurAutomatiqueIntelligent(true, 10);
j.choisirAction(d);



//let c=d.casesAccessiblesDepuis(4,4);
//c.forEach(i=>console.log(i.ligne,i.colonne, d.pionAdverseEntreCases(4,4,i.ligne,i.colonne)));

//d.grille.forEach(i => console.log(i[0],i[1],i[2],i[3],i[4],i[5],i[6],i[7],i[8],i[9]));
