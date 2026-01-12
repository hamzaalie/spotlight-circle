import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyArteloWebhook } from '@/lib/artelo';

/**
 * POST /api/webhooks/artelo
 * Handle webhooks from Artelo for order status updates
 */
export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('artelo-signature') || '';
    const webhookSecret = process.env.ARTELO_WEBHOOK_SECRET || '';
    
    // Get raw body for signature verification
    const body = await req.text();
    
    // Verify webhook signature
    if (!verifyArteloWebhook(body, signature, webhookSecret)) {
      console.error('Invalid Artelo webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse the webhook payload
    const event = JSON.parse(body);
    
    console.log('Artelo webhook received:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'order.created':
        await handleOrderCreated(event.data);
        break;
        
      case 'order.processing':
        await handleOrderProcessing(event.data);
        break;
        
      case 'order.in_production':
        await handleOrderInProduction(event.data);
        break;
        
      case 'order.shipped':
        await handleOrderShipped(event.data);
        break;
        
      case 'order.delivered':
        await handleOrderDelivered(event.data);
        break;
        
      case 'order.cancelled':
        await handleOrderCancelled(event.data);
        break;
        
      case 'order.failed':
        await handleOrderFailed(event.data);
        break;
        
      default:
        console.log('Unhandled Artelo webhook event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing Artelo webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleOrderCreated(data: any) {
  const arteloOrderId = data.id;
  
  await prisma.printOrder.updateMany({
    where: { arteloOrderId },
    data: {
      arteloStatus: 'created',
      status: 'PROCESSING',
    },
  });
}

async function handleOrderProcessing(data: any) {
  const arteloOrderId = data.id;
  
  await prisma.printOrder.updateMany({
    where: { arteloOrderId },
    data: {
      arteloStatus: 'processing',
      status: 'PROCESSING',
    },
  });
}

async function handleOrderInProduction(data: any) {
  const arteloOrderId = data.id;
  
  await prisma.printOrder.updateMany({
    where: { arteloOrderId },
    data: {
      arteloStatus: 'in_production',
      status: 'IN_PRODUCTION',
    },
  });
}

async function handleOrderShipped(data: any) {
  const arteloOrderId = data.id;
  const tracking = data.tracking || {};
  
  await prisma.printOrder.updateMany({
    where: { arteloOrderId },
    data: {
      arteloStatus: 'shipped',
      status: 'SHIPPED',
      trackingNumber: tracking.number || null,
      trackingUrl: tracking.url || null,
      carrier: tracking.carrier || null,
      shippedAt: new Date(),
    },
  });

  // TODO: Send email notification to user about shipment
  // const order = await prisma.printOrder.findFirst({
  //   where: { arteloOrderId },
  //   include: { user: true },
  // });
  // if (order) {
  //   await sendShipmentEmail(order);
  // }
}

async function handleOrderDelivered(data: any) {
  const arteloOrderId = data.id;
  
  await prisma.printOrder.updateMany({
    where: { arteloOrderId },
    data: {
      arteloStatus: 'delivered',
      status: 'DELIVERED',
      deliveredAt: new Date(),
    },
  });

  // TODO: Send email notification to user about delivery
}

async function handleOrderCancelled(data: any) {
  const arteloOrderId = data.id;
  
  await prisma.printOrder.updateMany({
    where: { arteloOrderId },
    data: {
      arteloStatus: 'cancelled',
      status: 'CANCELLED',
      cancelledAt: new Date(),
    },
  });

  // TODO: Process refund if payment was already made
}

async function handleOrderFailed(data: any) {
  const arteloOrderId = data.id;
  const errorMessage = data.error?.message || 'Order failed';
  
  await prisma.printOrder.updateMany({
    where: { arteloOrderId },
    data: {
      arteloStatus: 'failed',
      status: 'FAILED',
      errorMessage,
    },
  });

  // TODO: Notify user and process refund
}
