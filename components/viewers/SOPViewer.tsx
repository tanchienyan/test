// components/viewers/SOPViewer.tsx
'use client'

import React, { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Button,
  ProgressBar,
  Tabs,
  Alert,
  StepIndicator,
  Collapsible,
  Clock,
  Timer,
  Thermometer,
  CheckCircle2,
  AlertTriangle,
  Play,
  Info,
} from '@/components/ui/shared'
import { DocumentHeader } from './DocumentHeader'
import { cn, formatDuration, formatSeconds } from '@/lib/utils'
import type { SOP } from '@/types/documents'

interface SOPViewerProps {
  sop: SOP
}

export function SOPViewer({ sop }: SOPViewerProps) {
  const [activeTab, setActiveTab] = useState('steps')
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())

  const tabs = [
    { id: 'steps', label: 'Steps by Step' },
    { id: 'details', label: 'Details' },
    { id: 'troubleshooting', label: 'Troubleshooting' },
  ]

  const progress = (completedSteps.size / sop.steps.length) * 100

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev)
      if (next.has(stepId)) {
        next.delete(stepId)
      } else {
        next.add(stepId)
      }
      return next
    })
  }

  const resetProgress = () => setCompletedSteps(new Set())

  return (
    <div className="space-y-6">
      <DocumentHeader document={sop} />

      {/* Safety Warnings */}
      {sop.safety_warnings && sop.safety_warnings.length > 0 && (
        <Alert variant="error" title="Safety Warnings">
          <ul className="space-y-1">
            {sop.safety_warnings.map((warning, i) => (
              <li key={i} className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Progress Card */}
      <Card padding="sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              Progress: {completedSteps.size} of {sop.steps.length} steps
            </span>
            {sop.estimated_time_minutes && (
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Est. {formatDuration(sop.estimated_time_minutes)}
              </span>
            )}
          </div>
          {completedSteps.size > 0 && (
            <Button variant="ghost" size="sm" onClick={resetProgress}>
              Reset
            </Button>
          )}
        </div>
        <ProgressBar
          value={progress}
          max={100}
          showPercentage={false}
          color={progress === 100 ? 'green' : 'indigo'}
          size="sm"
        />
      </Card>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === 'steps' && (
          <SOPStepsTab sop={sop} completedSteps={completedSteps} onToggleStep={toggleStep} />
        )}
        {activeTab === 'details' && <SOPDetailsTab sop={sop} />}
        {activeTab === 'troubleshooting' && <SOPTroubleshootingTab sop={sop} />}
      </div>

      {/* Completion Banner */}
      {progress === 100 && (
        <Card className="bg-green-50 border-green-200">
          <div className="flex items-center justify-center gap-3 py-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-lg font-semibold text-green-800">SOP Complete! ✓</p>
              <p className="text-sm text-green-600">All steps have been completed successfully.</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

function SOPStepsTab({
  sop,
  completedSteps,
  onToggleStep,
}: {
  sop: SOP
  completedSteps: Set<string>
  onToggleStep: (id: string) => void
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Step-by-Step Instructions</h2>

      {sop.steps.map((step, index) => {
        const isComplete = completedSteps.has(step.id)
        const hasCCP = step.ccp && step.ccp.length > 0

        return (
          <Card
            key={step.id}
            className={cn('transition-all', isComplete && 'bg-green-50 border-green-200')}
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <button onClick={() => onToggleStep(step.id)}>
                  <StepIndicator
                    step={index + 1}
                    status={isComplete ? 'complete' : 'pending'}
                    size="lg"
                  />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-gray-900 mb-1">{step.title}</h3>
                <p className="text-gray-700 mb-3">{step.instruction}</p>

                {step.key_points && step.key_points.length > 0 && (
                  <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 mb-1">Key Points:</p>
                    <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                      {step.key_points.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {step.why && (
                  <p className="text-sm text-indigo-700 bg-indigo-50 px-3 py-2 rounded-md mb-3">
                    <strong>Why:</strong> {step.why}
                  </p>
                )}

                <div className="flex items-center gap-3">
                  {step.timer_seconds && (
                    <Badge variant="outline" size="md">
                      <Timer className="h-3.5 w-3.5 mr-1" />
                      {formatSeconds(step.timer_seconds)}
                    </Badge>
                  )}
                  {step.media_refs && step.media_refs.length > 0 && (
                    <Badge variant="info" size="sm">
                      <Play className="h-3 w-3 mr-1" />
                      {step.media_refs.length} media
                    </Badge>
                  )}
                </div>

                {hasCCP && (
                  <Alert variant="warning" title="Critical Control Point" className="mt-3">
                    <ul className="space-y-1">
                      {step.ccp!.map((ccp, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Thermometer className="h-4 w-4" />
                          <span>
                            {ccp.context}:{' '}
                            <strong>{ccp.target ?? ccp.threshold ?? `${ccp.value}°${ccp.unit}`}</strong>
                            {ccp.reason && <span className="text-gray-600"> ({ccp.reason})</span>}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </Alert>
                )}
              </div>

              <div className="flex-shrink-0">
                <Button
                  variant={isComplete ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => onToggleStep(step.id)}
                >
                  {isComplete ? 'Done ✓' : 'Mark Done'}
                </Button>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

function SOPDetailsTab({ sop }: { sop: SOP }) {
  return (
    <div className="space-y-6">
      {/* Purpose & Scope */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sop.purpose && (
          <Card>
            <CardHeader>
              <CardTitle>Purpose</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{sop.purpose}</p>
            </CardContent>
          </Card>
        )}
        {sop.scope && (
          <Card>
            <CardHeader>
              <CardTitle>Scope</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{sop.scope}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* When to Use */}
      {sop.when_to_use && (
        <Card>
          <CardHeader>
            <CardTitle>When to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{sop.when_to_use}</p>
          </CardContent>
        </Card>
      )}

      {/* Prerequisites */}
      {sop.prerequisites && sop.prerequisites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Prerequisites</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {sop.prerequisites.map((prereq, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>{prereq}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Tools Required */}
      {sop.tools_required && sop.tools_required.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tools & Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {sop.tools_required.map((tool) => (
                <Badge key={tool} variant="outline">
                  {tool}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quality Checks */}
      {sop.quality_checks && sop.quality_checks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Quality Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {sop.quality_checks.map((check, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>{check}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Common Mistakes */}
      {sop.common_mistakes && sop.common_mistakes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Common Mistakes to Avoid</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {sop.common_mistakes.map((mistake, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Escalation */}
      {sop.escalation && (
        <Alert variant="warning" title="Escalation">
          <p>{sop.escalation}</p>
        </Alert>
      )}
    </div>
  )
}

function SOPTroubleshootingTab({ sop }: { sop: SOP }) {
  if (!sop.troubleshooting || sop.troubleshooting.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <Info className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No troubleshooting information available.</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Troubleshooting Guide</h2>

      {sop.troubleshooting.map((item, index) => (
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
  )
}
