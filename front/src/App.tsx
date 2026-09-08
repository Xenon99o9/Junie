import { useState, useEffect } from "react";
import Map from "./Map";
import ToolBar from "./ToolBar";
import type { Card } from "./types"

function App() {



  const savedCards = localStorage.getItem("cards")
  const initialCards = savedCards ? JSON.parse(savedCards) : []
  const [cards, setCards] = useState<Card[]>(initialCards)
  
  const [selected, setSelected] = useState<number | null>(null)

  useEffect(() => {
    localStorage.setItem("cards", JSON.stringify(cards))
  }, [cards])

  return (
    <div className="relative w-screen h-screen overflow-hidden">
  
      {/* Interface flottante */}
      

      {/* arrière-plan */}
      <Map tab={cards} selected={selected} setSelected={setSelected}/>
      <ToolBar cards={cards} setCards={setCards}/>

  </div>
  )
}


export default App
