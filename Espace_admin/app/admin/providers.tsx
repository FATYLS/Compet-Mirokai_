'use client'

import { AdminAuthProvider } from '@/lib/admin-auth'
import { ModulesProvider } from '@/lib/modules-store'

export function AdminProviders({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <ModulesProvider>{children}</ModulesProvider>
    </AdminAuthProvider>
  )
}
