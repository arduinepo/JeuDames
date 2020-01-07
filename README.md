# JeuDames

<<<<<<< HEAD


## Choses à faire :

- ### Html et design : 
    -  interface plateau de jeu :  déroulement du jeu avec alternance des joueurs, détection d'une action 
        - - [ ] clic sur case, pion appartient au joueur qui a le tour ?
        - - [ ] récup des cases accessibles à ce pion
        - - [ ] clic sur case, si accessible, résultat d'un mouvement simple ou d'une prise d'un pion adverse ?
        - - [ ] appel méthode déplacer ou prendre
        - - [ ] màj interface
        - - [ ] fin de la partie ?  si oui, envoi résultats serveur ; afficher bouton pour nouvelle partie et retour à l'interface initiale

    
    - interface générale :  
      - - [ ] menus
      - - [ ] classement
      - - [x] formulaire de connection, changement de pseudo (Jimmy): j'en ai fait un avec un modal en pure css 
      - - [ ] choix type de jeu humain vs humain etc ...
      - - [ ] recherche de partie en fond

    


- ### Server : 
  - - [ ] échange client-serveur : au lancement, format de données pour paramètres partie : humain vs humain, humain vs Ia +- difficile (Jimmy)

- ### BDD :
- ### Merges pour prototypes et tests :
- ### Autres :
  - - [ ] contrôleur de l'interface, échange données avec Damier

- ### Rapport :


faits :
=======
à faire :
- tester api damier
- interface html : 
    - afficher tour courant
    - déroulement du jeu avec alternance des joueurs, détection d'une action :
        - clic sur case, pion appartient au joueur qui a le tour ?
        - récup des cases accessibles à ce pion et leur surlignage sur la grille
        - clic sur case, si accessible, résultat d'un mouvement simple ou d'une prise d'un pion adverse ?
        - appel méthode déplacer ou prendre
        - si prise multiple, boucler tant que prise possible ou joueur clic sur son pion preneur courant
        - si action se termine sur la ligne de fond adverse du pion, prmouvoir en dame
        
        - màj interface
        - fin de la partie ?  
            - si oui, message graphique et envoi résultats serveur ; 
            - afficher bouton pour nouvelle partie et retour à l'interface initiale

- échange client-serveur : au lancement, format de données pour paramètres partie : humain vs humain, humain vs Ia +- difficile

bonus :
- pouvoir annuler, pendant prise multiple de pions, les derniers déplacements, (via undo ?)
- surligner dernier mouvement
- webworker pour ia ?

>>>>>>> a29b1a15f616a70f89c3c998cebae0745a56f754
