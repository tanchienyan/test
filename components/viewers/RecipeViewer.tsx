// components/viewers/RecipeViewer.tsx
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
  Tabs,
  Alert,
  StepIndicator,
  Clock,
  Timer,
  Thermometer,
  CheckCircle2,
  Users,
  AlertTriangle,
} from '@/components/ui/shared'
import { DocumentHeader } from './DocumentHeader'
import { cn, formatDuration, formatSeconds } from '@/lib/utils'
import type { Recipe, RecipeIngredient, RecipeStep } from '@/types/documents'

interface RecipeViewerProps {
  recipe: Recipe
}

export function RecipeViewer({ recipe }: RecipeViewerProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [scale, setScale] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'ingredients', label: 'Ingredients' },
    { id: 'method', label: 'Method' },
    { id: 'plating', label: 'Plating & QC' },
  ]

  const progress = (completedSteps.size / recipe.steps.length) * 100

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

  const ingredientGroups = useMemo(() => {
    const groups: Record<string, RecipeIngredient[]> = {}
    recipe.ingredients.forEach((ing) => {
      const group = ing.group || 'Other'
      if (!groups[group]) groups[group] = []
      groups[group].push(ing)
    })
    return groups
  }, [recipe.ingredients])

  return (
    <div className="space-y-6">
      <DocumentHeader document={recipe} />

      <Card padding="md">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
              <Clock className="h-4 w-4" />
              <span className="text-xs uppercase">Prep Time</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {formatDuration(recipe.prep_time_minutes)}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
              <Timer className="h-4 w-4" />
              <span className="text-xs uppercase">Cook Time</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {formatDuration(recipe.cook_time_minutes)}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
              <Users className="h-4 w-4" />
              <span className="text-xs uppercase">Yield</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {recipe.yield.amount ?? '—'} {recipe.yield.unit ?? ''}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
              <span className="text-xs uppercase">Portion Size</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {recipe.portion_size ?? '—'}
            </p>
          </div>
        </div>
      </Card>

      <Card padding="sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Recipe Scale</span>
            <select
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={0.5}>0.5× (Half)</option>
              <option value={1}>1× (Original)</option>
              <option value={2}>2× (Double)</option>
              <option value={5}>5× (Batch)</option>
              <option value={10}>10× (Large Batch)</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Progress:</span>
              <span className="font-medium">
                {completedSteps.size} of {recipe.steps.length} steps
              </span>
            </div>
            {completedSteps.size > 0 && (
              <Button variant="ghost" size="sm" onClick={resetProgress}>
                Reset
              </Button>
            )}
          </div>
        </div>
        <div className="mt-3">
          <ProgressBar
            value={progress}
            max={100}
            showPercentage={false}
            color={progress === 100 ? 'green' : 'indigo'}
            size="sm"
          />
        </div>
      </Card>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === 'overview' && <RecipeOverview recipe={recipe} />}
        {activeTab === 'ingredients' && (
          <IngredientsTab groups={ingredientGroups} scale={scale} toolsRequired={recipe.tools_required} />
        )}
        {activeTab === 'method' && (
          <MethodTab steps={recipe.steps} completedSteps={completedSteps} onToggleStep={toggleStep} />
        )}
        {activeTab === 'plating' && <PlatingTab recipe={recipe} />}
      </div>

      {progress === 100 && (
        <Card className="bg-green-50 border-green-200">
          <div className="flex items-center justify-center gap-3 py-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-lg font-semibold text-green-800">Recipe Complete! 🎉</p>
              <p className="text-sm text-green-600">Great job! You have finished all the steps.</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

function RecipeOverview({ recipe }: { recipe: Recipe }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {recipe.holding_rules && recipe.holding_rules.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Holding Rules</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recipe.holding_rules.map((rule, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Thermometer className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      {recipe.shelf_life && (
        <Card>
          <CardHeader><CardTitle>Shelf Life</CardTitle></CardHeader>
          <CardContent><p className="text-sm text-gray-700">{recipe.shelf_life}</p></CardContent>
        </Card>
      )}
      {recipe.cooking_modes && recipe.cooking_modes.length > 0 && (
        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Cooking Modes</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recipe.cooking_modes.map((mode, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <Badge variant="info" size="sm" className="mb-2">{mode.mode}</Badge>
                  <div className="space-y-1 text-sm">
                    {mode.time_minutes && <p><span className="text-gray-500">Time:</span> <span className="font-medium">{mode.time_minutes} min</span></p>}
                    {mode.temperature?.value && <p><span className="text-gray-500">Temp:</span> <span className="font-medium">{mode.temperature.value}°{mode.temperature.unit}</span></p>}
                    {mode.equipment_program_code && <p><span className="text-gray-500">Program:</span> <code className="bg-gray-200 px-1 rounded text-xs">{mode.equipment_program_code}</code></p>}
                    {mode.notes && <p className="text-gray-600 italic text-xs mt-2">{mode.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function IngredientsTab({ groups, scale, toolsRequired }: { groups: Record<string, RecipeIngredient[]>; scale: number; toolsRequired?: string[] }) {
  const scaleQty = (qty: number | null) => {
    if (qty == null) return '—'
    return (qty * scale).toFixed(qty * scale < 10 ? 1 : 0).replace(/\.0$/, '')
  }

  return (
    <div className="space-y-6">
      {toolsRequired && toolsRequired.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Tools Required</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {toolsRequired.map((tool) => (<Badge key={tool} variant="outline">{tool}</Badge>))}
            </div>
          </CardContent>
        </Card>
      )}
      {Object.entries(groups).map(([groupName, ingredients]) => (
        <Card key={groupName}>
          <CardHeader><CardTitle>{groupName}</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ingredient</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Prep</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Per Portion</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Batch ({scale}×)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {ingredients.map((ing, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{ing.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{ing.prep ?? '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 text-right">{ing.per_portion ? `${scaleQty(ing.per_portion.qty)} ${ing.per_portion.unit ?? ''}` : '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 text-right font-medium">{ing.per_batch ? `${scaleQty(ing.per_batch.qty)} ${ing.per_batch.unit ?? ''}` : ing.per_portion ? `${scaleQty(ing.per_portion.qty)} ${ing.per_portion.unit ?? ''}` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function MethodTab({ steps, completedSteps, onToggleStep }: { steps: RecipeStep[]; completedSteps: Set<string>; onToggleStep: (id: string) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Step-by-Step Instructions</h2>
      {steps.map((step, index) => {
        const isComplete = completedSteps.has(step.id)
        const hasCCP = step.ccp && step.ccp.length > 0
        return (
          <Card key={step.id} className={cn('transition-all', isComplete && 'bg-green-50 border-green-200')}>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <button onClick={() => onToggleStep(step.id)}>
                  <StepIndicator step={index + 1} status={isComplete ? 'complete' : 'pending'} size="lg" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                {step.title && <h3 className="text-lg font-medium text-gray-900 mb-1">{step.title}</h3>}
                <p className="text-gray-700 mb-3">{step.instruction}</p>
                {step.key_points && step.key_points.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-600 mb-1">Key Points:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {step.key_points.map((point, i) => (<li key={i}>{point}</li>))}
                    </ul>
                  </div>
                )}
                {step.why && <p className="text-sm text-blue-700 bg-blue-50 px-3 py-2 rounded-md mb-3"><strong>Why:</strong> {step.why}</p>}
                {step.timer_seconds && <Badge variant="outline" size="md" className="mb-3"><Timer className="h-3.5 w-3.5 mr-1" />{formatSeconds(step.timer_seconds)}</Badge>}
                {hasCCP && (
                  <Alert variant="warning" title="Critical Control Point" className="mt-3">
                    <ul className="space-y-1">
                      {step.ccp!.map((ccp, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Thermometer className="h-4 w-4" />
                          <span>{ccp.context}: <strong>{ccp.target ?? `${ccp.value}°${ccp.unit}`}</strong>{ccp.safety_reason && <span className="text-gray-600"> ({ccp.safety_reason})</span>}</span>
                        </li>
                      ))}
                    </ul>
                  </Alert>
                )}
              </div>
              <div className="flex-shrink-0">
                <Button variant={isComplete ? 'secondary' : 'outline'} size="sm" onClick={() => onToggleStep(step.id)}>{isComplete ? 'Done ✓' : 'Mark Done'}</Button>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

function PlatingTab({ recipe }: { recipe: Recipe }) {
  return (
    <div className="space-y-6">
      {recipe.plating && (
        <Card>
          <CardHeader><CardTitle>Plating Guide</CardTitle></CardHeader>
          <CardContent>
            {recipe.plating.instructions && recipe.plating.instructions.length > 0 && (
              <ol className="list-decimal list-inside space-y-2">
                {recipe.plating.instructions.map((instruction, i) => (<li key={i} className="text-gray-700">{instruction}</li>))}
              </ol>
            )}
            {recipe.plating.reference_image_ref && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg text-center text-sm text-gray-500">
                <span className="font-mono">{recipe.plating.reference_image_ref}</span>
                <p className="mt-1">Reference image placeholder</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      {recipe.qc_spec && (
        <Card>
          <CardHeader><CardTitle>Quality Control Checks</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recipe.qc_spec.visual_cues && recipe.qc_spec.visual_cues.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">👁 Visual Cues</h4>
                  <ul className="space-y-1">{recipe.qc_spec.visual_cues.map((cue, i) => (<li key={i} className="text-sm text-gray-600 flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />{cue}</li>))}</ul>
                </div>
              )}
              {recipe.qc_spec.texture_cues && recipe.qc_spec.texture_cues.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">🤚 Texture Cues</h4>
                  <ul className="space-y-1">{recipe.qc_spec.texture_cues.map((cue, i) => (<li key={i} className="text-sm text-gray-600 flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />{cue}</li>))}</ul>
                </div>
              )}
              {recipe.qc_spec.taste_cues && recipe.qc_spec.taste_cues.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">👅 Taste Cues</h4>
                  <ul className="space-y-1">{recipe.qc_spec.taste_cues.map((cue, i) => (<li key={i} className="text-sm text-gray-600 flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />{cue}</li>))}</ul>
                </div>
              )}
              {recipe.qc_spec.pass_fail_checks && recipe.qc_spec.pass_fail_checks.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">✅ Pass/Fail Checks</h4>
                  <ul className="space-y-1">{recipe.qc_spec.pass_fail_checks.map((check, i) => (<li key={i} className="text-sm text-gray-600 flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-500" />{check}</li>))}</ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
