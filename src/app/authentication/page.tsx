"use client"

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Verifica che email e password non siano vuoti
      if (!email || !password) {
        throw new Error('Inserisci email e password')
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      })

      if (error) {
        switch (error.message) {
          case 'Invalid login credentials':
            throw new Error('Email o password non corretti')
          case 'Email not confirmed':
            throw new Error('Email non verificata. Controlla la tua casella di posta')
          default:
            throw new Error(error.message)
        }
      }

      if (data?.user) {
        console.log('Login effettuato con successo:', data.user)
        router.push('/app-page')
        router.refresh()
      }

    } catch (error: unknown) {
      console.error('Errore durante il login:', error)
      setError(error instanceof Error ? error.message : 'Si è verificato un errore')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-gray-800 p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
            Login
          </h2>
          <p className="mt-2 text-gray-400">Accedi al tuo account</p>
        </div>

        <form onSubmit={handleSignIn} className="mt-8 space-y-6">
          <div className="space-y-4">
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
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white"
          >
            {loading ? 'Caricamento...' : 'Accedi'}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Link 
            href="/authentication/register"
            className="text-sm text-gray-400 hover:text-gray-300"
          >
            Non hai un account? Registrati
          </Link>
        </div>
      </div>
    </div>
  )
} 