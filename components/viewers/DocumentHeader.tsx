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

export interface DocumentHeaderProps {
  document: OperationalDocument
  className?: string
}

export function DocumentHeader({ document, className }: DocumentHeaderProps) {
  const typeColors = getDocTypeColor(document.type)
  const DocIcon = getDocTypeIcon(document.type)
  const confidenceColor = getConfidenceColor(document.confidence_score)
  const confidenceLabel = getConfidenceLabel(document.confidence_score)

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
    <Card className={cn('', className)} padding="lg">
      {/* Breadcrumb / Back */}
      <div className="flex items-center justify-between mb-4">
        <nav className="flex items-center text-sm text-gray-500">
          <span className="hover:text-gray-700 cursor-pointer">← Back to Documents</span>
        </nav>
        <div className="flex items-center gap-2">
          <span className={cn('px-2 py-1 text-xs font-medium rounded', confidenceColor)}>
            Confidence: {confidenceLabel} ({Math.round(document.confidence_score * 100)}%)
          </span>
        </div>
      </div>

      {/* Type Badge + Category */}
      <div className="flex items-center gap-2 mb-3">
        <Badge
          variant="outline"
          className={cn(typeColors.bg, typeColors.text, typeColors.border)}
          size="md"
        >
          <DocIcon className="h-3.5 w-3.5 mr-1" />
          {document.type}
        </Badge>
        {'category_path' in document && document.category_path && (
          <span className="text-sm text-gray-500">
            {document.category_path.split('.').join(' › ')}
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{document.title}</h1>

      {/* Description */}
      {document.description && (
        <p className="text-gray-600 mb-4">{document.description}</p>
      )}

      {/* Metadata Row */}
      <MetadataRow className="mb-4">
        {timeMinutes != null && timeMinutes > 0 && (
          <MetadataItem icon={Clock} label="Time" value={formatDuration(timeMinutes)} />
        )}
        {station && <MetadataItem icon={Info} label="Station" value={station} />}
        {role && <MetadataItem icon={Users} label="Role" value={role} />}
        {'frequency' in document && document.frequency && (
          <MetadataItem
            icon={Clock}
            label="Frequency"
            value={document.frequency.replace('_', ' ')}
          />
        )}
      </MetadataRow>

      {/* Hazards and Allergens */}
      {((hazards && hazards.length > 0) || (allergens && allergens.length > 0)) && (
        <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100">
          {hazards && hazards.length > 0 && (
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-gray-500">Hazards:</span>
              <div className="flex gap-1">
                {hazards.map((h) => (
                  <Badge key={h} variant="warning" size="sm">
                    {h.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {allergens && allergens.length > 0 && (
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-red-500" />
              <span className="text-sm text-gray-500">Allergens:</span>
              <div className="flex gap-1">
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
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800">Open Questions</p>
              <ul className="mt-1 text-sm text-amber-700 list-disc list-inside">
                {document.open_questions.slice(0, 3).map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
                {document.open_questions.length > 3 && (
                  <li className="text-amber-600">
                    +{document.open_questions.length - 3} more...
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
