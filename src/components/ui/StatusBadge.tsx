type Status = 'queued' | 'processing' | 'completed' | 'failed' | 'active' | 'inactive'

const CONFIG: Record<Status, { label: string; className: string }> = {
  queued:     { label: 'Queued',     className: 'badge-queued' },
  processing: { label: 'Processing', className: 'badge-processing' },
  completed:  { label: 'Completed',  className: 'badge-completed' },
  failed:     { label: 'Failed',     className: 'badge-failed' },
  active:     { label: 'Active',     className: 'badge-completed' },
  inactive:   { label: 'Inactive',   className: 'badge-queued' },
}

interface StatusBadgeProps {
  status: Status
  dot?: boolean
}

export default function StatusBadge({ status, dot = false }: StatusBadgeProps) {
  const { label, className } = CONFIG[status] ?? CONFIG.queued

  return (
    <span className={`status-badge ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'currentColor',
            flexShrink: 0,
          }}
        />
      )}
      {label}
    </span>
  )
}
