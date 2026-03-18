import React from 'react'
import { Metadata } from 'next'
import ThankYou from '@/components/featured/Thanks'

export const metadata: Metadata = {
  title: "Cảm ơn",
}

function ThanksPage() {
  return (
    <div>
      <ThankYou />
    </div>
  )
}

export default ThanksPage