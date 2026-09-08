import Card from "./Card";

function App() {

  type Card = {
    id: number
    text: string
  }

  const test : Card ={
    id:0,
    text:"hehe"
  }

  return (
    <>
    <div>
        <p>test</p>
        <Card
        card={test} />
    </div>
    </>
  )
}

export default App
