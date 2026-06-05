/**
 * Fetches artwork data from the National Art Museum of Japan search system.
 * https://search.artmuseums.go.jp/
 *
 * Usage:
 *   node scripts/fetch-artworks.mjs [--limit N] [--genres 01,04] [--pages N]
 *   node scripts/fetch-artworks.mjs --redownload-images
 *
 * Defaults: limit=200, genres=01,02,03,04 (絵画,水彩,素描,版画), pages=5
 * --redownload-images: re-fetch images for all existing artworks using download.php
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from "fs"
import { join } from "path"

const BASE_URL = "https://search.artmuseums.go.jp"
const DELAY_MS = 600
const MUSEUMS_PARAM = "momat=on&momak=on&nmwa=on&nmao=on&ncm=on"

// --- CLI args ---
const args = process.argv.slice(2)
const getArg = (name, def) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? args[i + 1] : def
}
const LIMIT = parseInt(getArg("limit", "200"), 10)
const GENRES = (getArg("genres", "01,02,03,04")).split(",")
const MAX_PAGES = parseInt(getArg("pages", "5"), 10)
const REDOWNLOAD_IMAGES = args.includes("--redownload-images")

// --- Utilities ---
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function kataToHira(str) {
  return str.replace(/[ァ-ヶ]/g, (c) =>
    String.fromCharCode(c.charCodeAt(0) - 0x60)
  )
}

async function fetchText(url, options = {}) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          "User-Agent": "qartwork-data-fetcher/1.0 (educational art quiz; github.com/qartwork)",
          ...options.headers,
        },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`)
      return await res.text()
    } catch (e) {
      if (attempt === 2) throw e
      await sleep(1000 * (attempt + 1))
    }
  }
}

// --- Artist kana map ---
// yomi.php: <TD>キシダ、リュウセイ</TD><TD><A ...>岸田劉生</A></TD>
async function buildArtistKanaMap() {
  const map = {}
  const initials = [
    "ア","イ","ウ","エ","オ",
    "カ","キ","ク","ケ","コ",
    "サ","シ","ス","セ","ソ",
    "タ","チ","ツ","テ","ト",
    "ナ","ニ","ヌ","ネ","ノ",
    "ハ","ヒ","フ","ヘ","ホ",
    "マ","ミ","ム","メ","モ",
    "ヤ","ユ","ヨ","ラ","リ","ル","レ","ロ","ワ",
  ]

  process.stdout.write("Building artist kana map")
  for (const kana of initials) {
    try {
      const body = new URLSearchParams({
        momat: "on", momak: "on", nmwa: "on", nmao: "on", ncm: "on",
        yomi: kana, yomi_col: "yomi",
      })
      const html = await fetchText(`${BASE_URL}/yomi.php`, { method: "POST", body })

      // Match: <TD>キシダ、リュウセイ</TD><TD><A ...>岸田劉生</A></TD>
      for (const [, kanaStr, nameStr] of html.matchAll(
        /<TD>([ァ-ヶーＡ-Ｚａ-ｚ、・\s]+?)<\/TD><TD><A[^>]+>([^<]+)<\/A><\/TD>/g
      )) {
        const cleanKana = kataToHira(kanaStr.trim()).replace(/[、・\s　]/g, "")
        map[nameStr.trim()] = cleanKana
      }
      process.stdout.write(".")
    } catch (e) {
      process.stdout.write("x")
    }
    await sleep(DELAY_MS)
  }
  console.log(` done (${Object.keys(map).length} artists)`)
  return map
}

// --- List page parser ---
// Row: <TD>作家名</TD><TD><A HREF='records.php?sakuhin=ID'>タイトル</A></TD><TD>年</TD><TD>ジャンル</TD><TD ...>所蔵館</TD><TD>...<img src="jpeg/thumbs/MUSEUM/FILE.jpg">...</TD></TR>
function parseListRows(html) {
  const results = []
  for (const [, artist, id, title, yearStr, genre, , thumbSrc] of html.matchAll(
    /<TD>([^<]*)<\/TD><TD><A HREF='records\.php\?sakuhin=(\d+)'>([^<]*)<\/A><\/TD><TD>([^<]*)<\/TD><TD>([^<]*)<\/TD><TD[^>]*>([^<]*)<\/TD><TD>[\s\S]*?src="(jpeg\/thumbs\/[^"]+|img\/null\.png)"[\s\S]*?<\/TR>/g
  )) {
    if (thumbSrc === "img/null.png") continue
    const year = parseInt((yearStr.match(/(\d{4})/) || [])[1] || "0", 10)
    results.push({ id, artist: artist.trim(), title: title.trim(), year, genre: genre.trim(), thumbSrc })
  }
  return results
}

// --- Detail page parser ---
function parseDetailPage(html) {
  // Artist
  const artist = (html.match(/<BIG[^>]*><B>([^<]+)<\/B><\/BIG>/) || [])[1]?.trim() || ""

  // Title: first <B>...</B> inside the detail DIV
  const titleMatch = html.match(/<SPAN CLASS='heading'>作品詳細<\/SPAN>[\s\S]*?<td><B>([\s\S]*?)<\/B><\/td>/)
  const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, "").trim() : ""

  // Year: NOT extracted from detail page (acquisition dates cause false positives).
  //       Use candidate.year from the list page instead.
  const year = 0

  // Category: <td align=right>絵画　：　油彩その他</td>
  const catRaw = (html.match(/<td align=right>([^<]+)<\/td>/) || [])[1] || ""
  const catClean = catRaw.replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim()
  const catParts = catClean.split(/[：:。]/)
  const category = (catParts[1]?.trim() || catParts[0]?.trim() || "").replace(/^\s*[-–]\s*/, "") || catClean

  // Museum
  const museum = (html.match(/<td><b>([^<]+(?:美術館|館)[^<]*)<\/b><\/td>/) || [])[1]?.trim() || ""

  // Mid image (fallback only)
  const imageFile = (html.match(/img src = 'jpeg\/mid\/([^']+\.jpg)'/) || [])[1] || null

  // Download button edaban (for full-quality download.php)
  const edaban = (html.match(/class="dl_button"[^>]*data-edaban="(\d+)"/) ||
                  html.match(/data-edaban="(\d+)"[^>]*class="dl_button"/) || [])[1] || null

  // License
  const licenseRaw = (html.match(/img\/licences\/[^/]+\/([^'.]+)/) || [])[1] || ""
  const licenseCode = licenseRaw.split(".")[0]

  // Public domain: has download button
  const isPublicDomain = html.includes('class="dl_button"')

  return { artist, title, year, category, museum, imageFile, edaban, licenseCode, isPublicDomain }
}

// --- Image download ---
async function downloadImage(url, destPath, { force = false } = {}) {
  if (!force && existsSync(destPath)) return true
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "qartwork-data-fetcher/1.0" },
    })
    if (!res.ok) return false
    writeFileSync(destPath, Buffer.from(await res.arrayBuffer()))
    return true
  } catch {
    return false
  }
}

// --- Redownload images for existing artworks ---
async function redownloadImages(existing, imagesDir) {
  console.log(`Redownloading images for ${existing.length} existing artworks...`)
  let done = 0
  let failed = 0

  for (const artwork of existing) {
    const imageDest = join(imagesDir, `${artwork.id}.jpg`)
    try {
      const html = await fetchText(`${BASE_URL}/records.php?sakuhin=${artwork.id}`)
      const { edaban, imageFile } = parseDetailPage(html)

      let downloaded = false
      if (edaban) {
        downloaded = await downloadImage(
          `${BASE_URL}/download.php?id=${artwork.id}&edaban=${edaban}`,
          imageDest,
          { force: true }
        )
      }
      if (!downloaded && imageFile) {
        downloaded = await downloadImage(`${BASE_URL}/jpeg/mid/${imageFile}`, imageDest, { force: true })
      }

      if (downloaded) {
        done++
      } else {
        failed++
        console.error(`  Failed: ${artwork.id}`)
      }

      if ((done + failed) % 20 === 0) {
        console.log(`  ${done + failed}/${existing.length} (${failed} failed)...`)
      }
    } catch (e) {
      failed++
      console.error(`  Error ${artwork.id}: ${e.message}`)
    }
    await sleep(DELAY_MS)
  }

  console.log(`Done: ${done} updated, ${failed} failed`)
}

// --- Search genre pages ---
async function searchGenre(genreCode, maxPages) {
  const candidates = []
  const seenIds = new Set()

  for (let page = 1; page <= maxPages; page++) {
    try {
      const body = new URLSearchParams(
        `${MUSEUMS_PARAM}&genre%5B${genreCode}%5D=${genreCode}&page=${page}&paging_flg=${page > 1 ? 1 : 0}`
      )
      const html = await fetchText(`${BASE_URL}/genre.php`, { method: "POST", body })
      const rows = parseListRows(html)
      if (rows.length === 0) break
      for (const row of rows) {
        if (!seenIds.has(row.id)) {
          seenIds.add(row.id)
          candidates.push(row)
        }
      }
      await sleep(DELAY_MS)
    } catch (e) {
      console.error(`  genre ${genreCode} page ${page} error: ${e.message}`)
      break
    }
  }
  return candidates
}

// --- Main ---
async function main() {
  const artworksDir = join(process.cwd(), "data", "artworks")
  const indexesDir = join(process.cwd(), "data", "indexes")
  const imagesDir = join(process.cwd(), "public", "images")

  mkdirSync(artworksDir, { recursive: true })
  mkdirSync(indexesDir, { recursive: true })
  mkdirSync(imagesDir, { recursive: true })

  // Load existing data (for resuming)
  const existingAllPath = join(indexesDir, "all.json")
  const existing = existsSync(existingAllPath)
    ? JSON.parse(readFileSync(existingAllPath, "utf-8"))
    : []
  const existingIds = new Set(existing.map((a) => a.id))
  console.log(`Existing: ${existingIds.size} artworks`)

  if (REDOWNLOAD_IMAGES) {
    await redownloadImages(existing, imagesDir)
    return
  }

  // Build kana map
  const kanaMap = await buildArtistKanaMap()

  // Collect candidates from genre pages
  console.log(`Searching genres: ${GENRES.join(", ")} (${MAX_PAGES} pages each)`)
  const allCandidates = []
  const seenIds = new Set(existingIds)

  for (const genre of GENRES) {
    const results = await searchGenre(genre, MAX_PAGES)
    let newCount = 0
    for (const r of results) {
      if (!seenIds.has(r.id)) {
        seenIds.add(r.id)
        allCandidates.push(r)
        newCount++
      }
    }
    console.log(`  Genre ${genre}: ${results.length} found, ${newCount} new`)
    await sleep(DELAY_MS)
  }

  console.log(`Total new candidates: ${allCandidates.length}`)

  // Fetch details and download images
  const newArtworks = []
  let processed = 0
  let skipped = 0

  for (const candidate of allCandidates) {
    if (newArtworks.length + existing.length >= LIMIT) break

    try {
      const html = await fetchText(`${BASE_URL}/records.php?sakuhin=${candidate.id}`)
      const detail = parseDetailPage(html)

      if (!detail.isPublicDomain || (!detail.edaban && !detail.imageFile)) {
        skipped++
        continue
      }

      const imageDest = join(imagesDir, `${candidate.id}.jpg`)
      let downloaded = false
      if (detail.edaban) {
        downloaded = await downloadImage(
          `${BASE_URL}/download.php?id=${candidate.id}&edaban=${detail.edaban}`,
          imageDest
        )
      }
      if (!downloaded && detail.imageFile) {
        downloaded = await downloadImage(`${BASE_URL}/jpeg/mid/${detail.imageFile}`, imageDest)
      }
      if (!downloaded) {
        skipped++
        continue
      }

      const year = candidate.year || detail.year
      const artist = detail.artist || candidate.artist
      const title = detail.title || candidate.title
      const category = detail.category || candidate.genre

      const artwork = {
        id: candidate.id,
        title,
        artist,
        artistKana: kanaMap[artist] || "",
        year,
        style: "",
        country: "",
        category,
        imageUrl: `/images/${candidate.id}.jpg`,
        sourceUrl: `${BASE_URL}/records.php?sakuhin=${candidate.id}`,
        license: detail.licenseCode || "NoC-CR",
        description: "",
      }

      writeFileSync(
        join(artworksDir, `${candidate.id}.json`),
        JSON.stringify(artwork, null, 2)
      )

      newArtworks.push(artwork)
      processed++

      if (processed % 20 === 0) {
        console.log(`  Saved ${processed} new artworks (${skipped} skipped)...`)
      }

      await sleep(DELAY_MS)
    } catch (e) {
      console.error(`  Error ${candidate.id}: ${e.message}`)
      skipped++
    }
  }

  console.log(`New: ${processed}, Skipped: ${skipped}`)

  // Merge with existing and save indexes
  const all = [...existing, ...newArtworks]
  writeFileSync(join(indexesDir, "all.json"), JSON.stringify(all, null, 2))

  const artists = [...new Set(all.map((a) => a.artist))].sort()
  writeFileSync(join(indexesDir, "artists.json"), JSON.stringify(artists, null, 2))

  const styles = [...new Set(all.map((a) => a.style).filter(Boolean))].sort()
  writeFileSync(join(indexesDir, "styles.json"), JSON.stringify(styles, null, 2))

  const countries = [...new Set(all.map((a) => a.country).filter(Boolean))].sort()
  writeFileSync(join(indexesDir, "countries.json"), JSON.stringify(countries, null, 2))

  console.log(`Done! Total: ${all.length} artworks saved to data/indexes/all.json`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
