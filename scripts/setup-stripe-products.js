/**
 * Script to create Stripe products and prices
 * Run this once to set up your Stripe account with the required products
 * 
 * Usage: node scripts/setup-stripe-products.js
 */

const Stripe = require('stripe');
const fs = require('fs');
const path = require('path');

// Read .env file manually
const envPath = path.join(__dirname, '..', '.env');
console.log('Reading .env from:', envPath);
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split(/\r?\n/); // Handle both Unix and Windows line endings
const env = {};

envLines.forEach((line, index) => {
  // Skip empty lines and comments
  const trimmedLine = line.trim();
  if (!trimmedLine || trimmedLine.startsWith('#')) {
    return;
  }
  
  const match = trimmedLine.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let value = match[2].trim();
    // Remove surrounding quotes if present
    value = value.replace(/^["'](.*)["']$/, '$1');
    env[key] = value;
  }
});

console.log('Found env keys:', Object.keys(env));
console.log('STRIPE_SECRET_KEY exists:', !!env.STRIPE_SECRET_KEY);

if (!env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY not found in .env file');
  console.error('Make sure your .env file has: STRIPE_SECRET_KEY=sk_test_...');
  process.exit(1);
}

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

async function setupStripeProducts() {
  console.log('🔧 Setting up Stripe products and prices...\n');

  try {
    // 1. Create Setup Fee Product & Price
    console.log('Creating Setup Fee product...');
    const setupFeeProduct = await stripe.products.create({
      name: 'Spotlight Circle - Setup Fee',
      description: 'One-time setup fee for new Spotlight Circle members',
    });

    const setupFeePrice = await stripe.prices.create({
      product: setupFeeProduct.id,
      unit_amount: 1995, // $19.95
      currency: 'usd',
    });

    console.log(`✅ Setup Fee created: ${setupFeePrice.id}\n`);

    // 2. Create Monthly Subscription Product & Price
    console.log('Creating Monthly Subscription product...');
    const monthlyProduct = await stripe.products.create({
      name: 'Spotlight Circle - Monthly',
      description: 'Monthly membership to Spotlight Circle referral network',
    });

    const monthlyPrice = await stripe.prices.create({
      product: monthlyProduct.id,
      unit_amount: 995, // $9.95
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
    });

    console.log(`✅ Monthly Subscription created: ${monthlyPrice.id}\n`);

    // 3. Create Annual Subscription Product & Price
    console.log('Creating Annual Subscription product...');
    const annualProduct = await stripe.products.create({
      name: 'Spotlight Circle - Annual',
      description: 'Annual membership to Spotlight Circle referral network (save $19.45/year)',
    });

    const annualPrice = await stripe.prices.create({
      product: annualProduct.id,
      unit_amount: 9995, // $99.95
      currency: 'usd',
      recurring: {
        interval: 'year',
      },
    });

    console.log(`✅ Annual Subscription created: ${annualPrice.id}\n`);

    // Print summary
    console.log('=' .repeat(60));
    console.log('🎉 SUCCESS! Add these to your .env file:');
    console.log('=' .repeat(60));
    console.log(`STRIPE_SETUP_FEE_PRICE_ID="${setupFeePrice.id}"`);
    console.log(`STRIPE_MONTHLY_PRICE_ID="${monthlyPrice.id}"`);
    console.log(`STRIPE_ANNUAL_PRICE_ID="${annualPrice.id}"`);
    console.log('=' .repeat(60));
    console.log('\n📋 Copy the lines above and add them to your .env file');
    console.log('💡 You can view these products in your Stripe Dashboard:');
    console.log('   https://dashboard.stripe.com/test/products\n');

  } catch (error) {
    console.error('❌ Error setting up Stripe products:', error.message);
    process.exit(1);
  }
}

// Run the setup
setupStripeProducts();
