# Operational Document Viewer Demo

A production-quality Next.js application for rendering restaurant operational documents (Recipes, SOPs, Checklists, Equipment Guides, and General Guides) from JSON schemas.

## File Tree

```
doc-viewer/
├── app/
│   ├── demo/
│   │   └── viewer/
│   │       └── page.tsx          # Main demo page with sidebar navigation
│   ├── globals.css               # Tailwind CSS + custom styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home redirect
├── components/
│   ├── ui/
│   │   └── shared.tsx            # Reusable UI components (Badge, Card, Button, etc.)
│   └── viewers/
│       ├── index.ts              # Barrel export
│       ├── DocViewer.tsx         # Router component (routes to correct viewer)
│       ├── DocumentHeader.tsx    # Shared header for all document types
│       ├── RecipeViewer.tsx      # Recipe-specific viewer
│       ├── SOPViewer.tsx         # SOP-specific viewer
│       ├── ChecklistViewer.tsx   # Checklist-specific viewer
│       ├── EquipmentViewer.tsx   # Equipment Guide viewer
│       └── GuideViewer.tsx       # General Guide viewer
├── data/
│   └── mock-documents.ts         # Mock JSON data for all 5 document types
├── lib/
│   └── utils.ts                  # Utility functions (cn, formatDuration, etc.)
├── types/
│   └── documents.ts              # TypeScript types matching JSON schemas
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Features

### Document Types Supported
1. **Recipe** - Ingredients table (scalable), step-by-step method, plating guide, QC checks
2. **SOP** - Step-by-step procedures with safety callouts, troubleshooting
3. **Checklist** - Interactive tick-box list with progress tracking
4. **Equipment** - Quick actions (startup/shutdown/cleaning), programs library, error codes
5. **Guide** - Reference tables, scenarios/variants, FAQ, visual examples

### UI Components
- Responsive sidebar navigation
- Progress tracking with visual indicators
- Collapsible sections
- Interactive checklists with state management
- Temperature/numeric input validation
- Critical Control Point (CCP) alerts
- Related document linking

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Schema-Driven Design

The UI is completely driven by the JSON schemas defined in `types/documents.ts`. Each viewer component accepts the exact schema type as props:

```typescript
// Example: RecipeViewer props
interface RecipeViewerProps {
  recipe: Recipe
}
```

No fields are invented - all rendering is based on what exists in the schema.

## Technologies

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Lucide React** (icons)
- **clsx + tailwind-merge** (class name utilities)
