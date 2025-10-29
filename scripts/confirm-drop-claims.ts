#!/usr/bin/env tsx
import { confirmPendingDropClaims } from '@/services/drop-rush/confirmation'

async function main() {
  const result = await confirmPendingDropClaims()
  console.log(`[drop:confirm] processed=${result.processed} confirmed=${result.confirmed}`)
}

main().catch((error) => {
  console.error('[drop:confirm] failed', error)
  process.exit(1)
})
