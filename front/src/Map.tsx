import CardItem from "./CardItem";
import type { Card } from "./types"
import { useState } from "react";

type Props = {
    tab: Card[]
    selected: number | null
    setSelected: (id: number | null) => void
    updateCardPosition: (id:number,x:number,y:number)=>void
    updateCardText: (id:number, text:string)=>void
    updateCardPositionAndSize: (id:number, x:number, y:number, width:number,height:number) => void
    removeCard: (id:number) => void
}





const Map = ({ tab, selected, setSelected, updateCardPosition, updateCardText, updateCardPositionAndSize, removeCard }: Props) => {

  
  const handlePointerDown = (cardId: number, e: React.PointerEvent) => {
      e.stopPropagation() // Empêche le clic de traverser vers le fond


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
        const deltaX = moveEvent.clientX - startSourisX
        const deltaY = moveEvent.clientY - startSourisY

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

  // Déplacement d'une carte individuelle
  const handleCardPointerDown = (cardId: number, e: React.PointerEvent) => {
    e.stopPropagation()

    if (selected !== cardId) {
      setSelected(cardId)
    }

    const currentCard = tab.find((card) => card.id === cardId)
    if (!currentCard) return

    const startSourisX = e.clientX
    const startSourisY = e.clientY
    const startObjetX = currentCard.x
    const startObjetY = currentCard.y

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startSourisX
      const deltaY = moveEvent.clientY - startSourisY
      updateCardPosition(cardId, startObjetX + deltaX, startObjetY + deltaY)
    }

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }

    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerup", handlePointerUp)
  }
    return (

    <div
    onPointerDown={quandPointeurEnfonceSurFond}
    onClick={() => setSelected(null)} className="relative w-screen h-screen overflow-hidden bg-base-100">
      
      <div
      style={{
          transform: `translate(${camera.x}px, ${camera.y}px)`,
        }}
      className="absolute top-1/2 left-1/2">
        {tab.map((card) => (
            <CardItem
            key={card.id}
            card={card}
            selected={selected}
            setSelected={setSelected}
            onPointerDown={handlePointerDown}
            updateCardText={updateCardText}
            updateCardPositionAndSize={updateCardPositionAndSize}
            removeCard={removeCard}
            />
        ))}

      </div>

    </div>
  )
}

export default Map