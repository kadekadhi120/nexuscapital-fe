import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  Bot,
  Zap,
  Shield,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  Code2,
  Bell,
  Building2,
  User,
} from 'lucide-react'

// ── Mini mock ticker tape ──────────────────────────────────
const TICKERS = [
  { t: 'BBCA', p: '9.350', c: +1.23 },
  { t: 'TLKM', p: '3.870', c: -0.77 },
  { t: 'ASII', p: '5.125', c: +0.49 },
  { t: 'GOTO', p: '62', c: -3.12 },
  { t: 'PGEO', p: '1.340', c: +2.14 },
  { t: 'BBRI', p: '5.200', c: +0.96 },
  { t: 'MBMA', p: '460', c: -1.08 },
  { t: 'ANTM', p: '1.765', c: +1.55 },
]

const FEATURES = [
  {
    icon: <Bot size={20} />,
    title: 'Multi-Agent AI Research',
    desc: 'Three specialized agents — Fundamental, Technical, and Orchestrator — collaborate to synthesize a complete equity report in under 30 seconds.',
  },
  {
    icon: <BarChart3 size={20} />,
    title: 'Nexus Score',
    desc: 'A proprietary 1–100 score benchmarked against sector peers. Know instantly if an emiten is Strong Bull, Neutral, or Strong Bear.',
  },
  {
    icon: <Zap size={20} />,
    title: 'Event-Triggered Alerts',
    desc: 'Set rules like "IF ANTM drops >5%, generate micro-report." Our scheduler watches the market and fires analysis automatically.',
  },
  {
    icon: <Code2 size={20} />,
    title: 'B2B API & White-Label',
    desc: 'Full REST API with structured JSON output. Embed Nexus reports in your own platform with custom branding and logo.',
  },
  {
    icon: <Shield size={20} />,
    title: 'Role-Based Access',
    desc: 'Retail investors, institutional B2B clients, and admin operators each get a dedicated, purpose-built interface.',
  },
  {
    icon: <Bell size={20} />,
    title: 'Instant PDF Reports',
    desc: 'Export any research report to a professional One-Pager PDF with your branding, ready to share with clients or portfolio managers.',
  },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Enter a Ticker',
    desc: 'Type any IDX stock code — BBCA, PGEO, GOTO — and hit Generate.',
  },
  {
    step: '02',
    title: 'Agents Go to Work',
    desc: 'Agent 1 pulls financials from Sectors API. Agent 2 reads price action & volume. Agent 3 synthesizes everything via LLM.',
    highlight: true,
  },
  {
    step: '03',
    title: 'Read Your Report',
    desc: 'A complete One-Pager with Nexus Score, risk warnings, and interactive charts lands in ~30 seconds.',
  },
]

const PRICING = [
  {
    name: 'Starter',
    price: 'Free',
    period: '',
    credits: '3 reports / month',
    features: ['On-demand reports', 'Nexus Score', 'PDF export', 'Email alerts'],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Pro',
    price: 'Rp 149K',
    period: '/ month',
    credits: '30 reports / month',
    features: ['Everything in Starter', 'Event-triggered alerts', 'Priority queue', 'Portfolio watchlist', 'API read access'],
    cta: 'Start Free Trial',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    credits: 'Unlimited reports',
    features: ['Everything in Pro', 'B2B White-label API', 'Webhook delivery', 'Dedicated support', 'SLA guarantee', 'Custom branding'],
    cta: 'Contact Sales',
    highlight: false,
  },
]

// ── Minimal line chart SVG for hero ───────────────────────
function HeroChart() {
  const points = [42, 58, 51, 67, 63, 78, 72, 85, 80, 92, 88, 96]
  const w = 320
  const h = 120
  const step = w / (points.length - 1)
  const min = Math.min(...points)
  const max = Math.max(...points)
  const scaleY = (v: number) => h - ((v - min) / (max - min)) * (h - 16) - 8

  const linePath = points
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${scaleY(v)}`)
    .join(' ')
  const areaPath = `${linePath} L ${(points.length - 1) * step} ${h} L 0 ${h} Z`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 120 }}>
      <defs>
        <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#heroFill)" />
      <path d={linePath} fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Last dot */}
      <circle
        cx={(points.length - 1) * step}
        cy={scaleY(points[points.length - 1])}
        r="4"
        fill="#22c55e"
      />
    </svg>
  )
}

// ── Nexus Score Gauge (mini SVG) ──────────────────────────
function MiniGauge({ score, color }: { score: number; color: string }) {
  const R = 36
  const cx = 44
  const cy = 44
  const strokeW = 7
  const circum = Math.PI * R // half circle
  const fill = (score / 100) * circum

  return (
    <svg width="88" height="52" viewBox="0 0 88 52">
      <path
        d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
        fill="none"
        stroke="var(--color-surface-600)"
        strokeWidth={strokeW}
        strokeLinecap="round"
      />
      <path
        d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
        fill="none"
        stroke={color}
        strokeWidth={strokeW}
        strokeLinecap="round"
        strokeDasharray={`${fill} ${circum}`}
        style={{ transition: 'stroke-dasharray 1s ease-out' }}
      />
      <text x={cx} y={cy - 4} textAnchor="middle" fill={color} fontSize="14" fontWeight="700">
        {score}
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="var(--color-surface-300)" fontSize="7">
        / 100
      </text>
    </svg>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null)
  const [regRole, setRegRole] = useState<'retail' | 'b2b'>('retail')

  return (
    <div style={{ backgroundColor: 'var(--color-surface-900)', minHeight: '100vh' }}>

      {/* ── TICKER TAPE ─────────────────────────────────── */}
      <div
        style={{
          backgroundColor: 'var(--color-surface-800)',
          borderBottom: '1px solid var(--color-surface-500)',
          overflow: 'hidden',
          height: 32,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 40,
            whiteSpace: 'nowrap',
            animation: 'marquee 30s linear infinite',
            paddingLeft: '100%',
          }}
        >
          {[...TICKERS, ...TICKERS].map((t, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.75rem' }}>
              <span className="ticker-badge">{t.t}</span>
              <span style={{ color: 'var(--color-surface-100)', fontWeight: 500 }}>
                Rp {t.p}
              </span>
              <span
                style={{
                  color: t.c >= 0 ? 'var(--color-bull-500)' : 'var(--color-bear-500)',
                  fontWeight: 600,
                }}
              >
                {t.c >= 0 ? '+' : ''}{t.c}%
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ── NAVBAR ──────────────────────────────────────── */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backgroundColor: 'rgba(13,17,23,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--color-surface-500)',
          padding: '0 24px',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          gap: 32,
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: 'var(--color-accent-500)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 12L6 7L9 10L13 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-surface-50)', letterSpacing: '-0.01em' }}>
            NexusCapital
          </span>
        </div>

        {/* Links — hidden on small screens */}
        <div
          className="nav-links"
          style={{ display: 'flex', alignItems: 'center', gap: 4 }}
        >
          {['Features', 'How It Works', 'Pricing', 'API Docs'].map((l) => (
            <button key={l} className="btn btn-ghost" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
              {l}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" style={{ fontSize: '0.85rem' }} onClick={() => setAuthMode('login')}>
            Sign In
          </button>
          <button className="btn btn-primary" style={{ fontSize: '0.85rem' }} onClick={() => setAuthMode('register')}>
            Get Started
          </button>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '80px 24px 64px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 64,
          alignItems: 'center',
        }}
      >
        {/* Left: copy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 12px',
              borderRadius: 999,
              border: '1px solid var(--color-surface-500)',
              background: 'var(--color-surface-700)',
              fontSize: '0.75rem',
              color: 'var(--color-accent-400)',
              fontWeight: 500,
              alignSelf: 'flex-start',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent-500)', display: 'inline-block' }} />
            Powered by Multi-Agent AI · IDX Market Data
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              lineHeight: 1.12,
              color: 'var(--color-surface-50)',
              letterSpacing: '-0.03em',
            }}
          >
            Institutional-Grade<br />
            <span style={{ color: 'var(--color-accent-400)' }}>Equity Research</span>
            <br />
            in 30 Seconds.
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: '1rem',
              color: 'var(--color-surface-300)',
              lineHeight: 1.7,
              maxWidth: 460,
            }}
          >
            NexusCapital democratizes access to professional stock analysis. Our AI agents scan fundamentals, technicals,
            and bandarmologi data — then synthesize everything into a single, actionable report.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              style={{ fontSize: '0.9rem', padding: '10px 20px' }}
              onClick={() => navigate('/dashboard')}
            >
              Try Free — No Card Required <ArrowRight size={15} />
            </button>
            <button className="btn btn-secondary" style={{ fontSize: '0.9rem', padding: '10px 20px' }}>
              View Sample Report
            </button>
          </div>

          {/* Trust signals */}
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', paddingTop: 8 }}>
            {[
              { n: '10K+', l: 'Active Investors' },
              { n: '500K+', l: 'Reports Generated' },
              { n: '<30s', l: 'Avg. Report Time' },
            ].map((s) => (
              <div key={s.l}>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-surface-50)' }}>{s.n}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-surface-400)' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: mock report card */}
        <div style={{ position: 'relative' }}>
          <div
            className="fade-up"
            style={{
              background: 'var(--color-surface-700)',
              border: '1px solid var(--color-surface-500)',
              borderRadius: 16,
              padding: 24,
              boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
            }}
          >
            {/* Card header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="ticker-badge" style={{ fontSize: '0.85rem', padding: '3px 10px' }}>BBCA</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-surface-300)' }}>Bank Central Asia Tbk</span>
                </div>
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-surface-50)' }}>Rp 9.350</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-bull-500)', display: 'flex', alignItems: 'center', gap: 3 }}>
                    <TrendingUp size={12} /> +1.23%
                  </span>
                </div>
              </div>
              <MiniGauge score={82} color="#22c55e" />
            </div>

            {/* Chart */}
            <HeroChart />

            {/* Agent status pills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
              {[
                { label: 'Agent 1 · Fundamental Analysis', done: true },
                { label: 'Agent 2 · Technical & Bandarmologi', done: true },
                { label: 'Agent 3 · Synthesis & Scoring', done: true },
              ].map((a) => (
                <div
                  key={a.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 10px',
                    borderRadius: 6,
                    background: 'var(--color-surface-600)',
                    fontSize: '0.75rem',
                    color: a.done ? 'var(--color-surface-200)' : 'var(--color-surface-300)',
                  }}
                >
                  <CheckCircle2 size={13} color={a.done ? 'var(--color-bull-500)' : 'var(--color-surface-400)'} />
                  {a.label}
                  {a.done && (
                    <span style={{ marginLeft: 'auto', color: 'var(--color-bull-500)', fontWeight: 600 }}>Done</span>
                  )}
                </div>
              ))}
            </div>

            {/* Score label */}
            <div
              style={{
                marginTop: 16,
                padding: '10px 14px',
                borderRadius: 8,
                background: 'var(--color-bull-100)',
                border: '1px solid rgba(34,197,94,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <TrendingUp size={16} color="var(--color-bull-500)" />
              <span style={{ fontWeight: 700, color: 'var(--color-bull-500)', fontSize: '0.9rem' }}>
                Nexus Score 82 — Strong Bull
              </span>
            </div>
          </div>

          {/* Floating decoration card */}
          <div
            style={{
              position: 'absolute',
              bottom: -20,
              left: -20,
              background: 'var(--color-surface-800)',
              border: '1px solid var(--color-surface-500)',
              borderRadius: 10,
              padding: '10px 14px',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              zIndex: 2,
            }}
          >
            <span style={{ color: 'var(--color-bull-500)', fontWeight: 700 }}>↑ 5.2%</span>
            <span style={{ color: 'var(--color-surface-300)' }}>PGEO triggered alert fired</span>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────── */}
      <section
        style={{
          background: 'var(--color-surface-800)',
          borderTop: '1px solid var(--color-surface-500)',
          borderBottom: '1px solid var(--color-surface-500)',
          padding: '64px 24px',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ margin: '0 0 8px', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-accent-400)' }}>
              How It Works
            </p>
            <h2 style={{ margin: 0, fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: 'var(--color-surface-50)', letterSpacing: '-0.02em' }}>
              From ticker to insight in three steps
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 24,
              position: 'relative',
            }}
          >
            {HOW_IT_WORKS.map((step, i) => (
              <div
                key={i}
                style={{
                  position: 'relative',
                  background: step.highlight ? 'var(--color-accent-100)' : 'var(--color-surface-700)',
                  border: `1px solid ${step.highlight ? 'rgba(59,130,246,0.3)' : 'var(--color-surface-500)'}`,
                  borderRadius: 12,
                  padding: 24,
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontSize: '2.5rem',
                    fontWeight: 800,
                    color: step.highlight ? 'var(--color-accent-500)' : 'var(--color-surface-600)',
                    lineHeight: 1,
                    marginBottom: 16,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {step.step}
                </span>
                <h3
                  style={{
                    margin: '0 0 8px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'var(--color-surface-50)',
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-surface-300)', lineHeight: 1.6 }}>
                  {step.desc}
                </p>
                {i < HOW_IT_WORKS.length - 1 && (
                  <ChevronRight
                    size={20}
                    style={{
                      position: 'absolute',
                      right: -14,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--color-surface-500)',
                      zIndex: 1,
                      display: 'block',
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ margin: '0 0 8px', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-accent-400)' }}>
            Platform Features
          </p>
          <h2 style={{ margin: 0, fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: 'var(--color-surface-50)', letterSpacing: '-0.02em' }}>
            Everything an investor needs. Nothing they don't.
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
          }}
        >
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                transition: 'border-color 0.15s, transform 0.15s',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = 'var(--color-accent-500)'
                el.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = 'var(--color-surface-500)'
                el.style.transform = 'translateY(0)'
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: 'var(--color-accent-100)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-accent-400)',
                  flexShrink: 0,
                }}
              >
                {f.icon}
              </div>
              <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-surface-100)' }}>
                {f.title}
              </h3>
              <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--color-surface-300)', lineHeight: 1.65 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────── */}
      <section
        style={{
          background: 'var(--color-surface-800)',
          borderTop: '1px solid var(--color-surface-500)',
          borderBottom: '1px solid var(--color-surface-500)',
          padding: '64px 24px',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ margin: '0 0 8px', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-accent-400)' }}>
              Pricing
            </p>
            <h2 style={{ margin: 0, fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: 'var(--color-surface-50)', letterSpacing: '-0.02em' }}>
              Transparent pricing. No surprises.
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 20,
              alignItems: 'start',
            }}
          >
            {PRICING.map((plan) => (
              <div
                key={plan.name}
                style={{
                  background: plan.highlight ? 'var(--color-surface-700)' : 'var(--color-surface-900)',
                  border: `1px solid ${plan.highlight ? 'var(--color-accent-500)' : 'var(--color-surface-500)'}`,
                  borderRadius: 14,
                  padding: 28,
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 20,
                }}
              >
                {plan.highlight && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -11,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'var(--color-accent-500)',
                      color: '#fff',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      padding: '2px 12px',
                      borderRadius: 999,
                    }}
                  >
                    MOST POPULAR
                  </div>
                )}

                <div>
                  <p style={{ margin: '0 0 8px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-surface-300)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {plan.name}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-surface-50)', letterSpacing: '-0.02em' }}>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-surface-400)' }}>{plan.period}</span>
                    )}
                  </div>
                  <p style={{ margin: '6px 0 0', fontSize: '0.8rem', color: 'var(--color-accent-400)', fontWeight: 500 }}>
                    {plan.credits}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--color-surface-600)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--color-surface-200)' }}>
                      <CheckCircle2 size={14} color="var(--color-bull-500)" style={{ flexShrink: 0 }} />
                      {f}
                    </div>
                  ))}
                </div>

                <button
                  className={plan.highlight ? 'btn btn-primary' : 'btn btn-secondary'}
                  style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
                  onClick={() => setAuthMode('register')}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BOTTOM ────────────────────────────────────── */}
      <section style={{ maxWidth: 680, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <h2
          style={{
            margin: '0 0 16px',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 700,
            color: 'var(--color-surface-50)',
            letterSpacing: '-0.02em',
          }}
        >
          Start generating research-grade reports today.
        </h2>
        <p style={{ margin: '0 0 32px', color: 'var(--color-surface-300)', lineHeight: 1.7 }}>
          No Bloomberg terminal subscription required. Join thousands of retail investors who already use
          NexusCapital to stay ahead of the market.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary"
            style={{ fontSize: '0.95rem', padding: '12px 28px' }}
            onClick={() => setAuthMode('register')}
          >
            Create Free Account <ArrowRight size={15} />
          </button>
          <button className="btn btn-secondary" style={{ fontSize: '0.95rem', padding: '12px 28px' }}>
            <Building2 size={15} />
            Enterprise Sales
          </button>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: '1px solid var(--color-surface-500)',
          backgroundColor: 'var(--color-surface-800)',
          padding: '32px 24px',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 5,
                background: 'var(--color-accent-500)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M2 12L6 7L9 10L13 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-surface-300)' }}>
              NexusCapital © 2026
            </span>
          </div>
          <div style={{ display: 'flex', gap: 24, fontSize: '0.8rem', color: 'var(--color-surface-400)' }}>
            {['Privacy', 'Terms', 'API Docs', 'Status'].map((l) => (
              <span key={l} style={{ cursor: 'pointer', transition: 'color 0.15s' }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'var(--color-surface-200)')}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'var(--color-surface-400)')}
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </footer>

      {/* ── AUTH MODAL ────────────────────────────────────── */}
      {authMode && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            backdropFilter: 'blur(4px)',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setAuthMode(null) }}
        >
          <div
            className="fade-up"
            style={{
              background: 'var(--color-surface-700)',
              border: '1px solid var(--color-surface-500)',
              borderRadius: 16,
              padding: 32,
              width: '100%',
              maxWidth: 400,
              boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
            }}
          >
            {/* Toggle */}
            <div
              style={{
                display: 'flex',
                background: 'var(--color-surface-800)',
                borderRadius: 8,
                padding: 4,
                marginBottom: 24,
                gap: 4,
              }}
            >
              {(['login', 'register'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setAuthMode(m)}
                  style={{
                    flex: 1,
                    padding: '7px',
                    borderRadius: 6,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    background: authMode === m ? 'var(--color-surface-600)' : 'transparent',
                    color: authMode === m ? 'var(--color-surface-50)' : 'var(--color-surface-400)',
                    transition: 'all 0.15s',
                  }}
                >
                  {m === 'login' ? 'Sign In' : 'Register'}
                </button>
              ))}
            </div>

            {authMode === 'register' && (
              <>
                <p style={{ margin: '0 0 12px', fontSize: '0.8rem', color: 'var(--color-surface-300)', fontWeight: 500 }}>
                  Account Type
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                  {[
                    { v: 'retail', icon: <User size={16} />, label: 'Retail Investor', sub: 'Personal account' },
                    { v: 'b2b', icon: <Building2 size={16} />, label: 'Institution', sub: 'B2B / API access' },
                  ].map(({ v, icon, label, sub }) => (
                    <button
                      key={v}
                      onClick={() => setRegRole(v as 'retail' | 'b2b')}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 6,
                        padding: '12px',
                        borderRadius: 8,
                        border: `1px solid ${regRole === v ? 'var(--color-accent-500)' : 'var(--color-surface-500)'}`,
                        background: regRole === v ? 'var(--color-accent-100)' : 'var(--color-surface-800)',
                        color: regRole === v ? 'var(--color-accent-400)' : 'var(--color-surface-300)',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {icon}
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{label}</span>
                      <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>{sub}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {authMode === 'register' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-surface-300)', marginBottom: 6, fontWeight: 500 }}>
                    Full Name
                  </label>
                  <input className="input-base" placeholder="Budi Santoso" />
                </div>
              )}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-surface-300)', marginBottom: 6, fontWeight: 500 }}>
                  Email Address
                </label>
                <input className="input-base" type="email" placeholder="budi@email.com" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-surface-300)', marginBottom: 6, fontWeight: 500 }}>
                  Password
                </label>
                <input className="input-base" type="password" placeholder="••••••••" />
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '11px', marginTop: 4 }}
                onClick={() => {
                  setAuthMode(null)
                  navigate('/dashboard')
                }}
              >
                {authMode === 'login' ? 'Sign In to NexusCapital' : 'Create Account'}
                <ArrowRight size={15} />
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-surface-400)', margin: 0 }}>
                {authMode === 'login' ? (
                  <>No account? <span style={{ color: 'var(--color-accent-400)', cursor: 'pointer' }} onClick={() => setAuthMode('register')}>Register</span></>
                ) : (
                  <>Already have an account? <span style={{ color: 'var(--color-accent-400)', cursor: 'pointer' }} onClick={() => setAuthMode('login')}>Sign in</span></>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Ticker tape marquee keyframe */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
        }
      `}</style>
    </div>
  )
}
