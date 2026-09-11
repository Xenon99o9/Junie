import { useState, useEffect } from "react";
import Map from "./Map";
import ToolBar from "./ToolBar";
import type { Card, Wire, Mode } from "./types"

function App() {



  const savedCards = localStorage.getItem("cards")
  const initialCards = savedCards ? JSON.parse(savedCards) : []
  const [cards, setCards] = useState<Card[]>(initialCards)

  const savedWires = localStorage.getItem("wires")
  const initialWires = savedWires ? JSON.parse(savedWires) : []
  const [wires, setWires] = useState<Wire[]>(initialWires)

  const [mode, setMode] = useState<Mode>("select")
  
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
  const addCard = () => {
    const defaultCard : Card = {
      id:Date.now(),
      text:"Text",
      x:0,
      y:0,
      width: 100,
      height: 100,
      index: 10,
    }
    const newCards = [defaultCard, ...cards]
    setCards(newCards)
  }

  const removeCard = (id:number) => {
    const newCards = cards.filter((card) => card.id !== id)
    setCards(newCards)
    setWires((prevWires) =>
      prevWires.filter((wire) => wire.fromId !== id && wire.toId !== id)
    )
  }


  useEffect(() => {
    localStorage.setItem("cards", JSON.stringify(cards))
  }, [cards])

  useEffect(() => {
    localStorage.setItem("wires", JSON.stringify(wires))
  }, [wires])

  return (
    <div className="relative w-screen h-screen overflow-hidden">
  
      {/* Interface flottante */}
      

      {/* arrière-plan */}
      <Map tab={cards} selected={selected}
        setSelected={setSelected}
        updateCardPosition={updateCardPosition}
        updateCardText={updateCardText}
        updateCardPositionAndSize={updateCardPositionAndSize}
        removeCard={removeCard}
        mode={mode}
      />
      <ToolBar
        cards={cards}
        setCards={setCards}
        addCard={addCard}
        mode={mode}
        setMode={setMode}
      />

  </div>
  )
}


export default App
