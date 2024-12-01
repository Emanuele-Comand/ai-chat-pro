"use client"

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Register() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Le password non coincidono')
      return
    }

    setLoading(true)
    
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
        data: {
          username: username
        }
      },
    })

    setLoading(false)
    if (signUpError) {
      setError(signUpError.message)
    } else {
      router.push('/') // Reindirizza alla home dopo la registrazione
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-gray-800 p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
            Registrazione
          </h2>
          <p className="mt-2 text-gray-400">Crea il tuo account</p>
        </div>

        <form onSubmit={handleRegister} className="mt-8 space-y-6">
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
              required
            />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
              required
            />
            <Input
              type="password"
              placeholder="Conferma Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white"
          >
            {loading ? 'Caricamento...' : 'Conferma'}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Link 
            href="/authentication"
            className="text-sm text-gray-400 hover:text-gray-300"
          >
            Torna al login
          </Link>
        </div>
      </div>
    </div>
  )
} 