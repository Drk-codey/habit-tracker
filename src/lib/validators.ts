import { MAX_HABIT_NAME_LENGTH } from './constants'

export function validateHabitName(name: string): {
  valid: boolean;
  value: string;
  error: string | null;
} {
  const trimmed = name.trim()

  if (!trimmed) {
    return { valid: false, value: trimmed, error: 'Habit name is required' }
  }

  if (trimmed.length > MAX_HABIT_NAME_LENGTH) {
    return {
      valid: false,
      value: trimmed,
      error: `Habit name must be ${MAX_HABIT_NAME_LENGTH} characters or fewer`,
    }
  }

  return { valid: true, value: trimmed, error: null }
}