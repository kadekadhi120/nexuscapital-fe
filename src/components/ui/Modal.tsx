import { useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  maxWidth?: number
}

export default function Modal({ open, onClose, title, children, maxWidth = 480 }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(0,0,0,0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backdropFilter: 'blur(3px)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="fade-up"
        style={{
          background: 'var(--color-surface-700)',
          border: '1px solid var(--color-surface-500)',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth,
          boxShadow: 'var(--shadow-panel)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--color-surface-500)',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-surface-50)' }}>
            {title}
          </h3>
          <button className="btn btn-ghost" style={{ padding: '4px 6px' }} onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        {/* Body */}
        <div style={{ padding: '20px' }}>{children}</div>
      </div>
    </div>
  )
}
