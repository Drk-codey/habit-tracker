import {
  getUsers,
  saveUsers,
  findUserByEmail,
  getSession,
  saveSession,
  clearSession,
} from './storage'
import type { User, Session } from '@/types/auth'

/** Attempt to register a new user. Returns the new User or null if the email already exists. */
export function signUp(
  email: string,
  password: string
): { user: User; error: null } | { user: null; error: string } {
  if (findUserByEmail(email)) {
    return { user: null, error: 'User already exists' }
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    email,
    password,
    createdAt: new Date().toISOString(),
  }

  saveUsers([...getUsers(), newUser])
  return { user: newUser, error: null }
}

/** Attempt to log in. Returns the session or an error string. */
export function logIn(
  email: string,
  password: string
): { session: Session; error: null } | { session: null; error: string } {
  const user = findUserByEmail(email)

  if (!user || user.password !== password) {
    return { session: null, error: 'Invalid email or password' }
  }

  const session: Session = { userId: user.id, email: user.email }
  saveSession(session)
  return { session, error: null }
}

/** Log out the current user by clearing the session. */
export function logOut(): void {
  clearSession()
}

/** Return the active session, or null if no one is logged in. */
export function getActiveSession(): Session | null {
  return getSession()
}