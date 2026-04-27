'use client'
import { useState } from 'react'
import type { Habit } from '@/types/habit'
import HabitCard from './HabitCard'
import HabitForm from './HabitForm'
import { addHabit } from '@/lib/storage'

type Props = {
  userId: string
  habits: Habit[]
  onUpdate: () => void
}

export default function HabitList({ userId, habits, onUpdate }: Props) {
  const [showForm, setShowForm] = useState(false)

  function handleCreate(name: string, description: string) {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      userId,
      name,
      description,
      frequency: 'daily',
      createdAt: new Date().toISOString(),
      completions: [],
    }
    addHabit(newHabit)
    setShowForm(false)
    onUpdate()
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        data-testid="create-habit-button"
        onClick={() => setShowForm(true)}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 self-start"
      >
        + New Habit
      </button>

      {showForm && (
        <HabitForm
          onSave={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {habits.length === 0 && !showForm && (
        <div data-testid="empty-state" className="text-center text-gray-400 mt-8">
          <p>No habits yet. Create your first one!</p>
        </div>
      )}

      {habits.map((habit) => (
        <HabitCard key={habit.id} habit={habit} onUpdate={onUpdate} />
      ))}
    </div>
  )
}