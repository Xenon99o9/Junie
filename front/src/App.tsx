import { useState, useEffect } from "react";
import Map from "./Map";
import ToolBar from "./ToolBar";
import DashboardLayout from "./DashboardLayout"; // Import du nouveau layout
import type { Card, Wire, Mode, Side } from "./types"

function App() {
  // 1. Nouvel état pour savoir si on affiche le menu ou le canevas 
  const [modeMenu, setModeMenu] = useState<'menu' | 'canevas'>('menu');

  // LOGIQUE 
  const savedCards = localStorage.getItem("cards")
  const initialCards = savedCards ? JSON.parse(savedCards) : []
  const [cards, setCards] = useState<Card[]>(initialCards)

  const savedWires = localStorage.getItem("wires")
  const initialWires = savedWires ? JSON.parse(savedWires) : []
  const [wires, setWires] = useState<Wire[]>(initialWires)

  const [mode, setMode] = useState<Mode>("select")
  
  const [selected, setSelected] = useState<number | null>(null)
  const [selectedWire, setSelectedWire] = useState<number | null>(null)

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
    setSelectedWire(null)
  }

  const addWire = (fromId: number, fromSide: Side, toId: number, toSide: Side) => {
    const newWire: Wire = {
      id: Date.now(),
      fromId,
      fromSide,
      toId,
      toSide,
    }
    setWires((prevWires) => {
      const duplicate = prevWires.some((wire) =>
        (wire.fromId === fromId &&
          wire.fromSide === fromSide &&
          wire.toId === toId &&
          wire.toSide === toSide) ||
        (wire.fromId === toId &&
          wire.fromSide === toSide &&
          wire.toId === fromId &&
          wire.toSide === fromSide)
      )

      return duplicate ? prevWires : [...prevWires, newWire]
    })
  }

  useEffect(() => {
    localStorage.setItem("cards", JSON.stringify(cards))
  }, [cards])

  useEffect(() => {
    localStorage.setItem("wires", JSON.stringify(wires))
  }, [wires])

  useEffect(() => {
    if (selectedWire === null) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Delete" && event.key !== "Backspace") return

      event.preventDefault()
      event.stopImmediatePropagation()
      setWires((prevWires) =>
        prevWires.filter((wire) => wire.id !== selectedWire)
      )
      setSelectedWire(null)
    }

    window.addEventListener("keydown", handleKeyDown, true)
    return () => window.removeEventListener("keydown", handleKeyDown, true)
  }, [selectedWire])

  // 2. RENDU
  if (modeMenu === 'menu') {
    return (
      <DashboardLayout
        onOuvrirCanevas={() => setModeMenu('canevas')}
      />
    )
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">



      <Map
        cards={cards}
        selected={selected}
        setSelected={setSelected}
        updateCardPosition={updateCardPosition}
        updateCardText={updateCardText}
        updateCardPositionAndSize={updateCardPositionAndSize}
        removeCard={removeCard}
        mode={mode}
        wires={wires}
        addWire={addWire}
        selectedWire={selectedWire}
        setSelectedWire={setSelectedWire}
      />
      <ToolBar
        addCard={addCard}
        mode={mode}
        setMode={setMode}
        setSelected={setSelected}
        onRetourMenu={() => setModeMenu('menu')}
      />
    </div>

    
  )
}

export default App