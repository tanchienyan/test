// types/documents.ts

// ===== SHARED TYPES =====

export type Frequency = 'per_order' | 'per_shift' | 'daily' | 'weekly' | 'monthly' | 'ad_hoc'
export type TemperatureUnit = 'C' | 'F'
export type CookingMode = 'fresh' | 'defrosted' | 'frozen'
export type Shift = 'am' | 'pm' | 'full_day' | 'overnight'
export type ResponseType = 'checkbox' | 'number' | 'temperature' | 'text' | 'photo'
export type GuideKind = 'ops_reference' | 'policy_hr' | 'culture' | 'training_standard'
export type DocStatus = 'draft' | 'needs_review' | 'approved' | 'published' | 'archived'
export type CalloutType = 'info' | 'warning' | 'critical' | 'tip'

export interface BaseDocument {
  id: string
  title: string
  status: DocStatus
  version: string
  created_at: string
  updated_at: string
  owner_user_id: string
  tags?: string[]
  source_evidence: EvidenceRef[]
  open_questions: string[]
  confidence_score: number
}

export type EvidenceRef = {
  source_id: string
  locator: string
  note?: string
}

export type Callout = {
  callout_type: CalloutType
  title?: string
  text: string | string[]
  icon?: string
}

export type ControlPoint = {
  metric: string
  operator: '>=' | '<=' | '=' | 'between'
  value: number
  unit: string
  required: boolean
  note?: string
}

export type Tool = {
  tool_name: string
  quantity?: number
  notes?: string
}

export type StepCard = {
  id: string
  title?: string
  instruction: string
  key_points?: string[]
  why_callout?: Callout
  timer_seconds?: number | null
  timer_display?: string
  critical_control_points?: ControlPoint[]
  media_refs?: string[]
  notes_callouts?: Callout[]
}

export type QualityChecklistGroup = {
  group_name: string
  checks: {
    label: string
    check_type?: 'visual' | 'texture' | 'pass_fail' | 'measurement'
    control_point?: ControlPoint
    required: boolean
  }[]
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

export type CookingModeSpec = {
  mode: CookingMode
  time_minutes?: number | null
  temperature?: { value: number | null; unit: TemperatureUnit | null }
  equipment_program_code?: string | null
  notes?: string
}

export interface Recipe extends BaseDocument {
  type: 'Recipe'
  yield: { amount: number | null; unit: string | null }
  ingredients: RecipeIngredient[]
  steps: StepCard[]
  
  description?: string
  category_path?: string
  station?: string
  role?: string
  frequency?: Frequency
  portion_size?: string
  prep_time_minutes?: number | null
  cook_time_minutes?: number | null
  shelf_life?: string
  holding_rules?: {
    callout_type: 'warning'
    items: string[]
    reheat_allowed?: boolean
  }
  allergens?: string[]
  hazards?: string[]
  tools_required?: Tool[]
  cooking_modes?: CookingModeSpec[]
  plating_guide?: {
    bullets: string[]
    reference_image_ref?: string | null
  }
  quality_checks?: QualityChecklistGroup[]
}

// ===== SOP TYPES =====

export type TroubleshootingItem = {
  symptom: string
  likely_causes?: string[]
  fix_steps: string[]
  escalate_when?: string | null
}

export interface SOP extends BaseDocument {
  type: 'SOP'
  steps: StepCard[]
  
  description?: string
  purpose?: string | null
  when_to_use?: string | null
  tools_required?: Tool[]
  safety_warnings?: Callout[]
  troubleshooting?: TroubleshootingItem[]
  common_mistakes?: string[]
  escalation?: {
    conditions: string[]
    actions: string[]
    contact_role?: string
  }
  
  // Optional extras from before
  category_path?: string
  station?: string
  role?: string
  estimated_time_minutes?: number | null
  frequency?: Frequency
  hazards?: string[]
  allergens?: string[]
  scope?: string | null
  prerequisites?: string[]
  quality_checks?: string[]
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

export interface Checklist extends BaseDocument {
  type: 'Checklist'
  frequency: Frequency
  items: ChecklistItem[]
  
  description?: string
  department?: string
  station?: string
  role?: string
  shift?: Shift
  requires_signature?: boolean
  escalation_rules?: {
    condition: string
    action: string
    notify_roles: string[]
  }[]
}

// ===== EQUIPMENT TYPES =====

export type QuickAction = {
  action_name: string
  steps: string[]
  media_refs?: string[]
  callouts?: Callout[]
}

export type ProgramSetting = {
  key: string
  value: string
}

export type EquipmentProgram = {
  name: string
  program_code?: string | null
  purpose?: string | null
  button_sequence_steps: string[] // keeping legacy support if needed, or prefer button_sequence
  button_sequence?: string[] // new preferred
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

export type EquipmentRisk = {
  hazard: string
  warning: string
}

export interface Equipment extends BaseDocument {
  type: 'Equipment'
  quick_actions: QuickAction[] // Changed from object to array
  
  description?: string
  machine_name?: string
  model_number?: string
  station?: string
  role?: string
  frequency?: Frequency
  safety_warnings?: Callout[]
  risk_warnings?: EquipmentRisk[] // Legacy support
  programs?: EquipmentProgram[]
  error_codes?: ErrorCode[]
  troubleshooting?: TroubleshootingItem[]
  links_out?: {
    target_doc_type: 'recipe' | 'sop' | 'checklist'
  }[]
}

// ===== GUIDE TYPES =====

export type SectionBlock = {
  block_type: 'section'
  title: string
  content: string
}

export type TableBlock = {
  block_type: 'table'
  title: string
  columns: string[]
  rows: Record<string, string>[]
}

export type ComparisonBlock = {
  block_type: 'comparison_cards'
  cards: {
    title: string
    kv_pairs: { key: string; value: string }[]
  }[]
}

export type CalloutBlock = {
  block_type: 'callout'
  callout: Callout
}

export type GuideBlock = SectionBlock | TableBlock | ComparisonBlock | CalloutBlock

export type ReferenceTable = { // Legacy support
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

export interface Guide extends BaseDocument {
  type: 'Guide'
  blocks: GuideBlock[]
  
  description?: string
  kind?: GuideKind
  topics?: string[]
  category_path?: string
  station?: string
  role?: string
  frequency?: Frequency
  audience?: string[]
  overview?: string
  overview_callout?: Callout
  faq?: FAQItem[]
  links_out?: LinkOut[]
  
  // Legacy fields kept optional for backward compat if needed, 
  // though we prefer blocks[]
  sections?: { title: string; bullets: string[] }[]
  reference_tables?: ReferenceTable[]
  scenarios?: ScenarioBlock[]
  visual_examples?: VisualExample[]
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
