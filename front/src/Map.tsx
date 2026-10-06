import CardItem from "./CardItem";
import type { Card, Side, Mode, Wire } from "./types"
import { useState, useRef, useEffect } from "react";

type Props = {
    cards: Card[]
    selected: number | null
    setSelected: (id: number | null) => void
    updateCardPosition: (id:number,x:number,y:number)=>void
    saveCardPosition: (id:number,x:number,y:number)=>void
    updateCardText: (id:number, text:string)=>void
    saveCardText: (id:number, text:string)=>void
    updateCardPositionAndSize: (id:number, x:number, y:number, width:number,height:number) => void
    saveCardPositionAndSize: (id:number, x:number, y:number, width:number,height:number) => void
    removeCard: (id:number) => void
    mode: Mode
    wires: Wire[]
    addWire: (fromId: number, fromSide: Side, toId: number, toSide: Side) => void
    selectedWire: number | null
    setSelectedWire: (id: number | null) => void
}

export const getAnchorPosition = (card: Card, side: Side) => {
  switch (side) {
    case "n": // Haut : même X, Y décalé vers le haut
      return { x: card.x, y: card.y - card.height / 2 }
    case "s": // Bas : même X, Y décalé vers le bas
      return { x: card.x, y: card.y + card.height / 2 }
    case "w": // Gauche : X décalé à gauche, même Y
      return { x: card.x - card.width / 2, y: card.y }
    case "e": // Droite : X décalé à droite, même Y
      return { x: card.x + card.width / 2, y: card.y }
  }
}

type DraftWire = {
  fromId: number
  fromSide: Side
  currentX: number
  currentY: number
} | null





const Map = ({ cards, selected, setSelected, updateCardPosition, saveCardPosition, updateCardText, saveCardText, updateCardPositionAndSize, saveCardPositionAndSize, removeCard, mode, wires, addWire, selectedWire, setSelectedWire }: Props) => {

  
  const handlePointerDown = (cardId: number, e: React.PointerEvent) => {
      e.stopPropagation() // Empêche le clic de traverser vers le fond

      if (e.button !== 0) return // Bloque le clic droit sur la carte
      e.stopPropagation()

      if (mode === "connect") return

      if (selected !== cardId){
        setSelected(cardId)
      }
      

      const currentCard = cards.find((card) => card.id === cardId )
      if (!currentCard){
        return
      }

      // A. Captures au moment T : où est la souris et où est l'objet ?
      const startSourisX = e.clientX
      const startSourisY = e.clientY
      const startObjetX = currentCard.x
      const startObjetY = currentCard.y
      let finalX = startObjetX
      let finalY = startObjetY
      let moved = false

      // B. Fonction appelée à chaque micro-déplacement
      const handlePointerMove = (moveEvent: PointerEvent) => {
        // Calcul du décalage (delta)
        const deltaX = (moveEvent.clientX - startSourisX) / zoom
        const deltaY = (moveEvent.clientY - startSourisY) / zoom

        // Nouvelle position = point de départ de l'objet + décalage
        finalX = startObjetX + deltaX
        finalY = startObjetY + deltaY
        moved = true
        updateCardPosition(cardId, finalX, finalY)
      }

      // C. Fonction appelée au relâchement
      const handlePointerUp = () => {
        // Nettoyage impératif : on arrête d'écouter la fenêtre
        window.removeEventListener("pointermove", handlePointerMove)
        window.removeEventListener("pointerup", handlePointerUp)
        if (moved) saveCardPosition(cardId, finalX, finalY)
      }

      // D. Branchement temporaire sur la fenêtre
      window.addEventListener("pointermove", handlePointerMove)
      window.addEventListener("pointerup", handlePointerUp)

  }

  // 1. La mémoire de la caméra (l'état)
  // Créer un état camera contenant deux nombres (x: largeurEcran / 2, y: hauteurEcran / 2)
  const [camera, setCamera] = useState({
    x: 0,
    y: 0,
  })

  // État du zoom (1 = 100 %)
  const [zoom, setZoom] = useState(1)

  // Référence vers le conteneur plein écran pour écouter la molette
  const mapRef = useRef<HTMLDivElement>(null)

  // Références miroir pour accéder aux valeurs à jour sans recréer l'écouteur
  const cameraRef = useRef(camera)
  cameraRef.current = camera
  const zoomRef = useRef(zoom)
  zoomRef.current = zoom

  // Gestion du zoomcd 
  useEffect(() => {
    const surMolette = (e: WheelEvent) => {
      console.log("OK")
      // Filtrer : on n'agit QUE si c'est un pincement pad ou un Ctrl+molette
      if (!e.ctrlKey) return

      // Bloque impérativement le zoom natif de la page Chromium / Firefox
      e.preventDefault()

      const facteur = Math.exp(-e.deltaY * 0.0015)
      const zoomActuel = zoomRef.current
      const nouveauZoom = Math.min(Math.max(zoomActuel * facteur, 0.1), 5)
      const ratio = nouveauZoom / zoomActuel

      const sourisX = e.clientX - window.innerWidth / 2
      const sourisY = e.clientY - window.innerHeight / 2

      const cameraActuelle = cameraRef.current
      const nouvelleCameraX = sourisX - (sourisX - cameraActuelle.x) * ratio
      const nouvelleCameraY = sourisY - (sourisY - cameraActuelle.y) * ratio

      zoomRef.current = nouveauZoom
      cameraRef.current = { x: nouvelleCameraX, y: nouvelleCameraY }

      setZoom(nouveauZoom)
      setCamera({ x: nouvelleCameraX, y: nouvelleCameraY })
    }

    // Branché sur window pour intercepter l'événement avant le navigateur
    window.addEventListener("wheel", surMolette, { passive: false })
    return () => window.removeEventListener("wheel", surMolette)
  }, [])
  
  // 2. L'écouteur au clic sur le fond
  const quandPointeurEnfonceSurFond = (e: React.PointerEvent) => {
    // SI le bouton cliqué n'est PAS le bouton 0 : QUITTER
    if (e.button !== 0) return

    // Désélectionner la carte en cours
    setSelected(null)
    setSelectedWire(null)

    // 1. Photo instantanée du point de départ
    const sourisDepartX = e.clientX
    const sourisDepartY = e.clientY
    const cameraDepartX = camera.x
    const cameraDepartY = camera.y

    // 2. Ce qu'on fait à chaque mouvement de souris
    const surMouvementSouris = (evenementMouvement: PointerEvent) => {
      const deltaX = evenementMouvement.clientX - sourisDepartX
      const deltaY = evenementMouvement.clientY - sourisDepartY

      // mettreAJourCamera({ x: cameraDepartX + deltaX, y: cameraDepartY + deltaY })
      setCamera({
        x: cameraDepartX + deltaX,
        y: cameraDepartY + deltaY,
      })
    }

    // 3. Ce qu'on fait quand on relâche le clic
    const surRelachementSouris = () => {
      // retirerEcouteurSurFenetre("pointermove", surMouvementSouris)
      // retirerEcouteurSurFenetre("pointerup", surRelachementSouris)
      window.removeEventListener("pointermove", surMouvementSouris)
      window.removeEventListener("pointerup", surRelachementSouris)
    }

    // 4. Brancher les écouteurs sur toute la fenêtre
    // ajouterEcouteurSurFenetre("pointermove", surMouvementSouris)
    // ajouterEcouteurSurFenetre("pointerup", surRelachementSouris)
    window.addEventListener("pointermove", surMouvementSouris)
    window.addEventListener("pointerup", surRelachementSouris)
  }

  // Le fil en cours de tirage (null si on ne tire rien)
  const [draftWire, setDraftWire] = useState<DraftWire>(null)

  // Outil indispensable : Convertit les pixels de l'écran en coordonnées du monde virtuel
  const screenToWorld = (screenX: number, screenY: number) => ({
    x: (screenX - window.innerWidth / 2 - cameraRef.current.x) / zoomRef.current,
    y: (screenY - window.innerHeight / 2 - cameraRef.current.y) / zoomRef.current,
  })

  const handleStartConnect = (cardId: number, side: Side, e: React.PointerEvent) => {
    e.stopPropagation() // Empêche de déclencher le déplacement de la carte
    if (e.button !== 0) return // Clic gauche uniquement

    const worldPos = screenToWorld(e.clientX, e.clientY)

    // 1. On initialise le câble au point de départ de la souris
    setDraftWire({
      fromId: cardId,
      fromSide: side,
      currentX: worldPos.x,
      currentY: worldPos.y,
    })

    // 2. À chaque pixel bougé, on met à jour la pointe du câble
    const onPointerMove = (moveEv: PointerEvent) => {
      const pos = screenToWorld(moveEv.clientX, moveEv.clientY)
      setDraftWire((prev) => (prev ? { ...prev, currentX: pos.x, currentY: pos.y } : null))
    }

    // 3. Quand on lâche le clic, on nettoie tout
    const onPointerUp = (upEv: PointerEvent) => {
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)

      // Magie d'internet : on récupère l'élément HTML exact sous la souris !
      const target = document.elementFromPoint(upEv.clientX, upEv.clientY) as HTMLElement

      // Si l'élément sous la souris possède notre attribut "data-isanchor"
      if (target && target.dataset.isanchor === "true") {
        const toId = Number(target.dataset.cardid)
        const toSide = target.dataset.side as Side

        // On vérifie qu'on ne relie pas la carte à elle-même
        if (toId !== cardId) {
          addWire(cardId, side, toId, toSide) // On sauvegarde le câble !
        }
      }

      setDraftWire(null) // Dans tous les cas, on efface le câble temporaire
    }

    // On écoute sur la fenêtre entière pour pouvoir tirer le fil même vite ou loin
    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)
  }

 
    return (

    <div
    ref={mapRef}
    onPointerDown={quandPointeurEnfonceSurFond}
    onClick={() => {
      setSelected(null)
      setSelectedWire(null)
    }}
    onClickCapture={() => setSelectedWire(null)}
    className="relative w-screen h-screen overflow-hidden bg-base-100 touch-none">
      
      <div
      style={{
          transform: `translate(${camera.x}px, ${camera.y}px) scale(${zoom})`,
          transformOrigin: "0 0",
        }}
      className="absolute top-1/2 left-1/2">
        {/* LE CALQUE DES FILS (placé en premier pour être en dessous des cartes) */}
        <svg className="absolute top-0 left-0 overflow-visible pointer-events-none z-0">
          {wires.map((wire) => {
            // On retrouve les deux cartes liées
            const fromCard = cards.find((c) => c.id === wire.fromId)
            const toCard = cards.find((c) => c.id === wire.toId)
            
            // Si une des cartes n'existe plus, on ne dessine rien
            if (!fromCard || !toCard) return null

            // On recalcule les ancres en direct pour que le fil suive si la carte bouge
            const start = getAnchorPosition(fromCard, wire.fromSide)
            const end = getAnchorPosition(toCard, wire.toSide)
            const isSelected = selectedWire === wire.id

            return (
              <g
                key={wire.id}
                style={{ cursor: "pointer" }}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation()
                  setSelected(null)
                  setSelectedWire(wire.id)
                }}
              >
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke="transparent"
                  strokeWidth={15 / zoom}
                  pointerEvents="stroke"
                />
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke="currentColor"
                  strokeWidth={isSelected ? 5 : 3}
                  className={isSelected ? "text-accent" : "text-primary"}
                  pointerEvents="none"
                />
              </g>
            )
          })}
          {draftWire && (() => {
            const fromCard = cards.find((c) => c.id === draftWire.fromId)
            if (!fromCard) return null
            
            // On calcule le point de départ avec la fonction que tu as déjà créée
            const start = getAnchorPosition(fromCard, draftWire.fromSide)

            return (
              <line
                x1={start.x}
                y1={start.y}
                x2={draftWire.currentX}
                y2={draftWire.currentY}
                stroke="currentColor"
                strokeWidth={3}
                strokeDasharray="6 4" // Fait un trait pointillé
                className="text-accent"
              />
            )
          })()}
        </svg>
        {cards.map((card) => (
            <CardItem
            key={card.id}
            card={card}
            zoom={zoom}
            selected={selected}
            setSelected={setSelected}
            onPointerDown={handlePointerDown}
            updateCardText={updateCardText}
            saveCardText={saveCardText}
            updateCardPositionAndSize={updateCardPositionAndSize}
            saveCardPositionAndSize={saveCardPositionAndSize}
            removeCard={removeCard}
            mode={mode}
            onStartConnect={handleStartConnect}
            />
        ))}

      </div>

    </div>
  )
}

export default Map