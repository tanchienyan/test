// components/viewers/DocumentHeader.tsx
'use client'

import React from 'react'
import {
  Badge,
  Card,
  MetadataRow,
  MetadataItem,
  getDocTypeIcon,
  Clock,
  Users,
  AlertTriangle,
  Info,
} from '@/components/ui/shared'
import { cn, getDocTypeColor, getConfidenceColor, getConfidenceLabel, formatDuration } from '@/lib/utils'
import type { OperationalDocument } from '@/types/documents'
import { Sparkles, ArrowLeft, MapPin, RefreshCw } from 'lucide-react'

export interface DocumentHeaderProps {
  document: OperationalDocument
  className?: string
}

export function DocumentHeader({ document, className }: DocumentHeaderProps) {
  const typeColors = getDocTypeColor(document.type)
  const DocIcon = getDocTypeIcon(document.type)
  const confidenceColor = getConfidenceColor(document.confidence_score)
  const confidenceLabel = getConfidenceLabel(document.confidence_score)
  const confidencePercent = Math.round(document.confidence_score * 100)

  // Get time estimate if available
  const timeMinutes =
    document.type === 'Recipe'
      ? (document.prep_time_minutes ?? 0) + (document.cook_time_minutes ?? 0)
      : document.type === 'SOP'
        ? document.estimated_time_minutes
        : null

  // Get station/role if available
  const station = 'station' in document ? document.station : undefined
  const role = 'role' in document ? document.role : undefined

  // Get hazards/allergens if available
  const hazards = 'hazards' in document ? document.hazards : undefined
  const allergens = 'allergens' in document ? document.allergens : undefined

  return (
    <Card className={cn('overflow-hidden', className)} padding="none">
      {/* Colored Header Bar */}
      <div className={cn('h-2 bg-gradient-to-r', typeColors.gradient || 'from-indigo-500 to-purple-500')} />

      <div className="p-6">
        {/* Top Row - Back + Confidence */}
        <div className="flex items-center justify-between mb-5">
          <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Documents</span>
          </button>
          <div className="flex items-center gap-3">
            <div className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium',
              confidenceColor
            )}>
              <Sparkles className="h-3.5 w-3.5" />
              <span>{confidenceLabel}</span>
              <span className="opacity-75">({confidencePercent}%)</span>
            </div>
          </div>
        </div>

        {/* Type Badge + Category Path */}
        <div className="flex items-center gap-3 mb-4">
          <Badge
            variant="outline"
            className={cn('gap-1.5 py-1.5 px-3', typeColors.bg, typeColors.text, typeColors.border)}
            size="md"
          >
            <DocIcon className="h-4 w-4" />
            {document.type}
          </Badge>
          {'category_path' in document && document.category_path && (
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              {document.category_path.split('.').map((segment, i, arr) => (
                <React.Fragment key={i}>
                  <span className="hover:text-gray-700 cursor-pointer">{segment}</span>
                  {i < arr.length - 1 && <span className="text-gray-300">/</span>}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-3">
          {document.title}
        </h1>

        {/* Description */}
        {document.description && (
          <p className="text-gray-600 leading-relaxed mb-5 text-base">
            {document.description}
          </p>
        )}

        {/* Metadata Row */}
        <MetadataRow className="mb-5">
          {timeMinutes != null && timeMinutes > 0 && (
            <MetadataItem icon={Clock} label="Time" value={formatDuration(timeMinutes)} />
          )}
          {station && <MetadataItem icon={MapPin} label="Station" value={station} />}
          {role && <MetadataItem icon={Users} label="Role" value={role} />}
          {'frequency' in document && document.frequency && (
            <MetadataItem
              icon={RefreshCw}
              label="Frequency"
              value={document.frequency.replace('_', ' ')}
            />
          )}
        </MetadataRow>

        {/* Hazards and Allergens */}
        {((hazards && hazards.length > 0) || (allergens && allergens.length > 0)) && (
          <div className="flex flex-wrap gap-4 pt-5 border-t border-gray-100">
            {hazards && hazards.length > 0 && (
              <div className="flex items-center gap-2.5 px-3 py-2 bg-amber-50/80 rounded-xl border border-amber-200/50">
                <div className="p-1 bg-amber-100 rounded-lg">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                </div>
                <span className="text-sm font-medium text-amber-800">Hazards:</span>
                <div className="flex gap-1.5">
                  {hazards.map((h) => (
                    <Badge key={h} variant="warning" size="sm">
                      {h.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {allergens && allergens.length > 0 && (
              <div className="flex items-center gap-2.5 px-3 py-2 bg-red-50/80 rounded-xl border border-red-200/50">
                <div className="p-1 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                </div>
                <span className="text-sm font-medium text-red-800">Allergens:</span>
                <div className="flex gap-1.5">
                  {allergens.map((a) => (
                    <Badge key={a} variant="error" size="sm">
                      {a}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Open Questions Alert */}
        {document.open_questions && document.open_questions.length > 0 && (
          <div className="mt-5 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-amber-100 rounded-lg flex-shrink-0">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-900 mb-2">Open Questions</p>
                <ul className="space-y-1.5">
                  {document.open_questions.slice(0, 3).map((q, i) => (
                    <li key={i} className="text-sm text-amber-800 flex items-start gap-2">
                      <span className="text-amber-400 mt-1">•</span>
                      {q}
                    </li>
                  ))}
                  {document.open_questions.length > 3 && (
                    <li className="text-sm text-amber-600 font-medium pl-4">
                      +{document.open_questions.length - 3} more questions...
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
