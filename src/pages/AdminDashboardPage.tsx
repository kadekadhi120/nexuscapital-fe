import { useState } from 'react'
import type React from 'react'
import {
  BarChart3, Users, Zap, Activity, AlertTriangle,
  RefreshCw, Ban, CheckCircle2, XCircle,
  Power, ShieldAlert, Clock,
  Eye, MoreHorizontal, Building2, RotateCcw,
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import {
  TOKEN_USAGE, QUEUE_JOBS, ADMIN_STATS,
  B2B_PENDING, CREDIT_TRANSACTIONS,
} from '../lib/mockData'
import StatusBadge from '../components/ui/StatusBadge'
import StatCard from '../components/ui/StatCard'

// ── Kill Switch confirmation modal ────────────────────────
function KillSwitchModal({
  active,
  onConfirm,
  onClose,
}: {
  active: boolean
  onConfirm: () => void
  onClose: () => void
}) {
  const [confirmed, setConfirmed] = useState(false)
  const [inputVal, setInputVal] = useState('')
  const CONFIRM_PHRASE = 'DISABLE AUTOMATION'

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="fade-up"
        style={{
          background: 'var(--color-surface-700)',
          border: '2px solid var(--color-bear-500)',
          borderRadius: 14, padding: 28, width: '100%', maxWidth: 440,
          boxShadow: '0 0 48px rgba(239,68,68,0.2)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{
            width: 42, height: 42, borderRadius: '50%',
            background: 'var(--color-bear-100)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Power size={20} color="var(--color-bear-500)" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--color-bear-400)' }}>
              {active ? 'Disable Automation Kill Switch' : 'Activate Automation Kill Switch'}
            </h3>
            <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: 'var(--color-surface-400)' }}>
              {active ? 'Re-enable event-triggered micro-reports' : 'Emergency stop — halts all micro-report automation'}
            </p>
          </div>
        </div>

        {/* Warning box */}
        {!active && (
          <div style={{
            padding: '12px 14px', borderRadius: 8, marginBottom: 20,
            background: 'var(--color-bear-100)',
            border: '1px solid rgba(239,68,68,0.3)',
            fontSize: '0.82rem', color: 'var(--color-surface-200)', lineHeight: 1.6,
          }}>
            <strong style={{ color: 'var(--color-bear-400)' }}>This will immediately:</strong>
            <ul style={{ margin: '6px 0 0', paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li>Halt all pending micro-report cron jobs</li>
              <li>Prevent new alert-triggered reports from firing</li>
              <li>NOT affect in-progress manual reports</li>
              <li>Persist until manually re-enabled by an admin</li>
            </ul>
          </div>
        )}

        {/* Double confirmation input */}
        {!active && (
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: 'var(--color-surface-300)', marginBottom: 6 }}>
              Type <code style={{ background: 'var(--color-surface-600)', padding: '1px 6px', borderRadius: 3, color: 'var(--color-bear-400)', fontFamily: 'var(--font-mono)' }}>{CONFIRM_PHRASE}</code> to confirm
            </label>
            <input
              className="input-base"
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value)
                setConfirmed(e.target.value === CONFIRM_PHRASE)
              }}
              placeholder={CONFIRM_PHRASE}
              style={{ borderColor: confirmed ? 'var(--color-bull-500)' : undefined }}
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-danger kill-switch"
            style={{
              flex: 2, justifyContent: 'center',
              opacity: !active && !confirmed ? 0.4 : 1,
              cursor: !active && !confirmed ? 'not-allowed' : 'pointer',
            }}
            disabled={!active && !confirmed}
            onClick={onConfirm}
          >
            <Power size={15} />
            {active ? 'Re-enable Automation' : 'Activate Kill Switch'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── B2B Approval modal ────────────────────────────────────
function ApprovalModal({
  company,
  onApprove,
  onReject,
  onClose,
}: {
  company: typeof B2B_PENDING[0]
  onApprove: () => void
  onReject: () => void
  onClose: () => void
}) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="fade-up"
        style={{
          background: 'var(--color-surface-700)',
          border: '1px solid var(--color-surface-500)',
          borderRadius: 14, padding: 28, width: '100%', maxWidth: 440,
          boxShadow: 'var(--shadow-panel)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--color-accent-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={20} color="var(--color-accent-400)" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-surface-50)' }}>{company.company}</h3>
            <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--color-surface-400)' }}>{company.email}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'Plan', value: company.plan },
            { label: 'Submitted', value: company.submitted },
            { label: 'Status', value: 'Pending Review' },
            { label: 'API Access', value: 'Restricted' },
          ].map((item) => (
            <div key={item.label} style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--color-surface-800)', border: '1px solid var(--color-surface-600)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--color-surface-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-surface-100)' }}>{item.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="btn btn-danger"
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={onReject}
          >
            <XCircle size={14} /> Reject
          </button>
          <button
            className="btn btn-primary"
            style={{ flex: 2, justifyContent: 'center' }}
            onClick={onApprove}
          >
            <CheckCircle2 size={14} /> Approve & Issue API Key
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Custom chart tooltip ───────────────────────────────────
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--color-surface-700)',
      border: '1px solid var(--color-surface-500)',
      borderRadius: 8, padding: '10px 14px',
      fontSize: '0.8rem', color: 'var(--color-surface-100)',
    }}>
      <p style={{ margin: '0 0 6px', color: 'var(--color-surface-300)', fontWeight: 500 }}>{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
          <span style={{ color: 'var(--color-surface-300)' }}>{p.name}:</span>
          <span style={{ fontWeight: 600 }}>
            {p.name === 'cost' ? `$${p.value.toFixed(2)}` : `${(p.value / 1000).toFixed(0)}K`}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [killSwitchActive, setKillSwitchActive] = useState(false)
  const [killModalOpen, setKillModalOpen] = useState(false)
  const [approvalTarget, setApprovalTarget] = useState<typeof B2B_PENDING[0] | null>(null)
  const [b2bList, setB2bList] = useState(B2B_PENDING)
  const [queueJobs, setQueueJobs] = useState(QUEUE_JOBS)
  const [activeTab, setActiveTab] = useState<'overview' | 'queue' | 'b2b' | 'billing'>('overview')
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'danger' } | null>(null)

  function showToast(msg: string, type: 'success' | 'danger' = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3200)
  }

  function handleKillConfirm() {
    setKillSwitchActive((v) => !v)
    setKillModalOpen(false)
    showToast(
      killSwitchActive ? 'Automation re-enabled.' : 'Kill switch activated — automation halted.',
      killSwitchActive ? 'success' : 'danger',
    )
  }

  function handleApprove() {
    if (!approvalTarget) return
    setB2bList((l) => l.filter((b) => b.id !== approvalTarget.id))
    showToast(`${approvalTarget.company} approved. API key issued.`)
    setApprovalTarget(null)
  }

  function handleReject() {
    if (!approvalTarget) return
    setB2bList((l) => l.filter((b) => b.id !== approvalTarget.id))
    showToast(`${approvalTarget.company} rejected.`, 'danger')
    setApprovalTarget(null)
  }

  function retryJob(jobId: string) {
    setQueueJobs((jobs) =>
      jobs.map((j) => j.id === jobId ? { ...j, status: 'queued' } : j)
    )
    showToast(`Job ${jobId} re-queued for processing.`)
  }

  const tabs: { key: 'overview' | 'queue' | 'b2b' | 'billing'; label: string; icon: React.ReactNode; badge?: number }[] = [
    { key: 'overview', label: 'Overview', icon: <BarChart3 size={14} /> },
    { key: 'queue',    label: 'Queue Monitor', icon: <Activity size={14} /> },
    { key: 'b2b',     label: `B2B Approvals`, icon: <Building2 size={14} />, badge: b2bList.length },
    { key: 'billing', label: 'Credit Log', icon: <Users size={14} /> },
  ] as const

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1280 }}>

      {/* ── Toast notification ───────────────────────────── */}
      {toast && (
        <div
          className="fade-up"
          style={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 200,
            padding: '12px 20px', borderRadius: 10,
            background: toast.type === 'success' ? 'var(--color-surface-700)' : 'var(--color-bear-100)',
            border: `1px solid ${toast.type === 'success' ? 'var(--color-bull-500)' : 'var(--color-bear-500)'}`,
            color: toast.type === 'success' ? 'var(--color-bull-400)' : 'var(--color-bear-400)',
            fontWeight: 600, fontSize: '0.85rem',
            display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: 'var(--shadow-panel)',
            maxWidth: 360,
          }}
        >
          {toast.type === 'success'
            ? <CheckCircle2 size={16} />
            : <AlertTriangle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* ── Page header ─────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-surface-50)', letterSpacing: '-0.01em' }}>
            Admin Back-Office
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--color-surface-400)' }}>
            System health · Cost monitoring · Operations control · Tue 22 Sep 2026
          </p>
        </div>

        {/* ── KILL SWITCH ── high-visibility, always present */}
        <button
          className={killSwitchActive ? 'btn btn-secondary' : 'kill-switch btn'}
          style={{
            padding: '10px 20px', fontSize: '0.875rem', borderRadius: 8,
            display: 'flex', alignItems: 'center', gap: 8,
            minWidth: 220, justifyContent: 'center',
          }}
          onClick={() => setKillModalOpen(true)}
        >
          <Power size={16} />
          {killSwitchActive ? (
            <span>Automation: <strong style={{ color: 'var(--color-bear-400)' }}>HALTED</strong></span>
          ) : (
            <span>Kill Switch — Automation: <strong>LIVE</strong></span>
          )}
        </button>
      </div>

      {/* Kill switch status banner */}
      {killSwitchActive && (
        <div
          className="fade-up"
          style={{
            padding: '12px 16px', borderRadius: 10,
            background: 'var(--color-bear-100)',
            border: '1px solid rgba(239,68,68,0.4)',
            display: 'flex', alignItems: 'center', gap: 12,
            fontSize: '0.85rem', color: 'var(--color-surface-100)',
          }}
        >
          <Power size={16} color="var(--color-bear-500)" style={{ flexShrink: 0 }} />
          <span>
            <strong style={{ color: 'var(--color-bear-400)' }}>Automation Kill Switch is ACTIVE.</strong>
            {' '}All event-triggered micro-reports are halted. Manual on-demand reports are unaffected.
          </span>
          <button
            className="btn btn-secondary"
            style={{ marginLeft: 'auto', flexShrink: 0, fontSize: '0.78rem', padding: '5px 12px' }}
            onClick={() => setKillModalOpen(true)}
          >
            Re-enable
          </button>
        </div>
      )}

      {/* ── Stats row ────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
        <StatCard
          label="Reports Today"
          value={ADMIN_STATS.reportsToday}
          change={ADMIN_STATS.reportsChange}
          icon={<BarChart3 size={16} />}
        />
        <StatCard
          label="LLM Cost Today"
          value={`$${ADMIN_STATS.tokenCostToday.toFixed(2)}`}
          change={ADMIN_STATS.tokenCostChange}
          icon={<Zap size={16} />}
        />
        <StatCard
          label="Active Users"
          value={ADMIN_STATS.activeUsers}
          change={ADMIN_STATS.activeUsersChange}
          icon={<Users size={16} />}
          accent
        />
        <StatCard
          label="Pending B2B"
          value={ADMIN_STATS.pendingB2B}
          icon={<ShieldAlert size={16} />}
        />
      </div>

      {/* ── Tabs ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 2, background: 'var(--color-surface-800)', borderRadius: 10, padding: 4, border: '1px solid var(--color-surface-500)', alignSelf: 'flex-start', flexWrap: 'wrap' }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 7, border: 'none', cursor: 'pointer',
              fontSize: '0.82rem', fontWeight: 500,
              background: activeTab === tab.key ? 'var(--color-surface-600)' : 'transparent',
              color: activeTab === tab.key ? 'var(--color-surface-100)' : 'var(--color-surface-400)',
              transition: 'all 0.15s', position: 'relative',
            }}
          >
            {tab.icon} {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span style={{
                fontSize: '0.62rem', fontWeight: 700,
                background: 'var(--color-accent-500)', color: '#fff',
                borderRadius: 999, padding: '0px 5px', minWidth: 16, textAlign: 'center',
              }}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════ */}
      {/* OVERVIEW TAB                                       */}
      {/* ══════════════════════════════════════════════════ */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-up">

          {/* LLM Token cost chart */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-surface-100)' }}>
                  LLM Token Consumption — Last 7 Days
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: 'var(--color-surface-400)' }}>
                  Daily token count & estimated OpenAI cost (USD)
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-surface-50)', letterSpacing: '-0.02em' }}>
                  ${TOKEN_USAGE.reduce((s, d) => s + d.cost, 0).toFixed(2)}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-surface-400)' }}>Total 7-day cost</div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={TOKEN_USAGE} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-surface-600)" />
                <XAxis dataKey="date" tick={{ fill: 'var(--color-surface-400)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fill: 'var(--color-surface-400)', fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: 'var(--color-surface-400)', fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `$${v}`} />
                <Tooltip content={<ChartTooltip />} />
                <Bar yAxisId="left" dataKey="tokens" name="tokens" fill="#3b82f640" stroke="#3b82f6" strokeWidth={1} radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="cost" name="cost" fill="#f59e0b30" stroke="#f59e0b" strokeWidth={1} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
              {[{ l: 'Token Count', c: '#3b82f6' }, { l: 'USD Cost', c: '#f59e0b' }].map((l) => (
                <div key={l.l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--color-surface-300)' }}>
                  <div style={{ width: 12, height: 3, borderRadius: 2, background: l.c }} />
                  {l.l}
                </div>
              ))}
            </div>
          </div>

          {/* Reports generated trend */}
          <div className="card">
            <h3 style={{ margin: '0 0 16px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-surface-100)' }}>
              Reports Generated — Cumulative (7 Days)
            </h3>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart
                data={[
                  { date: 'Mon', reports: 18 }, { date: 'Tue', reports: 31 },
                  { date: 'Wed', reports: 27 }, { date: 'Thu', reports: 44 },
                  { date: 'Fri', reports: 38 }, { date: 'Sat', reports: 20 },
                  { date: 'Sun', reports: 15 },
                ]}
                margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="rg-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-surface-600)" />
                <XAxis dataKey="date" tick={{ fill: 'var(--color-surface-400)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--color-surface-400)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--color-surface-700)', border: '1px solid var(--color-surface-500)', borderRadius: 8, fontSize: '0.8rem' }} />
                <Area type="monotone" dataKey="reports" stroke="#22c55e" strokeWidth={2} fill="url(#rg-fill)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* System health row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
            {[
              { label: 'API Gateway', status: 'Operational', color: 'var(--color-bull-500)', icon: <CheckCircle2 size={14} /> },
              { label: 'Redis Queue', status: 'Operational', color: 'var(--color-bull-500)', icon: <CheckCircle2 size={14} /> },
              { label: 'OpenAI API', status: 'Operational', color: 'var(--color-bull-500)', icon: <CheckCircle2 size={14} /> },
              { label: 'Sectors API', status: '245ms latency', color: 'var(--color-warning-500)', icon: <AlertTriangle size={14} /> },
            ].map((s) => (
              <div
                key={s.label}
                className="card-sm"
                style={{ display: 'flex', alignItems: 'center', gap: 10 }}
              >
                <span style={{ color: s.color }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-surface-100)' }}>{s.label}</div>
                  <div style={{ fontSize: '0.72rem', color: s.color, fontWeight: 500 }}>{s.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════ */}
      {/* QUEUE MONITOR TAB                                  */}
      {/* ══════════════════════════════════════════════════ */}
      {activeTab === 'queue' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-up">

          {/* Queue stats mini row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
            {[
              { label: 'Processing', count: queueJobs.filter(j => j.status === 'processing').length, color: 'var(--color-accent-400)' },
              { label: 'Queued', count: queueJobs.filter(j => j.status === 'queued').length, color: 'var(--color-warning-500)' },
              { label: 'Completed', count: queueJobs.filter(j => j.status === 'completed').length, color: 'var(--color-bull-500)' },
              { label: 'Failed', count: queueJobs.filter(j => j.status === 'failed').length, color: 'var(--color-bear-500)' },
            ].map((s) => (
              <div key={s.label} className="card-sm">
                <div style={{ fontSize: '0.68rem', color: 'var(--color-surface-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: s.color }}>{s.count}</div>
              </div>
            ))}
          </div>

          {/* Queue table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-surface-500)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Activity size={14} color="var(--color-accent-400)" />
                <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-surface-100)' }}>
                  Active Job Queue
                </span>
              </div>
              <button
                className="btn btn-ghost"
                style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                onClick={() => window.location.reload()}
              >
                <RefreshCw size={12} /> Refresh
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Job ID</th>
                    <th>Ticker</th>
                    <th>User</th>
                    <th>Status</th>
                    <th>Duration</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {queueJobs.map((job) => (
                    <tr key={job.id}>
                      <td>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--color-surface-300)' }}>
                          {job.id}
                        </span>
                      </td>
                      <td><span className="ticker-badge">{job.ticker}</span></td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--color-surface-300)' }}>{job.user}</td>
                      <td><StatusBadge status={job.status as any} dot /></td>
                      <td>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.82rem', color: 'var(--color-surface-300)' }}>
                          <Clock size={11} /> {job.duration}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--color-surface-300)', fontFamily: 'var(--font-mono)' }}>
                        {job.created}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {job.status === 'failed' && (
                            <button
                              className="btn btn-secondary"
                              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                              onClick={() => retryJob(job.id)}
                            >
                              <RotateCcw size={11} /> Retry
                            </button>
                          )}
                          {job.status === 'processing' && (
                            <button
                              className="btn btn-ghost"
                              style={{ padding: '4px 10px', fontSize: '0.75rem', color: 'var(--color-bear-400)' }}
                            >
                              <Ban size={11} /> Kill
                            </button>
                          )}
                          <button className="btn btn-ghost" style={{ padding: '4px 8px' }}>
                            <Eye size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════ */}
      {/* B2B APPROVALS TAB                                  */}
      {/* ══════════════════════════════════════════════════ */}
      {activeTab === 'b2b' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-up">
          {b2bList.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
              <CheckCircle2 size={40} color="var(--color-bull-500)" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ margin: '0 0 8px', color: 'var(--color-surface-100)' }}>All caught up!</h3>
              <p style={{ margin: 0, color: 'var(--color-surface-400)', fontSize: '0.875rem' }}>
                No pending B2B approval requests.
              </p>
            </div>
          ) : (
            b2bList.map((company) => (
              <div
                key={company.id}
                className="card"
                style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}
              >
                <div
                  style={{
                    width: 44, height: 44, borderRadius: 10,
                    background: 'var(--color-accent-100)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}
                >
                  <Building2 size={22} color="var(--color-accent-400)" />
                </div>

                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-surface-100)' }}>
                      {company.company}
                    </span>
                    <span style={{
                      fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.06em',
                      padding: '2px 7px', borderRadius: 999,
                      background: 'var(--color-accent-100)', color: 'var(--color-accent-400)',
                    }}>
                      {company.plan.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-surface-400)', marginTop: 3, display: 'flex', gap: 12 }}>
                    <span>{company.email}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Clock size={10} /> Submitted {company.submitted}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="btn btn-ghost"
                    style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                    onClick={() => setApprovalTarget(company)}
                  >
                    <Eye size={13} /> Review
                  </button>
                  <button
                    className="btn btn-danger"
                    style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                    onClick={() => {
                      setApprovalTarget(company)
                    }}
                  >
                    <XCircle size={13} /> Reject
                  </button>
                  <button
                    className="btn btn-primary"
                    style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                    onClick={() => setApprovalTarget(company)}
                  >
                    <CheckCircle2 size={13} /> Approve
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════ */}
      {/* CREDIT LOG TAB                                     */}
      {/* ══════════════════════════════════════════════════ */}
      {activeTab === 'billing' && (
        <div className="fade-up">
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-surface-500)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Users size={14} color="var(--color-accent-400)" />
                <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-surface-100)' }}>Credit Transaction Log</span>
              </div>
              <button className="btn btn-secondary" style={{ fontSize: '0.78rem', padding: '5px 12px' }}>
                Export CSV
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Action</th>
                    <th>Credits</th>
                    <th>Balance</th>
                    <th>Date</th>
                    <th>Admin Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {CREDIT_TRANSACTIONS.map((tx) => (
                    <tr key={tx.id}>
                      <td>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--color-surface-300)' }}>
                          {tx.user}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--color-surface-300)' }}>{tx.email}</td>
                      <td style={{ fontSize: '0.82rem' }}>{tx.action}</td>
                      <td>
                        <span style={{
                          fontWeight: 700, fontSize: '0.85rem',
                          color: tx.credits > 0 ? 'var(--color-bull-500)' : tx.credits < 0 ? 'var(--color-bear-500)' : 'var(--color-surface-400)',
                        }}>
                          {tx.credits > 0 ? `+${tx.credits}` : tx.credits === 0 ? '—' : tx.credits}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--color-surface-100)' }}>{tx.balance}</td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--color-surface-400)', fontFamily: 'var(--font-mono)' }}>{tx.date}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-ghost" style={{ padding: '3px 8px', fontSize: '0.72rem' }}>
                            Top-up
                          </button>
                          <button
                            className="btn btn-ghost"
                            style={{ padding: '3px 8px', fontSize: '0.72rem', color: 'var(--color-bear-400)' }}
                          >
                            <Ban size={11} />
                          </button>
                          <button className="btn btn-ghost" style={{ padding: '3px 6px' }}>
                            <MoreHorizontal size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {killModalOpen && (
        <KillSwitchModal
          active={killSwitchActive}
          onConfirm={handleKillConfirm}
          onClose={() => setKillModalOpen(false)}
        />
      )}
      {approvalTarget && (
        <ApprovalModal
          company={approvalTarget}
          onApprove={handleApprove}
          onReject={handleReject}
          onClose={() => setApprovalTarget(null)}
        />
      )}
    </div>
  )
}
