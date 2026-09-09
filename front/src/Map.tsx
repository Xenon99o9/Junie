import CardItem from "./CardItem";
import type { Card } from "./types"

type Props = {
    tab: Card[]
    selected: number | null
    setSelected: (id: number | null) => void
    updateCardPosition: (id:number,x:number,y:number)=>void
    updateCardText: (id:number, text:string)=>void
    updateCardPositionAndSize: (id:number, x:number, y:number, width:number,height:number) => void
}





const Map = ({ tab, selected, setSelected, updateCardPosition, updateCardText, updateCardPositionAndSize }: Props) => {

  
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
    return (

    <div onClick={() => setSelected(null)} className="relative w-screen h-screen overflow-hidden bg-base-100">
      
      <div className="absolute top-1/2 left-1/2">
        {tab.map((card) => (
            <CardItem
            key={card.id}
            card={card}
            selected={selected}
            setSelected={setSelected}
            onPointerDown={handlePointerDown}
            updateCardText={updateCardText}
            updateCardPositionAndSize={updateCardPositionAndSize}
            />
        ))}

      </div>

    </div>
  )
}

export default Map