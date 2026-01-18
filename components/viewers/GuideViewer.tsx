// components/viewers/GuideViewer.tsx
'use client'

import React, { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Tabs,
  Alert,
  Collapsible,
  Table,
  CheckCircle2,
  AlertTriangle,
  Info,
  BookOpen,
  LinkIcon,
} from '@/components/ui/shared'
import { DocumentHeader } from './DocumentHeader'
import { cn } from '@/lib/utils'
import type { Guide, ReferenceTable, ScenarioBlock, VisualExample, FAQItem, LinkOut } from '@/types/documents'
import { HelpCircle, Image, List, TableIcon } from 'lucide-react'

interface GuideViewerProps {
  guide: Guide
}

export function GuideViewer({ guide }: GuideViewerProps) {
  const [activeTab, setActiveTab] = useState('content')

  // Build tabs dynamically based on available content
  const tabs = [
    { id: 'content', label: 'Content' },
    ...(guide.reference_tables && guide.reference_tables.length > 0
      ? [{ id: 'tables', label: 'Reference Tables' }]
      : []),
    ...(guide.scenarios && guide.scenarios.length > 0
      ? [{ id: 'scenarios', label: 'Scenarios' }]
      : []),
    ...(guide.faq && guide.faq.length > 0
      ? [{ id: 'faq', label: 'FAQ' }]
      : []),
  ]

  return (
    <div className="space-y-6">
      <DocumentHeader document={guide} />

      {/* Topics Tags */}
      {guide.topics && guide.topics.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {guide.topics.map((topic) => (
            <Badge key={topic} variant="info" size="sm">
              {topic}
            </Badge>
          ))}
        </div>
      )}

      {/* Overview */}
      {guide.overview && (
        <Card className="bg-indigo-50 border-indigo-200">
          <CardContent>
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
              <p className="text-indigo-900">{guide.overview}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {tabs.length > 1 && (
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      )}

      <div className="mt-6">
        {activeTab === 'content' && <ContentTab guide={guide} />}
        {activeTab === 'tables' && <TablesTab tables={guide.reference_tables || []} />}
        {activeTab === 'scenarios' && <ScenariosTab scenarios={guide.scenarios || []} />}
        {activeTab === 'faq' && <FAQTab faq={guide.faq || []} />}
      </div>

      {/* Visual Examples */}
      {guide.visual_examples && guide.visual_examples.length > 0 && (
        <VisualExamplesSection examples={guide.visual_examples} />
      )}

      {/* Links Out */}
      {guide.links_out && guide.links_out.length > 0 && (
        <LinksOutSection links={guide.links_out} />
      )}
    </div>
  )
}

function ContentTab({ guide }: { guide: Guide }) {
  if (!guide.sections || guide.sections.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <Info className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No content sections available.</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {guide.sections.map((section, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <List className="h-5 w-5 text-gray-400" />
              {section.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {section.bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{bullet}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function TablesTab({ tables }: { tables: ReferenceTable[] }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
        <TableIcon className="h-6 w-6" />
        Reference Tables
      </h2>

      {tables.map((table, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{table.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table headers={table.headers} rows={table.rows} />
            {table.notes && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-amber-800">{table.notes}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function ScenariosTab({ scenarios }: { scenarios: ScenarioBlock[] }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Scenarios & Variants</h2>

      {scenarios.map((scenario, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{scenario.title}</CardTitle>
            {scenario.description && (
              <p className="text-sm text-gray-500 mt-1">{scenario.description}</p>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scenario.variants.map((variant, vi) => (
                <div
                  key={vi}
                  className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <Badge variant="info" size="md" className="mb-3">
                    {variant.label}
                  </Badge>

                  <div className="space-y-2">
                    {variant.fields.map((field, fi) => (
                      <div key={fi} className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{field.key}:</span>
                        <span className="font-medium text-gray-900">{field.value}</span>
                      </div>
                    ))}
                  </div>

                  {variant.notes && (
                    <p className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600 italic">
                      {variant.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function FAQTab({ faq }: { faq: FAQItem[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
        <HelpCircle className="h-6 w-6" />
        Frequently Asked Questions
      </h2>

      {faq.map((item, index) => (
        <Collapsible
          key={index}
          title={
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-indigo-500" />
              <span className="font-medium">{item.question}</span>
            </div>
          }
        >
          <div className="pt-4">
            <p className="text-gray-700">{item.answer}</p>
            {item.evidence && item.evidence.length > 0 && (
              <div className="mt-3 flex gap-2">
                <span className="text-xs text-gray-500">Sources:</span>
                {item.evidence.map((ev, i) => (
                  <Badge key={i} variant="outline" size="sm">
                    {ev.source_id} • {ev.locator}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </Collapsible>
      ))}
    </div>
  )
}

function VisualExamplesSection({ examples }: { examples: VisualExample[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Visual Examples
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {examples.map((example, index) => (
            <div key={index} className="space-y-3">
              <h4 className="font-medium text-gray-900">{example.title}</h4>

              <div className="grid grid-cols-2 gap-4">
                {/* Good Example */}
                <div className="space-y-2">
                  <Badge variant="success" size="sm">
                    ✓ Good
                  </Badge>
                  <div className="aspect-square bg-green-50 border-2 border-green-200 border-dashed rounded-lg flex items-center justify-center">
                    {example.good_image_ref ? (
                      <span className="text-xs text-green-600 font-mono">
                        {example.good_image_ref}
                      </span>
                    ) : (
                      <Image className="h-8 w-8 text-green-300" />
                    )}
                  </div>
                </div>

                {/* Bad Example */}
                <div className="space-y-2">
                  <Badge variant="error" size="sm">
                    ✗ Bad
                  </Badge>
                  <div className="aspect-square bg-red-50 border-2 border-red-200 border-dashed rounded-lg flex items-center justify-center">
                    {example.bad_image_ref ? (
                      <span className="text-xs text-red-600 font-mono">
                        {example.bad_image_ref}
                      </span>
                    ) : (
                      <Image className="h-8 w-8 text-red-300" />
                    )}
                  </div>
                </div>
              </div>

              {example.notes && (
                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  {example.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function LinksOutSection({ links }: { links: LinkOut[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LinkIcon className="h-5 w-5" />
          Related Documents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {links.map((link, i) => (
            <div
              key={i}
              className="p-3 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" size="sm">
                  {link.target_doc_type}
                </Badge>
              </div>
              <p className="font-medium text-gray-900 text-sm">{link.title_hint}</p>
              {link.category_path_hint && (
                <p className="text-xs text-gray-400 font-mono mt-1">
                  {link.category_path_hint}
                </p>
              )}
              {link.reason && (
                <p className="text-xs text-gray-500 mt-1">{link.reason}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
