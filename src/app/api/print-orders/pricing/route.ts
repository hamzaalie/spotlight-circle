import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getArteloPricing } from '@/lib/artelo';
import { z } from 'zod';

const getPricingSchema = z.object({
  size: z.string(),
  frameStyle: z.string().optional(),
  material: z.string().optional(),
  quantity: z.number().int().min(1).max(100),
  shippingZip: z.string().min(5),
  shippingCountry: z.string().default('US'),
  posterImageUrl: z.string().url(),
});

/**
 * POST /api/print-orders/pricing
 * Get pricing estimate for a print order
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = getPricingSchema.parse(body);

    const pricing = await getArteloPricing({
      product: {
        type: 'poster',
        size: validatedData.size,
        image_url: validatedData.posterImageUrl,
        frame: validatedData.frameStyle,
        material: validatedData.material,
      },
      quantity: validatedData.quantity,
      shipping_address: {
        zip: validatedData.shippingZip,
        country: validatedData.shippingCountry,
      },
    });

    return NextResponse.json({
      unitPrice: pricing.unit_price,
      totalPrice: pricing.total_price,
      shippingCost: pricing.shipping_cost,
      grandTotal: pricing.total_price + pricing.shipping_cost,
      estimatedDeliveryDays: pricing.estimated_delivery_days,
    });
  } catch (error) {
    console.error('Error getting pricing:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to get pricing' },
      { status: 500 }
    );
  }
}
