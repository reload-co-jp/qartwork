import { getAllArtworks } from "lib/artworks"
import QuizGame from "components/QuizGame"

const Page = () => {
  const artworks = getAllArtworks()
  return <QuizGame artworks={artworks} type="artist" />
}

export default Page
