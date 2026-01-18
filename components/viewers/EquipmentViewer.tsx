// components/viewers/EquipmentViewer.tsx
'use client'

import React, { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Button,
  Tabs,
  Alert,
  Collapsible,
  Table,
  Clock,
  Timer,
  Thermometer,
  CheckCircle2,
  AlertTriangle,
  Play,
  Info,
  Cog,
  LinkIcon,
} from '@/components/ui/shared'
import { DocumentHeader } from './DocumentHeader'
import { cn } from '@/lib/utils'
import type { Equipment, QuickAction, EquipmentProgram } from '@/types/documents'
import { Power, PowerOff, Sparkles, Zap, Wrench } from 'lucide-react'

interface EquipmentViewerProps {
  equipment: Equipment
}

export function EquipmentViewer({ equipment }: EquipmentViewerProps) {
  const [activeTab, setActiveTab] = useState('quick-actions')

  const tabs = [
    { id: 'quick-actions', label: 'Quick Actions' },
    { id: 'programs', label: 'Programs' },
    { id: 'troubleshooting', label: 'Troubleshooting' },
  ]

  return (
    <div className="space-y-6">
      <DocumentHeader document={equipment} />

      {/* Equipment Info Card */}
      <Card>
        <div className="flex items-start gap-6">
          {/* Equipment Image Placeholder */}
          <div className="w-48 h-36 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Cog className="h-16 w-16 text-gray-300" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {equipment.machine_name && (
                <h2 className="text-xl font-semibold text-gray-900">
                  {equipment.machine_name}
                </h2>
              )}
              {equipment.model_number && (
                <Badge variant="outline" size="sm">
                  {equipment.model_number}
                </Badge>
              )}
            </div>

            {equipment.description && (
              <p className="text-gray-600 mb-4">{equipment.description}</p>
            )}

            {/* Risk Warnings */}
            {equipment.risk_warnings && equipment.risk_warnings.length > 0 && (
              <div className="space-y-2">
                {equipment.risk_warnings.map((risk, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-2 bg-red-50 border border-red-200 rounded-lg text-sm"
                  >
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-red-800">
                        {risk.hazard.replace('_', ' ')}:
                      </span>{' '}
                      <span className="text-red-700">{risk.warning}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === 'quick-actions' && <QuickActionsTab equipment={equipment} />}
        {activeTab === 'programs' && <ProgramsTab equipment={equipment} />}
        {activeTab === 'troubleshooting' && <TroubleshootingTab equipment={equipment} />}
      </div>

      {/* Links Out */}
      {equipment.links_out && equipment.links_out.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              Related Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {equipment.links_out.map((link, i) => (
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
                  {link.reason && (
                    <p className="text-xs text-gray-500 mt-1">{link.reason}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function QuickActionsTab({ equipment }: { equipment: Equipment }) {
  const quickActions = [
    { key: 'startup', icon: Power, label: 'Startup', color: 'green' },
    { key: 'shutdown', icon: PowerOff, label: 'Shutdown', color: 'red' },
    { key: 'emergency_stop', icon: Zap, label: 'Emergency Stop', color: 'red' },
    { key: 'cleaning_daily', icon: Sparkles, label: 'Daily Cleaning', color: 'blue' },
    { key: 'cleaning_weekly', icon: Sparkles, label: 'Weekly Cleaning', color: 'blue' },
    { key: 'cleaning_deep', icon: Wrench, label: 'Deep Cleaning', color: 'purple' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {quickActions.map(({ key, icon: Icon, label, color }) => {
        const action = equipment.quick_actions[key as keyof typeof equipment.quick_actions]
        if (!action) return null

        const colorClasses = {
          green: 'border-green-200 bg-green-50',
          red: 'border-red-200 bg-red-50',
          blue: 'border-blue-200 bg-blue-50',
          purple: 'border-purple-200 bg-purple-50',
        }

        const iconColors = {
          green: 'text-green-600',
          red: 'text-red-600',
          blue: 'text-blue-600',
          purple: 'text-purple-600',
        }

        return (
          <Card key={key} className={cn(colorClasses[color as keyof typeof colorClasses])}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon className={cn('h-5 w-5', iconColors[color as keyof typeof iconColors])} />
                {action.title || label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {action.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 bg-white rounded-full border border-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                      {i + 1}
                    </span>
                    <span className="text-gray-700 pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
              {action.media_refs && action.media_refs.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <Badge variant="info" size="sm">
                    <Play className="h-3 w-3 mr-1" />
                    {action.media_refs.length} media reference(s)
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function ProgramsTab({ equipment }: { equipment: Equipment }) {
  if (!equipment.programs || equipment.programs.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <Info className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No programs configured for this equipment.</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Programs Library</h2>

      {equipment.programs.map((program, index) => (
        <ProgramCard key={index} program={program} />
      ))}
    </div>
  )
}

function ProgramCard({ program }: { program: EquipmentProgram }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card>
      <div
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {program.code && (
              <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono text-gray-700">
                {program.code}
              </code>
            )}
            <div>
              <h3 className="font-medium text-gray-900">{program.name}</h3>
              {program.purpose && (
                <p className="text-sm text-gray-500">{program.purpose}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {program.time_minutes && (
              <Badge variant="outline" size="sm">
                <Timer className="h-3 w-3 mr-1" />
                {program.time_minutes} min
              </Badge>
            )}
            {program.temperature?.value && (
              <Badge variant="outline" size="sm">
                <Thermometer className="h-3 w-3 mr-1" />
                {program.temperature.value}°{program.temperature.unit}
              </Badge>
            )}
            <span className="text-gray-400">{isExpanded ? '▲' : '▼'}</span>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
          {/* Button Sequence */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Button Sequence:</h4>
            <ol className="space-y-2">
              {program.button_sequence_steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-medium text-indigo-700">
                    {i + 1}
                  </span>
                  <span className="text-gray-700 pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Settings */}
          {program.settings && program.settings.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Settings:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {program.settings.map((setting, i) => (
                  <div
                    key={i}
                    className="p-2 bg-gray-50 rounded border border-gray-200"
                  >
                    <p className="text-xs text-gray-500">{setting.key}</p>
                    <p className="text-sm font-medium text-gray-900">{setting.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Common Mistakes */}
          {program.common_mistakes && program.common_mistakes.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Common Mistakes:</h4>
              <ul className="space-y-1">
                {program.common_mistakes.map((mistake, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-amber-700">
                    <AlertTriangle className="h-4 w-4" />
                    {mistake}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Verification */}
          {program.verification && program.verification.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Verification:</h4>
              <ul className="space-y-1">
                {program.verification.map((check, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle2 className="h-4 w-4" />
                    {check}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

function TroubleshootingTab({ equipment }: { equipment: Equipment }) {
  return (
    <div className="space-y-6">
      {/* Error Codes */}
      {equipment.error_codes && equipment.error_codes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Error Codes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table
              headers={['Code', 'Meaning', 'Immediate Action']}
              rows={equipment.error_codes.map((ec) => [
                ec.code,
                ec.meaning || '—',
                ec.immediate_action || '—',
              ])}
            />
          </CardContent>
        </Card>
      )}

      {/* Troubleshooting Items */}
      {equipment.troubleshooting && equipment.troubleshooting.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Troubleshooting Guide</h2>

          {equipment.troubleshooting.map((item, index) => (
            <Collapsible
              key={index}
              title={
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span>{item.symptom}</span>
                </div>
              }
            >
              <div className="space-y-4 pt-4">
                {item.error_codes && item.error_codes.length > 0 && (
                  <div className="flex gap-2">
                    <span className="text-sm text-gray-500">Related codes:</span>
                    {item.error_codes.map((code) => (
                      <Badge key={code} variant="error" size="sm">
                        {code}
                      </Badge>
                    ))}
                  </div>
                )}

                {item.likely_causes && item.likely_causes.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Likely Causes:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {item.likely_causes.map((cause, i) => (
                        <li key={i}>{cause}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Fix Steps:</p>
                  <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                    {item.fix_steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>

                {item.escalate_when && (
                  <Alert variant="info" title="Escalate When">
                    <p className="text-sm">{item.escalate_when}</p>
                  </Alert>
                )}
              </div>
            </Collapsible>
          ))}
        </div>
      )}

      {(!equipment.error_codes || equipment.error_codes.length === 0) &&
        (!equipment.troubleshooting || equipment.troubleshooting.length === 0) && (
          <Card>
            <div className="text-center py-8">
              <Info className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No troubleshooting information available.</p>
            </div>
          </Card>
        )}
    </div>
  )
}
