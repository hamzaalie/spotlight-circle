import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { createArteloOrder } from '@/lib/artelo';

/**
 * POST /api/print-orders/[id]/confirm
 * Confirm payment and submit order to Artelo
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const orderId = params.id;

    // Get the order
    const order = await prisma.printOrder.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (order.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Check if already processed
    if (order.arteloOrderId) {
      return NextResponse.json(
        { error: 'Order already submitted to Artelo' },
        { status: 400 }
      );
    }

    // Submit to Artelo
    const arteloResponse = await createArteloOrder({
      product: {
        type: 'poster',
        size: order.size,
        image_url: order.posterImageUrl,
        frame: order.frameStyle || undefined,
        material: order.material || undefined,
      },
      quantity: order.quantity,
      shipping_address: {
        name: order.shippingName,
        address1: order.shippingAddress1,
        address2: order.shippingAddress2 || undefined,
        city: order.shippingCity,
        state: order.shippingState,
        zip: order.shippingZip,
        country: order.shippingCountry,
        phone: order.shippingPhone || undefined,
      },
      metadata: {
        spotlight_order_id: order.id,
        spotlight_user_id: session.user.id,
      },
    });

    // Update order with Artelo response
    const updatedOrder = await prisma.printOrder.update({
      where: { id: orderId },
      data: {
        arteloOrderId: arteloResponse.id,
        arteloStatus: arteloResponse.status,
        arteloResponse: arteloResponse as any,
        status: 'PROCESSING',
        paid: true,
        paidAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      arteloOrderId: arteloResponse.id,
    });
  } catch (error) {
    console.error('Error confirming print order:', error);
    
    // Log the error to the order
    try {
      await prisma.printOrder.update({
        where: { id: params.id },
        data: {
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          status: 'FAILED',
        },
      });
    } catch (dbError) {
      console.error('Error updating order with error:', dbError);
    }
    
    return NextResponse.json(
      { error: 'Failed to submit order to Artelo' },
      { status: 500 }
    );
  }
}
