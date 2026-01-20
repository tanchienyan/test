// components/viewers/DocViewer.tsx
'use client'

import React from 'react'
import type { OperationalDocument } from '@/types/documents'
import { isRecipe, isSOP, isChecklist, isEquipment, isGuide } from '@/types/documents'
import { RecipeViewer } from './RecipeViewer'
import { SOPViewer } from './SOPViewer'
import { ChecklistViewer } from './ChecklistViewer'
import { EquipmentViewer } from './EquipmentViewer'
import { GuideViewer } from './GuideViewer'
import { Card, Info } from '@/components/ui/shared'

interface DocViewerProps {
  document: OperationalDocument
}

export function DocViewer({ document }: DocViewerProps) {
  if (isRecipe(document)) {
    return <RecipeViewer recipe={document} />
  }

  if (isSOP(document)) {
    return <SOPViewer sop={document} />
  }

  if (isChecklist(document)) {
    return <ChecklistViewer checklist={document} />
  }

  if (isEquipment(document)) {
    return <EquipmentViewer equipment={document} />
  }

  if (isGuide(document)) {
    return <GuideViewer guide={document} />
  }

  // Fallback for unknown document types
  const unknownDoc = document as { type?: string }
  return (
    <Card>
      <div className="text-center py-12">
        <Info className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Unknown Document Type</h3>
        <p className="text-gray-500 mt-2">
          Document type &quot;{unknownDoc.type}&quot; is not supported.
        </p>
        <pre className="mt-4 p-4 bg-gray-100 rounded-lg text-left overflow-auto text-xs">
          {JSON.stringify(unknownDoc, null, 2)}
        </pre>
      </div>
    </Card>
  )
}
