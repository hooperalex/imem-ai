#!/bin/bash
# Quick Stripe Setup - 5 Minutes to Revenue

echo "🚀 Setting up Stripe for imem.ai"
echo ""

# 1. Get Stripe test keys
echo "Step 1: Get your Stripe keys"
echo "→ Go to: https://dashboard.stripe.com/test/apikeys"
echo "→ Copy 'Publishable key' and 'Secret key'"
echo ""
read -p "Press Enter when ready..."

# 2. Add to Vercel
echo ""
echo "Step 2: Adding keys to Vercel..."
cd imem-web

echo "Enter your Stripe PUBLISHABLE key (pk_test_...):"
read STRIPE_PUB_KEY
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production <<< "$STRIPE_PUB_KEY"

echo "Enter your Stripe SECRET key (sk_test_...):"
read -s STRIPE_SECRET_KEY
vercel env add STRIPE_SECRET_KEY production <<< "$STRIPE_SECRET_KEY"

# 3. Deploy
echo ""
echo "Step 3: Deploying with Stripe..."
vercel --prod

echo ""
echo "✅ Stripe is LIVE!"
echo ""
echo "Test payment: https://imem-web.vercel.app/pricing"
echo "Test card: 4242 4242 4242 4242"
echo ""
echo "💰 Ready to make money!"
