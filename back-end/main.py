# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uvicorn

app = FastAPI(title="API To-Do List Collaborative - Groupe 12")

# Configuration CORS complète
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

# Base de données temporaire en mémoire RAM
base_de_donnees_taches: List[Task] = []

# Ajout du paramètre pour gérer automatiquement le slash final (ex: /taches et /taches/)
@app.get("/taches", response_model=List[Task])
@app.get("/taches/", response_model=List[Task], include_in_schema=False)
def lister_taches():
    return base_de_donnees_taches

@app.post("/taches")
@app.post("/taches/", include_in_schema=False)
def ajouter_tache(tache: Task):
    base_de_donnees_taches.append(tache)
    return {"status": "success"}

@app.delete("/taches/{index}")
@app.delete("/taches/{index}/", include_in_schema=False)
def supprimer_tache(index: int):
    if 0 <= index < len(base_de_donnees_taches):
        base_de_donnees_taches.pop(index)
        return {"status": "success"}
    else:
        raise HTTPException(status_code=404, detail="Tâche non trouvée")

if __name__ == "__main__":
    # Force l'écoute sur le port exigé par OpenShift
    uvicorn.run(app, host="0.0.0.0", port=8080)