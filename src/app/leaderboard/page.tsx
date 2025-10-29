"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"

type LeaderboardEntry = {
  wallet: string
  streak: number
  user: {
    id: string
    walletAddress: string
    username?: string | null
    avatarUrl?: string | null
  } | null
}

type LeaderboardResponse = {
  leaderboard: LeaderboardEntry[]
}

export default function LeaderboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    let mounted = true
    let timer: any
    const load = async () => {
      try {
        const res = await fetch("/api/drop-rush/leaderboard", { cache: "no-store" })
        if (!res.ok) throw new Error(`Failed to load leaderboard: ${res.status}`)
        const json: LeaderboardResponse = await res.json()
        if (mounted) setEntries(json.leaderboard || [])
      } catch (e: any) {
        if (mounted) setError(e?.message ?? "Failed to load leaderboard")
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    timer = setInterval(load, 3000)
    return () => {
      mounted = false
      clearInterval(timer)
    }
  }, [])

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 text-white">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-black">Leaderboard</h1>
          <p className="text-white/70 mt-2">Top streaks update live as claims are confirmed.</p>
        </div>
        <div className="text-sm text-white/70">
          <Link className="underline" href="/drop-rush">Back to today’s drop</Link>
        </div>
      </header>

      {loading && <p className="text-white/70">Loading leaderboard…</p>}
      {error && !loading && <p className="text-red-400">{error}</p>}

      {!loading && (
        <section className="rounded-2xl border border-white/12 bg-white/5 p-6 backdrop-blur">
          {entries.length === 0 ? (
            <p className="text-white/80">No confirmed claims yet. Be the first to claim today’s drop.</p>
          ) : (
            <ol className="divide-y divide-white/10">
              {entries.map((e, idx) => (
                <li key={`${e.wallet}-${idx}`} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 text-center text-white/70">{idx + 1}</span>
                    <div>
                      <div className="font-semibold">
                        {e.user?.username || `${e.wallet.slice(0, 4)}…${e.wallet.slice(-4)}`}
                      </div>
                      <div className="text-xs text-white/60">{e.wallet}</div>
                    </div>
                  </div>
                  <div className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm">Streak: {e.streak}</div>
                </li>
              ))}
            </ol>
          )}
        </section>
      )}
    </main>
  )
}
