import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, TrendingUp, TrendingDown, Plus, FileText,
  Zap, BarChart3, Clock, ChevronRight, Bell, Star,
  RefreshCw, ArrowUpRight, AlertTriangle, X,
} from 'lucide-react'
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis,
} from 'recharts'
import {
  WATCHLIST, RECENT_REPORTS, PRICE_HISTORY, TICKER_SUGGESTIONS,
} from '../lib/mockData'
import { formatPercent, getNexusLabel } from '../lib/utils'
import StatusBadge from '../components/ui/StatusBadge'

// ── Mini sparkline for watchlist rows ─────────────────────
const SPARKS: Record<string, number[]> = {
  BBCA: [87, 91, 89, 93, 90, 94, 93.5],
  TLKM: [40, 38, 39, 37, 38, 36, 38.7],
  ASII: [50, 52, 51, 53, 52, 51, 51.25],
  GOTO: [66, 63, 65, 62, 61, 60, 62],
  PGEO: [12, 13, 12.5, 14, 13.8, 13.5, 13.4],
  MBMA: [50, 49, 51, 48, 47, 46, 46],
}

function Sparkline({ ticker, positive }: { ticker: string; positive: boolean }) {
  const data = (SPARKS[ticker] ?? [50, 52, 51, 53]).map((v, i) => ({ i, v }))
  return (
    <ResponsiveContainer width={80} height={32}>
      <AreaChart data={data} margin={{ top: 2, bottom: 2, left: 0, right: 0 }}>
        <defs>
          <linearGradient id={`sg-${ticker}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={positive ? '#22c55e' : '#ef4444'} stopOpacity={0.3} />
            <stop offset="100%" stopColor={positive ? '#22c55e' : '#ef4444'} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={positive ? '#22c55e' : '#ef4444'}
          strokeWidth={1.5}
          fill={`url(#sg-${ticker})`}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// ── Alert trigger form modal ───────────────────────────────
interface AlertModalProps {
  onClose: () => void
}
function AlertModal({ onClose }: AlertModalProps) {
  const [tickers, setTickers] = useState('ANTM, PGEO')
  const [condition, setCondition] = useState('price_drop')
  const [threshold, setThreshold] = useState('5')

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="fade-up" style={{
        background: 'var(--color-surface-700)',
        border: '1px solid var(--color-surface-500)',
        borderRadius: 14, padding: 28, width: '100%', maxWidth: 440,
        boxShadow: 'var(--shadow-panel)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-surface-50)' }}>
              New Alert Trigger
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: 'var(--color-surface-400)' }}>
              Auto-generate a micro-report when conditions are met
            </p>
          </div>
          <button className="btn btn-ghost" style={{ padding: '4px 6px' }} onClick={onClose}><X size={16} /></button>
        </div>

        {/* Preview rule */}
        <div style={{
          padding: '10px 14px', borderRadius: 8, marginBottom: 20,
          background: 'var(--color-surface-800)', border: '1px solid var(--color-surface-500)',
          fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-accent-400)',
          lineHeight: 1.6,
        }}>
          IF [{tickers || '…'}] {condition === 'price_drop' ? 'drops' : condition === 'price_spike' ? 'rises' : 'volume spikes'} &gt; {threshold || '0'}%<br />
          THEN generate_micro_report()
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: 'var(--color-surface-300)', marginBottom: 6 }}>
              Tickers (comma separated)
            </label>
            <input className="input-base" value={tickers} onChange={e => setTickers(e.target.value)} placeholder="ANTM, PGEO, TOBA" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: 'var(--color-surface-300)', marginBottom: 6 }}>
              Condition
            </label>
            <select className="input-base" value={condition} onChange={e => setCondition(e.target.value)}
              style={{ appearance: 'none' }}>
              <option value="price_drop">Price Drop</option>
              <option value="price_spike">Price Spike</option>
              <option value="volume_spike">Volume Spike</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: 'var(--color-surface-300)', marginBottom: 6 }}>
              Threshold (%)
            </label>
            <input className="input-base" type="number" value={threshold} onChange={e => setThreshold(e.target.value)} placeholder="5" min="0.1" max="50" step="0.5" />
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }} onClick={onClose}>
              <Zap size={14} /> Save Alert Trigger
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Dashboard ─────────────────────────────────────────
export default function DashboardPage() {
  const navigate = useNavigate()

  // Search state
  const [query, setQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [alertModalOpen, setAlertModalOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = query.length >= 1
    ? TICKER_SUGGESTIONS.filter(
        (s) =>
          s.ticker.toLowerCase().includes(query.toLowerCase()) ||
          s.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 7)
    : TICKER_SUGGESTIONS.slice(0, 6)

  // Close dropdown on outside click
  const dropdownRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function handleGenerate(ticker: string) {
    setSearchFocused(false)
    setQuery('')
    navigate(`/reports/generating/${ticker}`)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1280 }}>

      {/* ── Page header ─────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-surface-50)', letterSpacing: '-0.01em' }}>
            Good morning, Budi
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--color-surface-400)' }}>
            IDX market is <span style={{ color: 'var(--color-bull-500)', fontWeight: 600 }}>open</span> · IHSG 7,284.5 <span style={{ color: 'var(--color-bull-500)' }}>+0.41%</span> · 15 credits remaining
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" style={{ fontSize: '0.82rem' }} onClick={() => setAlertModalOpen(true)}>
            <Bell size={14} /> New Alert
          </button>
          <button className="btn btn-primary" style={{ fontSize: '0.82rem' }} onClick={() => inputRef.current?.focus()}>
            <Plus size={14} /> Generate Report
          </button>
        </div>
      </div>

      {/* ── TICKER SEARCH ───────────────────────────────── */}
      <div ref={dropdownRef} style={{ position: 'relative', zIndex: 20 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 0,
            background: 'var(--color-surface-700)',
            border: `1px solid ${searchFocused ? 'var(--color-accent-500)' : 'var(--color-surface-500)'}`,
            borderRadius: 10,
            overflow: 'hidden',
            boxShadow: searchFocused ? '0 0 0 3px rgba(59,130,246,0.15)' : 'none',
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}
        >
          <div style={{ padding: '0 16px', color: 'var(--color-surface-400)', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <Search size={16} />
          </div>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value.toUpperCase())}
            onFocus={() => setSearchFocused(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && filtered.length > 0) handleGenerate(filtered[0].ticker)
              if (e.key === 'Escape') setSearchFocused(false)
            }}
            placeholder="Enter ticker or company name — e.g. BBCA, PGEO, GoTo…"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--color-surface-100)',
              fontSize: '0.9rem',
              padding: '13px 0',
              fontFamily: 'var(--font-sans)',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ padding: '0 12px', background: 'transparent', border: 'none', color: 'var(--color-surface-400)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <X size={14} />
            </button>
          )}
          <button
            className="btn btn-primary"
            style={{ borderRadius: 0, padding: '13px 20px', fontSize: '0.85rem', alignSelf: 'stretch' }}
            onClick={() => filtered.length > 0 && handleGenerate(filtered[0].ticker)}
          >
            <BarChart3 size={15} />
            Generate Report
          </button>
        </div>

        {/* Autocomplete dropdown */}
        {searchFocused && (
          <div
            className="dropdown fade-up"
            style={{
              position: 'absolute', top: '100%', left: 0, right: 0,
              marginTop: 4, zIndex: 50,
            }}
          >
            {!query && (
              <div style={{ padding: '8px 14px 4px', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-surface-400)' }}>
                Frequently Researched
              </div>
            )}
            {filtered.length === 0 ? (
              <div className="dropdown-item" style={{ color: 'var(--color-surface-400)', cursor: 'default', justifyContent: 'center' }}>
                No results for "{query}"
              </div>
            ) : (
              filtered.map((s) => (
                <div
                  key={s.ticker}
                  className="dropdown-item"
                  onClick={() => handleGenerate(s.ticker)}
                  style={{ justifyContent: 'space-between' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="ticker-badge">{s.ticker}</span>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-surface-100)' }}>
                        {s.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-surface-400)' }}>{s.sector}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-surface-400)', fontSize: '0.78rem' }}>
                    <BarChart3 size={12} />
                    Analyze
                    <ChevronRight size={12} />
                  </div>
                </div>
              ))
            )}
            <div style={{ padding: '8px 14px', borderTop: '1px solid var(--color-surface-500)', fontSize: '0.72rem', color: 'var(--color-surface-500)' }}>
              Press Enter to generate · Esc to close
            </div>
          </div>
        )}
      </div>

      {/* ── PORTFOLIO SUMMARY ROW ───────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 14,
        }}
      >
        {[
          { label: 'Portfolio Value', value: 'Rp 48.2M', change: +2.14, color: 'var(--color-bull-500)' },
          { label: 'Day P&L', value: '+Rp 1.03M', change: +2.14, color: 'var(--color-bull-500)' },
          { label: 'Reports This Month', value: '7', sub: 'of 30 used', color: 'var(--color-accent-400)' },
          { label: 'Active Alerts', value: '3', sub: '2 triggered today', color: 'var(--color-warning-500)' },
        ].map((item) => (
          <div
            key={item.label}
            className="card-sm"
            style={{ transition: 'border-color 0.15s' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--color-surface-400)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--color-surface-500)')}
          >
            <p style={{ margin: '0 0 6px', fontSize: '0.72rem', fontWeight: 500, color: 'var(--color-surface-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {item.label}
            </p>
            <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: item.color, letterSpacing: '-0.02em' }}>
              {item.value}
            </p>
            {item.change !== undefined ? (
              <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: item.change >= 0 ? 'var(--color-bull-500)' : 'var(--color-bear-500)', display: 'flex', alignItems: 'center', gap: 3 }}>
                {item.change >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {formatPercent(item.change)} today
              </p>
            ) : (
              <p style={{ margin: '4px 0 0', fontSize: '0.72rem', color: 'var(--color-surface-400)' }}>{item.sub}</p>
            )}
          </div>
        ))}
      </div>

      {/* ── MAIN 2-COL GRID ─────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 20,
          alignItems: 'start',
        }}
      >
        {/* LEFT — Watchlist ─────────────────────────────── */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-surface-500)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Star size={14} color="var(--color-warning-500)" />
              <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-surface-100)' }}>Watchlist</span>
              <span style={{ fontSize: '0.72rem', background: 'var(--color-surface-600)', color: 'var(--color-surface-300)', borderRadius: 4, padding: '1px 6px', fontWeight: 500 }}>
                {WATCHLIST.length}
              </span>
            </div>
            <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: '0.78rem' }}>
              <RefreshCw size={12} /> Refresh
            </button>
          </div>

          <div>
            {WATCHLIST.map((stock, i) => (
              <div
                key={stock.ticker}
                onClick={() => handleGenerate(stock.ticker)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 20px',
                  borderBottom: i < WATCHLIST.length - 1 ? '1px solid var(--color-surface-600)' : 'none',
                  cursor: 'pointer',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--color-surface-600)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
              >
                {/* Ticker + name */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span className="ticker-badge">{stock.ticker}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-surface-400)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {stock.sector}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-surface-300)', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {stock.name}
                  </div>
                </div>

                {/* Sparkline */}
                <Sparkline ticker={stock.ticker} positive={stock.change >= 0} />

                {/* Price + change */}
                <div style={{ textAlign: 'right', minWidth: 80 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-surface-100)', fontVariantNumeric: 'tabular-nums' }}>
                    {stock.price.toLocaleString('id-ID')}
                  </div>
                  <div
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: stock.change >= 0 ? 'var(--color-bull-500)' : 'var(--color-bear-500)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: 3,
                    }}
                  >
                    {stock.change >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {formatPercent(stock.change)}
                  </div>
                </div>

                {/* Analyze arrow */}
                <ArrowUpRight size={14} color="var(--color-surface-500)" />
              </div>
            ))}
          </div>

          <div style={{ padding: '12px 20px', borderTop: '1px solid var(--color-surface-600)' }}>
            <button className="btn btn-ghost" style={{ fontSize: '0.78rem', width: '100%', justifyContent: 'center' }}>
              <Plus size={12} /> Add to Watchlist
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN ─────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Recent Reports ──────────────────────────────── */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-surface-500)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText size={14} color="var(--color-accent-400)" />
                <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-surface-100)' }}>Recent Reports</span>
              </div>
              <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: '0.78rem' }} onClick={() => navigate('/reports')}>
                View all <ChevronRight size={12} />
              </button>
            </div>

            <div>
              {RECENT_REPORTS.map((r, i) => {
                const { label, ringColor } = getNexusLabel(r.score)
                const isProcessing = r.status === 'processing'
                return (
                  <div
                    key={r.id}
                    onClick={() => !isProcessing && navigate(`/reports/${r.id}`)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: '12px 20px',
                      borderBottom: i < RECENT_REPORTS.length - 1 ? '1px solid var(--color-surface-600)' : 'none',
                      cursor: isProcessing ? 'default' : 'pointer',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={(e) => !isProcessing && ((e.currentTarget as HTMLElement).style.background = 'var(--color-surface-600)')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                  >
                    {/* Score ring */}
                    <div style={{ flexShrink: 0 }}>
                      {isProcessing ? (
                        <div
                          className="agent-pulse"
                          style={{
                            width: 36, height: 36, borderRadius: '50%',
                            border: '2px solid var(--color-accent-500)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <RefreshCw size={14} color="var(--color-accent-400)" />
                        </div>
                      ) : (
                        <svg width="36" height="36" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="14" fill="none" stroke="var(--color-surface-600)" strokeWidth="3" />
                          <circle
                            cx="18" cy="18" r="14" fill="none"
                            stroke={ringColor}
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray={`${(r.score / 100) * 88} 88`}
                            transform="rotate(-90 18 18)"
                          />
                          <text x="18" y="22" textAnchor="middle" fontSize="9" fontWeight="700" fill={ringColor}>
                            {r.score}
                          </text>
                        </svg>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <span className="ticker-badge">{r.ticker}</span>
                        {!isProcessing && (
                          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: ringColor }}>
                            {label}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-surface-400)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={10} />
                        {r.date}
                      </div>
                    </div>

                    <StatusBadge status={r.status as any} dot />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Active Alerts ───────────────────────────────── */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-surface-500)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Zap size={14} color="var(--color-warning-500)" />
                <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-surface-100)' }}>Active Alerts</span>
              </div>
              <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: '0.78rem' }} onClick={() => setAlertModalOpen(true)}>
                <Plus size={12} /> Add
              </button>
            </div>

            <div style={{ padding: '8px 0' }}>
              {[
                { ticker: 'ANTM', cond: 'Price drop', threshold: '>5%', active: true },
                { ticker: 'PGEO', cond: 'Price spike', threshold: '>3%', active: true },
                { ticker: 'WIFI', cond: 'Volume spike', threshold: '>200%', active: false },
              ].map((alert, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 20px',
                  }}
                >
                  <div
                    style={{
                      width: 32, height: 32, borderRadius: 6,
                      background: alert.active ? 'var(--color-warning-100)' : 'var(--color-surface-600)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <AlertTriangle size={14} color={alert.active ? 'var(--color-warning-500)' : 'var(--color-surface-400)'} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--color-surface-100)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className="ticker-badge" style={{ fontSize: '0.7rem' }}>{alert.ticker}</span>
                      {alert.cond} {alert.threshold}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-surface-400)', marginTop: 2 }}>
                      Triggers micro-report via email
                    </div>
                  </div>
                  {/* Toggle */}
                  <div
                    style={{
                      width: 34, height: 18, borderRadius: 9,
                      background: alert.active ? 'var(--color-accent-500)' : 'var(--color-surface-500)',
                      position: 'relative', cursor: 'pointer', flexShrink: 0,
                      transition: 'background 0.2s',
                    }}
                  >
                    <div style={{
                      position: 'absolute', top: 2,
                      left: alert.active ? 16 : 2,
                      width: 14, height: 14, borderRadius: '50%',
                      background: '#fff', transition: 'left 0.2s',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market overview mini ─────────────────────────── */}
          <div className="card-sm">
            <p style={{ margin: '0 0 12px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-surface-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Sector Heatmap
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
              {[
                { sector: 'Finance', change: +1.42 },
                { sector: 'Energy', change: +0.83 },
                { sector: 'Mining', change: -2.14 },
                { sector: 'Tech', change: -0.55 },
                { sector: 'FMCG', change: +0.21 },
                { sector: 'Telecom', change: -0.77 },
              ].map((s) => (
                <div
                  key={s.sector}
                  style={{
                    padding: '8px',
                    borderRadius: 6,
                    background: s.change >= 0 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
                    border: `1px solid ${s.change >= 0 ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'}`,
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '0.68rem', color: 'var(--color-surface-300)', marginBottom: 3 }}>{s.sector}</div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: s.change >= 0 ? 'var(--color-bull-500)' : 'var(--color-bear-500)' }}>
                    {formatPercent(s.change)}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── MARKET CHART ─────────────────────────────────── */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-surface-100)' }}>
              Price Comparison — Banking Sector
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: 'var(--color-surface-400)' }}>
              6-month normalized price index · BBCA vs BMRI vs BBNI
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['1M', '3M', '6M', 'YTD', '1Y'].map((p, i) => (
              <button
                key={p}
                className="btn btn-ghost"
                style={{
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  background: i === 2 ? 'var(--color-surface-600)' : 'transparent',
                  color: i === 2 ? 'var(--color-surface-100)' : 'var(--color-surface-400)',
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={PRICE_HISTORY} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              {[
                { id: 'bbca', color: '#3b82f6' },
                { id: 'bmri', color: '#22c55e' },
                { id: 'bbni', color: '#f59e0b' },
              ].map(({ id, color }) => (
                <linearGradient key={id} id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <XAxis dataKey="date" tick={{ fill: 'var(--color-surface-400)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: 'var(--color-surface-700)',
                border: '1px solid var(--color-surface-500)',
                borderRadius: 8,
                fontSize: '0.8rem',
                color: 'var(--color-surface-100)',
              }}
              formatter={(value: unknown) => [
                `Rp ${Number(value).toLocaleString('id-ID')}`,
              ]}
            />
            <Area type="monotone" dataKey="BBCA" stroke="#3b82f6" strokeWidth={2} fill="url(#grad-bbca)" dot={false} />
            <Area type="monotone" dataKey="BMRI" stroke="#22c55e" strokeWidth={2} fill="url(#grad-bmri)" dot={false} />
            <Area type="monotone" dataKey="BBNI" stroke="#f59e0b" strokeWidth={2} fill="url(#grad-bbni)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
          {[
            { label: 'BBCA', color: '#3b82f6' },
            { label: 'BMRI', color: '#22c55e' },
            { label: 'BBNI', color: '#f59e0b' },
          ].map((l) => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--color-surface-300)' }}>
              <div style={{ width: 12, height: 3, borderRadius: 2, background: l.color }} />
              {l.label}
            </div>
          ))}
        </div>
      </div>

      {/* Alert modal */}
      {alertModalOpen && <AlertModal onClose={() => setAlertModalOpen(false)} />}
    </div>
  )
}
