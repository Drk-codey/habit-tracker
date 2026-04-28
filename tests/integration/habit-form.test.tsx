import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import HabitList from '@/components/habits/HabitList'
import { saveHabits, getHabits } from '@/lib/storage'
import type { Habit } from '@/types/habit'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

const userId = 'user-1'

const sampleHabit: Habit = {
  id: 'habit-1',
  userId,
  name: 'Drink Water',
  description: 'Stay hydrated',
  frequency: 'daily',
  createdAt: new Date().toISOString(),
  completions: [],
}

beforeEach(() => {
  localStorage.clear()
})

describe('habit form', () => {
  it('shows a validation error when habit name is empty', () => {
    render(<HabitList userId={userId} habits={[]} onUpdate={() => {}} />)

    fireEvent.click(screen.getByTestId('create-habit-button'))
    fireEvent.click(screen.getByTestId('habit-save-button'))

    expect(screen.getByText('Habit name is required')).toBeInTheDocument()
  })

  it('creates a new habit and renders it in the list', () => {
    let habits: Habit[] = []
    const onUpdate = vi.fn(() => {
      habits = getHabits()
    })

    render(<HabitList userId={userId} habits={habits} onUpdate={onUpdate} />)

    fireEvent.click(screen.getByTestId('create-habit-button'))
    fireEvent.change(screen.getByTestId('habit-name-input'), {
      target: { value: 'Drink Water' },
    })
    fireEvent.click(screen.getByTestId('habit-save-button'))

    const saved = getHabits()
    expect(saved).toHaveLength(1)
    expect(saved[0].name).toBe('Drink Water')
    expect(saved[0].userId).toBe(userId)
    expect(saved[0].frequency).toBe('daily')
  })

  it('edits an existing habit and preserves immutable fields', () => {
    saveHabits([sampleHabit])
    const onUpdate = vi.fn()

    render(<HabitList userId={userId} habits={[sampleHabit]} onUpdate={onUpdate} />)

    fireEvent.click(screen.getByTestId('habit-edit-drink-water'))
    fireEvent.change(screen.getByTestId('habit-name-input'), {
      target: { value: 'Drink More Water' },
    })
    fireEvent.click(screen.getByTestId('habit-save-button'))

    const saved = getHabits()
    expect(saved[0].name).toBe('Drink More Water')
    // Immutable fields must not change
    expect(saved[0].id).toBe('habit-1')
    expect(saved[0].userId).toBe(userId)
    expect(saved[0].createdAt).toBe(sampleHabit.createdAt)
    expect(saved[0].completions).toEqual(sampleHabit.completions)
  })

  it('deletes a habit only after explicit confirmation', () => {
    saveHabits([sampleHabit])

    render(<HabitList userId={userId} habits={[sampleHabit]} onUpdate={() => {}} />)

    // Click delete — confirmation should appear
    fireEvent.click(screen.getByTestId('habit-delete-drink-water'))

    // Habit should NOT be deleted yet
    expect(getHabits()).toHaveLength(1)
    expect(screen.getByTestId('confirm-delete-button')).toBeInTheDocument()

    // Now confirm — habit should be deleted
    fireEvent.click(screen.getByTestId('confirm-delete-button'))
    expect(getHabits()).toHaveLength(0)
  })

  it('toggles completion and updates the streak display', async () => {
    saveHabits([sampleHabit])

    render(<HabitList userId={userId} habits={[sampleHabit]} onUpdate={() => {}} />)

    const streakEl = screen.getByTestId('habit-streak-drink-water')
    expect(streakEl.textContent).toContain('0')

    fireEvent.click(screen.getByTestId('habit-complete-drink-water'))

    await waitFor(() => {
      expect(screen.getByTestId('habit-streak-drink-water').textContent).toContain('1')
    })

    const today = new Date().toISOString().split('T')[0]
    const saved = getHabits()
    expect(saved[0].completions).toContain(today)

    // Toggle off — streak should return to 0
    fireEvent.click(screen.getByTestId('habit-complete-drink-water'))
    await waitFor(() => {
      expect(screen.getByTestId('habit-streak-drink-water').textContent).toContain('0')
    })
    expect(getHabits()[0].completions).not.toContain(today)
  })
})