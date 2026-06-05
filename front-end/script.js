// Étape 3 : La fonction qui va chercher les tâches de TOUT LE MONDE
async function recupererEtAfficherTaches() {
    try {
        // LECTURE SUR OPENSHIFT : On demande toutes les tâches stockées
        const reponse = await fetch(URL_API_OPENSHIFT);
        const listeTaches = await reponse.json();

        // On cible la zone HTML où s'affichent les tâches (ex: une div ou un ul)
        const conteneurListe = document.getElementById("zone-liste-taches");
        conteneurListe.innerHTML = ""; // On vide l'ancien affichage

        // On boucle sur chaque tâche reçue pour l'ajouter sur l'écran
        listeTaches.forEach(tache => {
            conteneurListe.innerHTML += `
                <div class="tache-item" style="padding: 10px; border-bottom: 1px solid #eee;">
                    <strong>${tache.nom} :</strong> ${tache.texte}
                </div>
            `;
        });

    } catch (erreur) {
        console.error("Erreur lors de la récupération des tâches :", erreur);
    }
}

// Étape 4 : RAFAÎCHISSEMENT AUTOMATIQUE (Le secret pour voir les autres !)
// Cette ligne demande à votre JavaScript de se connecter à OpenShift toutes les 4 secondes 
// pour vérifier si un autre utilisateur a ajouté son nom et sa tâche.
setInterval(recupererEtAfficherTaches, 4000);

// On appelle la fonction une première fois au chargement de la page
recupererEtAfficherTaches();