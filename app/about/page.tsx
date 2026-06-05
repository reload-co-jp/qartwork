import { Metadata } from "next"

export const metadata: Metadata = {
  title: "このサイトについて | 美術クイズ",
  description: "美術クイズサイトの概要・利用データについて",
}

const Page = () => {
  return (
    <div style={{ maxWidth: "640px", lineHeight: 1.8 }}>
      <h1 style={{ fontSize: "1.2rem", marginBottom: "1.5rem" }}>このサイトについて</h1>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "0.95rem", color: "#bbb", marginBottom: "0.75rem" }}>概要</h2>
        <p style={{ color: "#ccc", fontSize: "0.9rem" }}>
          国立美術館の所蔵作品を題材に、美術の知識を学べるクイズサイト。作者・作品名・制作年代を4択形式で出題する。
        </p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "0.95rem", color: "#bbb", marginBottom: "0.75rem" }}>利用データ</h2>
        <p style={{ color: "#ccc", fontSize: "0.9rem", marginBottom: "0.75rem" }}>
          本サイトの作品データ・画像は{" "}
          <a
            href="https://search.artmuseums.go.jp/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#aaa" }}
          >
            国立美術館所蔵作品総合目録検索システム
          </a>{" "}
          の公開データを利用している。
        </p>
        <p style={{ color: "#ccc", fontSize: "0.9rem", marginBottom: "0.75rem" }}>
          掲載作品はパブリックドメイン（Public Domain）。
          利用規約は{" "}
          <a
            href="https://search.artmuseums.go.jp/how_to_use.html"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#aaa" }}
          >
            国立美術館所蔵作品総合目録検索システム 利用について
          </a>{" "}
          を参照。
        </p>
        <p style={{ color: "#ccc", fontSize: "0.9rem" }}>
          各作品の出典ページは作品詳細・作品一覧の「出典」リンクから確認できる。
        </p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "0.95rem", color: "#bbb", marginBottom: "0.75rem" }}>技術</h2>
        <ul style={{ color: "#ccc", fontSize: "0.9rem", paddingLeft: "1.25rem" }}>
          <li>Next.js (Static Export)</li>
          <li>TypeScript</li>
          <li>作品データ: 静的JSON</li>
        </ul>
      </section>
    </div>
  )
}

export default Page
