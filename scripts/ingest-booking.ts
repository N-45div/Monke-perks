#!/usr/bin/env tsx
import 'dotenv/config'
import { ingestBookingDeals } from '@/services/external/booking/ingest'
import { prisma } from '@/lib/prisma'

const destinations = process.argv.slice(2)

async function run() {
  console.log('Starting Booking.com ingestion', { destinations })
  await ingestBookingDeals(destinations.length > 0 ? destinations : undefined)
  console.log('Ingestion complete')
}

run()
  .catch((error) => {
    console.error('Ingestion failed', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
