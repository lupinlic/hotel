import React from 'react'
import Checkout from '@/components/featured/Checkout'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Checkout',
}

function CheckoutPage() {
  return (
    <div>
        <Checkout />
    </div>
  )
}

export default CheckoutPage