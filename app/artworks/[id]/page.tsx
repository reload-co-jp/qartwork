import Link from "next/link"
import { notFound } from "next/navigation"
import { getAllArtworks, getArtwork } from "lib/artworks"
import ImageLightbox from "components/ImageLightbox"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  const artworks = getAllArtworks()
  return artworks.map((a) => ({ id: a.id }))
}

const Page = async ({ params }: Props) => {
  const { id } = await params
  const artwork = getArtwork(id)
  if (!artwork) notFound()

  return (
    <div>
      <Link
        href="/artworks"
        style={{ color: "#888", textDecoration: "none", fontSize: "0.85rem" }}
      >
        ← 一覧に戻る
      </Link>
      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          flexWrap: "wrap",
          marginTop: "1rem",
        }}
      >
        <ImageLightbox src={artwork.imageUrl} alt={artwork.title} />
        <div style={{ flex: "1 1 200px" }}>
          <h1 style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>
            {artwork.title}
          </h1>
          <dl
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: "0.25rem 1rem",
              fontSize: "0.9rem",
              marginBottom: "1rem",
            }}
          >
            {[
              ["作者", artwork.artist],
              ["作者カナ", artwork.artistKana],
              ["制作年", artwork.year ? `${artwork.year}年` : ""],
              ["様式", artwork.style],
              ["国・地域", artwork.country],
              ["カテゴリ", artwork.category],
              ["ライセンス", artwork.license],
            ]
              .filter(([, value]) => value)
              .map(([label, value]) => (
              <>
                <dt key={`dt-${label}`} style={{ color: "#888" }}>
                  {label}
                </dt>
                <dd key={`dd-${label}`} style={{ margin: 0 }}>
                  {value}
                </dd>
              </>
            ))}
          </dl>
          {artwork.description && (
            <p
              style={{
                color: "#bbb",
                fontSize: "0.9rem",
                lineHeight: 1.7,
                marginBottom: "1rem",
              }}
            >
              {artwork.description}
            </p>
          )}
          <p style={{ fontSize: "0.75rem", color: "#666" }}>
            出典:{" "}
            <a
              href={artwork.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#888" }}
            >
              国立美術館所蔵作品総合目録検索システム
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page
