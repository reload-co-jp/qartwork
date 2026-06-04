import type { Artwork, QuizType, History } from "lib/types"
import { getWrongRate } from "lib/history"

export function getAnswerLabel(artwork: Artwork, type: QuizType): string {
  switch (type) {
    case "artist":
      return artwork.artist
    case "title":
      return artwork.title
    case "year":
      return `${Math.floor(artwork.year / 10) * 10}年代`
    case "style":
      return artwork.style
    case "country":
      return artwork.country
  }
}

export function buildOptions(
  correct: Artwork,
  pool: Artwork[],
  type: QuizType
): string[] {
  const correctLabel = getAnswerLabel(correct, type)
  const otherLabels = [
    ...new Set(
      pool
        .filter((a) => a.id !== correct.id)
        .map((a) => getAnswerLabel(a, type))
        .filter((label) => label !== correctLabel)
    ),
  ]
  const shuffled = otherLabels.sort(() => Math.random() - 0.5).slice(0, 3)
  return [...shuffled, correctLabel].sort(() => Math.random() - 0.5)
}

export function pickArtwork(
  pool: Artwork[],
  history: History,
  weakMode: boolean
): Artwork {
  if (!weakMode || Object.keys(history).length === 0) {
    return pool[Math.floor(Math.random() * pool.length)]
  }
  const sorted = [...pool].sort((a, b) => {
    const ra = getWrongRate(history[a.id] ?? { correct: 0, wrong: 0 })
    const rb = getWrongRate(history[b.id] ?? { correct: 0, wrong: 0 })
    return rb - ra
  })
  const top = sorted.slice(0, Math.ceil(pool.length / 3))
  return top[Math.floor(Math.random() * top.length)]
}

export function filterByType(artworks: Artwork[], type: QuizType): Artwork[] {
  switch (type) {
    case "style":
      return artworks.filter((a) => a.style)
    case "country":
      return artworks.filter((a) => a.country)
    default:
      return artworks
  }
}
