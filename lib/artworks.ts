import { readFileSync } from "fs"
import { join } from "path"
import type { Artwork } from "lib/types"

export function getAllArtworks(): Artwork[] {
  const raw = readFileSync(
    join(process.cwd(), "data/indexes/all.json"),
    "utf-8"
  )
  return JSON.parse(raw)
}

export function getArtwork(id: string): Artwork | null {
  try {
    const raw = readFileSync(
      join(process.cwd(), `data/artworks/${id}.json`),
      "utf-8"
    )
    return JSON.parse(raw)
  } catch {
    return null
  }
}
