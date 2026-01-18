// app/demo/viewer/page.tsx
'use client'

import React, { useState } from 'react'
import { DocViewer } from '@/components/viewers/DocViewer'
import { mockDocuments, documentList } from '@/data/mock-documents'
import { Badge, getDocTypeIcon } from '@/components/ui/shared'
import { cn, getDocTypeColor } from '@/lib/utils'
import type { OperationalDocument } from '@/types/documents'
import { Menu, X } from 'lucide-react'

export default function ViewerDemoPage() {
  const [selectedDocId, setSelectedDocId] = useState<string>('recipe')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const selectedDoc = mockDocuments[selectedDocId] as OperationalDocument

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LW</span>
              </div>
              <span className="font-semibold text-gray-900">LineWise</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success" size="md">Demo Mode</Badge>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out pt-16 lg:pt-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          )}
        >
          <div className="p-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Document Types
            </h2>

            {/* Document Type Filter */}
            <div className="space-y-1">
              {documentList.map((doc) => {
                const Icon = getDocTypeIcon(doc.type)
                const colors = getDocTypeColor(doc.type)
                const isSelected = selectedDocId === doc.id

                return (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setSelectedDocId(doc.id)
                      if (window.innerWidth < 1024) setSidebarOpen(false)
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                      isSelected
                        ? 'bg-indigo-50 border border-indigo-200'
                        : 'hover:bg-gray-50'
                    )}
                  >
                    <div
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center',
                        colors.bg
                      )}
                    >
                      <Icon className={cn('h-4 w-4', colors.text)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          'text-sm font-medium truncate',
                          isSelected ? 'text-indigo-900' : 'text-gray-900'
                        )}
                      >
                        {doc.title}
                      </p>
                      <p className="text-xs text-gray-500">{doc.type}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Quick Select Dropdown (Mobile Alternative) */}
          <div className="p-4 border-t border-gray-200 lg:hidden">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Select
            </label>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {documentList.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.type}: {doc.title}
                </option>
              ))}
            </select>
          </div>

          {/* Info Box */}
          <div className="p-4 border-t border-gray-200">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>Demo:</strong> This viewer renders operational documents from JSON schemas. 
                Click on different document types to see how each viewer component handles the data.
              </p>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 min-h-screen">
          <div className="max-w-5xl mx-auto">
            <DocViewer document={selectedDoc} />
          </div>
        </main>
      </div>
    </div>
  )
}
