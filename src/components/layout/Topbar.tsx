import { Bell, CreditCard, LogOut, ChevronDown, Search } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface TopbarProps {
  credits?: number
  userName?: string
  role?: 'retail' | 'b2b_client' | 'admin'
}

export default function Topbar({ credits = 15, userName = 'Budi Santoso', role = 'retail' }: TopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const roleLabel = {
    retail: 'Retail Investor',
    b2b_client: 'B2B Client',
    admin: 'Administrator',
  }[role]

  const roleBadgeStyle = {
    retail:     { background: 'var(--color-surface-600)', color: 'var(--color-surface-200)' },
    b2b_client: { background: 'var(--color-accent-100)',  color: 'var(--color-accent-400)' },
    admin:      { background: 'var(--color-bear-100)',    color: 'var(--color-bear-400)' },
  }[role]

  return (
    <header
      style={{
        height: 56,
        borderBottom: '1px solid var(--color-surface-500)',
        backgroundColor: 'var(--color-surface-800)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: 12,
        position: 'sticky',
        top: 0,
        zIndex: 30,
        flexShrink: 0,
      }}
    >
      {/* Global quick search */}
      <div style={{ flex: 1, maxWidth: 320, position: 'relative' }}>
        <Search
          size={14}
          style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-surface-400)',
          }}
        />
        <input
          className="input-base"
          placeholder="Search ticker, report…"
          style={{ paddingLeft: 34, height: 36, fontSize: '0.8rem' }}
          onFocus={() => navigate('/dashboard')}
          readOnly
        />
      </div>

      <div style={{ flex: 1 }} />

      {/* Credit balance — only for non-admin */}
      {role !== 'admin' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            borderRadius: 8,
            background: 'var(--color-surface-700)',
            border: '1px solid var(--color-surface-500)',
            cursor: 'pointer',
          }}
          title="Report Credits"
        >
          <CreditCard size={14} style={{ color: 'var(--color-accent-400)' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-surface-100)' }}>
            {credits}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-surface-300)' }}>credits</span>
        </div>
      )}

      {/* Notifications */}
      <button
        className="btn btn-ghost"
        style={{ padding: '6px 8px', position: 'relative' }}
        title="Notifications"
      >
        <Bell size={16} />
        <span
          style={{
            position: 'absolute',
            top: 4,
            right: 4,
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: 'var(--color-bear-500)',
            border: '1.5px solid var(--color-surface-800)',
          }}
        />
      </button>

      {/* Profile dropdown */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 10px',
            borderRadius: 8,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-600)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          {/* Avatar */}
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'var(--color-accent-500)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: '#fff',
              flexShrink: 0,
            }}
          >
            {userName.slice(0, 2).toUpperCase()}
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-surface-100)', lineHeight: 1.2 }}>
              {userName.split(' ')[0]}
            </div>
            <div
              style={{
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                padding: '1px 5px',
                borderRadius: 3,
                ...roleBadgeStyle,
              }}
            >
              {roleLabel}
            </div>
          </div>
          <ChevronDown size={12} style={{ color: 'var(--color-surface-300)' }} />
        </button>

        {menuOpen && (
          <div
            className="dropdown"
            style={{ position: 'absolute', right: 0, top: 44, minWidth: 180 }}
            onMouseLeave={() => setMenuOpen(false)}
          >
            <div className="dropdown-item" onClick={() => { setMenuOpen(false); navigate('/dashboard') }}>
              <LayoutDashboardIcon />
              Dashboard
            </div>
            <div
              className="dropdown-item"
              style={{ color: 'var(--color-bear-400)' }}
              onClick={() => { setMenuOpen(false); navigate('/') }}
            >
              <LogOut size={14} />
              Sign out
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

function LayoutDashboardIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}
