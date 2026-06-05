# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI(title="API To-Do List Collaborative - Groupe 12")

# Configuration CORS : Autorise votre page HTML à communiquer avec ce serveur
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modèle de données pour une tâche
class Task(BaseModel):
    nom: str
    texte: str

# Base de données en mémoire (RAM)
base_de_donnees_taches: List[Task] = []

@app.get("/taches", response_model=List[Task])
def lister_taches():
    """Récupère la liste de toutes les tâches"""
    return base_de_donnees_taches

@app.post("/taches")
def ajouter_tache(tache: Task):
    """Ajoute une nouvelle tâche à la liste commune"""
    base_de_donnees_taches.append(tache)
    return {"status": "success"}

@app.delete("/taches/{index}")
def supprimer_tache(index: int):
    """Supprime définitivement une tâche par son numéro (index)"""
    if 0 <= index < len(base_de_donnees_taches):
        base_de_donnees_taches.pop(index)
        return {"status": "success"}
    else:
        raise HTTPException(status_code=404, detail="Tâche non trouvée")