function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}
  
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

function showDivPlayer() {
  document.getElementById("slide_1").style.opacity = "1";
  document.getElementById("slide_1").style.zIndex = "1";
  document.getElementById("slide_2").style.opacity = "0";
  document.getElementById("slide_3").style.opacity = "0";
  document.getElementById("slide_2").style.zIndex = "0";
  document.getElementById("slide_3").style.zIndex = "0";
}
function showDivComputer() {
  document.getElementById("slide_2").style.opacity = "1";
  document.getElementById("slide_2").style.zIndex = "1";
  document.getElementById("slide_1").style.opacity = "0";
  document.getElementById("slide_3").style.opacity = "0";
  document.getElementById("slide_1").style.zIndex = "0";
  document.getElementById("slide_3").style.zIndex = "0";
}
function showDivPuzzle() {
  document.getElementById("slide_3").style.opacity = "1";
  document.getElementById("slide_3").style.zIndex = "1";
  document.getElementById("slide_2").style.opacity = "0";
  document.getElementById("slide_1").style.opacity = "0";
  document.getElementById("slide_2").style.zIndex = "0";
  document.getElementById("slide_1").style.zIndex = "0";
}

function notification(text) {
  var popup = document.querySelector("#myPopup");
  popup.innerText = text;
  popup.classList.toggle("show");
  setTimeout(function(){ popup.classList.remove("show"); }, 2000);  
}

function genererClassement() {
  let classement = "<ul></ul>"; //Faire une boucle qui récupère les jouers (pseudo + nombre victoires) et les met dans une liste (<li></li>) par ordre décroissant
  let titre = "<a class='item'>Classement</a>"
  document.getElementById('mySidenav').appendChild(titre);
  document.getElementById('mySidenav').appendChild(classement);
}