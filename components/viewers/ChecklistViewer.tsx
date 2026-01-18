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
      <Card padding="md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <span className="text-lg font-medium text-gray-700">
              Progress: {completedCount} of {totalCount}
            </span>
            {checklist.shift && (
              <Badge variant="info" size="md">
                {checklist.shift.toUpperCase()} Shift
              </Badge>
            )}
            {checklist.frequency && (
              <Badge variant="outline" size="sm">
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
          size="md"
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
                      'p-3 rounded-lg border transition-all',
                      state.checked
                        ? 'bg-green-50 border-green-200'
                        : outOfRange
                          ? 'bg-red-50 border-red-200'
                          : 'bg-gray-50 border-gray-200'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {/* Checkbox */}
                      <div className="pt-0.5">
                        <button
                          onClick={() => toggleItem(item.id)}
                          className={cn(
                            'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                            state.checked
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-gray-300 hover:border-gray-400'
                          )}
                        >
                          {state.checked && <CheckCircle2 className="h-3.5 w-3.5" />}
                        </button>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={cn(
                              'font-medium',
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
                            <Badge variant="info" size="sm">
                              <Camera className="h-3 w-3 mr-1" />
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
                            <div className="flex items-center gap-2 mt-2">
                              <Thermometer className="h-4 w-4 text-gray-400" />
                              <input
                                type="number"
                                placeholder={item.numeric_field.target_text || 'Enter value'}
                                value={state.value ?? ''}
                                onChange={(e) =>
                                  setItemValue(item.id, parseFloat(e.target.value) || 0)
                                }
                                className={cn(
                                  'w-24 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2',
                                  outOfRange
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-indigo-500'
                                )}
                              />
                              <span className="text-sm text-gray-500">
                                {item.numeric_field.unit}
                              </span>
                              {item.numeric_field.target_text && (
                                <span className="text-xs text-gray-400">
                                  (Target: {item.numeric_field.target_text})
                                </span>
                              )}
                            </div>
                          )}

                        {/* Text input for notes */}
                        {item.text_required && (
                          <div className="mt-2">
                            <input
                              type="text"
                              placeholder="Add notes..."
                              value={state.notes ?? ''}
                              onChange={(e) => setItemNotes(item.id, e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        )}

                        {/* Out of range warning */}
                        {outOfRange && item.fail_path_instruction && (
                          <div className="mt-2 p-2 bg-red-100 rounded text-sm text-red-700">
                            <AlertTriangle className="h-4 w-4 inline mr-1" />
                            {item.fail_path_instruction}
                          </div>
                        )}

                        {/* Escalation trigger */}
                        {item.escalation_trigger && (
                          <p className="mt-1 text-xs text-gray-500">
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
        <Card className="bg-green-50 border-green-200">
          <div className="flex items-center justify-center gap-3 py-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-lg font-semibold text-green-800">Checklist Complete! ✓</p>
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
