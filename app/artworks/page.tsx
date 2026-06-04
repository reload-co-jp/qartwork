import { getAllArtworks } from "lib/artworks"
import ArtworkList from "components/ArtworkList"

const Page = () => {
  const artworks = getAllArtworks()
  const artists = [...new Set(artworks.map((a) => a.artist))].sort()
  const styles = [...new Set(artworks.map((a) => a.style))].sort()
  const countries = [...new Set(artworks.map((a) => a.country))].sort()

  return (
    <div>
      <h1 style={{ fontSize: "1.2rem", marginBottom: "1.5rem" }}>作品一覧</h1>
      <ArtworkList
        artworks={artworks}
        artists={artists}
        styles={styles}
        countries={countries}
      />
    </div>
  )
}

export default Page
