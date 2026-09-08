import type { Card } from "./types"

type Props = {
    card: Card
}

const CardItem = ({card} : Props) => {

    return (
        <div style={{ left: `${card.x}px`, top: `${card.y}px`, width: `${card.width}px`, height: `${card.height}px`}} className="absolute -translate-x-1/2 -translate-y-1/2  bg-secondary">
            <div className="h-full w-full flex items-center justify-center">
                <p className="text-secondary-content text-center">{card.text}</p>
            </div>
            
        </div>
    )
}

export default CardItem

