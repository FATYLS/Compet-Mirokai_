'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/lib/admin-auth'
import Image from 'next/image'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAdminAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    const success = login(username, password)
    if (success) {
      router.push('/admin/dashboard')
    } else {
      setError('Identifiants incorrects. Essayez admin / mirokais2024')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen stars-bg bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 100%, oklch(0.55 0.15 245 / 0.15) 0%, transparent 70%)',
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/e100_s040_poster__compo__w001%201-seBUFmozIvR1pYi3wrae4OX1xAyzkw.png"
              alt="Mirokaï Experience"
              width={180}
              height={200}
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
          <h1
            className="text-3xl font-bold tracking-widest uppercase text-foreground text-balance"
            style={{ fontFamily: 'serif', letterSpacing: '0.15em' }}
          >
            Mirokaï
          </h1>
          <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mt-1">
            Espace Administration
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 border"
          style={{
            background: 'oklch(0.15 0.03 245 / 0.85)',
            borderColor: 'oklch(0.30 0.06 245)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 0 40px oklch(0.55 0.15 245 / 0.15), 0 0 0 1px oklch(0.30 0.06 245 / 0.5)',
          }}
        >
          <h2 className="text-xl font-semibold text-foreground mb-1">Connexion</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Connectez-vous pour gérer l&apos;expérience
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="username"
                className="text-sm font-medium text-foreground/80 uppercase tracking-wider"
              >
                Identifiant
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                required
                autoComplete="username"
                className="w-full rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground outline-none transition-all focus:ring-2"
                style={{
                  background: 'oklch(0.11 0.025 245)',
                  border: '1px solid oklch(0.25 0.05 245)',
                  focusRingColor: 'var(--ring)',
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'oklch(0.75 0.16 65)'
                  e.target.style.boxShadow = '0 0 0 2px oklch(0.75 0.16 65 / 0.2)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'oklch(0.25 0.05 245)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground/80 uppercase tracking-wider"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••"
                required
                autoComplete="current-password"
                className="w-full rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground outline-none transition-all"
                style={{
                  background: 'oklch(0.11 0.025 245)',
                  border: '1px solid oklch(0.25 0.05 245)',
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'oklch(0.75 0.16 65)'
                  e.target.style.boxShadow = '0 0 0 2px oklch(0.75 0.16 65 / 0.2)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'oklch(0.25 0.05 245)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            {error && (
              <div
                className="rounded-xl px-4 py-3 text-sm"
                style={{
                  background: 'oklch(0.55 0.22 25 / 0.15)',
                  border: '1px solid oklch(0.55 0.22 25 / 0.4)',
                  color: 'oklch(0.75 0.18 25)',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-3 font-semibold text-primary-foreground transition-all duration-200 uppercase tracking-widest text-sm mt-2 disabled:opacity-70"
              style={{
                background: loading
                  ? 'oklch(0.65 0.14 65)'
                  : 'oklch(0.75 0.16 65)',
                boxShadow: loading ? 'none' : '0 0 20px oklch(0.75 0.16 65 / 0.3)',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
                  />
                  Connexion...
                </span>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Identifiants par défaut:{' '}
            <span className="text-primary font-mono">admin</span> /{' '}
            <span className="text-primary font-mono">mirokais2024</span>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6 tracking-widest uppercase">
          Mirokaï Experience &copy; 2024
        </p>
      </div>
    </div>
  )
}
