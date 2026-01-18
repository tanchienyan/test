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
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-amber-50 text-amber-700',
    error: 'bg-red-50 text-red-700',
    info: 'bg-blue-50 text-blue-700',
    outline: 'bg-transparent border border-gray-300 text-gray-600',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        variants[variant],
        sizes[size],
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
}

export function Card({ children, className, padding = 'md' }: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  }

  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200 shadow-sm',
        paddings[padding],
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mb-4', className)}>{children}</div>
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn('text-lg font-semibold text-gray-900', className)}>{children}</h3>
}

export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('text-sm text-gray-500 mt-1', className)}>{children}</p>
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}

// ===== BUTTON =====
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    ghost: 'text-gray-600 hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }

  const sizes = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2.5 text-base',
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
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
  size?: 'sm' | 'md'
  color?: 'indigo' | 'green' | 'amber' | 'red'
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  size = 'md',
  color = 'indigo',
}: ProgressBarProps) {
  const percentage = Math.round((value / max) * 100)
  
  const colors = {
    indigo: 'bg-indigo-600',
    green: 'bg-green-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
  }

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
  }

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between mb-1">
          {label && <span className="text-sm text-gray-600">{label}</span>}
          {showPercentage && <span className="text-sm font-medium text-gray-700">{percentage}%</span>}
        </div>
      )}
      <div className={cn('w-full bg-gray-200 rounded-full', heights[size])}>
        <div
          className={cn('rounded-full transition-all duration-300', colors[color], heights[size])}
          style={{ width: `${percentage}%` }}
        />
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
}

export function Collapsible({ title, children, defaultOpen = false, className }: CollapsibleProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <div className={cn('border border-gray-200 rounded-lg', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900">{title}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>
      {isOpen && <div className="px-4 pb-4 border-t border-gray-100">{children}</div>}
    </div>
  )
}

// ===== TABS =====
export interface TabsProps {
  tabs: { id: string; label: string; icon?: LucideIcon }[]
  activeTab: string
  onChange: (id: string) => void
  className?: string
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn('border-b border-gray-200', className)}>
      <nav className="flex space-x-4 -mb-px" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                'flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium transition-colors',
                isActive
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {tab.label}
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
}

export function Alert({ variant = 'info', title, children, className }: AlertProps) {
  const variants = {
    info: { bg: 'bg-blue-50', border: 'border-blue-200', icon: Info, iconColor: 'text-blue-500' },
    success: { bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle2, iconColor: 'text-green-500' },
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', icon: AlertTriangle, iconColor: 'text-amber-500' },
    error: { bg: 'bg-red-50', border: 'border-red-200', icon: XCircle, iconColor: 'text-red-500' },
  }

  const { bg, border, icon: Icon, iconColor } = variants[variant]

  return (
    <div className={cn('rounded-lg border p-4', bg, border, className)}>
      <div className="flex gap-3">
        <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', iconColor)} />
        <div>
          {title && <p className="font-medium text-gray-900 mb-1">{title}</p>}
          <div className="text-sm text-gray-700">{children}</div>
        </div>
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
}

export function MetadataItem({ icon: Icon, label, value, className }: MetadataItemProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Icon className="h-4 w-4 text-gray-400" />
      <span className="text-sm text-gray-500">{label}:</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  )
}

export function MetadataRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-wrap items-center gap-x-6 gap-y-2', className)}>
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
}

export function Table({ headers, rows, caption, className }: TableProps) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="min-w-full divide-y divide-gray-200">
        {caption && (
          <caption className="text-sm text-gray-500 text-left mb-2">{caption}</caption>
        )}
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, i) => (
              <th
                key={i}
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
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

  const statusStyles = {
    pending: 'bg-gray-100 text-gray-600 border-gray-200',
    active: 'bg-indigo-100 text-indigo-700 border-indigo-300',
    complete: 'bg-green-100 text-green-700 border-green-300',
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full border-2 font-semibold',
        sizes[size],
        statusStyles[status]
      )}
    >
      {status === 'complete' ? <CheckCircle2 className="h-4 w-4" /> : step}
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
    <div className="text-center py-12">
      <Icon className="mx-auto h-12 w-12 text-gray-300" />
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      {description && <p className="mt-2 text-sm text-gray-500">{description}</p>}
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
