import { useState } from "react";
import Map from "./Map";
import ToolBar from "./ToolBar";

function App() {

  type Card = {
    id: number
    text: string
    x:number
    y:number
  }

  const savedCards = localStorage.getItem("cards")
  const initialCards = savedCards ? JSON.parse(savedCards) : []
  const [cards, setCards] = useState<Card[]>(initialCards)
  

  return (
    <div className="relative w-screen h-screen overflow-hidden">
  
      {/* Interface flottante */}
      

      {/* arrière-plan */}
      <Map tab={cards} />
      <ToolBar cards={cards} setCards={setCards}/>

  </div>
  )
}


export default App
