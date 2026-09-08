import { useState, useEffect } from "react"
import type React from "react"
import type { Card } from "./types"

type Props = {
  card: Card
  selected: number | null
  setSelected: (id: number | null) => void
  onPointerDown: (id: number, e: React.PointerEvent) => void
  updateCardText: (id: number, text: string) => void
}

const CardItem = ({
  card,
  selected,
  setSelected,
  onPointerDown,
  updateCardText,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false)
  const isSelected = selected === card.id

  // Désactive automatiquement l'édition si la carte perd la sélection globale
  useEffect(() => {
    if (!isSelected) {
      setIsEditing(false)
    }
  }, [isSelected])

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
            className={`text-secondary-content text-center w-full break-words ${
              isSelected ? "select-text" : "select-none"
            }`}
          >
            {card.text}
          </p>
        )}
      </div>
    </div>
  )
}

export default CardItem