import { describe, it, expect, beforeEach, vi } from 'vitest'
import { signUp, logIn, logOut, getActiveSession } from '@/lib/auth'
import * as storage from '@/lib/storage'

describe('auth.ts', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('signUp', () => {
    it('should sign up a new user successfully', () => {
      const result = signUp('test@test.com', 'password')
      expect(result.user).not.toBeNull()
      expect(result.error).toBeNull()
      expect(result.user?.email).toBe('test@test.com')
    })

    it('should return error if user already exists', () => {
      signUp('test@test.com', 'password')
      const result = signUp('test@test.com', 'password')
      expect(result.user).toBeNull()
      expect(result.error).toBe('User already exists')
    })
  })

  describe('logIn', () => {
    it('should log in successfully with correct credentials', () => {
      signUp('test@test.com', 'password')
      const result = logIn('test@test.com', 'password')
      expect(result.session).not.toBeNull()
      expect(result.error).toBeNull()
      expect(result.session?.email).toBe('test@test.com')
    })

    it('should return error with incorrect email', () => {
      const result = logIn('wrong@test.com', 'password')
      expect(result.session).toBeNull()
      expect(result.error).toBe('Invalid email or password')
    })

    it('should return error with incorrect password', () => {
      signUp('test@test.com', 'password')
      const result = logIn('test@test.com', 'wrong')
      expect(result.session).toBeNull()
      expect(result.error).toBe('Invalid email or password')
    })
  })

  describe('logOut', () => {
    it('should clear the active session', () => {
      signUp('test@test.com', 'password')
      logIn('test@test.com', 'password')
      expect(getActiveSession()).not.toBeNull()
      logOut()
      expect(getActiveSession()).toBeNull()
    })
  })

  describe('getActiveSession', () => {
    it('should return null if no user is logged in', () => {
      expect(getActiveSession()).toBeNull()
    })

    it('should return the active session if user is logged in', () => {
      signUp('test@test.com', 'password')
      const { session } = logIn('test@test.com', 'password')
      expect(getActiveSession()).toEqual(session)
    })
  })
})
