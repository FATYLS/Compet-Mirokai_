'use client'

import { useState, useEffect } from 'react'
import { type Module, type ModuleCategory, useModules } from '@/lib/modules-store'

const CATEGORIES: { value: ModuleCategory; label: string; icon: string }[] = [
  { value: 'quiz', label: 'Quiz', icon: '❓' },
  { value: 'video', label: 'Vidéo', icon: '🎬' },
  { value: 'ar', label: 'Réalité Augmentée', icon: '🔮' },
  { value: 'game', label: 'Mini-jeu', icon: '🎮' },
  { value: 'story', label: 'Histoire', icon: '📖' },
  { value: 'photo', label: 'Photo', icon: '📸' },
]

const STATUSES = [
  { value: 'active', label: 'Actif' },
  { value: 'inactive', label: 'Inactif' },
  { value: 'draft', label: 'Brouillon' },
] as const

interface Props {
  module?: Module
  onClose: () => void
}

const FIELD_STYLE = {
  background: 'oklch(0.11 0.025 245)',
  border: '1px solid oklch(0.25 0.05 245)',
  borderRadius: '0.75rem',
  padding: '0.625rem 1rem',
  color: 'white',
  width: '100%',
  outline: 'none',
  fontSize: '0.875rem',
}

export function ModuleFormModal({ module, onClose }: Props) {
  const { addModule, updateModule, CATEGORY_COLORS } = useModules()

  const isEdit = !!module

  const [form, setForm] = useState({
    name: module?.name ?? '',
    description: module?.description ?? '',
    category: module?.category ?? ('story' as ModuleCategory),
    status: module?.status ?? ('draft' as 'active' | 'inactive' | 'draft'),
    duration: module?.duration ?? '5 min',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cat = form.category as ModuleCategory
    if (isEdit && module) {
      updateModule(module.id, {
        ...form,
        icon: CATEGORIES.find(c => c.value === cat)?.icon ?? '📦',
        color: CATEGORY_COLORS[cat],
      })
    } else {
      addModule({
        ...form,
        icon: CATEGORIES.find(c => c.value === cat)?.icon ?? '📦',
        color: CATEGORY_COLORS[cat],
        status: form.status,
      })
    }
    onClose()
  }

  // Trap focus
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'oklch(0 0 0 / 0.7)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-lg rounded-2xl p-6 relative"
        style={{
          background: 'oklch(0.15 0.03 245)',
          border: '1px solid oklch(0.30 0.06 245)',
          boxShadow: '0 0 40px oklch(0.55 0.15 245 / 0.2)',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Fermer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 className="text-lg font-bold text-foreground mb-1">
          {isEdit ? 'Modifier le module' : 'Nouveau module'}
        </h2>
        <p className="text-sm text-muted-foreground mb-5">
          {isEdit
            ? 'Modifiez les informations du module'
            : 'Remplissez les informations pour créer un module'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground/70 uppercase tracking-wider">
              Nom du module *
            </label>
            <input
              style={FIELD_STYLE}
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Ex : Quiz Mirium"
              required
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
            <label className="text-xs font-medium text-foreground/70 uppercase tracking-wider">
              Description
            </label>
            <textarea
              style={{ ...FIELD_STYLE, resize: 'vertical', minHeight: '80px' }}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Décrivez brièvement le module..."
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

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground/70 uppercase tracking-wider">
                Catégorie
              </label>
              <select
                style={FIELD_STYLE}
                value={form.category}
                onChange={e =>
                  setForm(f => ({
                    ...f,
                    category: e.target.value as ModuleCategory,
                  }))
                }
              >
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value} style={{ background: '#0d1f3c' }}>
                    {c.icon} {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground/70 uppercase tracking-wider">
                Statut
              </label>
              <select
                style={FIELD_STYLE}
                value={form.status}
                onChange={e =>
                  setForm(f => ({
                    ...f,
                    status: e.target.value as 'active' | 'inactive' | 'draft',
                  }))
                }
              >
                {STATUSES.map(s => (
                  <option key={s.value} value={s.value} style={{ background: '#0d1f3c' }}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground/70 uppercase tracking-wider">
              Durée estimée
            </label>
            <input
              style={FIELD_STYLE}
              value={form.duration}
              onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
              placeholder="Ex : 5 min"
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

          {/* Category color preview */}
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: 'oklch(0.20 0.04 245)' }}
          >
            <div
              className="w-8 h-8 rounded-lg text-xl flex items-center justify-center"
              style={{ background: CATEGORY_COLORS[form.category] + '33' }}
            >
              {CATEGORIES.find(c => c.value === form.category)?.icon}
            </div>
            <div>
              <p className="text-xs font-medium text-foreground/80">Aperçu de la catégorie</p>
              <p className="text-xs text-muted-foreground">
                {CATEGORIES.find(c => c.value === form.category)?.label}
              </p>
            </div>
            <div
              className="ml-auto w-4 h-4 rounded-full"
              style={{ background: CATEGORY_COLORS[form.category] }}
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              style={{ border: '1px solid oklch(0.25 0.05 245)' }}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground transition-all"
              style={{
                background: 'oklch(0.75 0.16 65)',
                boxShadow: '0 0 16px oklch(0.75 0.16 65 / 0.25)',
              }}
            >
              {isEdit ? 'Sauvegarder' : 'Créer le module'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
