'use client'
import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { getSession, getHabitsForUser, clearSession } from '@/lib/storage'
import HabitList from '@/components/habits/HabitList'
import ProtectedRoute from '@/components/shared/ProtectedRoute'

export default function DashboardPage() {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  const [refreshTick, setRefreshTick] = useState(0)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true)
  }, [])

  const session = isMounted ? getSession() : null
  const email = session?.email ?? ''
  const userId = session?.userId ?? ''
  
  const habits = useMemo(() => {
    // Access refreshTick to ensure re-calculation when reloadHabits is called
    void refreshTick
    return isMounted && session ? getHabitsForUser(session.userId) : []
  }, [isMounted, session, refreshTick])

  // refreshTick is not used in the calculation above but we use it to force re-render
  // Or we can just use a simple state for habits and update it in useEffect and reloadHabits

  function reloadHabits() {
    setRefreshTick(t => t + 1)
  }

  function handleLogout() {
    clearSession()
    router.push('/login')
  }

  return (
    <ProtectedRoute>
      <main data-testid="dashboard-page" className="max-w-lg mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-green-700">My Habits</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{email}</span>
            <button
              data-testid="auth-logout-button"
              onClick={handleLogout}
              className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
            >
              Logout
            </button>
          </div>
        </div>

        <HabitList userId={userId} habits={habits} onUpdate={reloadHabits} />
      </main>
    </ProtectedRoute>
  )
}