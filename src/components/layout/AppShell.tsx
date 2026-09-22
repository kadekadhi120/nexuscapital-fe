import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

interface AppShellProps {
  role?: 'retail' | 'b2b_client' | 'admin'
  credits?: number
  userName?: string
}

export default function AppShell({ role = 'retail', credits = 15, userName = 'Budi Santoso' }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-surface-900)' }}>
      {/* Sidebar — hidden below md on mobile via inline responsive logic */}
      <div
        className="sidebar-wrapper"
        style={{
          display: 'flex',
          flexShrink: 0,
        }}
      >
        <Sidebar role={role} collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar credits={credits} userName={userName} role={role} />
        <main
          style={{
            flex: 1,
            padding: '24px',
            overflowY: 'auto',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
