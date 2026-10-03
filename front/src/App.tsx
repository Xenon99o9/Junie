import { useState, useEffect } from "react";
import Map from "./Map";
import ToolBar from "./ToolBar";
import MenuPrincipal from "./menuPrincipal"; // Import du composant MenuPrincipal ajouté
import type { Card } from "./types";

function App() {
  // 1. Nouvel état pour savoir quoi afficher ('menu' ou 'canevas')
  const [vueActuelle, setVueActuelle] = useState<'menu' | 'canevas'>('menu');

  // états existants
  const savedCards = localStorage.getItem("cards");
  const initialCards = savedCards ? JSON.parse(savedCards) : [];
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [selected, setSelected] = useState<number | null>(null);

  // fonctions 
  const updateCardPosition = (id: number, x: number, y: number) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, x, y } : card
      )
    )
  }

  const updateCardText = (id: number, text: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, text } : c))
    )
  }

  const updateCardPositionAndSize = (id:number, x:number, y:number, width:number,height:number) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, x, y, width, height } : card
      )
    )
  }

  useEffect(() => {
    localStorage.setItem("cards", JSON.stringify(cards));
  }, [cards]);


  // 2. LOGIQUE D'AFFICHAGE (Routeur manuel à modifier plus tard)
  
  // Si l'état est sur 'menu', on affiche seulement le menuPrincipal
  if (vueActuelle === 'menu') {
    return (
      <MenuPrincipal 
        // Quand on clique sur nouveau projet dans le menu, on change l'état pour afficher le canevas
        onNouveauProjet={() => setVueActuelle('canevas')} 
      />
    );
  }

  // Sinon, c'est qu'on est sur 'canevas'donc on affiche la Map et la ToolBar
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      
      {/* Bouton pour revenir au menu principal (ajouté pour ne pas rester bloqué sur le canevas) */}
      <button 
        onClick={() => setVueActuelle('menu')}
        className="absolute top-4 left-4 z-50 bg-white border border-gray-300 px-4 py-2 rounded-md shadow-sm hover:bg-gray-50"
      >
        ← Retour au menu
      </button>

      {/* arrière-plan Map avec les props existantes */}
      <Map 
        tab={cards} 
        selected={selected}
        setSelected={setSelected}
        updateCardPosition={updateCardPosition}
        updateCardText={updateCardText}
        updateCardPositionAndSize={updateCardPositionAndSize}
      />
      
      {/* la ToolBar */}
      <ToolBar cards={cards} setCards={setCards} />

    </div>
  );
}

export default App;