import { db } from '@/app/lib/firebase'
import stripe from '@/app/lib/stripe'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    const secret = process.env.STRIPE_WEBHOOK_SECRET
    if (!signature || !secret) {
      return new NextResponse('Stripe webhook secret is not set', {
        status: 400,
      })
    }

    const event = stripe.webhooks.constructEvent(body, signature, secret)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.payment_status === 'paid' && session.client_reference_id) {
          try {
            await db
              .collection('users')
              .doc(session.client_reference_id)
              .update({
                isSubscribed: true,
              })
          } catch (err) {
            console.error('Failed to update Firestore:', err)
          }
        }

        if (session.payment_status === 'unpaid' && session.payment_intent) {
          const paymentIntent = await stripe.paymentIntents.retrieve(
            session.payment_intent.toString(),
          )
          const hostedVoucherUrl =
            paymentIntent.next_action?.boleto_display_details
              ?.hosted_voucher_url

          if (hostedVoucherUrl) {
            console.log('Enviar email para o cliente com o boleto')
          }
        }
        break
      }

      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.payment_status === 'paid' && session.client_reference_id) {
          try {
            await db
              .collection('users')
              .doc(session.client_reference_id)
              .update({
                isSubscribed: true,
              })
          } catch (err) {
            console.error('Failed to update Firestore:', err)
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        if (customerId) {
          const customer = (await stripe.customers.retrieve(
            customerId,
          )) as Stripe.Customer
          const userId = customer.metadata?.userId

          if (userId) {
            try {
              await db.collection('users').doc(userId).update({
                isSubscribed: false,
              })
            } catch (err) {
              console.error('Failed to update Firestore:', err)
            }
          }
        }
        break
      }
    }

    return new NextResponse(null, { status: 200 })
  } catch (error) {
    console.error('Stripe webhook error', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
