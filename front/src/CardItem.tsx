import { useState, useEffect } from "react"
import type React from "react"
import type { Card } from "./types"

type Props = {
  card: Card
  selected: number | null
  setSelected: (id: number | null) => void
  onPointerDown: (id: number, e: React.PointerEvent) => void
  updateCardText: (id: number, text: string) => void
  updateCardPositionAndSize: (id:number, x:number, y:number, width:number,height:number) => void
}

const CardItem = ({
  card,
  selected,
  setSelected,
  onPointerDown,
  updateCardText,
  updateCardPositionAndSize,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false)
  const isSelected = selected === card.id

  // Désactive automatiquement l'édition si la carte perd la sélection globale
  useEffect(() => {
    if (!isSelected) {
      setIsEditing(false)
    }
  }, [isSelected])

  type Direction = "nw" | "ne" | "sw" | "se"

const handleResize = (dir: Direction, e: React.PointerEvent) => {
  e.stopPropagation()

  // 1. Détection des signes selon la direction passée
  const isWest = dir.includes("w")
  const isNorth = dir.includes("n")

  // 2. Point d'ancrage opposé (qui reste figé sur le canevas)
  const anchorX = isWest ? card.x + card.width / 2 : card.x - card.width / 2
  const anchorY = isNorth ? card.y + card.height / 2 : card.y - card.height / 2

  const startMouseX = e.clientX
  const startMouseY = e.clientY
  const startW = card.width
  const startH = card.height

const onPointerMove = (moveEv: PointerEvent) => {
      const dx = moveEv.clientX - startMouseX
      const dy = moveEv.clientY - startMouseY

      // 3. Nouvelle taille (inversion du delta si on tire vers le haut ou la gauche)
      const newWidth = Math.max(50, startW + (isWest ? -dx : dx))
      const newHeight = Math.max(50, startH + (isNorth ? -dy : dy))

      // 4. Nouveau centre déduit de l'ancre fixe
      const newX = isWest ? anchorX - newWidth / 2 : anchorX + newWidth / 2
      const newY = isNorth ? anchorY - newHeight / 2 : anchorY + newHeight / 2

      updateCardPositionAndSize(card.id, newX, newY, newWidth, newHeight)
    } // <-- Referme bien onPointerMove ici

    const onPointerUp = () => {
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
    }

    // Déclenchés immédiatement au clic sur la pastille :
    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)
  }




  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        setSelected(card.id)
      }}
      onDoubleClick={(e) => {
        e.stopPropagation()
        setIsEditing(true)
      }}
      onPointerDown={(e) => onPointerDown(card.id, e)}
      style={{
        left: `${card.x}px`,
        top: `${card.y}px`,
        width: `${card.width}px`,
        height: `${card.height}px`,
        zIndex: isSelected ? 1000 : card.index,
      }}
      className="absolute -translate-x-1/2 -translate-y-1/2 bg-secondary rounded-lg cursor-grab active:cursor-grabbing"
    >
      <div
        className={`h-full w-full flex items-center justify-center p-2 ${
          isSelected
            ? "border-4 border-primary rounded-lg"
            : "border-3 border-neutral rounded-lg"
        }`}
      >
        {isSelected && isEditing ? (
          <textarea
            value={card.text}
            onChange={(e) => updateCardText(card.id, e.target.value)}
            onPointerDown={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                setIsEditing(false) // Quitte l'édition sans toucher à la sélection
              }
            }}
            onBlur={() => setIsEditing(false)}
            className="w-full h-full bg-transparent text-secondary-content text-center outline-none resize-none overflow-hidden cursor-text"
            autoFocus
          />
        ) : (
          <p
            className={`text-secondary-content text-center w-full break-words select-none`}
          >
            {card.text}
          </p>
        )}
        {isSelected && (
        <>
          {/* Haut-gauche */}
          <div
          onPointerDown={(e) => handleResize("nw", e)}
          className="absolute -top-1 -left-1 w-3 h-3 bg-base-100 border-2 border-primary rounded-full cursor-nwse-resize" />

          {/* Haut-droite */}
          <div
          onPointerDown={(e) => handleResize("ne", e)}
          className="absolute -top-1 -right-1 w-3 h-3 bg-base-100 border-2 border-primary rounded-full cursor-nesw-resize" />

          {/* Bas-gauche */}
          <div
          onPointerDown={(e) => handleResize("sw", e)}
          className="absolute -bottom-1 -left-1 w-3 h-3 bg-base-100 border-2 border-primary rounded-full cursor-nesw-resize" />

          {/* Bas-droite */}
          <div
          onPointerDown={(e) => handleResize("se", e)}
          className="absolute -bottom-1 -right-1 w-3 h-3 bg-base-100 border-2 border-primary rounded-full cursor-nwse-resize" />
        </>
      )}
      </div>
    </div>
  )
}

export default CardItem