import { useState, useEffect } from "react";
import Map from "./Map";
import ToolBar from "./ToolBar";
import DashboardLayout from "./DashboardLayout";
import type { Card, Wire, Mode, Side } from "./types";
import { apiFetchGet, apiFetchPost, apiFetchDelete, apiFetchUpdate } from "./fetch";

function App() {
  // 1. Nouvel état pour savoir si on affiche le menu ou le canevas 
  const [modeMenu, setModeMenu] = useState<'menu' | 'canevas'>('menu');

  // LOGIQUE 
  const [cards, setCards] = useState<Card[]>([])

  const [wires, setWires] = useState<Wire[]>([])

  const [mode, setMode] = useState<Mode>("select")
  
  const [selected, setSelected] = useState<number | null>(null)
  const [selectedWire, setSelectedWire] = useState<number | null>(null)
  const [wireError, setWireError] = useState<string | null>(null)
  const [cardError, setCardError] = useState<string | null>(null)

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

  useEffect(() => {
    let active = true

    apiFetchGet("cards/")
      .then((response: { results: Card[] }) => {
        if (active) {
          setCards(response.results.filter((card) => card.project === 1))
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setCardError(error instanceof Error ? error.message : "Erreur lors du chargement des cards")
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

  const saveCardPosition = (id: number, x: number, y: number) => {
    apiFetchUpdate("cards", id, { x, y })
      .then(() => setCardError(null))
      .catch((error: unknown) => {
        setCardError(error instanceof Error ? error.message : "Erreur lors de la mise à jour de la card")
      })
  }

  const updateCardText = (id: number, text: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, text } : c))
    )
  }

  const saveCardText = (id: number, text: string) => {
    apiFetchUpdate("cards", id, { text })
      .then(() => setCardError(null))
      .catch((error: unknown) => {
        setCardError(error instanceof Error ? error.message : "Erreur lors de la mise à jour de la card")
      })
  }

  const updateCardPositionAndSize = (id: number, x: number, y: number, width: number, height: number) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, x, y, width, height } : card
      )
    )
  }

  const saveCardPositionAndSize = (id: number, x: number, y: number, width: number, height: number) => {
    apiFetchUpdate("cards", id, { x, y, width, height })
      .then(() => setCardError(null))
      .catch((error: unknown) => {
        setCardError(error instanceof Error ? error.message : "Erreur lors de la mise à jour de la card")
      })
  }
  const addCard = async () => {
    const defaultCard = {
      project: 1,
      text:"Text",
      x:0,
      y:0,
      width: 100,
      height: 100,
      index: 10,
    }

    try {
      const savedCard: Card = await apiFetchPost("cards/", defaultCard)
      setCards((prevCards) => [savedCard, ...prevCards])
      setCardError(null)
    } catch (error) {
      setCardError(error instanceof Error ? error.message : "Erreur lors de l'enregistrement de la card")
    }
  }

  const removeCard = async (id:number) => {
    try {
      await apiFetchDelete("cards", id)
      setCards((prevCards) => prevCards.filter((card) => card.id !== id))
      setSelectedWire(null)
      wires
        .filter((wire) => wire.fromId === id || wire.toId === id)
        .forEach((wire) => void removeWire(wire.id))
      setCardError(null)
    } catch (error) {
      setCardError(error instanceof Error ? error.message : "Erreur lors de la suppression de la card")
    }
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
        saveCardPosition={saveCardPosition}
        updateCardText={updateCardText}
        saveCardText={saveCardText}
        updateCardPositionAndSize={updateCardPositionAndSize}
        saveCardPositionAndSize={saveCardPositionAndSize}
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
      {cardError && (
        <div role="alert" className="absolute left-4 top-16 z-50 rounded bg-red-100 px-4 py-2 text-red-800">
          {cardError}
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