import type { Habit } from '@/types/habit'

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const hasDate = habit.completions.includes(date)

  const newCompletions = hasDate
    ? habit.completions.filter((d) => d !== date)  // remove
    : [...new Set([...habit.completions, date])]    // add (no duplicates)

  // Return a NEW object — don't mutate the original
  return { ...habit, completions: newCompletions }
}