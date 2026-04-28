'use client'
import { useState } from 'react'
import { validateHabitName } from '@/lib/validators'
import type { Habit } from '@/types/habit'

type Props = {
  initialValues?: Partial<Habit>
  onSave: (name: string, description: string) => void
  onCancel: () => void
}

export default function HabitForm({ initialValues, onSave, onCancel }: Props) {
  const [name, setName] = useState(initialValues?.name ?? '')
  const [description, setDescription] = useState(initialValues?.description ?? '')
  const [nameError, setNameError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const result = validateHabitName(name)
    if (!result.valid) {
      setNameError(result.error!)
      return
    }
    setNameError('')
    onSave(result.value, description.trim())
  }

  return (
    <form data-testid="habit-form" onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 bg-gray-50 rounded border">
      <div>
        <label htmlFor="habit-name">Habit Name *</label>
        <input
          id="habit-name"
          data-testid="habit-name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-3 py-2 mt-1"
          placeholder="e.g. Drink Water"
        />
        {nameError && <p className="text-red-600 text-sm mt-1">{nameError}</p>}
      </div>

      <div>
        <label htmlFor="habit-desc">Description (optional)</label>
        <input
          id="habit-desc"
          data-testid="habit-description-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded px-3 py-2 mt-1"
          placeholder="e.g. Drink 8 glasses"
        />
      </div>

      <div>
        <label htmlFor="habit-freq">Frequency</label>
        <select
          id="habit-freq"
          data-testid="habit-frequency-select"
          value="daily"
          onChange={() => { }}
          aria-readonly="true"
          className="w-full border rounded px-3 py-2 mt-1 bg-gray-100 text-gray-500 cursor-default"
          title="Only daily frequency is supported at this stage"        >
          <option value="daily">Daily</option>
        </select>
        <p className="text-xs text-gray-400 mt-1">
          Only daily frequency is available right now.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          data-testid="habit-save-button"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}