type Card = {
  id: number
  text: string
  x: number
  y: number
}

type Props = {
    card: Card
}

const CardItem = ({card} : Props) => {

    return (
        <div style={{ left: `${card.x}px`, top: `${card.y}px` }} className="absolute -translate-x-1/2 -translate-y-1/2  w-40 h-40 bg-secondary">
            <div className="h-full w-full flex items-center justify-center">
                <p className="text-secondary-content text-center">{card.text}</p>
            </div>
            
        </div>
    )
}

export default CardItem

