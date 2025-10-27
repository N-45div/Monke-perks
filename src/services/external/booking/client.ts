import { env } from '@/lib/utils'
import { BookingDestination, BookingHotelOffer, BookingSearchDestinationResponse, BookingSearchHotelsResponse } from './types'

const BASE_URL = 'https://booking-com15.p.rapidapi.com/api/v1'

const RAPID_API_KEY = env('RAPIDAPI_KEY')
const DEFAULT_HEADERS: HeadersInit = {
  'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
  'x-rapidapi-key': RAPID_API_KEY,
}

async function request<T>(path: string, searchParams: Record<string, string | number | undefined>): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`)
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value))
    }
  })

  const response = await fetch(url, {
    method: 'GET',
    headers: DEFAULT_HEADERS,
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Booking API request failed: ${response.status} ${response.statusText}`)
  }

  return (await response.json()) as T
}

export async function searchDestinations(query: string, limit = 5): Promise<BookingDestination[]> {
  const data = await request<BookingSearchDestinationResponse>('/hotels/searchDestination', { query })
  return (data.data ?? []).slice(0, limit)
}

export async function searchHotelsByDestination(destId: string, checkin: string, checkout: string): Promise<BookingHotelOffer[]> {
  const data = await request<BookingSearchHotelsResponse>('/hotels/searchHotels', {
    dest_id: destId,
    search_type: 'city',
    checkout_date: checkout,
    checkin_date: checkin,
    order_by: 'popularity',
    adults_number: 2,
    room_number: 1,
    units: 'metric',
    page_number: 0,
    children_number: 0,
    currency_code: 'USD',
  })

  const results = data.data?.result ?? []
  return results.map((result) => ({
    destination: { dest_id: destId, dest_type: 'city', label: result.city ?? '', city_name: result.city },
    result,
  }))
}
