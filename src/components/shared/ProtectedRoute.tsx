'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSession } from '@/lib/storage'

type Props = {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
 
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true)
  }, [])

  const session = isMounted ? getSession() : null
 
  useEffect(() => {
    if (isMounted && !session) {
      // Use a small delay to ensure the router is initialized
      const timer = setTimeout(() => {
        router.push('/login')
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [isMounted, session, router])
 
  if (!isMounted || !session) return null
 
  return <>{children}</>
}