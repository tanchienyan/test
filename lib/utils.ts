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
  if (score >= 0.8) return 'text-green-600 bg-green-50'
  if (score >= 0.6) return 'text-amber-600 bg-amber-50'
  return 'text-red-600 bg-red-50'
}

export function getConfidenceLabel(score: number): string {
  if (score >= 0.8) return 'High'
  if (score >= 0.6) return 'Medium'
  return 'Low'
}

export function getDocTypeColor(type: string): { bg: string; text: string; border: string } {
  switch (type) {
    case 'Recipe':
      return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' }
    case 'SOP':
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' }
    case 'Checklist':
      return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' }
    case 'Equipment':
      return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' }
    case 'Guide':
      return { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' }
    default:
      return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' }
  }
}
