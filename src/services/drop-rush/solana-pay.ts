import { encodeURL } from '@solana/pay'
import { Keypair, PublicKey } from '@solana/web3.js'

export interface BuildPaymentUrlOptions {
  recipient?: string | null
  reference: string
  label?: string
  message?: string
  memo?: string
}

export function generateReference(): string {
  return Keypair.generate().publicKey.toBase58()
}

export function buildPaymentUrl({ recipient, reference, label, message, memo }: BuildPaymentUrlOptions): string | null {
  if (!recipient) {
    return null
  }

  const url = encodeURL({
    recipient: new PublicKey(recipient),
    reference: new PublicKey(reference),
    label,
    message,
    memo,
  })

  return url.toString()
}
