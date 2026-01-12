/**
 * Artelo API Integration
 * Documentation: https://www.artelo.io/artelo-api/documentation/introduction
 */

const ARTELO_API_URL = process.env.ARTELO_API_URL || 'https://api.artelo.io/v1';
const ARTELO_API_KEY = process.env.ARTELO_API_KEY;

export interface ArteloOrderProduct {
  type: 'poster' | 'print' | 'canvas';
  size: string; // e.g., "18x24", "24x36"
  image_url: string; // URL to the poster image
  frame?: string; // e.g., "black_metal", "wood_natural", "white_metal", "none"
  material?: string; // e.g., "premium_matte", "glossy", "semi_gloss"
}

export interface ArteloShippingAddress {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string; // ISO 3166-1 alpha-2 code (e.g., "US")
  phone?: string;
}

export interface ArteloOrderRequest {
  product: ArteloOrderProduct;
  quantity: number;
  shipping_address: ArteloShippingAddress;
  metadata?: Record<string, any>; // Custom data to store with the order
}

export interface ArteloOrderResponse {
  id: string; // Artelo order ID
  status: string; // e.g., "pending", "processing", "in_production", "shipped", "delivered"
  product: ArteloOrderProduct;
  quantity: number;
  pricing: {
    unit_price: number; // Price per unit in cents
    total_price: number; // Total price in cents
    shipping_cost?: number; // Shipping cost in cents
  };
  shipping_address: ArteloShippingAddress;
  tracking?: {
    number?: string;
    url?: string;
    carrier?: string;
  };
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

export interface ArteloPricingRequest {
  product: ArteloOrderProduct;
  quantity: number;
  shipping_address: Pick<ArteloShippingAddress, 'zip' | 'country'>;
}

export interface ArteloPricingResponse {
  unit_price: number; // Price per unit in cents
  total_price: number; // Total price in cents
  shipping_cost: number; // Shipping cost in cents
  estimated_delivery_days: number;
}

/**
 * Create a new print order with Artelo
 */
export async function createArteloOrder(
  orderData: ArteloOrderRequest
): Promise<ArteloOrderResponse> {
  if (!ARTELO_API_KEY) {
    throw new Error('ARTELO_API_KEY is not configured');
  }

  const response = await fetch(`${ARTELO_API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ARTELO_API_KEY}`,
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(`Artelo API error: ${error.message || response.statusText}`);
  }

  return response.json();
}

/**
 * Get pricing for a print order (before creating the order)
 */
export async function getArteloPricing(
  pricingData: ArteloPricingRequest
): Promise<ArteloPricingResponse> {
  if (!ARTELO_API_KEY) {
    throw new Error('ARTELO_API_KEY is not configured');
  }

  const response = await fetch(`${ARTELO_API_URL}/pricing`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ARTELO_API_KEY}`,
    },
    body: JSON.stringify(pricingData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(`Artelo API error: ${error.message || response.statusText}`);
  }

  return response.json();
}

/**
 * Get order status from Artelo
 */
export async function getArteloOrderStatus(
  orderId: string
): Promise<ArteloOrderResponse> {
  if (!ARTELO_API_KEY) {
    throw new Error('ARTELO_API_KEY is not configured');
  }

  const response = await fetch(`${ARTELO_API_URL}/orders/${orderId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${ARTELO_API_KEY}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(`Artelo API error: ${error.message || response.statusText}`);
  }

  return response.json();
}

/**
 * Cancel an Artelo order (if it hasn't been processed yet)
 */
export async function cancelArteloOrder(orderId: string): Promise<ArteloOrderResponse> {
  if (!ARTELO_API_KEY) {
    throw new Error('ARTELO_API_KEY is not configured');
  }

  const response = await fetch(`${ARTELO_API_URL}/orders/${orderId}/cancel`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ARTELO_API_KEY}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(`Artelo API error: ${error.message || response.statusText}`);
  }

  return response.json();
}

/**
 * Verify webhook signature from Artelo
 */
export function verifyArteloWebhook(
  payload: string,
  signature: string,
  secret: string
): boolean {
  // TODO: Implement webhook signature verification once Artelo provides the method
  // This typically involves HMAC validation
  // For now, return true but this should be properly implemented in production
  return true;
}

/**
 * Available poster sizes with dimensions
 */
export const POSTER_SIZES = [
  { value: '12x18', label: '12" × 18"', description: 'Small' },
  { value: '18x24', label: '18" × 24"', description: 'Medium' },
  { value: '24x36', label: '24" × 36"', description: 'Large' },
  { value: '27x40', label: '27" × 40"', description: 'Movie Poster' },
] as const;

/**
 * Available frame styles
 */
export const FRAME_STYLES = [
  { value: 'none', label: 'No Frame', description: 'Poster only' },
  { value: 'black_metal', label: 'Black Metal', description: 'Modern black frame' },
  { value: 'white_metal', label: 'White Metal', description: 'Clean white frame' },
  { value: 'wood_natural', label: 'Natural Wood', description: 'Warm wood frame' },
  { value: 'wood_black', label: 'Black Wood', description: 'Classic black wood' },
] as const;

/**
 * Available material finishes
 */
export const MATERIAL_FINISHES = [
  { value: 'premium_matte', label: 'Premium Matte', description: 'Professional finish' },
  { value: 'glossy', label: 'Glossy', description: 'Vibrant colors' },
  { value: 'semi_gloss', label: 'Semi-Gloss', description: 'Balanced finish' },
] as const;
