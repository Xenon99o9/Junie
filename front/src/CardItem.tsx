import { useState, useEffect } from "react"
import type React from "react"
import type { Card , Mode} from "./types"

type Props = {
  card: Card
  selected: number | null
  zoom: number
  setSelected: (id: number | null) => void
  onPointerDown: (id: number, e: React.PointerEvent) => void
  updateCardText: (id: number, text: string) => void
  updateCardPositionAndSize: (id:number, x:number, y:number, width:number,height:number) => void
  removeCard: (id:number)=> void
  mode: Mode
}

const CardItem = ({
  card,
  selected,
  zoom,
  setSelected,
  onPointerDown,
  updateCardText,
  updateCardPositionAndSize,
  removeCard,
  mode,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false)
  const isSelected = selected === card.id

  // Désactive automatiquement l'édition si la carte perd la sélection globale
  useEffect(() => {
    if (!isSelected) {
      setIsEditing(false)
    }
  }, [isSelected])

  type Direction = "n" | "s" | "e" | "w" | "nw" | "ne" | "sw" | "se"

const handleResize = (dir: Direction, e: React.PointerEvent) => {
  e.stopPropagation()

  const hasX = dir.includes("w") || dir.includes("e")
  const hasY = dir.includes("n") || dir.includes("s")
  const isWest = dir.includes("w")
  const isNorth = dir.includes("n")

  const startX = card.x
  const startY = card.y
  const startW = card.width
  const startH = card.height
  const startMouseX = e.clientX
  const startMouseY = e.clientY

  // Ancrages opposés uniquement si l'axe est actif
  const anchorX = isWest ? startX + startW / 2 : startX - startW / 2
  const anchorY = isNorth ? startY + startH / 2 : startY - startH / 2

  const onPointerMove = (moveEv: PointerEvent) => {
    const dx = (moveEv.clientX - startMouseX) / zoom
    const dy = (moveEv.clientY - startMouseY) / zoom

    // 1. Largeur et position X (inchangées si on tire 'n' ou 's')
    let newWidth = startW
    let newX = startX
    if (hasX) {
      newWidth = Math.max(50, startW + (isWest ? -dx : dx))
      newX = isWest ? anchorX - newWidth / 2 : anchorX + newWidth / 2
    }

    // 2. Hauteur et position Y (inchangées si on tire 'e' ou 'w')
    let newHeight = startH
    let newY = startY
    if (hasY) {
      newHeight = Math.max(50, startH + (isNorth ? -dy : dy))
      newY = isNorth ? anchorY - newHeight / 2 : anchorY + newHeight / 2
    }

    updateCardPositionAndSize(card.id, newX, newY, newWidth, newHeight)
  }

  const onPointerUp = () => {
    window.removeEventListener("pointermove", onPointerMove)
    window.removeEventListener("pointerup", onPointerUp)
  }

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
        tabIndex={0}
        onKeyDown={(e) => {
              if (e.key === "Delete" && isSelected && !isEditing) {
                e.preventDefault()
                removeCard(card.id) // Supprime la carte
              }
            }}
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
          {/* Milieu Haut */}
          <div
            onPointerDown={(e) => handleResize("n", e)}
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-base-100 border-2 border-primary rounded-full cursor-ns-resize"
          />

          {/* Milieu Bas */}
          <div
            onPointerDown={(e) => handleResize("s", e)}
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-base-100 border-2 border-primary rounded-full cursor-ns-resize"
          />

          {/* Milieu Gauche */}
          <div
            onPointerDown={(e) => handleResize("w", e)}
            className="absolute top-1/2 -translate-y-1/2 -left-1 w-3 h-3 bg-base-100 border-2 border-primary rounded-full cursor-ew-resize"
          />

          {/* Milieu Droite */}
          <div
            onPointerDown={(e) => handleResize("e", e)}
            className="absolute top-1/2 -translate-y-1/2 -right-1 w-3 h-3 bg-base-100 border-2 border-primary rounded-full cursor-ew-resize"
          />

          {/* Haut-Gauche */}
          <div
            onPointerDown={(e) => handleResize("nw", e)}
            className="absolute -top-1 -left-1 w-3 h-3 bg-base-100 border-2 border-primary rounded-full cursor-nwse-resize"
          />

          {/* Haut-Droite */}
          <div
            onPointerDown={(e) => handleResize("ne", e)}
            className="absolute -top-1 -right-1 w-3 h-3 bg-base-100 border-2 border-primary rounded-full cursor-nesw-resize"
          />

          {/* Bas-Gauche */}
          <div
            onPointerDown={(e) => handleResize("sw", e)}
            className="absolute -bottom-1 -left-1 w-3 h-3 bg-base-100 border-2 border-primary rounded-full cursor-nesw-resize"
          />

          {/* Bas-Droite */}
          <div
            onPointerDown={(e) => handleResize("se", e)}
            className="absolute -bottom-1 -right-1 w-3 h-3 bg-base-100 border-2 border-primary rounded-full cursor-nwse-resize"
          />
        </>
      )}
      </div>
      {/* Pastilles de connexion (visibles uniquement en mode "connect") */}
      {mode === "connect" && (
        <>
          {/* Haut (Nord) */}
          <div
            data-side="n"
            className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-accent border-2 border-base-100 rounded-full cursor-crosshair z-30 hover:scale-125 transition-transform"
          />

          {/* Bas (Sud) */}
          <div
            data-side="s"
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-accent border-2 border-base-100 rounded-full cursor-crosshair z-30 hover:scale-125 transition-transform"
          />

          {/* Gauche (Ouest) */}
          <div
            data-side="w"
            className="absolute top-1/2 -translate-y-1/2 -left-2 w-4 h-4 bg-accent border-2 border-base-100 rounded-full cursor-crosshair z-30 hover:scale-125 transition-transform"
          />

          {/* Droite (Est) */}
          <div
            data-side="e"
            className="absolute top-1/2 -translate-y-1/2 -right-2 w-4 h-4 bg-accent border-2 border-base-100 rounded-full cursor-crosshair z-30 hover:scale-125 transition-transform"
          />
        </>
      )}
    </div>
  )
}

export default CardItem