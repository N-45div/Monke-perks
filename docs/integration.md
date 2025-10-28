# MonkePerks Integration Guide

## Overview
MonkePerks exposes a REST endpoint and ingestion hooks so partners can surface curated NFT-powered deals inside their products or create new drops.

- **Base URL**: `/api`
- **Deals Endpoint**: `GET /api/deals`
- **Response format**:

```jsonc
{
  "deals": [
    {
      "id": "clx...",
      "title": "Lifetime Espresso Protocol Pass",
      "summary": "Unlimited single-origin espresso shots...",
      "discountType": "FLAT",
      "discountValue": 25,
      "originalPrice": 99,
      "currency": "USD",
      "tags": ["coffee", "lifestyle"],
      "categories": ["food", "lifestyle"],
      "merchant": {
        "id": "clx...",
        "name": "MonkeDAO Coffee Lab",
        "logoUrl": "https://..."
      }
    }
  ]
}
```

The endpoint returns up to 20 ACTIVE deals sorted by freshness. Because deals may contain NFT metadata and redemption constraints, always surface the latest copy per request.

## Authentication
During the hackathon prototype the endpoint is public. For production we plan to issue partner API keys via header `x-monke-api-key` with signature verification.

## Partner Workflows

### 1. Pull deals for display
1. `GET /api/deals`
2. Cache responses for 5 minutes max (`Cache-Control` header communicates default ISR window).
3. Render name, summary, discount, and call-to-action linking to MonkePerks mint or redemption URL.

### 2. Seed deals via RapidAPI ingestion
Partners who provide Booking.com RapidAPI access can run:

```bash
npm run ingest:booking Lisbon Tokyo
```

This fetches hotel offers for the destinations (defaults to our curated list) and upserts merchants + deals. Destinations are configurable arguments.

### 3. Local demo data
To populate demo content:

```bash
npm run seed
```

This script creates the MonkeDAO Coffee Lab deal and ingests a small batch of hotel drops. Requires `.env` with `DATABASE_URL` and `RAPIDAPI_KEY`.

## Roadmap
- Webhooks for redemption events
- GraphQL API mirroring REST output
- Merchant dashboard for custom deal creation
- Signature-based auth + rate limiting

For questions, ping the MonkePerks team in the DAO Discord.
