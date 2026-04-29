import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSession } from '@/lib/storage'
 
type Props = {
  children: React.ReactNode
}
 
export default function ProtectedRoute({ children }: Props) {
  const router = useRouter()
  const [allowed, setAllowed] = useState(false)
 
  useEffect(() => {
    const session = getSession()
    if (!session) {
      router.push('/login')
    } else {
      setAllowed(true)
    }
  }, [router])
 
  if (!allowed) return null
 
  return <>{children}</>
}