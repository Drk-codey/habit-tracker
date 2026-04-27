import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SignupForm from '@/components/auth/SignupForm'
import LoginForm from '@/components/auth/LoginForm'
import { saveUsers } from '@/lib/storage'
import type { User } from '@/types/auth'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

beforeEach(() => {
  localStorage.clear()
})

describe('auth flow', () => {
  it('submits the signup form and creates a session', () => {
    render(<SignupForm />)

    fireEvent.change(screen.getByTestId('auth-signup-email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByTestId('auth-signup-password'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByTestId('auth-signup-submit'))

    const session = JSON.parse(localStorage.getItem('habit-tracker-session') || 'null')
    expect(session).not.toBeNull()
    expect(session.email).toBe('test@example.com')
    expect(session.userId).toBeTruthy()
  })

  it('shows an error for duplicate signup email', () => {
    const existing: User = {
      id: '1',
      email: 'test@example.com',
      password: 'pass',
      createdAt: new Date().toISOString(),
    }
    saveUsers([existing])

    render(<SignupForm />)

    fireEvent.change(screen.getByTestId('auth-signup-email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByTestId('auth-signup-password'), {
      target: { value: 'anything' },
    })
    fireEvent.click(screen.getByTestId('auth-signup-submit'))

    expect(screen.getByText('User already exists')).toBeInTheDocument()
    expect(localStorage.getItem('habit-tracker-session')).toBeNull()
  })

  it('submits the login form and stores the active session', () => {
    const user: User = {
      id: 'user-123',
      email: 'test@example.com',
      password: 'pass123',
      createdAt: new Date().toISOString(),
    }
    saveUsers([user])

    render(<LoginForm />)

    fireEvent.change(screen.getByTestId('auth-login-email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByTestId('auth-login-password'), {
      target: { value: 'pass123' },
    })
    fireEvent.click(screen.getByTestId('auth-login-submit'))

    const session = JSON.parse(localStorage.getItem('habit-tracker-session') || 'null')
    expect(session).not.toBeNull()
    expect(session.userId).toBe('user-123')
    expect(session.email).toBe('test@example.com')
  })

  it('shows an error for invalid login credentials', () => {
    render(<LoginForm />)

    fireEvent.change(screen.getByTestId('auth-login-email'), {
      target: { value: 'nobody@example.com' },
    })
    fireEvent.change(screen.getByTestId('auth-login-password'), {
      target: { value: 'wrongpass' },
    })
    fireEvent.click(screen.getByTestId('auth-login-submit'))

    expect(screen.getByText('Invalid email or password')).toBeInTheDocument()
    expect(localStorage.getItem('habit-tracker-session')).toBeNull()
  })
})