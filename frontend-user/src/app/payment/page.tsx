import React from 'react'
import { Metadata } from 'next'
import Payment from '@/components/featured/Payment'

export const metadata: Metadata = {
  title: "Thanh toán",
}

function PaymentPage() {
  return (
    <div>
        <Payment />
    </div>
  )
}

export default PaymentPage