import type { User, Session } from '@/types/auth'
import type { Habit } from '@/types/habit'

const USERS_KEY = 'habit-tracker-users'
const SESSION_KEY = 'habit-tracker-session'
const HABITS_KEY = 'habit-tracker-habits'

// Users 

export function getUsers(): User[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(USERS_KEY)
  return raw ? JSON.parse(raw) : []
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function findUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email === email)
}

export function createUser(email: string, password: string): User {
  const users = getUsers()
  const newUser: User = {
    id: crypto.randomUUID(),
    email,
    password,
    createdAt: new Date().toISOString(),
  }
  saveUsers([...users, newUser])
  return newUser
}

// Session 

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(SESSION_KEY)
  return raw ? JSON.parse(raw) : null
}

export function saveSession(session: Session): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
}

// Habits 

export function getHabits(): Habit[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(HABITS_KEY)
  return raw ? JSON.parse(raw) : []
}

export function saveHabits(habits: Habit[]): void {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits))
}

export function getHabitsForUser(userId: string): Habit[] {
  return getHabits().filter((h) => h.userId === userId)
}

export function addHabit(habit: Habit): void {
  saveHabits([...getHabits(), habit])
}

export function updateHabit(updated: Habit): void {
  const habits = getHabits().map((h) => (h.id === updated.id ? updated : h))
  saveHabits(habits)
}

export function deleteHabit(id: string): void {
  saveHabits(getHabits().filter((h) => h.id !== id))
}