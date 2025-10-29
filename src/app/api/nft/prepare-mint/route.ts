import { NextResponse } from 'next/server'
import { Connection, Keypair, PublicKey, clusterApiUrl } from '@solana/web3.js'
import { getOrCreateAssociatedTokenAccount, createMint, mintTo } from '@solana/spl-token'
import { prisma } from '@/lib/prisma'

function getConnection() {
  const url = process.env.SOLANA_RPC_URL || clusterApiUrl('devnet')
  return new Connection(url, 'confirmed')
}

function getFeePayer(): Keypair | null {
  const secret = process.env.FEE_PAYER_SECRET
  if (!secret) return null
  try {
    const arr = JSON.parse(secret) as number[]
    return Keypair.fromSecretKey(Uint8Array.from(arr))
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const owner = body?.owner as string | undefined
    const couponId = body?.couponId as string | undefined
    const metadata = body?.metadata || {}

    if (!owner || !couponId) {
      return NextResponse.json({ error: 'Missing owner or couponId' }, { status: 400 })
    }

    const feePayer = getFeePayer()
    if (!feePayer) {
      return NextResponse.json({ error: 'FEE_PAYER_SECRET not set (devnet mint requires a fee payer)' }, { status: 400 })
    }

    const connection = getConnection()
    const ownerPk = new PublicKey(owner)

    // Create mint and ATA, mint 1 token to owner (acts as NFT for demo)
    const mintKeypair = Keypair.generate()
    const mintPubkey = await createMint(connection, feePayer, feePayer.publicKey, null, 0, mintKeypair)
    const ata = await getOrCreateAssociatedTokenAccount(connection, feePayer, mintPubkey, ownerPk)
    const signature = await mintTo(connection, feePayer, mintPubkey, ata.address, feePayer, 1)

    await prisma.dealCoupon.update({ where: { id: couponId }, data: { mintAddress: mintPubkey.toBase58() } })

    return NextResponse.json({ mintAddress: mintPubkey.toBase58(), signature })
  } catch (e) {
    console.error('prepare-mint failed', e)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
