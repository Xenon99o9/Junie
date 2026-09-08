import type { Card } from "./types"

type Props = {
    cards: Card[]
    setCards: (cards: Card[])=> void
}

const ToolBar = ({cards, setCards} : Props) => {

  const test0 : Card ={
    id:0,
    text:"mid",
    x:0,
    y:0,
    width: 100,
    height: 100,
  }
  const test1 : Card ={
    id:1,
    text:"100 100",
    x:100,
    y:100,
    width: 50,
    height: 50,
  }
  const test2 : Card ={
    id:2,
    text:"-100 -100",
    x:-100,
    y:-100,
    width: 200,
    height: 200,
  }


  function setTest(){
    console.log(cards)
    setCards([test0,test1,test2])
  }
    
    
  return (

    <div className="absolute top-0 left-0 w-40 h-screen z-20 overflow-hidden bg-primary p-4">
        <button className="btn btn-secondary" onClick={setTest}>Default</button>
    </div>
  )
}

export default ToolBar