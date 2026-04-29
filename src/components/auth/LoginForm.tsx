'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { findUserByEmail, saveSession } from '@/lib/storage'


export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const user = findUserByEmail(email)

    if (!user || user.password !== password) {
      setError('Invalid email or password')
      return
    }

    saveSession({ userId: user.id, email: user.email })
    router.push('/dashboard')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold text-center">Log In</h2>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        required
        data-testid="auth-login-email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border rounded px-3 py-2"
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        required
        data-testid="auth-login-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border rounded px-3 py-2"
      />

      <button
        type="submit"
        data-testid="auth-login-submit"
        className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Log In
      </button>

      <p className="text-sm text-center">
        No account?{' '}
        <a href="/signup" className="text-green-600 underline">Sign up</a>
      </p>
    </form>
  )
}