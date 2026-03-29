import React from 'react'
import Profile from '@/components/featured/Profile'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile',
}

function ProfilePage() {
  return (
    <div>
      <Profile />
    </div>
  )
}

export default ProfilePage
