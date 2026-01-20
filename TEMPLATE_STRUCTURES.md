# Operational Document Template Structures

This document is a **complete field reference** for the 5 core operational document templates used in the system, incorporating enhanced UI blocks for better usability.

## Common Types used across templates

### Shared Identity & Lifecycle (All Templates)
Every document includes these base fields:
- `id` (string): Unique identifier
- `status` (string): `draft | needs_review | approved | published | archived`
- `version` (string): e.g., "1.0"
- `created_at` (string): ISO date
- `updated_at` (string): ISO date
- `owner_user_id` (string): ID of the owner
- `tags` (string[]): searchable labels

### Frequency
One of: `'per_order' | 'per_shift' | 'daily' | 'weekly' | 'monthly' | 'ad_hoc'`

### TemperatureUnit
One of: `'C' | 'F'`

### CookingMode
One of: `'fresh' | 'defrosted' | 'frozen'`

### Shift
One of: `'am' | 'pm' | 'full_day' | 'overnight'`

### ResponseType
One of: `'checkbox' | 'number' | 'temperature' | 'text' | 'photo'`

### GuideKind
One of: `'ops_reference' | 'policy_hr' | 'culture' | 'training_standard'`

### EvidenceRef
Used to link data back to source documents.
- `source_id` (string): ID of the source file
- `locator` (string): Page number or section
- `note` (string, optional): Context about the source

### Callout (Reusable)
- `callout_type`: `'info' | 'warning' | 'critical' | 'tip'`
- `title?`: string
- `text`: string | string[]
- `icon?`: string

### ControlPoint (Enhanced CCP)
- `metric`: string (e.g., 'internal_temp')
- `operator`: `'>=' | '<=' | '=' | 'between'`
- `value`: number
- `unit`: string
- `required`: boolean
- `note?`: string

### StepCard (Reusable for Recipe & SOP)
- `id`: string
- `title?`: string
- `instruction`: string
- `key_points?`: string[]
- `why_callout?`: Callout (typically 'info')
- `timer_seconds?`: number
- `timer_display?`: string (e.g., "3:00")
- `critical_control_points?`: ControlPoint[]
- `media_refs?`: string[]
- `notes_callouts?`: Callout[]

### QualityChecklistGroup (Reusable)
- `group_name`: string (e.g., "Visual", "Texture")
- `checks`: Array of:
  - `label`: string
  - `check_type?`: `'visual' | 'texture' | 'pass_fail' | 'measurement'`
  - `control_point?`: ControlPoint
  - `required`: boolean

---

## 1. Recipe
Used for food and beverage preparation instructions.

### Top-level fields
- **Required**
  - `type`: `"Recipe"`
  - `title`: string
  - `yield`: `{ amount: number | null; unit: string | null }`
  - `ingredients`: `RecipeIngredient[]`
  - `steps`: `StepCard[]` (Enhanced structure)
  - `source_evidence`: `EvidenceRef[]`
  - `open_questions`: `string[]`
  - `confidence_score`: number
- **Optional**
  - `description?`: string
  - `category_path?`: string
  - `station?`: string
  - `role?`: string
  - `frequency?`: Frequency
  - `portion_size?`: string
  - `prep_time_minutes?`: number | null
  - `cook_time_minutes?`: number | null
  - `shelf_life?`: string
  - `holding_rules?`: `{ callout_type: 'warning', items: string[], reheat_allowed?: boolean }`
  - `allergens?`: string[]
  - `hazards?`: string[]
  - `tools_required?`: `Tool[]` (Enhanced structure)
  - `cooking_modes?`: `CookingModeSpec[]`
  - `plating_guide?`: `{ bullets: string[], reference_image_ref?: string | null }`
  - `quality_checks?`: `QualityChecklistGroup[]` (Enhanced grouped structure)

### Nested structures
- **Tool**
  - `tool_name`: string
  - `quantity?`: number
  - `notes?`: string
- **Quantity**
  - `qty`: number | null
  - `unit`: string | null
- **RecipeIngredient**
  - `name`: string
  - `group?`: string (e.g., "Sauce", "Garnish")
  - `prep?`: string
  - `per_portion?`: Quantity
  - `per_batch?`: Quantity
  - `notes?`: string
- **CookingModeSpec**
  - `mode`: CookingMode
  - `time_minutes?`: number | null
  - `temperature?`: `{ value: number | null; unit: TemperatureUnit | null }`
  - `equipment_program_code?`: string | null
  - `notes?`: string

### JSON Example
```json
{
  "id": "recipe_123",
  "type": "Recipe",
  "title": "Classic Burger",
  "status": "published",
  "yield": { "amount": 4, "unit": "servings" },
  "prep_time_minutes": 15,
  "cook_time_minutes": 10,
  "tools_required": [
    { "tool_name": "Flat Top Grill" },
    { "tool_name": "Spatula" }
  ],
  "ingredients": [
    {
      "name": "Ground Beef",
      "group": "Patty",
      "per_portion": { "qty": 150, "unit": "g" }
    }
  ],
  "steps": [
    {
      "id": "step_1",
      "instruction": "Grill patty for 3 mins per side",
      "timer_seconds": 180,
      "why_callout": {
        "callout_type": "info",
        "text": "Seals in juices"
      },
      "critical_control_points": [
        {
          "metric": "internal_temp",
          "operator": ">=",
          "value": 75,
          "unit": "C",
          "required": true
        }
      ]
    }
  ],
  "cooking_modes": [
    {
      "mode": "fresh",
      "time_minutes": 6,
      "temperature": { "value": 200, "unit": "C" }
    }
  ],
  "quality_checks": [
    {
      "group_name": "Visual",
      "checks": [{ "label": "Golden brown crust", "check_type": "visual", "required": true }]
    }
  ],
  "allergens": ["Gluten", "Dairy"],
  "source_evidence": [{ "source_id": "doc_1", "locator": "p. 1" }],
  "open_questions": [],
  "confidence_score": 0.95
}
```

---

## 2. SOP (Standard Operating Procedure)
Used for processes, workflows, and detailed procedures not specific to a single recipe.

### Top-level fields
- **Required**
  - `type`: `"SOP"`
  - `title`: string
  - `steps`: `StepCard[]` (Enhanced structure)
  - `source_evidence`: `EvidenceRef[]`
  - `open_questions`: `string[]`
  - `confidence_score`: number
- **Optional**
  - `description?`: string
  - `purpose?`: string | null
  - `when_to_use?`: string | null (trigger)
  - `tools_required?`: `Tool[]`
  - `safety_warnings?`: `Callout[]`
  - `troubleshooting?`: `TroubleshootingItem[]`
  - `common_mistakes?`: string[]
  - `escalation?`: `{ conditions: string[], actions: string[], contact_role?: string }`

### Nested structures
- **TroubleshootingItem**
  - `symptom`: string
  - `likely_causes?`: string[]
  - `fix_steps`: string[]
  - `escalate_when?`: string | null

### JSON Example
```json
{
  "id": "sop_456",
  "type": "SOP",
  "title": "Opening Procedures",
  "status": "published",
  "purpose": "Ensure station is ready for service",
  "safety_warnings": [
    { "callout_type": "warning", "text": "Surfaces may be slippery when wet" }
  ],
  "steps": [
    {
      "id": "1",
      "title": "Turn on lights",
      "instruction": "Switch on all station lights"
    },
    {
      "id": "2",
      "title": "Sanitize surfaces",
      "instruction": "Wipe down all counters with sanitizer",
      "timer_seconds": 60,
      "timer_display": "1:00"
    }
  ],
  "troubleshooting": [
    {
      "symptom": "POS not turning on",
      "fix_steps": ["Check power cable", "Call IT support"]
    }
  ],
  "source_evidence": [{ "source_id": "doc_2", "locator": "p. 3" }],
  "open_questions": [],
  "confidence_score": 1.0
}
```

---

## 3. Checklist
Used for data collection, validation tasks, and compliance logs.

### Top-level fields
- **Required**
  - `type`: `"Checklist"`
  - `title`: string
  - `frequency`: Frequency
  - `items`: `ChecklistItem[]`
  - `source_evidence`: `EvidenceRef[]`
  - `open_questions`: `string[]`
  - `confidence_score`: number
- **Optional**
  - `description?`: string
  - `department?`: string
  - `station?`: string
  - `role?`: string
  - `shift?`: Shift
  - `requires_signature?`: boolean
  - `escalation_rules?`: `{ condition: string, action: string, notify_roles: string[] }[]`

### Checklist Item Types
Items can be of different types defined by `response_type`:
- `checkbox`: Simple done/not done
- `number`: Numeric input (supports min/max validation)
- `temperature`: Temperature input
- `text`: Free text input
- `photo`: Requires a photo upload

### Nested structures
- **NumericField**
  - `label`: string
  - `unit?`: string | null
  - `min?`: number | null
  - `max?`: number | null
  - `target?`: number | null
- **ChecklistItem**
  - `id`: string
  - `label`: string
  - `category?`: string
  - `is_mandatory`: boolean
  - `response_type`: ResponseType
  - `numeric_field?`: NumericField
  - `photo_required?`: boolean
  - `text_required?`: boolean
  - `fail_path_instruction?`: string | null
  - `escalation_trigger?`: string | null

### JSON Example
```json
{
  "id": "chk_789",
  "type": "Checklist",
  "title": "Fridge Temp Log",
  "status": "published",
  "frequency": "daily",
  "items": [
    {
      "id": "item_1",
      "label": "Walk-in Fridge Temp",
      "response_type": "temperature",
      "is_mandatory": true,
      "numeric_field": {
        "label": "Temp",
        "unit": "C",
        "min": 1,
        "max": 5
      }
    },
    {
      "id": "item_2",
      "label": "Clean Shelves",
      "response_type": "checkbox",
      "is_mandatory": true
    }
  ],
  "source_evidence": [{ "source_id": "doc_3", "locator": "p. 2" }],
  "open_questions": [],
  "confidence_score": 0.9
}
```

---

## 4. Equipment
Used for machine manuals, maintenance guides, and quick reference cards.

### Top-level fields
- **Required**
  - `type`: `"Equipment"`
  - `title`: string
  - `quick_actions`: `QuickAction[]` (Array of card-like actions)
  - `source_evidence`: `EvidenceRef[]`
  - `open_questions`: `string[]`
  - `confidence_score`: number
- **Optional**
  - `description?`: string
  - `machine_name?`: string
  - `model_number?`: string
  - `safety_warnings?`: `Callout[]` (Critical warnings)
  - `programs?`: `EquipmentProgram[]`
  - `error_codes?`: `ErrorCode[]`
  - `troubleshooting?`: `TroubleshootingItem[]`

### Nested structures
- **QuickAction**
  - `action_name`: string (e.g. "Startup", "Daily Cleaning")
  - `steps`: string[]
  - `media_refs?`: string[]
  - `callouts?`: Callout[]
- **EquipmentProgram**
  - `name`: string
  - `program_code?`: string
  - `settings?`: `{ key: string; value: string }[]`
  - `button_sequence`: string[]
- **ErrorCode**
  - `code`: string
  - `meaning?`: string
  - `immediate_action?`: string

### JSON Example
```json
{
  "id": "eq_101",
  "type": "Equipment",
  "title": "Combi Oven Usage",
  "machine_name": "Rational Combi",
  "safety_warnings": [
    { "callout_type": "critical", "text": "Hot steam! Stand back when opening." }
  ],
  "quick_actions": [
    {
      "action_name": "Morning Startup",
      "steps": ["Press power button", "Select pre-heat"]
    }
  ],
  "error_codes": [
    {
      "code": "E12",
      "meaning": "Door open",
      "immediate_action": "Close door securely"
    }
  ],
  "source_evidence": [{ "source_id": "doc_4", "locator": "p. 10" }],
  "open_questions": [],
  "confidence_score": 0.9
}
```

---

## 5. Guide
Used for knowledge base articles, reference tables, policies, and FAQs.

### Top-level fields
- **Required**
  - `type`: `"Guide"`
  - `title`: string
  - `blocks`: `GuideBlock[]` (Flexible content blocks)
  - `source_evidence`: `EvidenceRef[]`
  - `open_questions`: `string[]`
  - `confidence_score`: number
- **Optional**
  - `description?`: string
  - `kind?`: GuideKind
  - `topics?`: string[]
  - `overview_callout?`: Callout
  - `faq?`: `FAQItem[]`
  - `related_documents?`: `{ doc_id: string, title: string, type: string }[]`

### Guide Blocks
The content is composed of ordered blocks of different types:

- **SectionBlock**: `{ block_type: 'section', title: string, content: string }`
- **TableBlock**: `{ block_type: 'table', title: string, columns: string[], rows: object[] }`
- **ComparisonBlock**: `{ block_type: 'comparison_cards', cards: { title: string, kv_pairs: { key: string, value: string }[] }[] }`
- **CalloutBlock**: `{ block_type: 'callout', callout: Callout }`

### JSON Example
```json
{
  "id": "guide_202",
  "type": "Guide",
  "title": "Uniform Policy",
  "kind": "policy_hr",
  "blocks": [
    {
      "block_type": "section",
      "title": "Shirt Standards",
      "content": "Shirts must be black and ironed daily."
    },
    {
      "block_type": "table",
      "title": "Allowed Footwear",
      "columns": ["Type", "Color", "Allowed?"],
      "rows": [
        { "Type": "Sneakers", "Color": "Black", "Allowed?": "Yes" },
        { "Type": "Sandals", "Color": "Any", "Allowed?": "No" }
      ]
    }
  ],
  "faq": [
    {
      "question": "Can I wear jeans?",
      "answer": "No, black trousers only."
    }
  ],
  "source_evidence": [{ "source_id": "doc_5", "locator": "p. 1" }],
  "open_questions": [],
  "confidence_score": 0.85
}
```
