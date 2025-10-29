"use client"

import React, { useState } from "react"

export default function VerifyPage() {
  const [ref, setRef] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)

  async function onVerify(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setData(null)
    setLoading(true)
    try {
      const url = new URL("/api/drop-rush/verify", window.location.origin)
      url.searchParams.set("ref", ref.trim())
      const res = await fetch(url.toString(), { cache: "no-store" })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || json?.reason || "Verification failed")
      setData(json)
    } catch (e: any) {
      setError(e?.message ?? "Verification failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 text-white">
      <h1 className="text-4xl md:text-5xl font-black">Verify Redemption</h1>
      <p className="text-white/70 mt-2">Enter a Solana Pay reference to check claim and ownership status.</p>

      <form onSubmit={onVerify} className="mt-8 flex items-center gap-3">
        <input
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          placeholder="Reference (public key)"
          className="flex-1 rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none"
        />
        <button
          type="submit"
          disabled={loading || !ref.trim()}
          className="rounded-md bg-white px-4 py-2 text-black hover:bg-white/90 disabled:opacity-50"
        >
          {loading ? "Checking…" : "Verify"}
        </button>
      </form>

      {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}

      {data && (
        <section className="mt-6 rounded-2xl border border-white/12 bg-white/5 p-6 backdrop-blur text-sm">
          <div className="grid gap-2">
            <div>Status: {data.verified ? "VERIFIED" : data.status}</div>
            <div>Wallet: {data.walletAddress || "-"}</div>
            <div>Drop: {data.drop?.title}</div>
            <div>Deal: {data.drop?.deal?.title} ({data.drop?.deal?.slug})</div>
            <div>Tx: {data.transactionSig || "-"}</div>
            {data.coupon && (
              <div className="mt-3 rounded-md border border-white/10 bg-black/40 p-3">
                <div>Coupon ID: {data.coupon.id}</div>
                <div>Owner: {data.coupon.ownerWallet || "-"}</div>
                <div>State: {data.coupon.state}</div>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  )
}
