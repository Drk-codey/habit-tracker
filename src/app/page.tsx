'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SplashScreen from '@/components/shared/SplashScreen'
import { getSession } from '@/lib/storage'
import { SPLASH_DURATION_MS } from '@/lib/constants'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Wait 1 second (testable splash duration between 800ms and 2000ms)
    const timer = setTimeout(() => {
      const session = getSession()
      if (session) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }, SPLASH_DURATION_MS)

    return () => clearTimeout(timer)
  }, [router])

  return <SplashScreen />
}