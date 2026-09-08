import { useState } from "react";
import Map from "./Map";

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

  const test0 : Card ={
    id:0,
    text:"mid",
    x:0,
    y:0,
  }
  const test1 : Card ={
    id:0,
    text:"100 100",
    x:100,
    y:100,
  }
  const test2 : Card ={
    id:0,
    text:"-100 -100",
    x:-100,
    y:-100,
  }
  
  function setTest(){
    setCards([test0,test1,test2])
  }
  

  return (
    <div>
      <button className="btn" onClick={setTest}>Default</button>
        <p>test</p>
        <Map
        tab={cards} />
    </div>
  )
}


export default App
