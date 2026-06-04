import type { History, HistoryEntry } from "lib/types"

const KEY = "qartwork_history"

export function getHistory(): History {
  if (typeof window === "undefined") return {}
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}") as History
  } catch {
    return {}
  }
}

export function recordResult(artworkId: string, correct: boolean): void {
  const history = getHistory()
  const entry: HistoryEntry = history[artworkId] ?? { correct: 0, wrong: 0 }
  if (correct) {
    entry.correct += 1
  } else {
    entry.wrong += 1
  }
  history[artworkId] = entry
  localStorage.setItem(KEY, JSON.stringify(history))
}

export function getWrongRate(entry: HistoryEntry): number {
  const total = entry.correct + entry.wrong
  if (total === 0) return 0
  return entry.wrong / total
}
