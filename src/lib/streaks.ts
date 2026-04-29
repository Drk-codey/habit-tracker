export function calculateCurrentStreak(completions: string[], today?: string): number {
  // Use today's date if not provided
  const todayStr = today ?? new Date().toISOString().split('T')[0]

  // Remove duplicates and sort oldest → newest
  const unique = [...new Set(completions)].sort()

  // If today is not in completions, streak is 0
  if (!unique.includes(todayStr)) return 0

  // Count backwards from today
  let streak = 0
  const current = new Date(todayStr)

  while (true) {
    const dateStr = current.toISOString().split('T')[0]
    if (!unique.includes(dateStr)) break
    streak++
    // Go back one day
    current.setDate(current.getDate() - 1)
  }

  return streak
}