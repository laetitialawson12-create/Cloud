// 1. URL fournie par OpenShift après le déploiement de votre main.py
const URL_API_OPENSHIFT = "http://VOTRE_ROUTE_OPENSHIFT_ICI/taches";

// On cible nos éléments HTML
let inputName = document.querySelector(".input-name"); // La nouvelle case Nom
let inputTask = document.querySelector(".input");      // Votre case Tâche actuelle
let submit = document.querySelector(".add");           // Votre bouton "Add Task"
let tasksDiv = document.querySelector(".tasks");       // Votre div qui affiche les tâches

// Au clic sur le bouton "Add Task"
submit.onclick = function() {
    if (inputTask.value !== "" && inputName.value !== "") {
        addtask(inputName.value, inputTask.value); // On envoie le nom et le texte
        inputTask.value = ""; // On vide juste la case tâche
    } else {
        alert("Veuillez remplir votre nom et votre tâche !");
    }
}

// FONCTION 1 : ENVOYER LA TÂCHE À OPENSHIFT
async function addtask(userName, taskText) {
    const taskData = {
        nom: userName,
        texte: taskText
    };

    try {
        await fetch(URL_API_OPENSHIFT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(taskData)
        });
        
        // On rafraîchit immédiatement l'affichage
        getAndDisplayTasks();
    } catch (error) {
        console.error("Erreur lors de l'envoi :", error);
    }
}

// FONCTION 2 : RÉCUPÉRER ET AFFICHER LES TÂCHES DE TOUT LE MONDE
async function getAndDisplayTasks() {
    try {
        const response = await fetch(URL_API_OPENSHIFT);
        const tasksList = await response.json();

        tasksDiv.innerHTML = ""; // On vide l'écran avant de réafficher

        tasksList.forEach((task) => {
            // Création de la div principale de la tâche (votre style actuel)
            let div = document.createElement("div");
            div.className = "task";
            
            // On affiche "Nom : Tâche"
            div.appendChild(document.createTextNode(`${task.nom} : ${task.texte}`));
            
            // Création du bouton Supprimer (votre style actuel)
            let span = document.createElement("span");
            span.className = "del";
            span.appendChild(document.createTextNode("Delete"));
            div.appendChild(span);
            
            tasksDiv.appendChild(div);
        });
    } catch (error) {
        console.error("Erreur lors de la récupération :", error);
    }
}

// FONCTION 3 : GÉRER LE CLIC SUR LE BOUTON DELETE
tasksDiv.addEventListener("click", (e) => {
    if (e.target.classList.contains("del")) {
        // Pour un TP simple en mémoire, le delete supprime juste visuellement pour l'instant
        e.target.parentElement.remove();
    }
});

// REFRESH AUTOMATIQUE : On vérifie les nouvelles tâches des autres toutes les 4 secondes
setInterval(getAndDisplayTasks, 4000);

// Charger les tâches dès l'ouverture de la page
getAndDisplayTasks();