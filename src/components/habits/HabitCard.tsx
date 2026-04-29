'use client'
import { useState } from 'react'
import { getHabitSlug } from '@/lib/slug'
import { calculateCurrentStreak } from '@/lib/streaks'
import { toggleHabitCompletion } from '@/lib/habits'
import { updateHabit, deleteHabit } from '@/lib/storage'
import type { Habit } from '@/types/habit'
import HabitForm from './HabitForm'
import { Flame, Check } from 'lucide-react'

type Props = {
  habit: Habit
  onUpdate: () => void   // tells parent to reload habits
}

export default function HabitCard({ habit, onUpdate }: Props) {
  const slug = getHabitSlug(habit.name)
  const today = new Date().toISOString().split('T')[0]
  const [completions, setCompletions] = useState<string[]>(habit.completions)
  const isCompleted = completions.includes(today)
  const streak = calculateCurrentStreak(completions, today)

  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  function handleToggle() {
    const updated = toggleHabitCompletion({ ...habit, completions }, today)
    updateHabit(updated)
    setCompletions(updated.completions)
    onUpdate()
  }

  function handleDelete() {
    deleteHabit(habit.id)
    onUpdate()
  }

  function handleSaveEdit(name: string, description: string) {
    updateHabit({ ...habit, completions, name, description })
    setEditing(false)
    onUpdate()
  }

  if (editing) {
    return (
      <HabitForm
        initialValues={habit}
        onSave={handleSaveEdit}
        onCancel={() => setEditing(false)}
      />
    )
  }

  return (
    <div
      data-testid={`habit-card-${slug}`}
      className={`p-4 rounded border ${isCompleted ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200'}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-lg">{habit.name}</h3>
          {habit.description && (
            <p className="text-sm text-gray-500">{habit.description}</p>
          )}
          <p data-testid={`habit-streak-${slug}`} className="text-sm mt-1 text-orange-600 font-medium flex items-center gap-1">
            <Flame className="w-4 h-4" /> {streak} day streak
          </p>
        </div>

        <button
          data-testid={`habit-complete-${slug}`}
          onClick={handleToggle}
          className={`px-3 py-1 rounded text-sm font-medium flex items-center gap-1 ${
            isCompleted
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-green-100'
          }`}
        >
          {isCompleted ? <><Check className="w-4 h-4" /> Done</> : 'Mark Done'}
          </button>
      </div>

      <div className="flex gap-2 mt-3">
        <button
          data-testid={`habit-edit-${slug}`}
          onClick={() => setEditing(true)}
          className="text-sm text-blue-600 hover:underline"
        >
          Edit
        </button>
        <button
          data-testid={`habit-delete-${slug}`}
          onClick={() => setConfirmDelete(true)}
          className="text-sm text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>

      {confirmDelete && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-sm text-red-700 mb-2">Are you sure you want to delete this habit?</p>
          <div className="flex gap-2">
            <button
              data-testid="confirm-delete-button"
              onClick={handleDelete}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="bg-gray-200 px-3 py-1 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}