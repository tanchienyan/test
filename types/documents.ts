// types/documents.ts
// Shared Types

export type Frequency = 'per_order' | 'per_shift' | 'daily' | 'weekly' | 'monthly' | 'ad_hoc'
export type TemperatureUnit = 'C' | 'F'
export type CookingMode = 'fresh' | 'defrosted' | 'frozen'
export type Shift = 'am' | 'pm' | 'full_day' | 'overnight'
export type ResponseType = 'checkbox' | 'number' | 'temperature' | 'text' | 'photo'
export type GuideKind = 'ops_reference' | 'policy_hr' | 'culture' | 'training_standard'
export type DocumentType = 'Recipe' | 'SOP' | 'Checklist' | 'Equipment' | 'Guide'

export type EvidenceRef = {
  source_id: string
  locator: string
  note?: string
}

// ===== RECIPE TYPES =====

export type Quantity = {
  qty: number | null
  unit: string | null
}

export type RecipeIngredient = {
  name: string
  group?: string
  prep?: string
  per_portion?: Quantity
  per_batch?: Quantity
  notes?: string
}

export type CriticalControlPoint = {
  context: string
  value: number | null
  unit: TemperatureUnit | null
  target?: string
  safety_reason?: string
  threshold?: string | null
  verification?: string | null
  reason?: string | null
}

export type RecipeStep = {
  id: string
  title?: string
  instruction: string
  key_points?: string[]
  why?: string
  timer_seconds?: number | null
  media_refs?: string[]
  ccp?: CriticalControlPoint[]
}

export type CookingModeSpec = {
  mode: CookingMode
  time_minutes?: number | null
  temperature?: { value: number | null; unit: TemperatureUnit | null }
  equipment_program_code?: string | null
  notes?: string
}

export type Recipe = {
  type: 'Recipe'
  title: string
  description?: string
  category_path?: string
  station?: string
  role?: string
  frequency?: Frequency
  yield: { amount: number | null; unit: string | null }
  portion_size?: string
  prep_time_minutes?: number | null
  cook_time_minutes?: number | null
  shelf_life?: string
  holding_rules?: string[]
  allergens?: string[]
  hazards?: string[]
  ingredients: RecipeIngredient[]
  tools_required?: string[]
  cooking_modes?: CookingModeSpec[]
  steps: RecipeStep[]
  plating?: {
    instructions?: string[]
    reference_image_ref?: string | null
  }
  qc_spec?: {
    visual_cues?: string[]
    texture_cues?: string[]
    taste_cues?: string[]
    pass_fail_checks?: string[]
  }
  source_evidence: EvidenceRef[]
  open_questions: string[]
  confidence_score: number
}

// ===== SOP TYPES =====

export type SOPStep = {
  id: string
  title: string
  instruction: string
  key_points?: string[]
  why?: string | null
  timer_seconds?: number | null
  media_refs?: string[]
  ccp?: CriticalControlPoint[]
}

export type TroubleshootingItem = {
  symptom: string
  likely_causes?: string[]
  fix_steps: string[]
  escalate_when?: string | null
}

export type SOP = {
  type: 'SOP'
  title: string
  description?: string
  category_path?: string
  station?: string
  role?: string
  estimated_time_minutes?: number | null
  frequency?: Frequency
  hazards?: string[]
  allergens?: string[]
  purpose?: string | null
  when_to_use?: string | null
  scope?: string | null
  prerequisites?: string[]
  tools_required?: string[]
  safety_warnings?: string[]
  steps: SOPStep[]
  quality_checks?: string[]
  common_mistakes?: string[]
  escalation?: string | null
  troubleshooting?: TroubleshootingItem[]
  source_evidence: EvidenceRef[]
  open_questions: string[]
  confidence_score: number
}

// ===== CHECKLIST TYPES =====

export type NumericField = {
  label: string
  unit?: string | null
  min?: number | null
  max?: number | null
  target?: number | null
  target_text?: string | null
}

export type ChecklistItem = {
  id: string
  label: string
  category?: string
  is_mandatory: boolean
  response_type: ResponseType
  numeric_field?: NumericField
  photo_required?: boolean
  text_required?: boolean
  expected_value_text?: string | null
  fail_path_instruction?: string | null
  escalation_trigger?: string | null
  requires_signature?: boolean
  requires_initials?: boolean
}

export type Checklist = {
  type: 'Checklist'
  title: string
  description?: string
  department?: string
  station?: string
  role?: string
  shift?: Shift
  frequency: Frequency
  items: ChecklistItem[]
  escalation_rules?: string[]
  source_evidence: EvidenceRef[]
  open_questions: string[]
  confidence_score: number
}

// ===== EQUIPMENT TYPES =====

export type EquipmentRisk = {
  hazard: string
  warning: string
}

export type QuickAction = {
  title: string
  steps: string[]
  media_refs?: string[]
}

export type ProgramSetting = {
  key: string
  value: string
}

export type EquipmentProgram = {
  code?: string | null
  name: string
  purpose?: string | null
  button_sequence_steps: string[]
  settings?: ProgramSetting[]
  time_minutes?: number | null
  temperature?: { value: number | null; unit: TemperatureUnit | null }
  control_panel_image_ref?: string | null
  common_mistakes?: string[]
  verification?: string[]
}

export type ErrorCode = {
  code: string
  meaning?: string | null
  immediate_action?: string | null
}

export type Equipment = {
  type: 'Equipment'
  title: string
  description?: string
  machine_name?: string
  model_number?: string
  station?: string
  role?: string
  frequency?: Frequency
  risk_warnings?: EquipmentRisk[]
  quick_actions: {
    startup?: QuickAction
    shutdown?: QuickAction
    cleaning_daily?: QuickAction
    cleaning_weekly?: QuickAction
    cleaning_deep?: QuickAction
    emergency_stop?: QuickAction
  }
  programs?: EquipmentProgram[]
  error_codes?: ErrorCode[]
  troubleshooting?: TroubleshootingItem[]
  links_out?: {
    target_doc_type: 'recipe' | 'sop' | 'checklist'
    title_hint: string
    reason?: string
  }[]
  source_evidence: EvidenceRef[]
  open_questions: string[]
  confidence_score: number
}

// ===== GUIDE TYPES =====

export type ReferenceTable = {
  title: string
  headers: string[]
  rows: string[][]
  notes?: string
}

export type ScenarioVariant = {
  label: string
  fields: {
    key: string
    value: string
  }[]
  notes?: string
}

export type ScenarioBlock = {
  title: string
  description?: string
  variants: ScenarioVariant[]
}

export type VisualExample = {
  title: string
  good_image_ref?: string | null
  bad_image_ref?: string | null
  notes?: string
}

export type FAQItem = {
  question: string
  answer: string
  evidence?: EvidenceRef[]
}

export type LinkOut = {
  target_doc_type: 'sop' | 'recipe' | 'checklist' | 'equipment'
  title_hint: string
  category_path_hint?: string
  reason?: string
}

export type Guide = {
  type: 'Guide'
  title: string
  description?: string
  kind?: GuideKind
  topics?: string[]
  category_path?: string
  station?: string
  role?: string
  frequency?: Frequency
  audience?: string[]
  overview?: string
  sections: {
    title: string
    bullets: string[]
  }[]
  reference_tables?: ReferenceTable[]
  scenarios?: ScenarioBlock[]
  visual_examples?: VisualExample[]
  faq?: FAQItem[]
  links_out?: LinkOut[]
  source_evidence: EvidenceRef[]
  open_questions: string[]
  confidence_score: number
}

// ===== UNIFIED DOCUMENT TYPE =====

export type OperationalDocument = Recipe | SOP | Checklist | Equipment | Guide

// Helper type guards
export function isRecipe(doc: OperationalDocument): doc is Recipe {
  return doc.type === 'Recipe'
}

export function isSOP(doc: OperationalDocument): doc is SOP {
  return doc.type === 'SOP'
}

export function isChecklist(doc: OperationalDocument): doc is Checklist {
  return doc.type === 'Checklist'
}

export function isEquipment(doc: OperationalDocument): doc is Equipment {
  return doc.type === 'Equipment'
}

export function isGuide(doc: OperationalDocument): doc is Guide {
  return doc.type === 'Guide'
}
