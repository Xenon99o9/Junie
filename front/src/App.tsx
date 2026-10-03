import { useState, useEffect } from "react";
import Map from "./Map";
import ToolBar from "./ToolBar";
import DashboardLayout from "./DashboardLayout"; // Import du nouveau layout
import type { Card } from "./types"

function App() {
  // 1. Nouvel état pour savoir si on affiche le menu ou le canevas 
  const [mode, setMode] = useState<'menu' | 'canevas'>('menu');

  // LOGIQUE 
  const savedCards = localStorage.getItem("cards")
  const initialCards = savedCards ? JSON.parse(savedCards) : []
  const [cards, setCards] = useState<Card[]>(initialCards)

  const [selected, setSelected] = useState<number | null>(null)

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

  const updateCardPositionAndSize = (id: number, x: number, y: number, width: number, height: number) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, x, y, width, height } : card
      )
    )
  }

  useEffect(() => {
    localStorage.setItem("cards", JSON.stringify(cards))
  }, [cards])
  


  // 2. RENDU 

  // Si on est en mode 'menu', on affiche toute votre nouvelle interface
  if (mode === 'menu') {
    return (
      <DashboardLayout
        // On passe la fonction pour basculer sur le canevas
        onOuvrirCanevas={() => setMode('canevas')}
      />
    );
  }

  // Sinon, on affiche votre Canevas existant
  return (
    <div className="relative w-screen h-screen overflow-hidden">



      {/* arrière-plan */}
      <Map
        tab={cards}
        selected={selected}
        setSelected={setSelected}
        updateCardPosition={updateCardPosition}
        updateCardText={updateCardText}
        updateCardPositionAndSize={updateCardPositionAndSize}
      />
      {/* On ajoute la prop onRetourMenu ici */}
      <ToolBar
        cards={cards}
        setCards={setCards}
        onRetourMenu={() => setMode('menu')}
      />
    </div>

    
  )
}

export default App