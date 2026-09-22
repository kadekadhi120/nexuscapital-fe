import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  Bell,
  Key,
  ShieldAlert,
  Users,
  BarChart3,
  Layers,
  ChevronRight,
  Zap,
} from 'lucide-react'
import { cn } from '../../lib/utils'

interface NavItem {
  label: string
  icon: React.ReactNode
  to: string
  badge?: string | number
}

interface NavSection {
  title?: string
  items: NavItem[]
}

const B2C_NAV: NavSection[] = [
  {
    items: [
      { label: 'Dashboard', icon: <LayoutDashboard size={16} />, to: '/dashboard' },
      { label: 'My Reports', icon: <FileText size={16} />, to: '/reports' },
      { label: 'Alerts', icon: <Bell size={16} />, to: '/alerts', badge: 2 },
    ],
  },
]

const B2B_NAV: NavSection[] = [
  {
    title: 'API & Integrations',
    items: [
      { label: 'API Keys', icon: <Key size={16} />, to: '/api-keys' },
      { label: 'Webhooks', icon: <Zap size={16} />, to: '/webhooks' },
    ],
  },
]

const ADMIN_NAV: NavSection[] = [
  {
    title: 'Operations',
    items: [
      { label: 'Overview', icon: <BarChart3 size={16} />, to: '/admin' },
      { label: 'Queue Monitor', icon: <Layers size={16} />, to: '/admin/queue' },
      { label: 'Cost Monitor', icon: <BarChart3 size={16} />, to: '/admin/cost' },
    ],
  },
  {
    title: 'Management',
    items: [
      { label: 'Users & Billing', icon: <Users size={16} />, to: '/admin/users' },
      { label: 'B2B Approvals', icon: <ShieldAlert size={16} />, to: '/admin/b2b', badge: 3 },
    ],
  },
]

interface SidebarProps {
  role?: 'retail' | 'b2b_client' | 'admin'
  collapsed?: boolean
  onToggle?: () => void
}

export default function Sidebar({ role = 'retail', collapsed = false, onToggle }: SidebarProps) {
  const location = useLocation()

  const sections =
    role === 'admin'
      ? ADMIN_NAV
      : role === 'b2b_client'
      ? [...B2C_NAV, ...B2B_NAV]
      : B2C_NAV

  return (
    <aside
      style={{
        width: collapsed ? 56 : 220,
        minHeight: '100vh',
        backgroundColor: 'var(--color-surface-800)',
        borderRight: '1px solid var(--color-surface-500)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '20px 16px 16px',
          borderBottom: '1px solid var(--color-surface-500)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          minHeight: 60,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: 'var(--color-accent-500)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 12L6 7L9 10L13 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {!collapsed && (
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-surface-50)', letterSpacing: '-0.01em' }}>
            NexusCapital
          </span>
        )}
      </div>

      {/* Nav sections */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {sections.map((section, si) => (
          <div key={si}>
            {section.title && !collapsed && (
              <p
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-surface-400)',
                  padding: '0 8px',
                  marginBottom: 6,
                }}
              >
                {section.title}
              </p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {section.items.map((item) => {
                const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/')
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={cn('nav-item', isActive && 'active')}
                    style={collapsed ? { justifyContent: 'center', padding: '8px' } : {}}
                    title={collapsed ? item.label : undefined}
                  >
                    <span style={{ flexShrink: 0 }}>{item.icon}</span>
                    {!collapsed && (
                      <>
                        <span style={{ flex: 1 }}>{item.label}</span>
                        {item.badge !== undefined && (
                          <span
                            style={{
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              background: 'var(--color-accent-500)',
                              color: '#fff',
                              borderRadius: 999,
                              padding: '1px 6px',
                              minWidth: 18,
                              textAlign: 'center',
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        style={{
          margin: '8px',
          padding: '8px',
          borderRadius: 8,
          background: 'transparent',
          border: '1px solid var(--color-surface-500)',
          color: 'var(--color-surface-300)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.15s, color 0.15s',
        }}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <ChevronRight
          size={14}
          style={{
            transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)',
            transition: 'transform 0.2s',
          }}
        />
      </button>
    </aside>
  )
}
