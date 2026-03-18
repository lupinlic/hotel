import React from 'react'
import { Metadata } from 'next'
import Reservation from '@/components/featured/Reservation'

export const metadata: Metadata = {
  title: 'Reservation',
}

function ReservationPage() {
  return (
    <div>
        <Reservation />
    </div>
  )
}

export default ReservationPage