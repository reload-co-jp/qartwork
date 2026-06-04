export type Artwork = {
  id: string
  title: string
  artist: string
  artistKana: string
  year: number
  style: string
  country: string
  category: string
  imageUrl: string
  sourceUrl: string
  license: string
  description: string
}

export type QuizType = "artist" | "title" | "year" | "style" | "country"

export type HistoryEntry = {
  correct: number
  wrong: number
}

export type History = Record<string, HistoryEntry>
