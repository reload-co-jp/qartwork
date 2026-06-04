"use client"

import { FC, useState, useCallback, useEffect } from "react"
import Image from "next/image"
import type { Artwork, QuizType } from "lib/types"
import { getHistory, recordResult } from "lib/history"
import { buildOptions, pickArtwork, filterByType, getAnswerLabel } from "lib/quiz"

type Props = {
  artworks: Artwork[]
  type: QuizType
}

type Phase = "question" | "result"

const QuizGame: FC<Props> = ({ artworks, type }) => {
  const [weakMode, setWeakMode] = useState(false)
  const [artwork, setArtwork] = useState<Artwork | null>(null)
  const [options, setOptions] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [phase, setPhase] = useState<Phase>("question")
  const [score, setScore] = useState({ correct: 0, total: 0 })

  const pool = filterByType(artworks, type)

  const next = useCallback(() => {
    const history = getHistory()
    const picked = pickArtwork(pool, history, weakMode)
    const opts = buildOptions(picked, pool, type)
    setArtwork(picked)
    setOptions(opts)
    setSelected(null)
    setPhase("question")
  }, [pool, type, weakMode])

  useEffect(() => {
    next()
  }, [next])

  const handleSelect = (option: string) => {
    if (phase !== "question" || !artwork) return
    const correct = option === getAnswerLabel(artwork, type)
    setSelected(option)
    setPhase("result")
    setScore((s) => ({
      correct: s.correct + (correct ? 1 : 0),
      total: s.total + 1,
    }))
    recordResult(artwork.id, correct)
  }

  if (!artwork) return null

  const correctLabel = getAnswerLabel(artwork, type)

  const typeLabel: Record<QuizType, string> = {
    artist: "作者",
    title: "作品名",
    year: "制作年代",
    style: "様式",
    country: "国・地域",
  }

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <span style={{ color: "#aaa", fontSize: "0.85rem" }}>
          {typeLabel[type]}クイズ
        </span>
        <label style={{ fontSize: "0.85rem", color: "#aaa", cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={weakMode}
            onChange={(e) => setWeakMode(e.target.checked)}
            style={{ marginRight: "0.4rem" }}
          />
          苦手問題優先
        </label>
      </div>

      <div style={{ fontSize: "0.85rem", color: "#888", marginBottom: "0.5rem" }}>
        正解 {score.correct} / {score.total}
      </div>

      <div
        style={{
          width: "100%",
          aspectRatio: "4/3",
          background: "#1a1a1a",
          borderRadius: "8px",
          overflow: "hidden",
          position: "relative",
          marginBottom: "1rem",
        }}
      >
        <Image
          src={artwork.imageUrl}
          alt="この作品は？"
          fill
          style={{ objectFit: "contain" }}
          unoptimized
        />
      </div>

      <p style={{ textAlign: "center", color: "#bbb", marginBottom: "1rem" }}>
        {typeLabel[type]}は？
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        {options.map((opt) => {
          let bg = "#2a2a2a"
          if (phase === "result") {
            if (opt === correctLabel) bg = "#1a5c2a"
            else if (opt === selected) bg = "#5c1a1a"
          }
          return (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              disabled={phase === "result"}
              style={{
                background: bg,
                color: "#fff",
                border: "1px solid #444",
                borderRadius: "6px",
                padding: "0.75rem 0.5rem",
                fontSize: "0.9rem",
                cursor: phase === "question" ? "pointer" : "default",
                transition: "background 0.2s",
                textAlign: "center",
              }}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {phase === "result" && (
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              color: selected === correctLabel ? "#4caf50" : "#f44336",
              fontWeight: "bold",
              marginBottom: "0.5rem",
            }}
          >
            {selected === correctLabel ? "正解！" : `不正解 — 正解: ${correctLabel}`}
          </p>
          <button
            onClick={next}
            style={{
              background: "#444",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "0.6rem 1.5rem",
              fontSize: "0.9rem",
              cursor: "pointer",
            }}
          >
            次の問題
          </button>
        </div>
      )}
    </div>
  )
}

export default QuizGame
