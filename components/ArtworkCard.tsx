import Link from "next/link"
import Image from "next/image"
import { FC } from "react"
import type { Artwork } from "lib/types"

type Props = {
  artwork: Artwork
}

const ArtworkCard: FC<Props> = ({ artwork }) => (
  <Link
    href={`/artworks/${artwork.id}`}
    style={{
      display: "block",
      background: "#2a2a2a",
      borderRadius: "8px",
      overflow: "hidden",
      textDecoration: "none",
      color: "inherit",
      transition: "transform 0.2s",
    }}
  >
    <div
      style={{
        width: "100%",
        aspectRatio: "4/3",
        background: "#1a1a1a",
        position: "relative",
      }}
    >
      <Image
        src={artwork.imageUrl}
        alt={artwork.title}
        fill
        style={{ objectFit: "cover" }}
        unoptimized
      />
    </div>
    <div style={{ padding: "0.75rem" }}>
      <p style={{ margin: 0, fontWeight: "bold", fontSize: "0.9rem" }}>
        {artwork.title}
      </p>
      <p style={{ margin: "0.25rem 0 0", fontSize: "0.8rem", color: "#aaa" }}>
        {artwork.artist} / {artwork.year}
      </p>
    </div>
  </Link>
)

export default ArtworkCard
