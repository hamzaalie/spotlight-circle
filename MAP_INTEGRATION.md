# Map Integration Setup Guide

## Overview
The Spotlight Circles platform now includes interactive map visualization for the professional directory, powered by **Leaflet** and **OpenStreetMap** - completely free, no API key required!

## Features
- **Interactive Map View**: Toggle between grid and map views in the directory
- **Geocoding**: Automatic conversion of addresses to coordinates using Nominatim (OpenStreetMap)
- **Professional Markers**: Click markers to view professional details
- **Batch Processing**: Admin tool to geocode all existing profiles
- **Auto-geocoding**: New profiles are automatically geocoded during onboarding
- **100% Free**: No API keys, no credit cards, unlimited usage

## Setup Instructions

### 1. No API Key Required! ✅
Unlike Mapbox, **OpenStreetMap and Nominatim are completely free**:
- ✅ No signup required
- ✅ No credit card needed
- ✅ No API key configuration
- ✅ Unlimited map loads
- ✅ 1 geocoding request per second (built-in rate limiting)

### 2. Verify Installation
Dependencies (already installed):
```json
{
  "leaflet": "^1.9.4",
  "react-leaflet": "^4.2.1",
  "@types/leaflet": "^1.9.8"
}
```

### 3. Geocode Existing Profiles
Visit `/admin/geocode` to batch geocode all existing profiles:

**Stats Dashboard**:
- Total profiles
- Geocoded profiles
- Missing geocodes

**Batch Processing**:
- Processes all profiles missing coordinates
- 1 second delay between requests (Nominatim rate limit)
- Progress tracking
- Success/error reporting

## Components

### DirectoryMap
Location: `src/components/directory/DirectoryMap.tsx`

Interactive map component with:
- Leaflet base map with OpenStreetMap tiles
- Custom purple pin markers for professionals
- Popup cards with professional details
- Auto-fit bounds to show all professionals
- Zoom and pan controls

### DirectorySearch
Location: `src/components/directory/DirectorySearch.tsx`

Enhanced with:
- Grid/Map view toggle
- Filters work in both views
- Dynamic map component loading (SSR disabled)

### GeocodeAdmin
Location: `src/components/admin/GeocodeAdmin.tsx`

Admin interface for:
- Batch geocoding profiles
- Progress tracking
- Error handling
- Manual geocoding instructions

## API Endpoints

### POST /api/geocode
Geocode a single address or profile using Nominatim:
```typescript
{
  "profileId": "optional_profile_id",
  "city": "Los Angeles",
  "state": "CA",
  "zipCode": "90001"
}
```

Response:
```typescript
{
  "success": true,
  "latitude": 34.0522,
  "longitude": -118.2437,
  "formatted": "Los Angeles, California, United States"
}
```

### PUT /api/geocode
Batch geocode all profiles missing coordinates:
```typescript
// No body required
```

Response:
```typescript
{
  "success": true,
  "total": 50,
  "successCount": 48,
  "errorCount": 2
}
```

## Utilities

### Geocoding Library
Location: `src/lib/geocoding.ts`

Functions:
- `geocodeAddress(address: string)` - Geocode using Nominatim (free)
- `geocodeLocation(city, state, zipCode)` - Geocode from parts
- `batchGeocode(addresses[])` - Process multiple addresses with rate limiting
- `calculateDistance(lat1, lon1, lat2, lon2)` - Distance calculation in miles

## Database Schema

Profile model includes:
```prisma
model Profile {
  // ...
  city      String
  state     String?
  zipCode   String
  latitude  Float?
  longitude Float?
  // ...
}
```

## Rate Limiting

Nominatim (free tier) guidelines:
- **Geocoding**: 1 request per second (enforced in code)
- **Map loads**: Unlimited (OpenStreetMap tiles are free)
- **Fair use**: Please don't abuse the free service

Batch geocoding includes 1 second delay to respect Nominatim's rate limits.

## Error Handling

### No API Key Needed
- Maps work immediately, no configuration required
- OpenStreetMap tiles load automatically

### Failed Geocoding
- Onboarding continues without coordinates
- Admin tool logs errors but continues
- Profiles without coordinates hidden from map view

### Invalid Addresses
- Returns null, doesn't throw
- Profile saved without coordinates
- Can be re-geocoded later via admin panel

## Onboarding Flow

1. User completes LocationStep (city, state, ZIP)
2. On final submit, geocoding attempted via Nominatim
3. If successful, coordinates stored with profile
4. If failed, profile created without coordinates
5. Can geocode later via admin panel

## Performance

### Map Loading
- Dynamic import with loading state
- SSR disabled (`ssr: false`)
- Shows spinner while loading
- Leaflet is lightweight (~40KB gzipped)

### Professional Filtering
- Only professionals with coordinates shown on map
- Empty state displayed if none available
- Grid view always shows all professionals

## Customization

### Map Tiles
Change in `DirectoryMap.tsx`:
```typescript
<TileLayer
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  // Alternative free tiles:
  // url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" // Topographic
  // url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png" // Clean
/>
```

### Marker Icon
Customize in `DirectoryMap.tsx`:
```typescript
const createCustomIcon = () => {
  return new Icon({
    iconUrl: "your-custom-icon.svg",
    iconSize: [32, 40],
    iconAnchor: [16, 40],
  })
}
```

### Popup Content
Edit popup HTML in `DirectoryMap.tsx` Popup component.

## Troubleshooting

### Map not displaying
1. Check browser console for errors
2. Verify Leaflet CSS is imported
3. Ensure MapContainer has height set
4. Check internet connection (tiles load from OSM)

### Geocoding failures
1. Verify city and ZIP code are valid
2. Check Nominatim usage policy (1 req/sec)
3. Review geocoding API logs
4. Try manual geocoding in admin panel

### Markers not appearing
1. Check if profiles have latitude/longitude
2. Visit `/admin/geocode` to see stats
3. Run batch geocoding if needed
4. Verify coordinates are valid numbers

## Advantages Over Mapbox

✅ **Completely Free**: No credit card, no API key, unlimited usage  
✅ **No Signup**: Works immediately out of the box  
✅ **Privacy**: No tracking or data collection  
✅ **Open Source**: Built on OpenStreetMap data  
✅ **Community**: Millions of contributors worldwide  
✅ **Lightweight**: Smaller bundle size than Mapbox GL  

## Next Steps

Potential enhancements:
- **Clustering**: Group nearby professionals at high zoom levels
- **Search by radius**: Find professionals within X miles
- **Heatmap**: Visualize professional density
- **Directions**: Integrate routing to professionals
- **Custom markers**: Different icons for professions
- **Map filters**: Show/hide by profession on map
- **Custom tiles**: Use themed OSM tiles for brand consistency

## Support

For issues with:
- **Leaflet**: https://leafletjs.com/reference.html
- **react-leaflet**: https://react-leaflet.js.org/
- **Nominatim**: https://nominatim.org/release-docs/latest/api/
- **OpenStreetMap**: https://wiki.openstreetmap.org/
