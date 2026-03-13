'use client'

import { useModules } from '@/lib/modules-store'
import Image from 'next/image'
import Link from 'next/link'

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string
  value: string | number
  sub?: string
  color: string
}) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-2"
      style={{
        background: 'oklch(0.15 0.03 245)',
        border: '1px solid oklch(0.22 0.04 245)',
      }}
    >
      <div
        className="w-8 h-1 rounded-full"
        style={{ background: color }}
      />
      <p className="text-3xl font-bold text-foreground">{value}</p>
      <div>
        <p className="text-sm font-medium text-foreground/80">{label}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function QuickActionCard({
  label,
  description,
  href,
  icon,
}: {
  label: string
  description: string
  href: string
  icon: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl p-5 flex items-start gap-4 transition-all duration-200 group"
      style={{
        background: 'oklch(0.15 0.03 245)',
        border: '1px solid oklch(0.22 0.04 245)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'oklch(0.75 0.16 65 / 0.5)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'oklch(0.22 0.04 245)'
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ background: 'oklch(0.20 0.04 245)' }}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
          {label}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
      </div>
      <svg
        className="ml-auto text-muted-foreground group-hover:text-primary transition-all duration-200 group-hover:translate-x-1 mt-1"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </Link>
  )
}

export default function DashboardPage() {
  const { modules } = useModules()

  const active = modules.filter(m => m.status === 'active').length
  const draft = modules.filter(m => m.status === 'draft').length
  const placed = modules.filter(m => m.planPosition).length

  const recentModules = [...modules].slice(0, 4)

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground text-balance">
            Tableau de bord
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez l&apos;expérience Mirokaï depuis cet espace
          </p>
        </div>
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Image%202%20perso%206-lIh6ufI7X3yj0eQfbgq3Ii9gxWmv29.png"
          alt="Mirokaï"
          width={70}
          height={80}
          className="object-contain drop-shadow-lg hidden sm:block"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total modules"
          value={modules.length}
          sub="dans la bibliothèque"
          color="oklch(0.75 0.16 65)"
        />
        <StatCard
          label="Modules actifs"
          value={active}
          sub="visibles par les visiteurs"
          color="oklch(0.65 0.18 160)"
        />
        <StatCard
          label="Brouillons"
          value={draft}
          sub="en cours de création"
          color="oklch(0.55 0.15 245)"
        />
        <StatCard
          label="Placés sur le plan"
          value={placed}
          sub="positions configurées"
          color="oklch(0.70 0.20 300)"
        />
      </div>

      {/* Quick actions + Preview */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-foreground">
            Actions rapides
          </h2>
          <div className="flex flex-col gap-3">
            <QuickActionCard
              href="/admin/modules"
              label="Gérer les modules"
              description="Ajouter, modifier ou supprimer des modules d'expérience"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              }
            />
            <QuickActionCard
              href="/admin/plan"
              label="Éditeur de plan"
              description="Placer les modules sur l&apos;espace d&apos;expérience interactif"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="3,6 9,3 15,6 21,3 21,18 15,21 9,18 3,21" />
                  <line x1="9" y1="3" x2="9" y2="18" />
                  <line x1="15" y1="6" x2="15" y2="21" />
                </svg>
              }
            />
          </div>
        </div>

        {/* PWA Preview mockup */}
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-foreground">
            Aperçu interface visiteur
          </h2>
          <div
            className="rounded-2xl overflow-hidden relative"
            style={{
              background: 'oklch(0.15 0.03 245)',
              border: '1px solid oklch(0.22 0.04 245)',
            }}
          >
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Accueil-SStctIyaURG9DXuKyzSXdur97Rjg8d.png"
              alt="Aperçu PWA Mirokaï Experience"
              width={400}
              height={300}
              className="w-full object-cover object-top"
              style={{ maxHeight: '220px' }}
            />
            <div
              className="absolute inset-0 flex items-end p-4"
              style={{
                background: 'linear-gradient(to top, oklch(0.11 0.025 245 / 0.9) 0%, transparent 60%)',
              }}
            >
              <div className="flex items-center justify-between w-full">
                <p className="text-xs text-muted-foreground">Interface Mirokaï Experience</p>
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                  style={{
                    background: 'oklch(0.75 0.16 65)',
                    color: 'oklch(0.11 0.025 245)',
                  }}
                >
                  Ouvrir
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent modules */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Modules récents</h2>
          <Link
            href="/admin/modules"
            className="text-xs text-primary hover:underline"
          >
            Voir tout
          </Link>
        </div>
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid oklch(0.22 0.04 245)' }}
        >
          {recentModules.map((mod, idx) => (
            <div
              key={mod.id}
              className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/30"
              style={{
                borderTop: idx > 0 ? '1px solid oklch(0.22 0.04 245)' : undefined,
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: mod.color + '22' }}
              >
                {mod.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{mod.name}</p>
                <p className="text-xs text-muted-foreground truncate">{mod.description}</p>
              </div>
              <span
                className="text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0"
                style={{
                  background:
                    mod.status === 'active'
                      ? 'oklch(0.65 0.18 160 / 0.15)'
                      : mod.status === 'draft'
                        ? 'oklch(0.55 0.15 245 / 0.15)'
                        : 'oklch(0.25 0.04 245)',
                  color:
                    mod.status === 'active'
                      ? 'oklch(0.65 0.18 160)'
                      : mod.status === 'draft'
                        ? 'oklch(0.65 0.15 245)'
                        : 'oklch(0.50 0.04 245)',
                }}
              >
                {mod.status === 'active'
                  ? 'Actif'
                  : mod.status === 'draft'
                    ? 'Brouillon'
                    : 'Inactif'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
