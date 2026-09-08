import type { Card } from "./types"

type Props = {
    card: Card
    selected: number | null
    setSelected: (id: number | null) => void
}

const CardItem = ({card, selected, setSelected} : Props) => {

    return (
        <div onClick={(e) => {
            e.stopPropagation()
            setSelected(card.id)}}
            style={{ left: `${card.x}px`, top: `${card.y}px`, width: `${card.width}px`, height: `${card.height}px`}}
            className="absolute -translate-x-1/2 -translate-y-1/2  bg-secondary rounded-lg">
            <div className={`h-full w-full flex items-center justify-center ${selected === card.id ? "border-4 border-primary rounded-lg" : "border-transparent"}`}>
                <p className="text-secondary-content text-center">{card.text}</p>
            </div>
            
        </div>
    )
}

export default CardItem

