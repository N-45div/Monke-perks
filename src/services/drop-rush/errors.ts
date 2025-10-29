export enum DropClaimErrorCode {
  DropNotFound = 'DROP_NOT_FOUND',
  DropNotLive = 'DROP_NOT_LIVE',
  DropSoldOut = 'DROP_SOLD_OUT',
  WalletRequired = 'WALLET_REQUIRED',
  LimitReached = 'LIMIT_REACHED',
  DealSupplyExceeded = 'DEAL_SUPPLY_EXCEEDED',
}

export class DropClaimError extends Error {
  constructor(public code: DropClaimErrorCode, message: string) {
    super(message)
    this.name = 'DropClaimError'
  }
}
