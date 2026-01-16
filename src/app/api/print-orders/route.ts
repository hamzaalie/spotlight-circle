import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { createArteloOrder, getArteloPricing } from '@/lib/artelo';
import { stripe } from '@/lib/stripe';
import { z } from 'zod';

// Validation schema for order creation
const createOrderSchema = z.object({
  posterImageUrl: z.string().url(),
  size: z.string(),
  frameStyle: z.string().optional(),
  material: z.string().optional(),
  quantity: z.number().int().min(1).max(100),
  shippingName: z.string().min(1),
  shippingAddress1: z.string().min(1),
  shippingAddress2: z.string().optional(),
  shippingCity: z.string().min(1),
  shippingState: z.string().min(2).max(2),
  shippingZip: z.string().min(5),
  shippingCountry: z.string().default('US'),
  shippingPhone: z.string().optional(),
});

// Validation schema for pricing
const getPricingSchema = z.object({
  size: z.string(),
  frameStyle: z.string().optional(),
  material: z.string().optional(),
  quantity: z.number().int().min(1).max(100),
  shippingZip: z.string().min(5),
  shippingCountry: z.string().default('US'),
});

/**
 * POST /api/print-orders
 * Create a new print order
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
    const validatedData = createOrderSchema.parse(body);

    // Step 1: Get pricing from Artelo
    let pricing;
    try {
      pricing = await getArteloPricing({
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
    } catch (error: any) {
      console.error('Artelo pricing error:', error);
      return NextResponse.json(
        { error: 'Failed to get pricing from print provider', details: error.message },
        { status: 500 }
      );
    }

    // Step 2: Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: pricing.total_price + pricing.shipping_cost,
      currency: 'usd',
      metadata: {
        userId: session.user.id,
        type: 'print_order',
      },
    });

    // Step 3: Create print order in database (PENDING status)
    const printOrder = await prisma.printOrder.create({
      data: {
        userId: session.user.id,
        posterImageUrl: validatedData.posterImageUrl,
        size: validatedData.size,
        frameStyle: validatedData.frameStyle,
        material: validatedData.material,
        quantity: validatedData.quantity,
        unitPrice: pricing.unit_price,
        totalPrice: pricing.total_price,
        shippingCost: pricing.shipping_cost,
        shippingName: validatedData.shippingName,
        shippingAddress1: validatedData.shippingAddress1,
        shippingAddress2: validatedData.shippingAddress2,
        shippingCity: validatedData.shippingCity,
        shippingState: validatedData.shippingState,
        shippingZip: validatedData.shippingZip,
        shippingCountry: validatedData.shippingCountry,
        shippingPhone: validatedData.shippingPhone,
        stripePaymentIntentId: paymentIntent.id,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      orderId: printOrder.id,
      clientSecret: paymentIntent.client_secret,
      pricing: {
        unitPrice: pricing.unit_price,
        totalPrice: pricing.total_price,
        shippingCost: pricing.shipping_cost,
        grandTotal: pricing.total_price + pricing.shipping_cost,
      },
    });
  } catch (error) {
    console.error('Error creating print order:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create print order' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/print-orders
 * Get all print orders for the current user
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const orders = await prisma.printOrder.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching print orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch print orders' },
      { status: 500 }
    );
  }
}
