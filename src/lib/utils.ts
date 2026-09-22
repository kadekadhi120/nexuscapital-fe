import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(n: number, decimals = 2): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toFixed(decimals)
}

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n)
}

export function formatPercent(n: number): string {
  return `${n > 0 ? '+' : ''}${n.toFixed(2)}%`
}

export function getNexusLabel(score: number): {
  label: string
  colorClass: string
  ringColor: string
} {
  if (score >= 80) return { label: 'Strong Bull', colorClass: 'score-strong-bull', ringColor: '#22c55e' }
  if (score >= 65) return { label: 'Bull',        colorClass: 'score-bull',        ringColor: '#4ade80' }
  if (score >= 45) return { label: 'Neutral',     colorClass: 'score-neutral',     ringColor: '#f59e0b' }
  if (score >= 30) return { label: 'Bear',        colorClass: 'score-bear',        ringColor: '#f87171' }
  return               { label: 'Strong Bear', colorClass: 'score-strong-bear', ringColor: '#ef4444' }
}
