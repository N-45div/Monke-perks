"use client"

import React, { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useWalletUi } from "@wallet-ui/react"

type TodayDropResponse = {
  drop: null | {
    id: string
    title: string
    description: string | null
    startAt: string
    endAt: string
    supplyAllocation: number
    claimed?: number
    remaining?: number
    streakMultiplier: number | null
    status: string
    deal: {
      title?: string | null
      summary?: string | null
      heroImageUrl?: string | null
      discountType?: string | null
      discountValue?: number | null
      originalPrice?: number | null
      currency?: string | null
    }
  }
}

type ClaimResponse = {
  claim: {
    id: string
    status: string
    reference: string | null
    streakSnapshot: number
    couponId?: string
    paymentUrl?: string | null
  }
  streak: {
    current: number
    longest: number
  }
}

function formatTimeRemaining(endAt: string) {
  const diff = new Date(endAt).getTime() - Date.now()
  if (diff <= 0) return "Ended"
  const h = Math.floor(diff / (1000 * 60 * 60))
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const s = Math.floor((diff % (1000 * 60)) / 1000)
  return `${h}h ${m}m ${s}s`
}

export default function DropRushPage() {
  const { account, connected } = useWalletUi()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<TodayDropResponse | null>(null)

  const [claiming, setClaiming] = useState(false)
  const [claimResult, setClaimResult] = useState<ClaimResponse | null>(null)
  const [transferTo, setTransferTo] = useState("")
  const [transferring, setTransferring] = useState(false)
  const [transferMsg, setTransferMsg] = useState<string | null>(null)
  const [minting, setMinting] = useState(false)
  const [mintMsg, setMintMsg] = useState<string | null>(null)
  const [mintAddress, setMintAddress] = useState<string | null>(null)

  // load + poll drop state for live supply
  useEffect(() => {
    let mounted = true
    let timer: any
    const load = async () => {
      try {
        const res = await fetch("/api/drop-rush/today", { cache: "no-store" })
        if (!res.ok) throw new Error(`Failed to load drop: ${res.status}`)
        const json: TodayDropResponse = await res.json()
        if (mounted) setData(json)
      } catch (e: any) {
        if (mounted) setError(e?.message ?? "Failed to load drop")
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

  const drop = data?.drop ?? null
  const [tick, setTick] = useState(0)
  useEffect(() => {
    if (!drop?.endAt) return
    const id = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [drop?.endAt])

  const timeLeft = useMemo(() => (drop?.endAt ? formatTimeRemaining(drop.endAt) : null), [drop?.endAt, tick])

  async function onClaim() {
    if (!drop) return
    if (!connected || !account?.address) {
      setError("Connect a wallet to claim")
      return
    }
    setError(null)
    setClaiming(true)
    setClaimResult(null)
    try {
      const refParam = typeof window !== 'undefined' ? new URL(window.location.href).searchParams.get('ref') : null
      const url = new URL("/api/drop-rush/claim", window.location.origin)
      if (refParam) url.searchParams.set('ref', refParam)
      const res = await fetch(url.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dropId: drop.id, walletAddress: account.address }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Claim failed")
      setClaimResult(json as ClaimResponse)
    } catch (e: any) {
      setError(e?.message ?? "Claim failed")
    } finally {
      setClaiming(false)
    }
  }

  const inviteLink = useMemo(() => {
    if (!account?.address) return null
    const url = new URL(typeof window !== "undefined" ? window.location.href : "http://localhost")
    url.searchParams.set("ref", account.address)
    return url.toString()
  }, [account?.address])

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 text-white">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-black">Today’s Drop</h1>
          <p className="text-white/70 mt-2">Claim the daily perk. Keep your streak alive.</p>
        </div>
        <div className="text-right text-white/70 text-sm">
          {connected ? (
            <span>Connected: {account?.address?.slice(0, 4)}…{account?.address?.slice(-4)}</span>
          ) : (
            <span>Connect wallet to claim</span>
          )}
        </div>
      </header>

      {loading && <p className="text-white/70">Loading drop…</p>}
      {error && !loading && <p className="text-red-400">{error}</p>}

      {!loading && !drop && (
        <section className="rounded-2xl border border-white/12 bg-white/5 p-8 backdrop-blur">
          <p className="text-white/80">No active drop right now. Check back soon.</p>
        </section>
      )}

      {drop && (
        <section className="grid gap-8 lg:grid-cols-[1.2fr,1fr] items-start">
          <div className="rounded-2xl border border-white/12 bg-white/5 p-8 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <span className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
                Drop Rush
              </span>
              {timeLeft && <span className="text-sm text-white/80">Ends in {timeLeft}</span>}
            </div>
            <h2 className="mt-4 text-2xl font-bold">{drop.deal.title ?? drop.title}</h2>
            {drop.deal.summary && <p className="mt-2 text-white/70">{drop.deal.summary}</p>}

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-md border border-white/10 bg-white/5 p-3">Supply: {drop.supplyAllocation}</div>
              <div className="rounded-md border border-white/10 bg-white/5 p-3">Claimed: {drop.claimed ?? "-"}</div>
              <div className="rounded-md border border-white/10 bg-white/5 p-3">Remaining: {drop.remaining ?? "-"}</div>
              {typeof drop.streakMultiplier === "number" && (
                <div className="rounded-md border border-white/10 bg-white/5 p-3">Multiplier: x{drop.streakMultiplier.toFixed(1)}</div>
              )}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <Button onClick={onClaim} disabled={!connected || claiming} className="bg-white text-black hover:bg-white/90">
                {claiming ? "Claiming…" : connected ? "Claim Now" : "Connect wallet to claim"}
              </Button>
              <Button asChild variant="ghost" className="rounded-full bg-white/10 text-white hover:bg-white/20">
                <Link href="/leaderboard">View leaderboard</Link>
              </Button>
            </div>

            {claimResult && (
              <div className="mt-6 rounded-md border border-white/10 bg-white/5 p-4 text-sm">
                <p className="text-white/90">Claimed! Your streak: {claimResult.streak.current} (longest {claimResult.streak.longest})</p>
                {claimResult.claim.paymentUrl ? (
                  <p className="mt-2 text-white/80">
                    Payment required. Open this Solana Pay link in a wallet: {" "}
                    <a className="underline break-all" href={claimResult.claim.paymentUrl} target="_blank" rel="noreferrer">
                      {claimResult.claim.paymentUrl}
                    </a>
                  </p>
                ) : (
                  <p className="mt-2 text-white/80">Your claim is confirmed.</p>
                )}

                {/* Mint NFT (devnet demo) */}
                {claimResult.claim.couponId && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-white">Mint NFT (devnet)</h4>
                    <p className="text-white/70 text-xs mt-1">Mints a 1-of-1 SPL token as a demo NFT to your wallet.</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        disabled={minting || !connected}
                        onClick={async () => {
                          if (!account?.address) return
                          setMinting(true)
                          setMintMsg(null)
                          setMintAddress(null)
                          try {
                            const res = await fetch('/api/nft/prepare-mint', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ owner: account.address, couponId: claimResult.claim.couponId }),
                            })
                            const json = await res.json()
                            if (!res.ok) throw new Error(json?.error || 'Mint failed')
                            setMintAddress(json.mintAddress)
                            setMintMsg('Minted. You can verify ownership in your wallet or on /verify by reference.')
                          } catch (e: any) {
                            setMintMsg(e?.message ?? 'Mint failed')
                          } finally {
                            setMinting(false)
                          }
                        }}
                        className="text-xs"
                      >
                        {minting ? 'Minting…' : 'Mint NFT'}
                      </Button>
                      {mintAddress && (
                        <span className="text-xs text-white/70 break-all">Mint: {mintAddress}</span>
                      )}
                    </div>
                    {mintMsg && <p className="mt-2 text-xs text-white/70">{mintMsg}</p>}
                  </div>
                )}

                {claimResult.claim.couponId && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-white">Transfer coupon</h4>
                    <p className="text-white/70 text-xs mt-1">Send this perk to another wallet for the demo.</p>
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        value={transferTo}
                        onChange={(e) => setTransferTo(e.target.value)}
                        placeholder="Recipient wallet"
                        className="flex-1 rounded-md border border-white/15 bg-black/40 px-3 py-2 text-xs outline-none"
                      />
                      <Button
                        disabled={transferring || !transferTo.trim()}
                        onClick={async () => {
                          setTransferring(true)
                          setTransferMsg(null)
                          try {
                            const res = await fetch('/api/coupons/transfer', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ couponId: claimResult.claim.couponId, toWallet: transferTo.trim() }),
                            })
                            const json = await res.json()
                            if (!res.ok) throw new Error(json?.error || 'Transfer failed')
                            setTransferMsg('Transfer complete. Open /verify and enter your reference to see new owner.')
                          } catch (e: any) {
                            setTransferMsg(e?.message ?? 'Transfer failed')
                          } finally {
                            setTransferring(false)
                          }
                        }}
                        className="text-xs"
                      >
                        {transferring ? 'Transferring…' : 'Transfer'}
                      </Button>
                    </div>
                    {transferMsg && <p className="mt-2 text-xs text-white/70">{transferMsg}</p>}
                  </div>
                )}
              </div>
            )}
          </div>

          <aside className="rounded-2xl border border-white/12 bg-white/5 p-8 backdrop-blur">
            <h3 className="font-bold text-lg">Invite a friend</h3>
            <p className="text-white/70 text-sm mt-2">Share your link to boost your squad multiplier.</p>
            <div className="mt-3 rounded-md border border-white/10 bg-black/40 p-3 text-xs break-all">
              {inviteLink ?? "Connect wallet to generate invite link"}
            </div>
            {inviteLink && (
              <div className="mt-3">
                <Button
                  variant="outline"
                  className="text-xs"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(inviteLink)
                      toast.success("Invite link copied")
                    } catch (e) {
                      toast.error("Failed to copy")
                    }
                  }}
                >
                  Copy link
                </Button>
              </div>
            )}
            <div className="mt-6">
              <p className="text-xs text-white/60">Note: Referral multipliers will be reflected in leaderboard when enabled.</p>
            </div>
          </aside>
        </section>
      )}
    </main>
  )
}
