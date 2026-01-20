// components/ui/shared.tsx
'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import {
  Clock,
  Users,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Timer,
  Thermometer,
  Camera,
  FileText,
  Link as LinkIcon,
  Play,
  ChefHat,
  Utensils,
  ClipboardList,
  Cog,
  BookOpen,
  type LucideIcon,
} from 'lucide-react'

// ===== BADGE =====
export interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline' | 'gradient'
  size?: 'sm' | 'md'
  className?: string
  pulse?: boolean
}

export function Badge({ children, variant = 'default', size = 'sm', className, pulse = false }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-700 ring-1 ring-gray-200',
    success: 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 ring-1 ring-green-200',
    warning: 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 ring-1 ring-amber-200',
    error: 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 ring-1 ring-red-200',
    info: 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 ring-1 ring-blue-200',
    outline: 'bg-transparent border border-gray-300 text-gray-600 hover:bg-gray-50',
    gradient: 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm',
  }

  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full transition-all duration-200',
        variants[variant],
        sizes[size],
        pulse && 'animate-pulse',
        className
      )}
    >
      {children}
    </span>
  )
}

// ===== CARD =====
export interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  gradient?: boolean
}

export function Card({ children, className, padding = 'md', hover = false, gradient = false }: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  }

  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-200/80 shadow-sm backdrop-blur-sm',
        'transition-all duration-300 ease-out',
        hover && 'hover:shadow-lg hover:border-gray-300 hover:-translate-y-0.5',
        gradient && 'bg-gradient-to-br from-white to-gray-50/50',
        paddings[padding],
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mb-4 pb-3 border-b border-gray-100', className)}>{children}</div>
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn('text-lg font-semibold text-gray-900 tracking-tight', className)}>{children}</h3>
}

export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('text-sm text-gray-500 mt-1.5 leading-relaxed', className)}>{children}</p>
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('', className)}>{children}</div>
}

// ===== BUTTON =====
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  loading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className,
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/30',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 ring-1 ring-gray-200',
    outline: 'border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300',
    ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-md shadow-red-500/25',
    success: 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-md shadow-green-500/25',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2',
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-lg',
        'transition-all duration-200 ease-out',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
        'active:scale-[0.98]',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  )
}

// ===== PROGRESS BAR =====
export interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: 'indigo' | 'green' | 'amber' | 'red' | 'gradient'
  animated?: boolean
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  size = 'md',
  color = 'indigo',
  animated = false,
}: ProgressBarProps) {
  const percentage = Math.round((value / max) * 100)

  const colors = {
    indigo: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
    green: 'bg-gradient-to-r from-green-500 to-emerald-500',
    amber: 'bg-gradient-to-r from-amber-500 to-orange-500',
    red: 'bg-gradient-to-r from-red-500 to-rose-500',
    gradient: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
  }

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between mb-2">
          {label && <span className="text-sm font-medium text-gray-600">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-semibold text-gray-700 tabular-nums">{percentage}%</span>
          )}
        </div>
      )}
      <div className={cn('w-full bg-gray-100 rounded-full overflow-hidden ring-1 ring-gray-200/50', heights[size])}>
        <div
          className={cn(
            'rounded-full transition-all duration-500 ease-out relative',
            colors[color],
            heights[size],
            animated && 'animate-pulse'
          )}
          style={{ width: `${percentage}%` }}
        >
          {size === 'lg' && percentage > 0 && (
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
          )}
        </div>
      </div>
    </div>
  )
}

// ===== COLLAPSIBLE =====
export interface CollapsibleProps {
  title: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
  icon?: LucideIcon
}

export function Collapsible({ title, children, defaultOpen = false, className, icon: Icon }: CollapsibleProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <div className={cn('border border-gray-200 rounded-xl overflow-hidden bg-white', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between p-4 text-left transition-all duration-200',
          'hover:bg-gray-50/80',
          isOpen && 'bg-gray-50/50'
        )}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="h-5 w-5 text-gray-500" />}
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        <div
          className={cn(
            'p-1 rounded-full transition-all duration-300',
            isOpen ? 'bg-indigo-100 rotate-180' : 'bg-gray-100'
          )}
        >
          <ChevronDown className={cn('h-4 w-4 transition-colors', isOpen ? 'text-indigo-600' : 'text-gray-500')} />
        </div>
      </button>
      <div
        className={cn(
          'grid transition-all duration-300 ease-out',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 pt-2 border-t border-gray-100">{children}</div>
        </div>
      </div>
    </div>
  )
}

// ===== TABS =====
export interface TabsProps {
  tabs: { id: string; label: string; icon?: LucideIcon; badge?: string | number }[]
  activeTab: string
  onChange: (id: string) => void
  className?: string
  variant?: 'underline' | 'pills' | 'boxed'
}

export function Tabs({ tabs, activeTab, onChange, className, variant = 'underline' }: TabsProps) {
  if (variant === 'pills') {
    return (
      <div className={cn('p-1 bg-gray-100 rounded-xl inline-flex gap-1', className)}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              )}
            >
              {Icon && <Icon className={cn('h-4 w-4', isActive && 'text-indigo-600')} />}
              {tab.label}
              {tab.badge && (
                <span className={cn(
                  'ml-1 px-1.5 py-0.5 text-xs rounded-full',
                  isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 text-gray-600'
                )}>
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  if (variant === 'boxed') {
    return (
      <div className={cn('flex gap-2', className)}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200',
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-white text-gray-600 hover:bg-gray-50 ring-1 ring-gray-200'
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {tab.label}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className={cn('border-b border-gray-200', className)}>
      <nav className="flex gap-6 -mb-px" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                'flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              {Icon && <Icon className={cn('h-4 w-4 transition-colors', isActive && 'text-indigo-500')} />}
              {tab.label}
              {tab.badge && (
                <span className={cn(
                  'ml-1 px-1.5 py-0.5 text-xs rounded-full tabular-nums',
                  isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
                )}>
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

// ===== ALERT =====
export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  children: React.ReactNode
  className?: string
  dismissible?: boolean
  onDismiss?: () => void
}

export function Alert({ variant = 'info', title, children, className, dismissible = false, onDismiss }: AlertProps) {
  const variants = {
    info: {
      bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
      border: 'border-blue-200/80',
      icon: Info,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-100',
    },
    success: {
      bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
      border: 'border-green-200/80',
      icon: CheckCircle2,
      iconColor: 'text-green-500',
      iconBg: 'bg-green-100',
    },
    warning: {
      bg: 'bg-gradient-to-r from-amber-50 to-orange-50',
      border: 'border-amber-200/80',
      icon: AlertTriangle,
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-100',
    },
    error: {
      bg: 'bg-gradient-to-r from-red-50 to-rose-50',
      border: 'border-red-200/80',
      icon: XCircle,
      iconColor: 'text-red-500',
      iconBg: 'bg-red-100',
    },
  }

  const { bg, border, icon: Icon, iconColor, iconBg } = variants[variant]

  return (
    <div className={cn('rounded-xl border p-4 shadow-sm', bg, border, className)}>
      <div className="flex gap-3">
        <div className={cn('p-1.5 rounded-lg flex-shrink-0', iconBg)}>
          <Icon className={cn('h-4 w-4', iconColor)} />
        </div>
        <div className="flex-1 min-w-0">
          {title && <p className="font-semibold text-gray-900 mb-1">{title}</p>}
          <div className="text-sm text-gray-700 leading-relaxed">{children}</div>
        </div>
        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 rounded-lg hover:bg-black/5 transition-colors flex-shrink-0"
          >
            <XCircle className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>
    </div>
  )
}

// ===== METADATA ROW =====
export interface MetadataItemProps {
  icon: LucideIcon
  label: string
  value: React.ReactNode
  className?: string
  variant?: 'inline' | 'stacked'
}

export function MetadataItem({ icon: Icon, label, value, className, variant = 'inline' }: MetadataItemProps) {
  if (variant === 'stacked') {
    return (
      <div className={cn('flex flex-col', className)}>
        <div className="flex items-center gap-1.5 text-gray-500 mb-0.5">
          <Icon className="h-3.5 w-3.5" />
          <span className="text-xs uppercase tracking-wide font-medium">{label}</span>
        </div>
        <span className="text-sm font-semibold text-gray-900">{value}</span>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg', className)}>
      <Icon className="h-4 w-4 text-gray-400" />
      <span className="text-sm text-gray-500">{label}:</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  )
}

export function MetadataRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {children}
    </div>
  )
}

// ===== TABLE =====
export interface TableProps {
  headers: string[]
  rows: string[][]
  caption?: string
  className?: string
  striped?: boolean
  compact?: boolean
}

export function Table({ headers, rows, caption, className, striped = false, compact = false }: TableProps) {
  return (
    <div className={cn('overflow-x-auto rounded-xl border border-gray-200', className)}>
      <table className="min-w-full divide-y divide-gray-200">
        {caption && (
          <caption className="text-sm font-medium text-gray-600 text-left p-3 bg-gray-50 border-b border-gray-200">
            {caption}
          </caption>
        )}
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
          <tr>
            {headers.map((header, i) => (
              <th
                key={i}
                scope="col"
                className={cn(
                  'text-left text-xs font-semibold text-gray-600 uppercase tracking-wider',
                  compact ? 'px-3 py-2' : 'px-4 py-3'
                )}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={cn(
                'transition-colors hover:bg-indigo-50/50',
                striped && rowIndex % 2 === 1 && 'bg-gray-50/50'
              )}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={cn(
                    'text-sm text-gray-700',
                    compact ? 'px-3 py-2' : 'px-4 py-3',
                    cellIndex === 0 && 'font-medium text-gray-900'
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ===== ICON HELPERS =====
export function getDocTypeIcon(type: string): LucideIcon {
  switch (type) {
    case 'Recipe':
      return ChefHat
    case 'SOP':
      return ClipboardList
    case 'Checklist':
      return CheckCircle2
    case 'Equipment':
      return Cog
    case 'Guide':
      return BookOpen
    default:
      return FileText
  }
}

// ===== STEP INDICATOR =====
export interface StepIndicatorProps {
  step: number | string
  status?: 'pending' | 'active' | 'complete'
  size?: 'sm' | 'md' | 'lg'
}

export function StepIndicator({ step, status = 'pending', size = 'md' }: StepIndicatorProps) {
  const sizes = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-10 w-10 text-base',
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  const statusStyles = {
    pending: 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200',
    active: 'bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700 border-indigo-300 ring-4 ring-indigo-100 animate-pulse',
    complete: 'bg-gradient-to-br from-green-400 to-emerald-500 text-white border-green-400 shadow-md shadow-green-500/30',
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full border-2 font-bold transition-all duration-300',
        sizes[size],
        statusStyles[status]
      )}
    >
      {status === 'complete' ? <CheckCircle2 className={iconSizes[size]} /> : step}
    </div>
  )
}

// ===== EMPTY STATE =====
export interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon: Icon = Info, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 mb-4">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 tracking-tight">{title}</h3>
      {description && <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

// Export icons for convenience
export {
  Clock,
  Users,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Timer,
  Thermometer,
  Camera,
  FileText,
  LinkIcon,
  Play,
  ChefHat,
  Utensils,
  ClipboardList,
  Cog,
  BookOpen,
}
