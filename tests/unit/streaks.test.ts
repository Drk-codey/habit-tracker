/* MENTOR_TRACE_STAGE3_HABIT_A91 */
import { describe, it, expect } from 'vitest'
import { calculateCurrentStreak } from '@/lib/streaks'

function daysAgo(n: number): string {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - n)
  return d.toISOString().split('T')[0]
}

const today = daysAgo(0)
const yesterday = daysAgo(1)
const twoDaysAgo = daysAgo(2)
const threeDaysAgo = daysAgo(3)

describe('calculateCurrentStreak', () => {
  it('returns 0 when completions is empty', () => {
    expect(calculateCurrentStreak([])).toBe(0)
  })

  it('returns 0 when today is not completed', () => {
    expect(calculateCurrentStreak([yesterday])).toBe(0)
    expect(calculateCurrentStreak([yesterday, twoDaysAgo])).toBe(0)
  })

  it('returns the correct streak for consecutive completed days', () => {
    expect(calculateCurrentStreak([today])).toBe(1)
    expect(calculateCurrentStreak([today, yesterday])).toBe(2)
    expect(calculateCurrentStreak([today, yesterday, twoDaysAgo])).toBe(3)
    expect(calculateCurrentStreak([today, yesterday, twoDaysAgo, threeDaysAgo])).toBe(4)
  })

  it('ignores duplicate completion dates', () => {
    expect(calculateCurrentStreak([today, today, today])).toBe(1)
    expect(calculateCurrentStreak([today, yesterday, yesterday])).toBe(2)
  })

  it('breaks the streak when a calendar day is missing', () => {
    // today + twoDaysAgo but NOT yesterday — gap breaks streak
    expect(calculateCurrentStreak([today, twoDaysAgo])).toBe(1)
    // today + threeDaysAgo — two days missing
    expect(calculateCurrentStreak([today, threeDaysAgo])).toBe(1)
  })
})