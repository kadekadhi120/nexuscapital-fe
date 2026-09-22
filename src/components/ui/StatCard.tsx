import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  change?: number
  unit?: string
  icon?: React.ReactNode
  accent?: boolean
}

export default function StatCard({ label, value, change, unit, icon, accent }: StatCardProps) {
  const isPositive = change !== undefined && change >= 0

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        transition: 'border-color 0.15s',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-surface-400)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-surface-500)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 500,
            color: 'var(--color-surface-300)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          {label}
        </span>
        {icon && (
          <span style={{ color: accent ? 'var(--color-accent-400)' : 'var(--color-surface-400)' }}>
            {icon}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span
          style={{
            fontSize: '1.6rem',
            fontWeight: 700,
            color: 'var(--color-surface-50)',
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}
        >
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: '0.8rem', color: 'var(--color-surface-300)', fontWeight: 400 }}>
            {unit}
          </span>
        )}
      </div>

      {change !== undefined && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: isPositive ? 'var(--color-bull-500)' : 'var(--color-bear-500)',
            fontSize: '0.78rem',
            fontWeight: 500,
          }}
        >
          {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          <span>{isPositive ? '+' : ''}{change.toFixed(1)}% vs yesterday</span>
        </div>
      )}
    </div>
  )
}
