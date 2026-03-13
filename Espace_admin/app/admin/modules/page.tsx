'use client'

import { useState } from 'react'
import { useModules, type Module } from '@/lib/modules-store'
import { ModuleFormModal } from '@/components/admin/module-form-modal'
import Link from 'next/link'

function DeleteConfirmModal({
  module,
  onConfirm,
  onCancel,
}: {
  module: Module
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'oklch(0 0 0 / 0.7)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6"
        style={{
          background: 'oklch(0.15 0.03 245)',
          border: '1px solid oklch(0.55 0.22 25 / 0.4)',
          boxShadow: '0 0 40px oklch(0.55 0.22 25 / 0.1)',
        }}
      >
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
          style={{ background: 'oklch(0.55 0.22 25 / 0.15)' }}>
          🗑️
        </div>
        <h3 className="text-base font-bold text-foreground mb-1">
          Supprimer ce module ?
        </h3>
        <p className="text-sm text-muted-foreground mb-5">
          <strong className="text-foreground">{module.name}</strong> sera définitivement
          supprimé et retiré du plan.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            style={{ border: '1px solid oklch(0.25 0.05 245)' }}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{
              background: 'oklch(0.55 0.22 25)',
              boxShadow: '0 0 16px oklch(0.55 0.22 25 / 0.25)',
            }}
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  )
}

const STATUS_LABELS: Record<string, string> = {
  active: 'Actif',
  inactive: 'Inactif',
  draft: 'Brouillon',
}

const STATUS_COLORS: Record<string, string> = {
  active: 'oklch(0.65 0.18 160)',
  inactive: 'oklch(0.50 0.04 245)',
  draft: 'oklch(0.65 0.15 245)',
}

const STATUS_BG: Record<string, string> = {
  active: 'oklch(0.65 0.18 160 / 0.12)',
  inactive: 'oklch(0.25 0.04 245)',
  draft: 'oklch(0.55 0.15 245 / 0.12)',
}

export default function ModulesPage() {
  const { modules, deleteModule } = useModules()
  const [showAdd, setShowAdd] = useState(false)
  const [editModule, setEditModule] = useState<Module | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<Module | undefined>()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filtered = modules.filter(m => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || m.status === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Modules</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {modules.length} module{modules.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/plan"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            style={{ border: '1px solid oklch(0.25 0.05 245)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="3,6 9,3 15,6 21,3 21,18 15,21 9,18 3,21" />
            </svg>
            Plan
          </Link>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground transition-all"
            style={{
              background: 'oklch(0.75 0.16 65)',
              boxShadow: '0 0 16px oklch(0.75 0.16 65 / 0.3)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nouveau module
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1 min-w-48"
          style={{
            background: 'oklch(0.15 0.03 245)',
            border: '1px solid oklch(0.22 0.04 245)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground flex-shrink-0">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none flex-1"
          />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'active', 'draft', 'inactive'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className="px-3 py-2 rounded-xl text-xs font-medium transition-all"
              style={{
                background:
                  filterStatus === s
                    ? 'oklch(0.75 0.16 65)'
                    : 'oklch(0.15 0.03 245)',
                color:
                  filterStatus === s
                    ? 'oklch(0.11 0.025 245)'
                    : 'oklch(0.60 0.04 245)',
                border:
                  filterStatus === s
                    ? '1px solid oklch(0.75 0.16 65)'
                    : '1px solid oklch(0.22 0.04 245)',
              }}
            >
              {s === 'all'
                ? 'Tous'
                : s === 'active'
                  ? 'Actifs'
                  : s === 'draft'
                    ? 'Brouillons'
                    : 'Inactifs'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{
            background: 'oklch(0.15 0.03 245)',
            border: '1px dashed oklch(0.30 0.06 245)',
          }}
        >
          <p className="text-4xl mb-3">📦</p>
          <p className="text-foreground font-medium">Aucun module trouvé</p>
          <p className="text-muted-foreground text-sm mt-1">
            Modifiez vos filtres ou créez un nouveau module
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(mod => (
            <div
              key={mod.id}
              className="rounded-2xl p-5 flex flex-col gap-4 group transition-all duration-200"
              style={{
                background: 'oklch(0.15 0.03 245)',
                border: '1px solid oklch(0.22 0.04 245)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = mod.color + '66'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'oklch(0.22 0.04 245)'
              }}
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: mod.color + '22' }}
                >
                  {mod.icon}
                </div>
                <span
                  className="text-xs px-2.5 py-1 rounded-full font-medium mt-0.5"
                  style={{
                    background: STATUS_BG[mod.status],
                    color: STATUS_COLORS[mod.status],
                  }}
                >
                  {STATUS_LABELS[mod.status]}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-sm leading-snug text-balance">
                  {mod.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                  {mod.description}
                </p>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span
                  className="px-2 py-0.5 rounded-md"
                  style={{ background: 'oklch(0.20 0.04 245)' }}
                >
                  {mod.category}
                </span>
                <span className="flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {mod.duration}
                </span>
                {mod.planPosition && (
                  <span
                    className="ml-auto flex items-center gap-1"
                    style={{ color: 'oklch(0.65 0.18 160)' }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="3,6 9,3 15,6 21,3 21,18 15,21 9,18 3,21" />
                    </svg>
                    Sur le plan
                  </span>
                )}
              </div>

              {/* Actions */}
              <div
                className="flex items-center gap-2 pt-3"
                style={{ borderTop: '1px solid oklch(0.22 0.04 245)' }}
              >
                <button
                  onClick={() => setEditModule(mod)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Modifier
                </button>
                <button
                  onClick={() => setDeleteTarget(mod)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:bg-destructive/10 transition-all"
                  style={{ color: 'oklch(0.65 0.18 25)' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.color = 'oklch(0.75 0.22 25)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.color = 'oklch(0.65 0.18 25)'
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showAdd && <ModuleFormModal onClose={() => setShowAdd(false)} />}
      {editModule && (
        <ModuleFormModal module={editModule} onClose={() => setEditModule(undefined)} />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          module={deleteTarget}
          onConfirm={() => {
            deleteModule(deleteTarget.id)
            setDeleteTarget(undefined)
          }}
          onCancel={() => setDeleteTarget(undefined)}
        />
      )}
    </div>
  )
}
