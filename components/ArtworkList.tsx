"use client"

import { FC, useState, useMemo } from "react"
import Fuse from "fuse.js"
import type { Artwork } from "lib/types"
import ArtworkCard from "components/ArtworkCard"

type Props = {
  artworks: Artwork[]
  artists: string[]
  styles: string[]
  countries: string[]
}

const ArtworkList: FC<Props> = ({ artworks, artists, styles, countries }) => {
  const [query, setQuery] = useState("")
  const [artist, setArtist] = useState("")
  const [style, setStyle] = useState("")
  const [country, setCountry] = useState("")

  const fuse = useMemo(
    () =>
      new Fuse(artworks, {
        keys: ["title", "artist", "style"],
        threshold: 0.4,
      }),
    [artworks]
  )

  const filtered = useMemo(() => {
    let result = query
      ? fuse.search(query).map((r) => r.item)
      : [...artworks]
    if (artist) result = result.filter((a) => a.artist === artist)
    if (style) result = result.filter((a) => a.style === style)
    if (country) result = result.filter((a) => a.country === country)
    return result
  }, [query, artist, style, country, fuse, artworks])

  const selectStyle: React.CSSProperties = {
    background: "#2a2a2a",
    color: "#fff",
    border: "1px solid #444",
    borderRadius: "4px",
    padding: "0.4rem 0.6rem",
    fontSize: "0.85rem",
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <input
          type="text"
          placeholder="タイトル・作者・様式 検索"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            ...selectStyle,
            flex: "1 1 200px",
          }}
        />
        <select
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          style={selectStyle}
        >
          <option value="">作者 すべて</option>
          {artists.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          style={selectStyle}
        >
          <option value="">様式 すべて</option>
          {styles.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          style={selectStyle}
        >
          <option value="">国 すべて</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <p style={{ color: "#888", fontSize: "0.85rem", margin: "0 0 1rem" }}>
        {filtered.length} 件
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        {filtered.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </div>
    </div>
  )
}

export default ArtworkList
