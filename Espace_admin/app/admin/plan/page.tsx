'use client'

import { useState, useCallback, useRef } from 'react'
import { useModules, type Module } from '@/lib/modules-store'
import Image from 'next/image'

const GRID_COLS = 12
const GRID_ROWS = 10
const CELL_SIZE = 60

// Drag source: either from palette (no gridPos) or from grid cell
type DragSource =
  | { kind: 'palette'; moduleId: string }
  | { kind: 'grid'; moduleId: string; fromCol: number; fromRow: number }

// ----------------------------------------------------------------
// Palette item
// ----------------------------------------------------------------
function PaletteItem({
  module,
  isPlaced,
  onDragStart,
}: {
  module: Module
  isPlaced: boolean
  onDragStart: (src: DragSource) => void
}) {
  return (
    <div
      draggable
      onDragStart={e => {
        e.dataTransfer.effectAllowed = 'move'
        onDragStart({ kind: 'palette', moduleId: module.id })
      }}
      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all select-none"
      style={{
        background: isPlaced ? 'oklch(0.18 0.035 245 / 0.5)' : 'oklch(0.18 0.035 245)',
        border: isPlaced
          ? `1px solid ${module.color}44`
          : `1px solid ${module.color}66`,
        opacity: isPlaced ? 0.55 : 1,
        cursor: 'grab',
      }}
      title={isPlaced ? `${module.name} (déjà placé — glissez pour déplacer)` : `Glisser pour placer ${module.name}`}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
        style={{ background: module.color + '20' }}
      >
        {module.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-foreground truncate">{module.name}</p>
        <p className="text-[10px] text-muted-foreground">{module.duration}</p>
      </div>
      {isPlaced && (
        <div
          className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'oklch(0.65 0.18 160 / 0.25)', border: '1px solid oklch(0.65 0.18 160 / 0.5)' }}
        >
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="oklch(0.65 0.18 160)" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      )}
    </div>
  )
}

// ----------------------------------------------------------------
// Grid cell
// ----------------------------------------------------------------
function GridCell({
  col,
  row,
  module,
  isDragOver,
  isOccupied,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onRemove,
}: {
  col: number
  row: number
  module?: Module
  isDragOver: boolean
  isOccupied: boolean
  onDragStart: (src: DragSource) => void
  onDragOver: (col: number, row: number) => void
  onDragLeave: () => void
  onDrop: (col: number, row: number) => void
  onRemove: (moduleId: string) => void
}) {
  // Colour based on state
  let bgColor = 'oklch(0.13 0.028 245 / 0.3)'
  let borderStyle = '1px solid oklch(0.20 0.04 245 / 0.6)'

  if (module) {
    bgColor = module.color + '1a'
    borderStyle = `1.5px solid ${module.color}55`
  } else if (isDragOver) {
    bgColor = 'oklch(0.75 0.16 65 / 0.18)'
    borderStyle = '1.5px dashed oklch(0.75 0.16 65 / 0.9)'
  }

  return (
    <div
      className="relative flex items-center justify-center rounded transition-colors duration-75"
      style={{
        width: CELL_SIZE,
        height: CELL_SIZE,
        background: bgColor,
        border: borderStyle,
        boxSizing: 'border-box',
      }}
      onDragOver={e => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        onDragOver(col, row)
      }}
      onDragLeave={onDragLeave}
      onDrop={e => {
        e.preventDefault()
        onDrop(col, row)
      }}
    >
      {module ? (
        // Occupied cell — draggable for repositioning
        <div
          draggable
          onDragStart={e => {
            e.dataTransfer.effectAllowed = 'move'
            e.stopPropagation()
            onDragStart({ kind: 'grid', moduleId: module.id, fromCol: col, fromRow: row })
          }}
          className="group w-full h-full flex flex-col items-center justify-center gap-0.5 p-1 cursor-grab active:cursor-grabbing select-none"
        >
          <span className="text-xl leading-none">{module.icon}</span>
          <span
            className="text-[7.5px] leading-tight font-semibold text-center line-clamp-2 px-0.5"
            style={{ color: module.color }}
          >
            {module.name.split(' ').slice(0, 3).join(' ')}
          </span>

          {/* Remove button — visible on hover */}
          <button
            onClick={e => {
              e.stopPropagation()
              onRemove(module.id)
            }}
            className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full items-center justify-center hidden group-hover:flex transition-all"
            style={{ background: 'oklch(0.50 0.22 25 / 0.9)' }}
            aria-label={`Retirer ${module.name}`}
          >
            <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Move cursor indicator on hover */}
          <div className="absolute bottom-0.5 left-0.5 hidden group-hover:flex opacity-60">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <polyline points="5 9 2 12 5 15" />
              <polyline points="9 5 12 2 15 5" />
              <polyline points="15 19 12 22 9 19" />
              <polyline points="19 9 22 12 19 15" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <line x1="12" y1="2" x2="12" y2="22" />
            </svg>
          </div>
        </div>
      ) : isDragOver ? (
        <div
          className="w-4 h-4 rounded-full animate-pulse"
          style={{ background: 'oklch(0.75 0.16 65 / 0.6)' }}
        />
      ) : null}
    </div>
  )
}

// ----------------------------------------------------------------
// Main page
// ----------------------------------------------------------------
export default function PlanPage() {
  const { modules, updatePlanPosition, removePlanPosition } = useModules()

  // Active drag source (palette item or grid cell)
  const [dragSrc, setDragSrc] = useState<DragSource | null>(null)
  const [dragOver, setDragOver] = useState<{ col: number; row: number } | null>(null)
  const [showGrid, setShowGrid] = useState(true)
  const [showCoords, setShowCoords] = useState(false)

  // Build lookup map: "col,row" -> moduleId
  const cellMap = new Map<string, string>()
  modules.forEach(m => {
    if (m.planPosition) {
      cellMap.set(`${m.planPosition.x},${m.planPosition.y}`, m.id)
    }
  })

  const handleDragStart = useCallback((src: DragSource) => {
    setDragSrc(src)
  }, [])

  const handleDrop = useCallback(
    (col: number, row: number) => {
      if (!dragSrc) return
      const targetKey = `${col},${row}`
      const targetOccupant = cellMap.get(targetKey)

      // Don't drop on same cell
      if (
        dragSrc.kind === 'grid' &&
        dragSrc.fromCol === col &&
        dragSrc.fromRow === row
      ) {
        setDragSrc(null)
        setDragOver(null)
        return
      }

      // If target is occupied by a different module, don't allow
      if (targetOccupant && targetOccupant !== dragSrc.moduleId) {
        setDragSrc(null)
        setDragOver(null)
        return
      }

      // Place or move
      updatePlanPosition(dragSrc.moduleId, { x: col, y: row, w: 1, h: 1 })
      setDragSrc(null)
      setDragOver(null)
    },
    [dragSrc, cellMap, updatePlanPosition]
  )

  const handleRemove = useCallback(
    (moduleId: string) => removePlanPosition(moduleId),
    [removePlanPosition]
  )

  const placedModules = modules.filter(m => m.planPosition)
  const unplacedModules = modules.filter(m => !m.planPosition && m.status !== 'inactive')
  const placedCount = placedModules.length

  // Active modules shown in palette (both placed and unplaced, except inactive)
  const paletteModules = modules.filter(m => m.status !== 'inactive')

  return (
    <div
      className="flex flex-col gap-5"
      onDragEnd={() => {
        setDragSrc(null)
        setDragOver(null)
      }}
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            Plan d&apos;expérience
          </h1>
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
            Glissez les modules depuis la palette pour les placer —{' '}
            <span className="text-foreground/70">déplacez-les sur la grille en les faisant glisser d&apos;une cellule à une autre</span>
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowCoords(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
            style={{
              background: showCoords ? 'oklch(0.75 0.16 65 / 0.15)' : 'oklch(0.15 0.03 245)',
              border: showCoords ? '1px solid oklch(0.75 0.16 65 / 0.5)' : '1px solid oklch(0.22 0.04 245)',
              color: showCoords ? 'oklch(0.85 0.14 65)' : 'oklch(0.55 0.04 245)',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1" /><circle cx="4" cy="12" r="1" /><circle cx="20" cy="12" r="1" />
            </svg>
            Coordonnées
          </button>
          <button
            onClick={() => setShowGrid(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
            style={{
              background: showGrid ? 'oklch(0.55 0.15 245 / 0.12)' : 'oklch(0.15 0.03 245)',
              border: showGrid ? '1px solid oklch(0.55 0.15 245 / 0.5)' : '1px solid oklch(0.22 0.04 245)',
              color: showGrid ? 'oklch(0.65 0.14 245)' : 'oklch(0.55 0.04 245)',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
            </svg>
            {showGrid ? 'Grille ON' : 'Grille OFF'}
          </button>
          <div
            className="px-3 py-1.5 rounded-xl text-xs font-semibold"
            style={{
              background: 'oklch(0.65 0.18 160 / 0.12)',
              color: 'oklch(0.65 0.18 160)',
              border: '1px solid oklch(0.65 0.18 160 / 0.35)',
            }}
          >
            {placedCount} / {modules.filter(m => m.status !== 'inactive').length} placé{placedCount > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <div className="flex gap-5 flex-col xl:flex-row items-start">
        {/* ── Palette ─────────────────────────────────────────── */}
        <aside
          className="xl:w-56 w-full flex-shrink-0 rounded-2xl p-4 flex flex-col gap-3"
          style={{
            background: 'oklch(0.12 0.025 245)',
            border: '1px solid oklch(0.22 0.04 245)',
          }}
        >
          <div>
            <p className="text-xs font-bold text-foreground uppercase tracking-widest mb-0.5">
              Modules
            </p>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Glissez sur la grille pour placer.<br />
              Glissez sur la grille pour <span className="text-foreground/60">déplacer</span>.
            </p>
          </div>

          {/* Unplaced section */}
          {unplacedModules.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold px-1">
                Non placés
              </p>
              {unplacedModules.map(m => (
                <PaletteItem
                  key={m.id}
                  module={m}
                  isPlaced={false}
                  onDragStart={handleDragStart}
                />
              ))}
            </div>
          )}

          {/* Placed section */}
          {placedModules.filter(m => m.status !== 'inactive').length > 0 && (
            <div
              className="flex flex-col gap-1.5 pt-3"
              style={{ borderTop: '1px solid oklch(0.22 0.04 245)' }}
            >
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold px-1">
                Sur le plan
              </p>
              {placedModules
                .filter(m => m.status !== 'inactive')
                .map(m => (
                  <PaletteItem
                    key={m.id}
                    module={m}
                    isPlaced={true}
                    onDragStart={handleDragStart}
                  />
                ))}
            </div>
          )}

          {paletteModules.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-6">
              Aucun module actif
            </p>
          )}

          {/* PWA preview thumbnail */}
          <div className="mt-auto pt-3 flex justify-center" style={{ borderTop: '1px solid oklch(0.22 0.04 245)' }}>
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Image%202%20perso%205-KA6yuxuj2EGln7nwk6gvzy0VhfQVw4.png"
              alt="Personnage Mirokaï"
              width={72}
              height={90}
              className="object-contain opacity-40"
              unoptimized
            />
          </div>
        </aside>

        {/* ── Grid area ───────────────────────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {/* Instructions banner */}
          <div
            className="flex items-start gap-3 px-4 py-3 rounded-xl"
            style={{
              background: 'oklch(0.75 0.16 65 / 0.07)',
              border: '1px solid oklch(0.75 0.16 65 / 0.2)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="oklch(0.75 0.16 65)" strokeWidth="2" className="flex-shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-xs text-foreground/80 leading-relaxed">
              <strong className="text-foreground">Placer :</strong> glissez depuis la palette gauche.{' '}
              <strong className="text-foreground">Déplacer :</strong> glissez une cellule vers une autre sur la grille.{' '}
              <strong className="text-foreground">Retirer :</strong> survolez la cellule et cliquez sur la croix.
            </p>
          </div>

          {/* Grid container */}
          <div
            className="rounded-2xl overflow-auto relative"
            style={{
              background: 'oklch(0.11 0.022 245)',
              border: '1px solid oklch(0.22 0.04 245)',
            }}
          >
            {/* Top bar */}
            <div
              className="flex items-center justify-between px-4 py-2.5"
              style={{ borderBottom: '1px solid oklch(0.22 0.04 245)' }}
            >
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Espace Mirokaï — {GRID_COLS} × {GRID_ROWS} zones
              </span>
              <div className="flex items-center gap-2">
                {dragSrc && (
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full animate-pulse font-medium"
                    style={{
                      background: 'oklch(0.75 0.16 65 / 0.15)',
                      color: 'oklch(0.75 0.16 65)',
                      border: '1px solid oklch(0.75 0.16 65 / 0.4)',
                    }}
                  >
                    Glissement en cours...
                  </span>
                )}
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <div className="w-2 h-2 rounded-sm" style={{ background: 'oklch(0.55 0.15 245 / 0.25)', border: '1px solid oklch(0.55 0.15 245 / 0.5)' }} />
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                  <div className="w-2 h-2 rounded-sm" style={{ background: 'oklch(0.65 0.18 160 / 0.3)', border: '1px solid oklch(0.65 0.18 160 / 0.6)' }} />
                  Placer / Déplacer
                </div>
              </div>
            </div>

            {/* Row labels + grid */}
            <div className="p-3 overflow-auto">
              <div className="flex flex-col gap-0" style={{ minWidth: GRID_COLS * CELL_SIZE + 24 }}>
                {/* Column labels */}
                <div className="flex gap-0 mb-0.5 ml-6">
                  {Array.from({ length: GRID_COLS }, (_, c) => (
                    <div
                      key={c}
                      className="flex items-center justify-center text-[8px] text-muted-foreground/50 flex-shrink-0"
                      style={{ width: CELL_SIZE }}
                    >
                      {c + 1}
                    </div>
                  ))}
                </div>

                {/* Rows */}
                {Array.from({ length: GRID_ROWS }, (_, row) => (
                  <div key={row} className="flex gap-0 items-center">
                    {/* Row label */}
                    <div
                      className="flex items-center justify-center text-[8px] text-muted-foreground/50 flex-shrink-0"
                      style={{ width: 24, height: CELL_SIZE }}
                    >
                      {row + 1}
                    </div>

                    {Array.from({ length: GRID_COLS }, (_, col) => {
                      const key = `${col},${row}`
                      const moduleId = cellMap.get(key)
                      const mod = moduleId ? modules.find(m => m.id === moduleId) : undefined
                      const isOver = dragOver?.col === col && dragOver?.row === row
                      const isOccupied = !!mod

                      // Show dragover highlight only if droppable (empty or same module moving)
                      const showDragOver = isOver && !isOccupied || (
                        isOver && isOccupied && dragSrc?.kind === 'grid' && dragSrc.moduleId === moduleId
                      )

                      return (
                        <GridCell
                          key={key}
                          col={col}
                          row={row}
                          module={mod}
                          isDragOver={showDragOver}
                          isOccupied={isOccupied}
                          onDragStart={handleDragStart}
                          onDragOver={(c, r) => setDragOver({ col: c, row: r })}
                          onDragLeave={() => setDragOver(null)}
                          onDrop={handleDrop}
                          onRemove={handleRemove}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Placed summary */}
          {placedModules.length > 0 && (
            <div
              className="rounded-2xl p-4"
              style={{
                background: 'oklch(0.14 0.028 245)',
                border: '1px solid oklch(0.22 0.04 245)',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-foreground uppercase tracking-widest">
                  Résumé du plan ({placedCount} module{placedCount > 1 ? 's' : ''})
                </p>
                <button
                  onClick={() => placedModules.forEach(m => handleRemove(m.id))}
                  className="text-[10px] text-muted-foreground hover:text-destructive transition-colors"
                >
                  Tout retirer
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {placedModules.map(m => (
                  <div
                    key={m.id}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs"
                    style={{
                      background: m.color + '12',
                      border: `1px solid ${m.color}40`,
                    }}
                  >
                    <span>{m.icon}</span>
                    <span className="font-medium" style={{ color: m.color }}>
                      {m.name}
                    </span>
                    {showCoords && (
                      <span className="text-muted-foreground text-[10px] font-mono">
                        [{m.planPosition!.x + 1},{m.planPosition!.y + 1}]
                      </span>
                    )}
                    <button
                      onClick={() => handleRemove(m.id)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={`Retirer ${m.name}`}
                    >
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PWA compatibility notice */}
          <div
            className="rounded-2xl p-4 flex items-center gap-4"
            style={{
              background: 'oklch(0.55 0.15 245 / 0.07)',
              border: '1px solid oklch(0.55 0.15 245 / 0.22)',
            }}
          >
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Accueil-SStctIyaURG9DXuKyzSXdur97Rjg8d.png"
              alt="Interface visiteur PWA"
              width={44}
              height={44}
              className="object-cover object-top rounded-xl flex-shrink-0"
              unoptimized
            />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Compatible interface visiteur PWA
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Chaque cellule correspond à une zone interactive dans l&apos;application mobile Mirokaï Experience. Les positions sont transmises en temps réel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
