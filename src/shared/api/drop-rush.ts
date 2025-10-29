import { HttpClient, defaultClient } from './http'

export interface DropDealSummary {
  id: string
  title: string
  slug: string
  summary: string
  description: string
  heroImageUrl: string | null
  discountType: string | null
  discountValue: number | null
  originalPrice: number | null
  currency: string
  tags: string[]
  categories: string[]
}

export interface DailyDropResponse {
  drop: {
    id: string
    dealId: string
    title: string
    description: string | null
    startAt: string
    endAt: string
    supplyAllocation: number
    streakMultiplier: number
    status: string
    deal: DropDealSummary
  } | null
}

export interface DropLeaderboardEntry {
  wallet: string
  streak: number
  user: {
    id: string
    walletAddress: string
    username: string | null
    avatarUrl: string | null
  } | null
}

export interface DropLeaderboardResponse {
  leaderboard: DropLeaderboardEntry[]
}

export interface ClaimDropRequest {
  dropId: string
  walletAddress: string
}

export interface ClaimDropResponse {
  claim: {
    id: string
    status: string
    reference: string | null
    streakSnapshot: number
    paymentUrl: string | null
  }
  streak: {
    current: number
    longest: number
  }
}

export class DropRushApi {
  constructor(private readonly client: HttpClient = defaultClient) {}

  getToday() {
    return this.client.get<DailyDropResponse>('/api/drop-rush/today')
  }

  getLeaderboard() {
    return this.client.get<DropLeaderboardResponse>('/api/drop-rush/leaderboard')
  }

  claimDrop(body: ClaimDropRequest) {
    return this.client.post<ClaimDropResponse>('/api/drop-rush/claim', body)
  }
}

export const dropRushApi = new DropRushApi()
