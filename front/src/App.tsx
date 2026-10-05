import { useState, useEffect } from "react";
import Map from "./Map";
import ToolBar from "./ToolBar";
import DashboardLayout from "./DashboardLayout";
import type { Card, Wire, Mode, Side } from "./types";
import { apiFetchGet, apiFetchPost, apiFetchDelete } from "./fetch";

function App() {
  // 1. Nouvel état pour savoir si on affiche le menu ou le canevas 
  const [modeMenu, setModeMenu] = useState<'menu' | 'canevas'>('menu');

  // LOGIQUE 
  const savedCards = localStorage.getItem("cards")
  const initialCards = savedCards ? JSON.parse(savedCards) : []
  const [cards, setCards] = useState<Card[]>(initialCards)

  const [wires, setWires] = useState<Wire[]>([])

  const [mode, setMode] = useState<Mode>("select")
  
  const [selected, setSelected] = useState<number | null>(null)
  const [selectedWire, setSelectedWire] = useState<number | null>(null)
  const [wireError, setWireError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    apiFetchGet("wires/")
      .then((response: { results: Wire[] }) => {
        if (active) {
          setWires(response.results.filter((wire) => wire.project === 1))
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setWireError(error instanceof Error ? error.message : "Erreur lors du chargement des wires")
        }
      })

    return () => {
      active = false
    }
  }, [])

  const removeWire = async (id: number) => {
    try {
      await apiFetchDelete("wires", id)
      setWires((prevWires) => prevWires.filter((wire) => wire.id !== id))
      setSelectedWire((selectedId) => selectedId === id ? null : selectedId)
      setWireError(null)
    } catch (error) {
      setWireError(error instanceof Error ? error.message : "Erreur lors de la suppression du wire")
    }
  }

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
      project: 1,
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
    setSelectedWire(null)
    wires
      .filter((wire) => wire.fromId === id || wire.toId === id)
      .forEach((wire) => void removeWire(wire.id))
  }

  const addWire = async (fromId: number, fromSide: Side, toId: number, toSide: Side) => {
    const duplicate = wires.some((wire) =>
      (wire.fromId === fromId &&
        wire.fromSide === fromSide &&
        wire.toId === toId &&
        wire.toSide === toSide) ||
      (wire.fromId === toId &&
        wire.fromSide === toSide &&
        wire.toId === fromId &&
        wire.toSide === fromSide)
    )
    if (duplicate) return

    try {
      const savedWire: Wire = await apiFetchPost("wires/", {
        project: 1,
        fromId,
        fromSide,
        toId,
        toSide,
      })
      setWires((prevWires) => [...prevWires, savedWire])
      setWireError(null)
    } catch (error) {
      setWireError(error instanceof Error ? error.message : "Erreur lors de l'enregistrement du wire")
    }
  }

  useEffect(() => {
    localStorage.setItem("cards", JSON.stringify(cards))
  }, [cards])

  useEffect(() => {
    if (selectedWire === null) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Delete" && event.key !== "Backspace") return

      event.preventDefault()
      event.stopImmediatePropagation()
      void removeWire(selectedWire)
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
      {wireError && (
        <div role="alert" className="absolute left-4 top-4 z-50 rounded bg-red-100 px-4 py-2 text-red-800">
          {wireError}
        </div>
      )}
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