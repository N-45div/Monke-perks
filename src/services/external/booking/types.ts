export type BookingDestination = {
  dest_id: string
  dest_type: string
  city_name?: string
  label: string
}

export type BookingSearchDestinationResponse = {
  data?: BookingDestination[]
}

export type BookingMoney = {
  value: number
  currency: string
}

export type BookingPriceBreakdown = {
  gross_amount?: BookingMoney
  strikethrough_amount?: BookingMoney
  discount_amount?: BookingMoney
  all_inclusive_amount?: BookingMoney
}

export type BookingHotelResult = {
  hotel_id: number | string
  hotel_name: string
  url?: string
  main_photo_url?: string
  review_score?: number
  review_score_word?: string
  city?: string
  address?: string
  country_trans?: string
  property_description?: string
  property_highlight_strip?: Array<{ icon?: string; text?: string }>
  composite_price_breakdown?: BookingPriceBreakdown
  distance_to_cc?: number
  unit_configuration_label?: string
  checkin?: { start_date?: string }
  checkout?: { end_date?: string }
}

export type BookingSearchHotelsResponse = {
  data?: {
    result?: BookingHotelResult[]
  }
}

export type BookingHotelOffer = {
  destination: BookingDestination
  result: BookingHotelResult
}
