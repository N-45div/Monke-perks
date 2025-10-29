import { NextResponse } from 'next/server'
import { Connection, Keypair, PublicKey, SystemProgram, Transaction, clusterApiUrl } from '@solana/web3.js'
import {
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  createInitializeMintInstruction,
} from '@solana/spl-token'

function getConnection() {
  const url = process.env.SOLANA_RPC_URL || clusterApiUrl('devnet')
  return new Connection(url, 'confirmed')
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const owner = body?.owner as string | undefined
    if (!owner) {
      return NextResponse.json({ error: 'Missing owner' }, { status: 400 })
    }

    const connection = getConnection()
    const ownerPk = new PublicKey(owner)
    // Server creates the mint (pays rent) and sets owner as mint authority, so the follow-up tx only needs owner signature
    const feePayerSecret = process.env.FEE_PAYER_SECRET
    if (!feePayerSecret) {
      return NextResponse.json({ error: 'FEE_PAYER_SECRET not set' }, { status: 400 })
    }
    const feePayer = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(feePayerSecret)))

    const mintKp = Keypair.generate()
    const rent = await connection.getMinimumBalanceForRentExemption(MINT_SIZE)
    // Server creates and initializes mint with owner as mintAuthority
    const serverTx = new Transaction()
    serverTx.add(
      SystemProgram.createAccount({
        fromPubkey: feePayer.publicKey,
        newAccountPubkey: mintKp.publicKey,
        lamports: rent,
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMintInstruction(mintKp.publicKey, 0, ownerPk, null, TOKEN_PROGRAM_ID),
    )
    serverTx.feePayer = feePayer.publicKey
    serverTx.recentBlockhash = (await connection.getLatestBlockhash('finalized')).blockhash
    await connection.sendTransaction(serverTx, [feePayer, mintKp], { skipPreflight: true })

    // Build unsigned tx for owner: create ATA (payer=owner) + mintTo (mintAuthority=owner)
    const ata = await getAssociatedTokenAddress(mintKp.publicKey, ownerPk)
    const clientTx = new Transaction()
    clientTx.feePayer = ownerPk
    clientTx.recentBlockhash = (await connection.getLatestBlockhash('finalized')).blockhash
    clientTx.add(
      createAssociatedTokenAccountInstruction(ownerPk, ata, ownerPk, mintKp.publicKey),
      createMintToInstruction(mintKp.publicKey, ata, ownerPk, 1),
    )

    const serialized = clientTx.serialize({ requireAllSignatures: false, verifySignatures: false }).toString('base64')
    return NextResponse.json({ transaction: serialized, mintAddress: mintKp.publicKey.toBase58(), ata: ata.toBase58() })
  } catch (e) {
    console.error('prepare-mint-signed failed', e)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
