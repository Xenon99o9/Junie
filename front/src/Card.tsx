type Card = {
  id: number
  text: string
}

type Props = {
    card: Card
}

const Card = ({card} : Props) => {

    return (
        <div className="w-40 h-40 bg-secondary">
            <div className="h-full w-full flex items-center justify-center">
                <p className="text-secondary-content text-center">{card.text}</p>
            </div>
            
        </div>
    )
}

export default Card

