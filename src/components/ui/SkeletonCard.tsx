interface SkeletonCardProps {
  rows?: number
  height?: number
}

export default function SkeletonCard({ rows = 3, height = 16 }: SkeletonCardProps) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="skeleton" style={{ height: 20, width: '40%' }} />
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{
            height,
            width: i === rows - 1 ? '60%' : '100%',
          }}
        />
      ))}
    </div>
  )
}

export function SkeletonRow({ cols = 4 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} style={{ padding: '12px 16px' }}>
          <div className="skeleton" style={{ height: 14, width: i === 0 ? 80 : '80%' }} />
        </td>
      ))}
    </tr>
  )
}

export function SkeletonText({ lines = 3, width = '100%' }: { lines?: number; width?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{ height: 14, width: i === lines - 1 ? '65%' : width }}
        />
      ))}
    </div>
  )
}
