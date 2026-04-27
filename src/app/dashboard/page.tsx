'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSession, getHabitsForUser, clearSession } from '@/lib/storage'
import type { Habit } from '@/types/habit'
import HabitList from '@/components/habits/HabitList'

export default function DashboardPage() {
  const router = useRouter()
  const [habits, setHabits] = useState<Habit[]>([])
  const [userId, setUserId] = useState('')
  const [email, setEmail] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const session = getSession()
    if (!session) {
      router.push('/login')
      return
    }
    setUserId(session.userId)
    setEmail(session.email)
    setHabits(getHabitsForUser(session.userId))
    setReady(true)
  }, [router])

  function reloadHabits() {
    setHabits(getHabitsForUser(userId))
  }

  function handleLogout() {
    clearSession()
    router.push('/login')
  }

  if (!ready) return null

  return (
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
  )
}