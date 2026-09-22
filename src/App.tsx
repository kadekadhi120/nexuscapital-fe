import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import ReportGeneratingPage from './pages/ReportGeneratingPage'
import ReportViewerPage from './pages/ReportViewerPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AppShell from './components/layout/AppShell'

// ── App router ─────────────────────────────────────────────
// Routes:
//   /                         → Landing page (public)
//   /dashboard                → B2C Dashboard (retail shell)
//   /reports                  → Report list stub → redirect to dashboard
//   /reports/generating/:ticker → Multi-agent loading page
//   /reports/:id              → Report viewer
//   /admin                    → Admin dashboard (admin shell)
//   /admin/*                  → Admin sub-pages (same component, tab-driven)
//   *                         → Redirect to /

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public landing ───────────────────────────── */}
        <Route path="/" element={<LandingPage />} />

        {/* ── B2C shell (retail) ───────────────────────── */}
        <Route
          path="/"
          element={
            <AppShell role="retail" credits={15} userName="Budi Santoso" />
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="reports" element={<Navigate to="/dashboard" replace />} />
          <Route path="reports/generating/:ticker" element={<ReportGeneratingPage />} />
          <Route path="reports/:id" element={<ReportViewerPage />} />
          <Route path="alerts" element={<DashboardPage />} />
          <Route path="api-keys" element={<DashboardPage />} />
          <Route path="webhooks" element={<DashboardPage />} />
        </Route>

        {/* ── Admin shell ──────────────────────────────── */}
        <Route
          path="/admin"
          element={
            <AppShell role="admin" userName="Admin Nexus" />
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="queue"   element={<AdminDashboardPage />} />
          <Route path="cost"    element={<AdminDashboardPage />} />
          <Route path="users"   element={<AdminDashboardPage />} />
          <Route path="b2b"     element={<AdminDashboardPage />} />
        </Route>

        {/* ── Catch-all ────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
