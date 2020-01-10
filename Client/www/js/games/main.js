import {Jeu} from "./DamierGraphique.js";
import {Websocket} from "../websocket.js";
import {Controller} from "../controller.js";

const adresseServeur = "http://localhost"; //Adresse du serveur
const portServeur = 3000; //Port du serveur, par défaut à 3000
var socket = io.connect(adresseServeur + ":" + portServeur);

let j = new Jeu(true,false);
let ws = new Websocket(adresseServeur,portServeur,socket);
let controller = new Controller(j,ws);
