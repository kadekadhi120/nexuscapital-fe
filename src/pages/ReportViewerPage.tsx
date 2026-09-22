import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TrendingUp, TrendingDown, Download, Share2, ArrowLeft,
  AlertTriangle, CheckCircle2, BarChart3, Activity,
  BookOpen, ChevronDown, ChevronUp, ExternalLink, Copy, Check,
} from 'lucide-react'
import {
  ComposedChart, Bar, Line, Area, AreaChart,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts'
import { REVENUE_DATA, PRICE_HISTORY } from '../lib/mockData'
import { getNexusLabel } from '../lib/utils'

// ── Mock report data ───────────────────────────────────────
const REPORT = {
  ticker: 'BBCA',
  companyName: 'Bank Central Asia Tbk',
  sector: 'Finance — Banking',
  generatedAt: '22 Sep 2026, 09:14 WIB',
  nexusScore: 82,
  price: 9350,
  priceChange: +1.23,
  marketCap: '1.15T',
  peRatio: 22.4,
  pbRatio: 4.1,
  roe: 24.8,
  debtEquity: 0.12,

  fundamentalSummary: `Bank Central Asia (BBCA) demonstrates exceptional fundamental quality, underpinned by consistently growing net interest income and a remarkably low non-performing loan (NPL) ratio of 1.2% — well below the industry average of 2.8%. Revenue grew 14.3% YoY in FY2025, driven by robust digital banking adoption and an expanding MSME loan book.

Valuation at P/E 22.4x is at a premium to regional banking peers, but justifiable given superior ROE of 24.8% and best-in-class management execution. The bank's CASA ratio of 77% provides a structural funding cost advantage.`,

  technicalSummary: `BBCA is in a confirmed uptrend, trading above its 20-day, 50-day, and 200-day moving averages. The stock recently broke out of a 3-month consolidation range between Rp 8,800–9,200, supported by above-average volume (245M vs 90-day avg of 168M) — a bullish confirmation signal.

Bandarmologi analysis reveals sustained institutional net buy activity for 8 consecutive sessions, with foreign investors accumulating significant positions. Key support at Rp 9,100; resistance target at Rp 9,800–10,000.`,

  executiveSummary: `BBCA presents a high-conviction bull case supported by both fundamental quality and technical momentum. The convergence of strong earnings growth, breakout price action, and institutional accumulation creates a compelling entry for medium-term investors. Primary risk is macro — any BI rate hike cycle could compress NIM and re-rate the sector.`,

  riskWarnings: [
    { level: 'medium', text: 'Bank Indonesia monetary policy shift risk — potential NIM compression if rates rise ≥50bps.' },
    { level: 'low',    text: 'Valuation premium (P/E 22.4x) leaves limited margin of safety in a risk-off market.' },
    { level: 'low',    text: 'Foreign ownership at 42% creates susceptibility to USD/IDR-driven capital outflows.' },
  ],

  peers: [
    { ticker: 'BBCA', score: 82, pe: 22.4, pb: 4.1, roe: 24.8, label: 'Strong Bull', you: true },
    { ticker: 'BMRI', score: 71, pe: 14.2, pb: 2.3, roe: 19.5, label: 'Bull' },
    { ticker: 'BBRI', score: 68, pe: 12.8, pb: 2.0, roe: 18.2, label: 'Bull' },
    { ticker: 'BBNI', score: 55, pe: 9.6,  pb: 1.5, roe: 14.7, label: 'Neutral' },
    { ticker: 'BRIS', score: 48, pe: 18.3, pb: 1.8, roe: 10.1, label: 'Neutral' },
  ],
}

// ── Nexus Score Gauge (SVG half-circle) ───────────────────
function NexusGauge({ score }: { score: number }) {
  const { label, ringColor } = getNexusLabel(score)
  const R = 80
  const cx = 100
  const cy = 100
  const strokeW = 14
  const circ = Math.PI * R
  const fill = (score / 100) * circ

  // Needle angle: 0 = far left (-90deg from positive x), 180 = far right
  const angle = (score / 100) * 180 - 90
  const rad = (angle * Math.PI) / 180
  const needleLen = R - 10
  const nx = cx + needleLen * Math.cos(rad)
  const ny = cy + needleLen * Math.sin(rad)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg width="200" height="112" viewBox="0 0 200 112">
        {/* Background arc */}
        <path
          d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
          fill="none" stroke="var(--color-surface-600)" strokeWidth={strokeW} strokeLinecap="round"
        />
        {/* Score fill arc */}
        <path
          d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
          fill="none"
          stroke={ringColor}
          strokeWidth={strokeW}
          strokeLinecap="round"
          strokeDasharray={`${fill} ${circ}`}
          className="gauge-arc"
        />
        {/* Zone labels */}
        <text x={cx - R - 6} y={cy + 14} textAnchor="end" fontSize="9" fill="var(--color-bear-400)" fontWeight="600">Bear</text>
        <text x={cx} y={cy + 22} textAnchor="middle" fontSize="9" fill="var(--color-warning-500)" fontWeight="600">Neutral</text>
        <text x={cx + R + 6} y={cy + 14} textAnchor="start" fontSize="9" fill="var(--color-bull-400)" fontWeight="600">Bull</text>

        {/* Needle */}
        <line
          x1={cx} y1={cy}
          x2={nx} y2={ny}
          stroke={ringColor}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r="6" fill={ringColor} />
        <circle cx={cx} cy={cy} r="3" fill="var(--color-surface-900)" />

        {/* Score number */}
        <text x={cx} y={cy - 18} textAnchor="middle" fontSize="28" fontWeight="800" fill={ringColor}>
          {score}
        </text>
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="9" fill="var(--color-surface-400)">
          / 100
        </text>
      </svg>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: ringColor }}>{label}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--color-surface-400)', marginTop: 2 }}>
          Nexus Score — Sector Rank #1 of 5
        </div>
      </div>
    </div>
  )
}

// ── Collapsible section wrapper ────────────────────────────
function Section({
  title, subtitle, icon, children, defaultOpen = true,
}: {
  title: string; subtitle?: string; icon: React.ReactNode
  children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 12,
          padding: '16px 20px',
          background: 'transparent', border: 'none', cursor: 'pointer',
          borderBottom: open ? '1px solid var(--color-surface-500)' : 'none',
          textAlign: 'left',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--color-surface-600)')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: 'var(--color-accent-400)' }}>{icon}</span>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-surface-100)' }}>{title}</div>
            {subtitle && <div style={{ fontSize: '0.75rem', color: 'var(--color-surface-400)', marginTop: 1 }}>{subtitle}</div>}
          </div>
        </div>
        {open ? <ChevronUp size={15} color="var(--color-surface-400)" /> : <ChevronDown size={15} color="var(--color-surface-400)" />}
      </button>
      {open && <div style={{ padding: '20px' }}>{children}</div>}
    </div>
  )
}

// ── Risk level badge ───────────────────────────────────────
function RiskBadge({ level }: { level: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    high:   { bg: 'var(--color-bear-100)',    color: 'var(--color-bear-400)' },
    medium: { bg: 'var(--color-warning-100)', color: 'var(--color-warning-500)' },
    low:    { bg: 'var(--color-surface-600)', color: 'var(--color-surface-300)' },
  }
  const s = map[level] ?? map.low
  return (
    <span style={{
      fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.06em',
      textTransform: 'uppercase', padding: '2px 8px', borderRadius: 999,
      background: s.bg, color: s.color, whiteSpace: 'nowrap',
    }}>
      {level}
    </span>
  )
}

// ── Custom tooltip for charts ──────────────────────────────
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--color-surface-700)',
      border: '1px solid var(--color-surface-500)',
      borderRadius: 8, padding: '10px 14px',
      fontSize: '0.8rem', color: 'var(--color-surface-100)',
      boxShadow: 'var(--shadow-panel)',
    }}>
      <p style={{ margin: '0 0 6px', color: 'var(--color-surface-300)', fontWeight: 500 }}>{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
          <span style={{ color: 'var(--color-surface-300)' }}>{p.name}:</span>
          <span style={{ fontWeight: 600 }}>{typeof p.value === 'number' ? `Rp ${p.value.toFixed(1)}T` : p.value}</span>
        </div>
      ))}
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────
export default function ReportViewerPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'summary' | 'fundamental' | 'technical'>('summary')
  const [copied, setCopied] = useState(false)

  const { label, ringColor } = getNexusLabel(REPORT.nexusScore)

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1100, margin: '0 auto' }}>

      {/* ── Breadcrumb ───────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={13} /> Dashboard
        </button>
        <span style={{ color: 'var(--color-surface-500)', fontSize: '0.8rem' }}>/</span>
        <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => navigate('/reports')}>
          Reports
        </button>
        <span style={{ color: 'var(--color-surface-500)', fontSize: '0.8rem' }}>/</span>
        <span className="ticker-badge">{REPORT.ticker}</span>
      </div>

      {/* ── Report header ────────────────────────────────── */}
      <div
        style={{
          background: 'var(--color-surface-700)',
          border: '1px solid var(--color-surface-500)',
          borderRadius: 14,
          padding: '24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
          alignItems: 'center',
        }}
      >
        {/* Left: identity */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span className="ticker-badge" style={{ fontSize: '1rem', padding: '4px 14px' }}>{REPORT.ticker}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-surface-400)' }}>{REPORT.sector}</span>
          </div>
          <h1 style={{ margin: '0 0 8px', fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-surface-50)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
            {REPORT.companyName}
          </h1>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-surface-50)', letterSpacing: '-0.03em' }}>
              Rp {REPORT.price.toLocaleString('id-ID')}
            </span>
            <span
              style={{
                fontSize: '0.9rem', fontWeight: 600,
                color: REPORT.priceChange >= 0 ? 'var(--color-bull-500)' : 'var(--color-bear-500)',
                display: 'flex', alignItems: 'center', gap: 3,
              }}
            >
              {REPORT.priceChange >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {REPORT.priceChange >= 0 ? '+' : ''}{REPORT.priceChange}%
            </span>
          </div>

          {/* Key metrics row */}
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[
              { label: 'Mkt Cap',  value: `Rp ${REPORT.marketCap}` },
              { label: 'P/E',      value: REPORT.peRatio },
              { label: 'P/B',      value: REPORT.pbRatio },
              { label: 'ROE',      value: `${REPORT.roe}%` },
            ].map((m) => (
              <div key={m.label}>
                <div style={{ fontSize: '0.68rem', color: 'var(--color-surface-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-surface-100)' }}>{m.value}</div>
              </div>
            ))}
          </div>

          {/* Generated time */}
          <div style={{ marginTop: 12, fontSize: '0.72rem', color: 'var(--color-surface-500)' }}>
            Generated by NexusCapital AI · {REPORT.generatedAt}
          </div>
        </div>

        {/* Center: Nexus gauge */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <NexusGauge score={REPORT.nexusScore} />
        </div>

        {/* Right: actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
          <button
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', maxWidth: 200 }}
            onClick={() => alert('PDF export would trigger here')}
          >
            <Download size={15} /> Export PDF
          </button>
          <button
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'center', maxWidth: 200 }}
            onClick={handleCopy}
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? 'Link Copied!' : 'Copy Link'}
          </button>
          <button
            className="btn btn-ghost"
            style={{ width: '100%', justifyContent: 'center', maxWidth: 200 }}
          >
            <Share2 size={15} /> Share Report
          </button>
          <button
            className="btn btn-ghost"
            style={{ width: '100%', justifyContent: 'center', maxWidth: 200, fontSize: '0.78rem' }}
            onClick={() => navigate('/reports/generating/BBCA')}
          >
            Regenerate <ExternalLink size={12} />
          </button>
        </div>
      </div>

      {/* ── Tab navigation ───────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: 2,
          background: 'var(--color-surface-800)',
          borderRadius: 10,
          padding: 4,
          border: '1px solid var(--color-surface-500)',
          alignSelf: 'flex-start',
        }}
      >
        {([
          { key: 'summary',     label: 'Executive Summary', icon: <BookOpen size={13} /> },
          { key: 'fundamental', label: 'Fundamental',       icon: <BarChart3 size={13} /> },
          { key: 'technical',   label: 'Technical',         icon: <Activity size={13} /> },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 7, border: 'none', cursor: 'pointer',
              fontSize: '0.82rem', fontWeight: 500,
              background: activeTab === tab.key ? 'var(--color-surface-600)' : 'transparent',
              color: activeTab === tab.key ? 'var(--color-surface-100)' : 'var(--color-surface-400)',
              transition: 'all 0.15s',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ── Executive Summary tab ─────────────────────────── */}
      {activeTab === 'summary' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-up">

          {/* Executive summary card */}
          <Section title="Executive Summary" icon={<BookOpen size={16} />} subtitle="AI-synthesised by Agent 3 (Orchestrator)">
            <div
              style={{
                fontSize: '0.875rem', color: 'var(--color-surface-200)',
                lineHeight: 1.75, whiteSpace: 'pre-line',
              }}
            >
              {REPORT.executiveSummary}
            </div>

            {/* Score pill */}
            <div
              style={{
                marginTop: 16, padding: '12px 16px',
                background: REPORT.nexusScore >= 65 ? 'var(--color-bull-100)' : 'var(--color-bear-100)',
                border: `1px solid ${REPORT.nexusScore >= 65 ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
                borderRadius: 8,
                display: 'flex', alignItems: 'center', gap: 10,
              }}
            >
              {REPORT.nexusScore >= 65
                ? <TrendingUp size={16} color={ringColor} />
                : <TrendingDown size={16} color={ringColor} />}
              <span style={{ fontWeight: 700, color: ringColor, fontSize: '0.9rem' }}>
                Nexus Score {REPORT.nexusScore}/100 — {label}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-surface-400)', marginLeft: 4 }}>
                Sector rank #1 of 5 peers
              </span>
            </div>
          </Section>

          {/* Risk warnings */}
          <Section title="Risk Warnings" icon={<AlertTriangle size={16} />} subtitle="Identified by Orchestrator Agent">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {REPORT.riskWarnings.map((r, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    padding: '12px 14px', borderRadius: 8,
                    background: r.level === 'high' ? 'var(--color-bear-100)' : r.level === 'medium' ? 'var(--color-warning-100)' : 'var(--color-surface-600)',
                    border: `1px solid ${r.level === 'high' ? 'rgba(239,68,68,0.2)' : r.level === 'medium' ? 'rgba(245,158,11,0.2)' : 'transparent'}`,
                  }}
                >
                  <AlertTriangle
                    size={14}
                    color={r.level === 'high' ? 'var(--color-bear-400)' : r.level === 'medium' ? 'var(--color-warning-500)' : 'var(--color-surface-400)'}
                    style={{ marginTop: 1, flexShrink: 0 }}
                  />
                  <span style={{ flex: 1, fontSize: '0.825rem', color: 'var(--color-surface-200)', lineHeight: 1.6 }}>
                    {r.text}
                  </span>
                  <RiskBadge level={r.level} />
                </div>
              ))}
            </div>
          </Section>

          {/* Peer comparison table */}
          <Section title="Peer Comparison — Banking Sector" icon={<BarChart3 size={16} />} subtitle="Nexus Score vs 4 sector peers">
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ticker</th>
                    <th>Nexus Score</th>
                    <th>Outlook</th>
                    <th>P/E</th>
                    <th>P/B</th>
                    <th>ROE</th>
                  </tr>
                </thead>
                <tbody>
                  {REPORT.peers.map((p) => {
                    const { ringColor: pc } = getNexusLabel(p.score)
                    return (
                      <tr key={p.ticker} style={{ background: p.you ? 'var(--color-accent-100)' : undefined }}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                            <span className="ticker-badge">{p.ticker}</span>
                            {p.you && <span style={{ fontSize: '0.65rem', color: 'var(--color-accent-400)', fontWeight: 600 }}>YOU</span>}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ flex: 1, maxWidth: 80, height: 4, borderRadius: 2, background: 'var(--color-surface-600)', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${p.score}%`, background: pc, borderRadius: 2, transition: 'width 0.6s' }} />
                            </div>
                            <span style={{ fontWeight: 700, color: pc, fontSize: '0.85rem', minWidth: 26 }}>{p.score}</span>
                          </div>
                        </td>
                        <td><span style={{ fontSize: '0.78rem', fontWeight: 600, color: pc }}>{p.label}</span></td>
                        <td style={{ fontVariantNumeric: 'tabular-nums' }}>{p.pe}x</td>
                        <td style={{ fontVariantNumeric: 'tabular-nums' }}>{p.pb}x</td>
                        <td style={{ color: 'var(--color-bull-400)', fontWeight: 600 }}>{p.roe}%</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      )}

      {/* ── Fundamental tab ───────────────────────────────── */}
      {activeTab === 'fundamental' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-up">

          <Section title="Fundamental Analysis" icon={<BarChart3 size={16} />} subtitle="Agent 1 — Fundamental Analyst">
            <p style={{ margin: '0 0 16px', fontSize: '0.875rem', color: 'var(--color-surface-200)', lineHeight: 1.75, whiteSpace: 'pre-line' }}>
              {REPORT.fundamentalSummary}
            </p>

            {/* Key ratios grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
              {[
                { label: 'P/E Ratio',   value: `${REPORT.peRatio}x`,  good: true  },
                { label: 'P/B Ratio',   value: `${REPORT.pbRatio}x`,  good: true  },
                { label: 'ROE',         value: `${REPORT.roe}%`,       good: true  },
                { label: 'Debt/Equity', value: REPORT.debtEquity,     good: true  },
                { label: 'CASA Ratio',  value: '77%',                  good: true  },
                { label: 'NPL Ratio',   value: '1.2%',                 good: true  },
              ].map((m) => (
                <div key={m.label} style={{
                  padding: '12px', borderRadius: 8,
                  background: 'var(--color-surface-800)',
                  border: '1px solid var(--color-surface-500)',
                }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--color-surface-400)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>{m.label}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: m.good ? 'var(--color-bull-400)' : 'var(--color-bear-400)' }}>
                    {m.value}
                  </div>
                  <div style={{ marginTop: 4 }}>
                    {m.good
                      ? <CheckCircle2 size={11} color="var(--color-bull-500)" />
                      : <AlertTriangle size={11} color="var(--color-bear-500)" />}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Revenue & Profit chart */}
          <Section title="Revenue & Net Profit Trend" icon={<BarChart3 size={16} />} subtitle="6-quarter historical — Rp Triliun">
            <ResponsiveContainer width="100%" height={240}>
              <ComposedChart data={REVENUE_DATA} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-surface-600)" />
                <XAxis dataKey="period" tick={{ fill: 'var(--color-surface-400)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--color-surface-400)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '0.78rem', color: 'var(--color-surface-300)', paddingTop: 12 }}
                  formatter={(value) => <span style={{ color: 'var(--color-surface-300)' }}>{value} (Rp T)</span>}
                />
                <Bar dataKey="revenue" name="Revenue" fill="#3b82f620" stroke="#3b82f6" strokeWidth={1.5} radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="profit" name="Net Profit" stroke="#22c55e" strokeWidth={2.5} dot={{ fill: '#22c55e', r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </Section>
        </div>
      )}

      {/* ── Technical tab ─────────────────────────────────── */}
      {activeTab === 'technical' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-up">

          <Section title="Technical Analysis" icon={<Activity size={16} />} subtitle="Agent 2 — Technical & Bandarmologi">
            <p style={{ margin: '0 0 16px', fontSize: '0.875rem', color: 'var(--color-surface-200)', lineHeight: 1.75, whiteSpace: 'pre-line' }}>
              {REPORT.technicalSummary}
            </p>

            {/* Technical indicators grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
              {[
                { label: 'Trend',       value: 'Uptrend',   positive: true  },
                { label: 'RSI (14)',    value: '58.4',      positive: true  },
                { label: 'MACD',        value: 'Bullish',   positive: true  },
                { label: 'Volume',      value: '+45% avg',  positive: true  },
                { label: 'Support',     value: 'Rp 9,100',  positive: null  },
                { label: 'Resistance',  value: 'Rp 9,800',  positive: null  },
                { label: 'Bandar Net',  value: '+8 Sessions', positive: true },
                { label: 'Signal',      value: 'Accumulate', positive: true },
              ].map((m) => (
                <div key={m.label} style={{
                  padding: '12px', borderRadius: 8,
                  background: 'var(--color-surface-800)',
                  border: '1px solid var(--color-surface-500)',
                }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--color-surface-400)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>{m.label}</div>
                  <div style={{
                    fontSize: '0.92rem', fontWeight: 700,
                    color: m.positive === true ? 'var(--color-bull-400)' : m.positive === false ? 'var(--color-bear-400)' : 'var(--color-surface-200)',
                  }}>
                    {m.value}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* 6-month price chart */}
          <Section title="6-Month Price History" icon={<Activity size={16} />} subtitle="BBCA vs Banking Sector Peers">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={PRICE_HISTORY} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                <defs>
                  {[{ id: 'bbca', c: '#3b82f6' }, { id: 'bmri', c: '#22c55e' }, { id: 'bbni', c: '#f59e0b' }].map(({ id, c }) => (
                    <linearGradient key={id} id={`tv-${id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={c} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={c} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-surface-600)" />
                <XAxis dataKey="date" tick={{ fill: 'var(--color-surface-400)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--color-surface-400)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--color-surface-700)', border: '1px solid var(--color-surface-500)', borderRadius: 8, fontSize: '0.8rem', color: 'var(--color-surface-100)' }}
                  formatter={(v: any) => [`Rp ${Number(v).toLocaleString('id-ID')}`]} />
                <ReferenceLine y={9200} stroke="rgba(239,68,68,0.4)" strokeDasharray="4 4" label={{ value: 'Breakout', fill: 'var(--color-bear-400)', fontSize: 10, position: 'right' }} />
                <Area type="monotone" dataKey="BBCA" stroke="#3b82f6" strokeWidth={2.5} fill="url(#tv-bbca)" dot={false} />
                <Area type="monotone" dataKey="BMRI" stroke="#22c55e" strokeWidth={1.5} fill="url(#tv-bmri)" dot={false} />
                <Area type="monotone" dataKey="BBNI" stroke="#f59e0b" strokeWidth={1.5} fill="url(#tv-bbni)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>

            <div style={{ display: 'flex', gap: 20, marginTop: 10 }}>
              {[{ l: 'BBCA', c: '#3b82f6' }, { l: 'BMRI', c: '#22c55e' }, { l: 'BBNI', c: '#f59e0b' }].map((l) => (
                <div key={l.l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--color-surface-300)' }}>
                  <div style={{ width: 12, height: 3, borderRadius: 2, background: l.c }} />
                  {l.l}
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

    </div>
  )
}
