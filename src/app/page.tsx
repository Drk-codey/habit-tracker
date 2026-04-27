'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SplashScreen from '@/components/shared/SplashScreen'
import { getSession } from '@/lib/storage'

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
    }, 1000)

    return () => clearTimeout(timer)
  }, [router])

  return <SplashScreen />
}