import type { Artwork } from "lib/types"

function hashDate(dateStr: string): number {
  let hash = 0
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export function getTodayArtwork(artworks: Artwork[]): Artwork {
  const today = new Date().toISOString().slice(0, 10)
  const index = hashDate(today) % artworks.length
  return artworks[index]
}
