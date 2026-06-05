# 美術学習・クイズサイト 仕様書

## 概要

国立美術館所蔵作品総合目録検索システムの公開データを利用し、美術作品を学習しながらクイズ形式で知識を身につけられるWebサイトを構築する。

DBは利用せず、静的JSONファイルと静的サイト生成を前提とする。

---

# 目的

- 美術作品に親しむ
- 作者・作品名・年代・様式を学ぶ
- ゲーム感覚で知識を定着させる
- パブリックドメイン作品の活用促進

---

# システム構成

```txt
国立美術館検索システム
        ↓
 データ取得スクリプト
        ↓
      JSON生成
        ↓
      GitHub
        ↓
      Next.js
 Static Export
        ↓
 GitHub Pages
```

DBは利用しない。

---

# データ取得

国立美術館所蔵作品総合目録検索システムの公開API・データを利用。

- API仕様: https://search.artmuseums.go.jp/how_to_use.html
- 利用規約に従い取得・加工・公開

取得後 `data/artworks/` 以下に静的JSONとして保存。画像は `public/images/` に配置。

---

# ID仕様

作品IDは国立美術館検索システムの作品IDをそのまま利用する。

例:

https://search.artmuseums.go.jp/records.php?sakuhin=4760

```json
{
  "id": "4760"
}
```

独自IDは発行しない。

---

# データ構造

```json
{
  "id": "4760",
  "title": "麗子五歳之像",
  "artist": "岸田劉生",
  "artistKana": "きしだりゅうせい",
  "year": 1918,
  "style": "写実主義",
  "country": "日本",
  "category": "油彩画",
  "imageUrl": "/images/4760.jpg",
  "sourceUrl": "https://search.artmuseums.go.jp/records.php?sakuhin=4760",
  "license": "Public Domain",
  "description": ""
}
```

---

# ディレクトリ構成

```txt
data/
├── artworks/
│   ├── 4760.json
│   ├── 4761.json
│   └── ...
│
└── indexes/
    ├── all.json
    ├── artists.json
    ├── styles.json
    └── countries.json

public/
└── images/
    ├── 4760.jpg
    ├── 4761.jpg
    └── ...
```

---

# 学習機能

## 作品一覧

表示項目

- 作品画像
- タイトル
- 作者
- 制作年

フィルタ

- 作者
- 時代
- 国
- 様式
- カテゴリ

## 作品詳細

表示項目

- 画像
- 作者
- 制作年
- 解説
- 出典リンク

出典表記を必須とする。

---

# クイズ機能

## 作者当てクイズ

作品画像を表示し、作者を4択で回答する。

## 作品名当てクイズ

作品画像を表示し、作品名を4択で回答する。

## 制作年代当てクイズ

作品画像を表示し、制作年代を4択で回答する。

年代は10年単位に丸める。

## 美術様式当てクイズ

作品画像を表示し、様式を4択で回答する。

様式情報が存在する作品のみ対象。

## 国・地域当てクイズ

作品画像を表示し、文化圏・国を4択で回答する。

国情報が存在する作品のみ対象。

---

# 出題モード

総合クイズは実装しない。

各クイズは独立ページとする。

```txt
/quiz/artist
/quiz/title
/quiz/year
/quiz/style
/quiz/country
```

---

# 学習履歴

LocalStorageを利用する。

```json
{
  "4760": {
    "correct": 8,
    "wrong": 3
  }
}
```

---

# 苦手問題モード

間違い率の高い作品を優先出題する。

---

# 今日の1作品

日付から決定的に作品を選択する。

```ts
hash(YYYY-MM-DD) % 件数
```

---

# 検索

クライアントサイド検索。

対象

- 作者
- タイトル
- 様式

実装候補

- Fuse.js

---

# 技術仕様

## フロントエンド

- TypeScript
- Next.js App Router

## 配信

```js
output: "export"
```

## ホスティング

- GitHub Pages
- Cloudflare Pages
- Netlify

---

# MVP

初期リリース対象

- 作品一覧
- 作品詳細
- 作者当てクイズ
- 作品名当てクイズ
- 制作年代当てクイズ
- LocalStorage学習履歴
- 苦手問題復習
- 静的JSON運用
- GitHub Pages公開

DB・認証・サーバーは利用しない。
