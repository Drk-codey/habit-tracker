'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SplashScreen from '@/components/shared/SplashScreen'
import { getSession } from '@/lib/storage'
import { SPLASH_DURATION_MS } from '@/lib/constants'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const session = getSession()
        if (session) {
          router.push('/dashboard')
        } else {
          router.push('/login')
        }
      } catch (err) {
        console.error('Redirection failed:', err)
        // Fallback or retry? Let's just log for now.
      }
    }, SPLASH_DURATION_MS)

    return () => clearTimeout(timer)
  }, [router])

  return <SplashScreen />
}