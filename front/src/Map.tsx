import CardItem from "./CardItem";
import type { Card } from "./types"

type Props = {
    tab: Card[]
    selected: number | null
    setSelected: (id: number | null) => void
}



const Map = ({ tab, selected, setSelected }: Props) => {

    return (

    <div onClick={() => setSelected(null)} className="relative w-screen h-screen overflow-hidden bg-base-100">
      
      <div className="absolute top-1/2 left-1/2">
        {tab.map((card) => (
            <CardItem
            key={card.id}
            card={card}
            selected={selected}
            setSelected={setSelected}/>
        ))}

      </div>

    </div>
  )
}

export default Map