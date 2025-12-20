/**
 * Geocoding utilities using free Nominatim (OpenStreetMap) API
 */

interface GeocodeResult {
  latitude: number
  longitude: number
  formatted: string
}

/**
 * Geocode an address using Nominatim (OpenStreetMap) - FREE, no API key needed
 */
export async function geocodeAddress(
  address: string
): Promise<GeocodeResult | null> {
  try {
    const encodedAddress = encodeURIComponent(address)
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SpotlightCircles/1.0', // Required by Nominatim
      },
    })
    const data = await response.json()

    if (data && data.length > 0) {
      const latitude = parseFloat(data[0].lat)
      const longitude = parseFloat(data[0].lon)
      const formatted = data[0].display_name

      return {
        latitude,
        longitude,
        formatted,
      }
    }

    return null
  } catch (error) {
    console.error("Geocoding error:", error)
    return null
  }
}

/**
 * Geocode using city, state, and ZIP code
 */
export async function geocodeLocation(
  city?: string,
  state?: string,
  zipCode?: string
): Promise<GeocodeResult | null> {
  const parts = [city, state, zipCode].filter(Boolean)

  if (parts.length === 0) {
    return null
  }

  const address = parts.join(", ")
  return geocodeAddress(address)
}

/**
 * Batch geocode multiple addresses with rate limiting
 * Nominatim requires 1 second delay between requests
 */
export async function batchGeocode(
  addresses: string[],
  delayMs: number = 1000
): Promise<(GeocodeResult | null)[]> {
  const results: (GeocodeResult | null)[] = []

  for (const address of addresses) {
    const result = await geocodeAddress(address)
    results.push(result)

    // Rate limiting delay (Nominatim requires 1 req/sec)
    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }

  return results
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 * Returns distance in miles
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959 // Earth's radius in miles
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return Math.round(distance * 10) / 10 // Round to 1 decimal
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180
}

