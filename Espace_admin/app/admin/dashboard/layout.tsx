'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/lib/admin-auth'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated } = useAdminAuth()
  const router = useRouter()
  const [checked, setChecked] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('mirokais_admin_auth')
    if (!isAuthenticated && stored !== 'true') {
      router.replace('/admin/login')
    } else {
      setChecked(true)
    }
  }, [isAuthenticated, router])

  if (!checked) {
    return (
      <div className="min-h-screen stars-bg bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-shrink-0 sticky top-0 h-screen">
        <AdminSidebar />
      </div>

      {/* Mobile Header */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
        style={{
          background: 'oklch(0.09 0.025 245 / 0.95)',
          borderBottom: '1px solid oklch(0.22 0.04 245)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <p className="text-sm font-bold tracking-wider uppercase" style={{ fontFamily: 'serif' }}>
          Mirokaï Admin
        </p>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground"
          aria-label="Menu"
        >
          {mobileMenuOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 pt-14"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="h-full w-64"
            onClick={e => e.stopPropagation()}
          >
            <AdminSidebar mobile />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen md:pt-0 pt-14 overflow-x-hidden">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
