"use client"

import React from "react"

export default function BuildersPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12 text-white">
      <h1 className="text-4xl md:text-5xl font-black">Builders: API v1</h1>
      <p className="text-white/70 mt-2">Simple, stable endpoints to discover drops, claim, verify redemption, and transfer coupons.</p>

      <section className="mt-10 space-y-6">
        <h2 className="text-2xl font-bold">Endpoints</h2>
        <div className="rounded-2xl border border-white/12 bg-white/5 p-6 backdrop-blur text-sm">
          <ul className="space-y-3 list-disc pl-5">
            <li><code>GET /api/drop-rush/today</code> — Active drop with deal metadata and remaining supply</li>
            <li><code>POST /api/drop-rush/claim</code> — Claim today’s drop. Body: <code>{`{ dropId, walletAddress }`}</code>. Optional: <code>referrerWallet</code> or <code>?ref=</code></li>
            <li><code>GET /api/drop-rush/leaderboard</code> — Top streakers</li>
            <li><code>GET /api/drop-rush/verify?ref=...</code> — Verify a claim by Solana Pay reference, includes coupon owner</li>
            <li><code>POST /api/coupons/transfer</code> — Transfer a coupon to another wallet. Body: <code>{`{ couponId, toWallet }`}</code></li>
          </ul>
        </div>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-bold">Quick cURL</h2>
        <div className="rounded-2xl border border-white/12 bg-white/5 p-6 backdrop-blur text-xs">
          <p className="text-white/80">Get today’s drop</p>
          <pre className="mt-2 whitespace-pre-wrap">{`curl -s http://localhost:3000/api/drop-rush/today | jq`}</pre>

          <p className="text-white/80 mt-4">Claim (replace DROP_ID and WALLET)</p>
          <pre className="mt-2 whitespace-pre-wrap">{`curl -s -X POST http://localhost:3000/api/drop-rush/claim \
  -H 'Content-Type: application/json' \
  -d '{"dropId":"DROP_ID","walletAddress":"WALLET"}' | jq`}</pre>

          <p className="text-white/80 mt-4">Verify by reference</p>
          <pre className="mt-2 whitespace-pre-wrap">{`curl -s 'http://localhost:3000/api/drop-rush/verify?ref=PUBLIC_KEY' | jq`}</pre>
        </div>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-bold">Webhooks (preview)</h2>
        <div className="rounded-2xl border border-white/12 bg-white/5 p-6 backdrop-blur text-sm">
          <p className="text-white/80">We emit events you can subscribe to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><code>claim.created</code></li>
            <li><code>claim.confirmed</code></li>
            <li><code>redemption.verified</code></li>
          </ul>
          <p className="text-white/60 mt-3">Configure your webhook URL and secrets in the dashboard (coming soon). For now, poll <code>/verify</code> or integrate directly.</p>
        </div>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-bold">On-chain NFT mint (planned)</h2>
        <div className="rounded-2xl border border-white/12 bg-white/5 p-6 backdrop-blur text-sm">
          <p className="text-white/80">We’ll expose a wallet-signed mint flow using Metaplex Token Metadata:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><code>POST /api/nft/prepare-mint</code> → returns a base64 transaction</li>
            <li>Client signs &amp; sends via wallet</li>
            <li><code>POST /api/nft/confirm</code> → store <code>mintAddress</code> on the coupon</li>
          </ul>
          <p className="text-white/60 mt-3">This keeps private keys off the server and lets builders compose custom mints.</p>
        </div>
      </section>
    </main>
  )
}
