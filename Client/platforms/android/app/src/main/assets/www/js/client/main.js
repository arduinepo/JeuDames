import {Damier} from './Damier.js';
import {Prise} from "./Action.js";

let d=new Damier();
d.grille=[
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, -2, 0, 0, 0, 0, 0, 0, 0, 0],
];
d.genereActionsPossibles();
console.log(d.actionsPossibles);
//let c=d.casesAccessiblesDepuis(4,4);
//c.forEach(i=>console.log(i.ligne,i.colonne, d.pionAdverseEntreCases(4,4,i.ligne,i.colonne)));

//d.grille.forEach(i => console.log(i[0],i[1],i[2],i[3],i[4],i[5],i[6],i[7],i[8],i[9]));
