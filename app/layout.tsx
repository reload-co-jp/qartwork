import Link from "next/link"
import "./reset.css"

export const metadata = {
  title: "Qartwork",
  description: "国立美術館作品で学ぶ美術クイズサイト",
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ja">
      <body>
        <header
          style={{
            backgroundColor: "#1e1e1e",
            borderBottom: "1px solid #333",
            padding: "0.75rem 1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              maxWidth: "960px",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "0 auto",
            }}
          >
            <Link
              href="/"
              style={{
                color: "#fff",
                textDecoration: "none",
                fontWeight: "bold",
                fontSize: "1rem",
              }}
            >
              Qartwork
            </Link>
            <nav
              style={{
                display: "flex",
                gap: "1.5rem",
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/artworks"
                style={{
                  color: "#aaa",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                }}
              >
                作品一覧
              </Link>
              <Link
                href="/quiz/artist"
                style={{
                  color: "#aaa",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                }}
              >
                作者当て
              </Link>
              <Link
                href="/quiz/title"
                style={{
                  color: "#aaa",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                }}
              >
                作品名当て
              </Link>
              <Link
                href="/quiz/year"
                style={{
                  color: "#aaa",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                }}
              >
                年代当て
              </Link>
              <Link
                href="/about"
                style={{
                  color: "#aaa",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  marginLeft: "auto",
                }}
              >
                このサイトについて
              </Link>
            </nav>
          </div>
        </header>
        <main
          style={{
            background: "#121212",
            minHeight: "calc(100dvh - 5rem)",
            padding: "1.5rem 1rem",
            maxWidth: "960px",
            margin: "0 auto",
          }}
        >
          {children}
        </main>
        <footer
          style={{
            backgroundColor: "#1e1e1e",
            borderTop: "1px solid #333",
            fontSize: "0.75rem",
            padding: "1rem",
            color: "#666",
            textAlign: "center",
          }}
        >
          <p>
            作品データ:{" "}
            <a
              href="https://search.artmuseums.go.jp/"
              style={{ color: "#888" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              国立美術館所蔵作品総合目録検索システム
            </a>
          </p>
        </footer>
      </body>
    </html>
  )
}

export default RootLayout
