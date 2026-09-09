import { useState, useEffect } from "react";
import Map from "./Map";
import ToolBar from "./ToolBar";
import type { Card } from "./types"

function App() {



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

  const updateCardPositionAndSize = (id:number, x:number, y:number, width:number,height:number) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, x, y, width, height } : card
      )
    )
  }


  useEffect(() => {
    localStorage.setItem("cards", JSON.stringify(cards))
  }, [cards])

  return (
    <div className="relative w-screen h-screen overflow-hidden">
  
      {/* Interface flottante */}
      

      {/* arrière-plan */}
      <Map tab={cards} selected={selected}
        setSelected={setSelected}
        updateCardPosition={updateCardPosition}
        updateCardText={updateCardText}
        updateCardPositionAndSize={updateCardPositionAndSize}
      />
      <ToolBar cards={cards} setCards={setCards}/>

  </div>
  )
}


export default App
