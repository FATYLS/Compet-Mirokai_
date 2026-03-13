'use client'

import React, { createContext, useContext, useState } from 'react'

export type ModuleCategory = 'quiz' | 'video' | 'ar' | 'game' | 'story' | 'photo'

export interface Module {
  id: string
  name: string
  description: string
  category: ModuleCategory
  status: 'active' | 'inactive' | 'draft'
  icon: string
  color: string
  duration: string
  planPosition?: { x: number; y: number; w: number; h: number }
}

const CATEGORY_COLORS: Record<ModuleCategory, string> = {
  quiz: '#f5a623',
  video: '#4a7fd4',
  ar: '#22c55e',
  game: '#a855f7',
  story: '#ec4899',
  photo: '#14b8a6',
}

const CATEGORY_ICONS: Record<ModuleCategory, string> = {
  quiz: '❓',
  video: '🎬',
  ar: '🔮',
  game: '🎮',
  story: '📖',
  photo: '📸',
}

const INITIAL_MODULES: Module[] = [
  {
    id: 'mod-001',
    name: 'Rencontre des Mirokaïs',
    description: 'Découvrez l\'univers des Mirokaïs et apprenez à les reconnaître',
    category: 'story',
    status: 'active',
    icon: '📖',
    color: '#ec4899',
    duration: '5 min',
  },
  {
    id: 'mod-002',
    name: 'Quiz Mirium',
    description: 'Testez vos connaissances sur l\'énergie magique Mirium',
    category: 'quiz',
    status: 'active',
    icon: '❓',
    color: '#f5a623',
    duration: '3 min',
  },
  {
    id: 'mod-003',
    name: 'Réalité Augmentée Atelier',
    description: 'Explorez l\'atelier en réalité augmentée',
    category: 'ar',
    status: 'active',
    icon: '🔮',
    color: '#22c55e',
    duration: '8 min',
  },
  {
    id: 'mod-004',
    name: 'Mini-jeu Assemblage',
    description: 'Assemblez les pièces du robot Mirokaï',
    category: 'game',
    status: 'draft',
    icon: '🎮',
    color: '#a855f7',
    duration: '10 min',
  },
  {
    id: 'mod-005',
    name: 'Vidéo Introduction',
    description: 'Présentation animée du monde Mirokaï',
    category: 'video',
    status: 'active',
    icon: '🎬',
    color: '#4a7fd4',
    duration: '2 min',
  },
  {
    id: 'mod-006',
    name: 'Photo Souvenir',
    description: 'Prenez une photo avec votre Mirokaï préféré',
    category: 'photo',
    status: 'inactive',
    icon: '📸',
    color: '#14b8a6',
    duration: '1 min',
  },
]

interface ModulesContextType {
  modules: Module[]
  addModule: (module: Omit<Module, 'id'>) => void
  updateModule: (id: string, updates: Partial<Module>) => void
  deleteModule: (id: string) => void
  updatePlanPosition: (id: string, pos: { x: number; y: number; w: number; h: number }) => void
  removePlanPosition: (id: string) => void
  CATEGORY_COLORS: typeof CATEGORY_COLORS
  CATEGORY_ICONS: typeof CATEGORY_ICONS
}

const ModulesContext = createContext<ModulesContextType>({
  modules: [],
  addModule: () => {},
  updateModule: () => {},
  deleteModule: () => {},
  updatePlanPosition: () => {},
  removePlanPosition: () => {},
  CATEGORY_COLORS,
  CATEGORY_ICONS,
})

export function ModulesProvider({ children }: { children: React.ReactNode }) {
  const [modules, setModules] = useState<Module[]>(INITIAL_MODULES)

  const addModule = (module: Omit<Module, 'id'>) => {
    const newModule: Module = {
      ...module,
      id: `mod-${Date.now()}`,
    }
    setModules(prev => [...prev, newModule])
  }

  const updateModule = (id: string, updates: Partial<Module>) => {
    setModules(prev =>
      prev.map(m => (m.id === id ? { ...m, ...updates } : m))
    )
  }

  const deleteModule = (id: string) => {
    setModules(prev => prev.filter(m => m.id !== id))
  }

  const updatePlanPosition = (
    id: string,
    pos: { x: number; y: number; w: number; h: number }
  ) => {
    setModules(prev =>
      prev.map(m => (m.id === id ? { ...m, planPosition: pos } : m))
    )
  }

  const removePlanPosition = (id: string) => {
    setModules(prev =>
      prev.map(m => {
        if (m.id === id) {
          const { planPosition: _, ...rest } = m
          return rest
        }
        return m
      })
    )
  }

  return (
    <ModulesContext.Provider
      value={{
        modules,
        addModule,
        updateModule,
        deleteModule,
        updatePlanPosition,
        removePlanPosition,
        CATEGORY_COLORS,
        CATEGORY_ICONS,
      }}
    >
      {children}
    </ModulesContext.Provider>
  )
}

export function useModules() {
  return useContext(ModulesContext)
}
