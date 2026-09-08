import CardItem from "./CardItem";


type Card = {
    id: number
    text: string
    x:number
    y:number
}

type Props = {
    tab: Card[]
}



const Map = ({ tab }: Props) => {

    return (

    <div className="relative w-screen h-screen overflow-hidden bg-base-100">
      
      <div className="absolute top-1/2 left-1/2">
        {tab.map((card) => (
            <CardItem
            key={card.id}
            card={card} />
        ))}

      </div>

    </div>
  )
}

export default Map