import CardItem from "./CardItem";
import type { Card, Side, Mode } from "./types"
import { useState, useRef, useEffect } from "react";

type Props = {
    tab: Card[]
    selected: number | null
    setSelected: (id: number | null) => void
    updateCardPosition: (id:number,x:number,y:number)=>void
    updateCardText: (id:number, text:string)=>void
    updateCardPositionAndSize: (id:number, x:number, y:number, width:number,height:number) => void
    removeCard: (id:number) => void
    mode: Mode
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





const Map = ({ tab, selected, setSelected, updateCardPosition, updateCardText, updateCardPositionAndSize, removeCard, mode }: Props) => {

  
  const handlePointerDown = (cardId: number, e: React.PointerEvent) => {
      e.stopPropagation() // Empêche le clic de traverser vers le fond

      if (e.button !== 0) return // Bloque le clic droit sur la carte
      e.stopPropagation()

      if (selected !== cardId){
        setSelected(cardId)
      }
      

      const currentCard = tab.find((card) => card.id === cardId )
      if (!currentCard){
        return
      }

      // A. Captures au moment T : où est la souris et où est l'objet ?
      const startSourisX = e.clientX
      const startSourisY = e.clientY
      const startObjetX = currentCard.x
      const startObjetY = currentCard.y

      // B. Fonction appelée à chaque micro-déplacement
      const handlePointerMove = (moveEvent: PointerEvent) => {
        // Calcul du décalage (delta)
        const deltaX = (moveEvent.clientX - startSourisX) / zoom
        const deltaY = (moveEvent.clientY - startSourisY) / zoom

        // Nouvelle position = point de départ de l'objet + décalage
        updateCardPosition(cardId, startObjetX + deltaX, startObjetY + deltaY)
      }

      // C. Fonction appelée au relâchement
      const handlePointerUp = () => {
        // Nettoyage impératif : on arrête d'écouter la fenêtre
        window.removeEventListener("pointermove", handlePointerMove)
        window.removeEventListener("pointerup", handlePointerUp)
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

 
    return (

    <div
    ref={mapRef}
    onPointerDown={quandPointeurEnfonceSurFond}
    onClick={() => setSelected(null)} 
    className="relative w-screen h-screen overflow-hidden bg-base-100 touch-none">
      
      <div
      style={{
          transform: `translate(${camera.x}px, ${camera.y}px) scale(${zoom})`,
          transformOrigin: "0 0",
        }}
      className="absolute top-1/2 left-1/2">
        {tab.map((card) => (
            <CardItem
            key={card.id}
            card={card}
            zoom={zoom}
            selected={selected}
            setSelected={setSelected}
            onPointerDown={handlePointerDown}
            updateCardText={updateCardText}
            updateCardPositionAndSize={updateCardPositionAndSize}
            removeCard={removeCard}
            mode={mode}
            />
        ))}

      </div>

    </div>
  )
}

export default Map