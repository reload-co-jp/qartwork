import Image from "next/image"
import Link from "next/link"
import { getAllArtworks } from "lib/artworks"
import { getTodayArtwork } from "lib/today"

const Page = () => {
  const artworks = getAllArtworks()
  const artwork = getTodayArtwork(artworks)

  return (
    <div>
      <h2 style={{ color: "#bbb", fontSize: "0.85rem", marginBottom: "1rem" }}>
        今日の1作品
      </h2>
      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            flex: "0 0 320px",
            aspectRatio: "4/3",
            background: "#1a1a1a",
            borderRadius: "8px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Image
            src={artwork.imageUrl}
            alt={artwork.title}
            fill
            style={{ objectFit: "contain" }}
            unoptimized
          />
        </div>
        <div style={{ flex: "1 1 200px" }}>
          <h1 style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>
            {artwork.title}
          </h1>
          <p style={{ color: "#aaa", marginBottom: "0.25rem" }}>{artwork.artist}</p>
          <p style={{ color: "#888", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
            {artwork.year}年 / {artwork.style}
          </p>
          <p style={{ color: "#888", fontSize: "0.85rem", marginBottom: "1rem" }}>
            {artwork.country} / {artwork.category}
          </p>
          {artwork.description && (
            <p style={{ color: "#bbb", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "1rem" }}>
              {artwork.description}
            </p>
          )}
          <Link
            href={`/artworks/${artwork.id}`}
            style={{
              display: "inline-block",
              background: "#2a2a2a",
              color: "#fff",
              textDecoration: "none",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              fontSize: "0.85rem",
              marginRight: "0.5rem",
            }}
          >
            詳細を見る
          </Link>
          <a
            href={artwork.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              color: "#888",
              fontSize: "0.8rem",
              padding: "0.5rem",
            }}
          >
            出典
          </a>
        </div>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h2 style={{ color: "#bbb", fontSize: "0.85rem", marginBottom: "1rem" }}>
          クイズで遊ぶ
        </h2>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {[
            { href: "/quiz/artist", label: "作者当て" },
            { href: "/quiz/title", label: "作品名当て" },
            { href: "/quiz/year", label: "年代当て" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                background: "#2a2a2a",
                color: "#fff",
                textDecoration: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                fontSize: "0.9rem",
                border: "1px solid #444",
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Page
