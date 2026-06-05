# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uvicorn

app = FastAPI(title="API To-Do List Collaborative")

# Configuration CORS pour connecter votre HTML à Python sans blocage
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

# Liste partagée stockée en mémoire RAM
base_de_donnees_taches: List[Task] = []

@app.get("/taches")
@app.get("/taches/", include_in_schema=False)
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
    raise HTTPException(status_code=404, detail="Non trouvé")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)