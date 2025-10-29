# DealMint

Turn discounts into liquid, ownable assets. Claim a perk, redeem via QR, or transfer in seconds.

## Overview

DealMint is a Solana‑powered deal discovery network:

- Daily Drop Rush with streaks, supply, and leaderboards
- Verifiable redemption via Solana Pay references (single‑use)
- Transferable “coupon” assets (SPL demo mint; NFT metadata planned)
- Builder‑friendly APIs (today/claim/leaderboard/verify/transfer)

### Is this RWA?

- Classic “RWA” = tokenized claims on off‑chain assets (real estate, T‑bills, etc.).
- DealMint is “consumer RWA” (real‑world utility): tokenized rights to real‑world services (discounts/perks) with verifiable ownership and redemption. It bridges on‑chain ownership to off‑chain experiences.

## Tech Stack

- App: Next.js (App Router), TypeScript, Tailwind + shadcn/ui
- Wallet: Wallet UI (Gill), @solana/web3.js
- Backend: Prisma ORM (PostgreSQL / Neon), Redis (caching)
- QR Redemption: @solana/pay (reference lookups)
- Demo Mint: SPL token 1‑of‑1 (Metaplex metadata planned)

## Quick Start

```bash
npm install
npm run dev
# http://localhost:3000
```

### Environment Variables

Create `.env` in the project root:

```
DATABASE_URL=postgresql://...
SOLANA_RPC_URL=https://api.devnet.solana.com
# Optional but recommended
REDIS_URL=redis://default:password@host:port/0

# Optional: paid drops QR (if set, paid flows use Solana Pay)
SOLANA_PAY_RECIPIENT=<wallet_address>

# Optional: demo NFT mint (devnet) – server‑subsidized mint
# JSON array of secret key (dev only!)
FEE_PAYER_SECRET=[1,2,3,...]

# Optional: Booking.com ingestion via RapidAPI
RAPIDAPI_KEY=...
```

## Scripts

```bash
npm run dev                 # start Next.js (turbopack)
npm run build && npm start  # prod build & start

# Seed sample deals (and Booking ingestion if RAPIDAPI_KEY set)
npm run seed

# Create a live demo drop (starts ~now)
npx tsx scripts/create-demo-drop.ts --supply=1000 --hours=4

# Confirm Solana Pay references to move PENDING -> CONFIRMED
npm run drop:confirm
```

## API (v1)

- `GET /api/drop-rush/today` → active drop + deal + claimed/remaining
- `POST /api/drop-rush/claim` → body `{ dropId, walletAddress }`, optional `referrerWallet` or `?ref=`
- `GET /api/drop-rush/leaderboard` → top streakers
- `GET /api/drop-rush/verify?ref=...` → verify by Solana Pay reference (returns coupon owner/state)
- `POST /api/coupons/transfer` → `{ couponId, toWallet }`
- Mint (devnet demo): `POST /api/nft/prepare-mint` → `{ owner, couponId }` returns `{ mintAddress, signature }`

## Demo Flow (3 minutes)

1) `/drop-rush` → connect wallet → Claim → streak + supply decrement
2) `Mint NFT (devnet)` → shows `mintAddress` (optional)
3) `View leaderboard` → live ranks
4) Transfer coupon to another wallet → success toast
5) `/verify` → paste claim reference → verified + owner shown
6) `/builders` → run `curl -s http://localhost:3000/api/drop-rush/today | jq`

## Architecture

```mermaid
flowchart TD
  U[User Browser\nNext.js App + Wallet UI] -->|GET/POST JSON| API[/Next.js Routes/]
  API --> S1[(Drop Rush Service)]
  API --> S2[(NFT Mint Service - SPL)]
  S1 <-->|ORM| DB[(PostgreSQL\nPrisma)]
  S1 <-->|TTL 15–30s| C[(Redis)]
  S2 --> SOL[(Solana Devnet\nRPC)]
  S1 --> JOB[[Confirm Solana Pay refs]]
  S1 --> ING[Booking.com Ingestion (optional)]

  DB --- D1[DailyDrop]
  DB --- D2[Deal, Analytics]
  DB --- D3[DropClaim]
  DB --- D4[UserProfile, UserStreak]
  DB --- D5[DealCoupon, CouponTransfer]
```

## Security Notes

- Treat `FEE_PAYER_SECRET` as dev‑only; do not commit or use in prod.
- Prefer wallet‑signed mint flow for production (prepare unsigned tx → client signs & sends).
- Enforce rate limiting + idempotency on write endpoints (planned).

## Rename & Branding

- Project brand: DealMint (formerly MonkePerks). Some docs/snippets may still reference the legacy name; PRs welcome.

## License

Apache‑2.0 (unless stated otherwise in subpackages).
