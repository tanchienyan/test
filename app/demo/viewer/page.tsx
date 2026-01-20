// app/demo/viewer/page.tsx
'use client'

import React, { useState } from 'react'
import { DocViewer } from '@/components/viewers/DocViewer'
import { mockDocuments, documentList } from '@/data/mock-documents'
import { Badge, getDocTypeIcon } from '@/components/ui/shared'
import { cn, getDocTypeColor } from '@/lib/utils'
import type { OperationalDocument } from '@/types/documents'
import { Menu, X, Sparkles, Search, Bell } from 'lucide-react'

export default function ViewerDemoPage() {
  const [selectedDocId, setSelectedDocId] = useState<string>('recipe')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const selectedDoc = mockDocuments[selectedDocId] as OperationalDocument

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between px-4 lg:px-6 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl hover:bg-gray-100 lg:hidden transition-colors"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <span className="text-white font-bold text-sm">LW</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-gray-900 tracking-tight">LineWise</h1>
                <p className="text-xs text-gray-500">Document Viewer</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
              <Search className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Search...</span>
              <kbd className="px-1.5 py-0.5 text-xs bg-white rounded border border-gray-200 text-gray-400 ml-2">
                /
              </kbd>
            </div>
            <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors relative">
              <Bell className="h-5 w-5 text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <Badge variant="gradient" size="md" className="gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Demo Mode
            </Badge>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed lg:static inset-y-0 left-0 z-40 w-80 bg-white/80 backdrop-blur-lg border-r border-gray-200/50 transform transition-transform duration-300 ease-out pt-16 lg:pt-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          )}
        >
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Document Types
              </h2>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {documentList.length} docs
              </span>
            </div>

            {/* Document Type Filter */}
            <div className="space-y-2">
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
                      'w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200',
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/80 shadow-sm'
                        : 'hover:bg-gray-50/80 border border-transparent'
                    )}
                  >
                    <div
                      className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-200',
                        isSelected ? 'scale-110' : '',
                        colors.bg
                      )}
                    >
                      <Icon className={cn('h-5 w-5', colors.text)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          'text-sm font-semibold truncate',
                          isSelected ? 'text-indigo-900' : 'text-gray-900'
                        )}
                      >
                        {doc.title}
                      </p>
                      <p className={cn(
                        'text-xs',
                        isSelected ? 'text-indigo-600' : 'text-gray-500'
                      )}>
                        {doc.type}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="w-1.5 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Quick Select Dropdown (Mobile Alternative) */}
          <div className="p-5 border-t border-gray-200/50 lg:hidden">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Select
            </label>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
            >
              {documentList.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.type}: {doc.title}
                </option>
              ))}
            </select>
          </div>

          {/* Info Box */}
          <div className="p-5 border-t border-gray-200/50">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">Demo Mode</p>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Explore operational documents rendered from JSON schemas. Each document type has its own specialized viewer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 min-h-screen">
          <div className="max-w-5xl mx-auto">
            {/* Breadcrumb */}
            <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
              <span className="hover:text-gray-700 cursor-pointer">Documents</span>
              <span>/</span>
              <span className="text-gray-900 font-medium">{selectedDoc.type}</span>
            </div>
            <DocViewer document={selectedDoc} />
          </div>
        </main>
      </div>
    </div>
  )
}
