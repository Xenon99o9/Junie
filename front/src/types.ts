export type Card = {
  id: number
  text: string
  x: number
  y: number
  width: number
  height: number
  index: number
}

export type Projet = {
  id: string;
  titre: string;
  dateModification: string;
  couleur: string;
}
export type Side = "n" | "s" | "e" | "w"

export type Wire = {
  id: number
  fromId: number
  toId: number
  fromSide: Side
  toSide: Side
}

export type Mode = "select" | "connect"
