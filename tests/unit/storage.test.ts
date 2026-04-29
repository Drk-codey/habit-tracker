import { describe, it, expect, beforeEach, vi } from 'vitest'
import { 
  getUsers, 
  saveUsers, 
  createUser, 
  getSession, 
  saveSession, 
  clearSession, 
  getHabits, 
  saveHabits, 
  getHabitsForUser, 
  addHabit, 
  updateHabit, 
  deleteHabit 
} from '@/lib/storage'

describe('storage.ts', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('Users', () => {
    it('should return empty array if no users stored', () => {
      expect(getUsers()).toEqual([])
    })

    it('should save and retrieve users', () => {
      const users = [{ id: '1', email: 'test@test.com', password: '123', createdAt: '2024-01-01' }]
      saveUsers(users)
      expect(getUsers()).toEqual(users)
    })

    it('should create a new user', () => {
      const user = createUser('new@test.com', 'password')
      expect(user.email).toBe('new@test.com')
      expect(user.id).toBeDefined()
      expect(getUsers()).toHaveLength(1)
      expect(getUsers()[0].email).toBe('new@test.com')
    })
  })

  describe('Session', () => {
    it('should return null if no session stored', () => {
      expect(getSession()).toBeNull()
    })

    it('should save and retrieve session', () => {
      const session = { userId: '1', email: 'test@test.com' }
      saveSession(session)
      expect(getSession()).toEqual(session)
    })

    it('should clear session', () => {
      saveSession({ userId: '1', email: 'test@test.com' })
      clearSession()
      expect(getSession()).toBeNull()
    })
  })

  describe('Habits', () => {
    it('should return empty array if no habits stored', () => {
      expect(getHabits()).toEqual([])
    })

    it('should save and retrieve habits', () => {
      const habits = [{ id: 'h1', userId: '1', name: 'Habit 1', description: '', completions: [], createdAt: '', frequency: 'daily' as const }]
      saveHabits(habits)
      expect(getHabits()).toEqual(habits)
    })

    it('should get habits for a specific user', () => {
      const habits = [
        { id: 'h1', userId: '1', name: 'Habit 1', description: '', completions: [], createdAt: '', frequency: 'daily' as const },
        { id: 'h2', userId: '2', name: 'Habit 2', description: '', completions: [], createdAt: '', frequency: 'daily' as const }
      ]
      saveHabits(habits)
      expect(getHabitsForUser('1')).toHaveLength(1)
      expect(getHabitsForUser('1')[0].id).toBe('h1')
    })

    it('should add a habit', () => {
      const habit = { id: 'h1', userId: '1', name: 'Habit 1', description: '', completions: [], createdAt: '', frequency: 'daily' as const }
      addHabit(habit)
      expect(getHabits()).toHaveLength(1)
    })

    it('should update a habit', () => {
      const habit = { id: 'h1', userId: '1', name: 'Habit 1', description: '', completions: [], createdAt: '', frequency: 'daily' as const }
      addHabit(habit)
      const updated = { ...habit, name: 'Updated' }
      updateHabit(updated)
      expect(getHabits()[0].name).toBe('Updated')
    })

    it('should delete a habit', () => {
      const habit = { id: 'h1', userId: '1', name: 'Habit 1', description: '', completions: [], createdAt: '', frequency: 'daily' as const }
      addHabit(habit)
      deleteHabit('h1')
      expect(getHabits()).toHaveLength(0)
    })
  })
})
