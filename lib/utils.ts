// lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(minutes: number | null | undefined): string {
  if (minutes == null) return '—'
  if (minutes < 60) return `${minutes} mins`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

export function formatSeconds(seconds: number | null | undefined): string {
  if (seconds == null) return '—'
  if (seconds < 60) return `${seconds}s`
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`
}

export function getConfidenceColor(score: number): string {
  if (score >= 0.8) return 'text-green-700 bg-gradient-to-r from-green-50 to-emerald-50 ring-1 ring-green-200'
  if (score >= 0.6) return 'text-amber-700 bg-gradient-to-r from-amber-50 to-orange-50 ring-1 ring-amber-200'
  return 'text-red-700 bg-gradient-to-r from-red-50 to-rose-50 ring-1 ring-red-200'
}

export function getConfidenceLabel(score: number): string {
  if (score >= 0.8) return 'High'
  if (score >= 0.6) return 'Medium'
  return 'Low'
}

export function getDocTypeColor(type: string): { bg: string; text: string; border: string; gradient: string } {
  switch (type) {
    case 'Recipe':
      return {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        border: 'border-orange-200',
        gradient: 'from-orange-400 to-amber-500',
      }
    case 'SOP':
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        gradient: 'from-blue-400 to-indigo-500',
      }
    case 'Checklist':
      return {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200',
        gradient: 'from-green-400 to-emerald-500',
      }
    case 'Equipment':
      return {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-200',
        gradient: 'from-purple-400 to-violet-500',
      }
    case 'Guide':
      return {
        bg: 'bg-cyan-50',
        text: 'text-cyan-700',
        border: 'border-cyan-200',
        gradient: 'from-cyan-400 to-teal-500',
      }
    default:
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-200',
        gradient: 'from-gray-400 to-gray-500',
      }
  }
}
