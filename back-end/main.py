from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Permet à n'importe qui de se connecter à votre application OpenShift
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Task(BaseModel):
    nom: str
    texte: str

# Cette liste en mémoire va stocker les tâches de tout le monde
base_de_donnees_taches: List[Task] = []

@app.get("/taches")
def lister_taches():
    return base_de_donnees_taches

@app.post("/taches")
def ajouter_tache(tache: Task):
    base_de_donnees_taches.append(tache)
    return {"status": "success"}