// components/viewers/ChecklistViewer.tsx
'use client'

import React, { useState, useMemo } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Button,
  ProgressBar,
  Alert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Camera,
  Thermometer,
  Info,
} from '@/components/ui/shared'
import { DocumentHeader } from './DocumentHeader'
import { cn } from '@/lib/utils'
import type { Checklist, ChecklistItem } from '@/types/documents'

interface ChecklistViewerProps {
  checklist: Checklist
}

interface ChecklistState {
  checked: boolean
  value?: string | number
  notes?: string
}

export function ChecklistViewer({ checklist }: ChecklistViewerProps) {
  const [itemStates, setItemStates] = useState<Record<string, ChecklistState>>({})

  // Group items by category
  const groupedItems = useMemo(() => {
    const groups: Record<string, ChecklistItem[]> = {}
    checklist.items.forEach((item) => {
      const category = item.category || 'General'
      if (!groups[category]) groups[category] = []
      groups[category].push(item)
    })
    return groups
  }, [checklist.items])

  const completedCount = Object.values(itemStates).filter((s) => s.checked).length
  const totalCount = checklist.items.length
  const progress = (completedCount / totalCount) * 100

  const toggleItem = (itemId: string) => {
    setItemStates((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        checked: !prev[itemId]?.checked,
      },
    }))
  }

  const setItemValue = (itemId: string, value: string | number) => {
    setItemStates((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        value,
      },
    }))
  }

  const setItemNotes = (itemId: string, notes: string) => {
    setItemStates((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        notes,
      },
    }))
  }

  const resetAll = () => setItemStates({})

  const isOutOfRange = (item: ChecklistItem, value: number | undefined): boolean => {
    if (value === undefined || !item.numeric_field) return false
    const { min, max } = item.numeric_field
    if (min !== null && min !== undefined && value < min) return true
    if (max !== null && max !== undefined && value > max) return true
    return false
  }

  return (
    <div className="space-y-6">
      <DocumentHeader document={checklist} />

      {/* Progress Card */}
      <Card padding="lg" gradient>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900 tabular-nums">{completedCount}</span>
              <span className="text-lg text-gray-400">/</span>
              <span className="text-lg text-gray-500">{totalCount}</span>
            </div>
            {checklist.shift && (
              <Badge variant="info" size="md">
                {checklist.shift.toUpperCase()} Shift
              </Badge>
            )}
            {checklist.frequency && (
              <Badge variant="outline" size="md">
                {checklist.frequency.replace('_', ' ')}
              </Badge>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={resetAll}>
            Reset All
          </Button>
        </div>
        <ProgressBar
          value={progress}
          max={100}
          showPercentage
          color={progress === 100 ? 'green' : progress > 50 ? 'indigo' : 'amber'}
          size="lg"
        />
      </Card>

      {/* Escalation Rules */}
      {checklist.escalation_rules && checklist.escalation_rules.length > 0 && (
        <Alert variant="warning" title="Escalation Rules">
          <ul className="space-y-1">
            {checklist.escalation_rules.map((rule, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Checklist Items by Category */}
      {Object.entries(groupedItems).map(([category, items]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>{category}</span>
              <Badge variant="outline" size="sm">
                {items.filter((i) => itemStates[i.id]?.checked).length}/{items.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {items.map((item) => {
                const state = itemStates[item.id] || { checked: false }
                const numValue = typeof state.value === 'number' ? state.value : undefined
                const outOfRange = isOutOfRange(item, numValue)

                return (
                  <div
                    key={item.id}
                    className={cn(
                      'p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer',
                      state.checked
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-sm'
                        : outOfRange
                          ? 'bg-gradient-to-r from-red-50 to-rose-50 border-red-300'
                          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    )}
                    onClick={() => toggleItem(item.id)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <div className="pt-0.5">
                        <div
                          className={cn(
                            'w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200',
                            state.checked
                              ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-400 text-white shadow-md shadow-green-500/30'
                              : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                          )}
                        >
                          {state.checked && <CheckCircle2 className="h-4 w-4" />}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span
                            className={cn(
                              'font-semibold',
                              state.checked ? 'text-green-800' : 'text-gray-900'
                            )}
                          >
                            {item.label}
                          </span>
                          {item.is_mandatory && (
                            <Badge variant="error" size="sm">
                              Required
                            </Badge>
                          )}
                          {item.photo_required && (
                            <Badge variant="info" size="sm" className="gap-1">
                              <Camera className="h-3 w-3" />
                              Photo
                            </Badge>
                          )}
                          {item.requires_initials && (
                            <Badge variant="outline" size="sm">
                              Initials
                            </Badge>
                          )}
                        </div>

                        {/* Numeric Input for temperature/number */}
                        {(item.response_type === 'temperature' || item.response_type === 'number') &&
                          item.numeric_field && (
                            <div className="flex items-center gap-3 mt-3">
                              <div className="p-1.5 bg-gray-100 rounded-lg">
                                <Thermometer className="h-4 w-4 text-gray-500" />
                              </div>
                              <input
                                type="number"
                                placeholder={item.numeric_field.target_text || 'Enter value'}
                                value={state.value ?? ''}
                                onChange={(e) =>
                                  setItemValue(item.id, parseFloat(e.target.value) || 0)
                                }
                                className={cn(
                                  'w-28 px-3 py-2 text-sm font-medium border-2 rounded-xl focus:outline-none focus:ring-2 transition-colors',
                                  outOfRange
                                    ? 'border-red-300 focus:ring-red-500 bg-red-50'
                                    : 'border-gray-200 focus:ring-indigo-500 bg-white'
                                )}
                              />
                              <span className="text-sm font-medium text-gray-600">
                                {item.numeric_field.unit}
                              </span>
                              {item.numeric_field.target_text && (
                                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
                                  Target: {item.numeric_field.target_text}
                                </span>
                              )}
                            </div>
                          )}

                        {/* Text input for notes */}
                        {item.text_required && (
                          <div className="mt-3">
                            <input
                              type="text"
                              placeholder="Add notes..."
                              value={state.notes ?? ''}
                              onChange={(e) => setItemNotes(item.id, e.target.value)}
                              className="w-full px-4 py-2 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                            />
                          </div>
                        )}

                        {/* Out of range warning */}
                        {outOfRange && item.fail_path_instruction && (
                          <div className="mt-3 p-3 bg-red-100 rounded-xl text-sm text-red-700 flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                            <span>{item.fail_path_instruction}</span>
                          </div>
                        )}

                        {/* Escalation trigger */}
                        {item.escalation_trigger && (
                          <p className="mt-2 text-xs text-gray-500 flex items-center gap-1.5">
                            <Info className="h-3 w-3" />
                            Escalate: {item.escalation_trigger}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Completion Banner */}
      {progress === 100 && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 overflow-hidden">
          <div className="flex items-center justify-center gap-4 py-6 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(34,197,94,0.1),transparent_50%)]" />
            <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl shadow-lg shadow-green-500/30">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold text-green-800">Checklist Complete!</p>
              <p className="text-sm text-green-600">
                All {totalCount} items have been checked.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
