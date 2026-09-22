import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  CheckCircle2, Loader2, Clock, AlertTriangle,
  BarChart3, TrendingUp, Brain, ArrowRight, X,
} from 'lucide-react'

// ── Agent step definitions ────────────────────────────────
interface AgentStep {
  id: number
  agentName: string
  shortName: string
  description: string
  subTasks: string[]
  durationMs: number   // how long this agent takes (simulated)
  color: string
  icon: React.ReactNode
}

const AGENTS: AgentStep[] = [
  {
    id: 1,
    agentName: 'Agent 1 — Fundamental Analyst',
    shortName: 'Fundamental',
    description: 'Fetching financial statements, computing valuation ratios, and evaluating revenue growth trend.',
    subTasks: [
      'Fetching income statement & balance sheet via Sectors API…',
      'Computing P/E, P/B, EV/EBITDA ratios…',
      'Comparing valuations against sector peers…',
      'Scoring revenue CAGR and margin expansion…',
      'Fundamental analysis complete ✓',
    ],
    durationMs: 9000,
    color: '#3b82f6',
    icon: <BarChart3 size={18} />,
  },
  {
    id: 2,
    agentName: 'Agent 2 — Technical & Bandarmologi',
    shortName: 'Technical',
    description: 'Analysing price action, support/resistance levels, volume patterns, and institutional accumulation signals.',
    subTasks: [
      'Fetching 180-day OHLCV data via Sectors API…',
      'Identifying support & resistance zones…',
      'Computing RSI, MACD, and Bollinger Bands…',
      'Scanning bandarmologi — unusual volume clusters…',
      'Technical & bandarmologi analysis complete ✓',
    ],
    durationMs: 9000,
    color: '#f59e0b',
    icon: <TrendingUp size={18} />,
  },
  {
    id: 3,
    agentName: 'Agent 3 — Orchestrator',
    shortName: 'Orchestrator',
    description: 'Synthesising findings from Agent 1 & 2, resolving conflicting signals, computing Nexus Score, and drafting the executive summary.',
    subTasks: [
      'Receiving structured JSON from Agent 1 & 2…',
      'Resolving fundamental vs technical bias conflicts…',
      'Calling LLM (GPT-4o) for narrative synthesis…',
      'Computing proprietary Nexus Score (1–100)…',
      'Finalising risk warnings & executive summary…',
      'Report generation complete ✓',
    ],
    durationMs: 12000,
    color: '#22c55e',
    icon: <Brain size={18} />,
  },
]

type PhaseStatus = 'idle' | 'running' | 'done' | 'error'

interface AgentState {
  status: PhaseStatus
  subTaskIndex: number    // which sub-task log line is showing
  progress: number        // 0-100
}

// ── Animated log line ─────────────────────────────────────
function LogLine({ text, delay }: { text: string; delay: number }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  if (!visible) return null
  return (
    <div
      className="fade-up"
      style={{
        fontSize: '0.78rem',
        color: text.endsWith('✓') ? 'var(--color-bull-400)' : 'var(--color-surface-300)',
        fontFamily: 'var(--font-mono)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
        lineHeight: 1.5,
        paddingLeft: 4,
      }}
    >
      <span style={{ color: 'var(--color-surface-500)', userSelect: 'none', flexShrink: 0 }}>›</span>
      {text}
    </div>
  )
}

// ── Circular progress ring ────────────────────────────────
function ProgressRing({ progress, color, size = 64, stroke = 5 }: { progress: number; color: string; size?: number; stroke?: number }) {
  const r = (size - stroke * 2) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (progress / 100) * circ

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-surface-600)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.4s ease-out' }}
      />
    </svg>
  )
}

// ── Agent card ─────────────────────────────────────────────
function AgentCard({
  agent,
  state,
}: {
  agent: AgentStep
  state: AgentState
  isActive: boolean
}) {
  const { status, subTaskIndex, progress } = state
  const isDone    = status === 'done'
  const isRunning = status === 'running'
  const isIdle    = status === 'idle'

  return (
    <div
      style={{
        background: 'var(--color-surface-700)',
        border: `1px solid ${
          isDone    ? 'rgba(34,197,94,0.3)' :
          isRunning ? agent.color + '4d' :
          'var(--color-surface-500)'
        }`,
        borderRadius: 12,
        padding: '20px',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        boxShadow: isRunning ? `0 0 24px ${agent.color}18` : 'none',
        opacity: isIdle ? 0.5 : 1,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: isRunning ? 16 : 0 }}>
        {/* Icon + ring */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <ProgressRing progress={progress} color={agent.color} />
          <div
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: isDone ? 'var(--color-bull-500)' : isRunning ? agent.color : 'var(--color-surface-500)',
            }}
          >
            {isDone ? <CheckCircle2 size={22} /> : isRunning ? (
              <div style={{ animation: 'spin 1.2s linear infinite' }}>
                <Loader2 size={20} />
              </div>
            ) : agent.icon}
          </div>
        </div>

        {/* Title + status */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-surface-100)' }}>
              {agent.agentName}
            </span>
            <span
              style={{
                fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.06em',
                textTransform: 'uppercase', padding: '2px 8px', borderRadius: 999,
                background: isDone ? 'var(--color-bull-100)' : isRunning ? agent.color + '22' : 'var(--color-surface-600)',
                color: isDone ? 'var(--color-bull-400)' : isRunning ? agent.color : 'var(--color-surface-400)',
              }}
            >
              {isDone ? 'Done' : isRunning ? 'In Progress' : 'Waiting'}
            </span>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: 'var(--color-surface-400)', lineHeight: 1.5 }}>
            {agent.description}
          </p>
        </div>

        {/* Progress % */}
        <span
          style={{
            fontSize: '1rem', fontWeight: 700, color: isDone ? 'var(--color-bull-400)' : agent.color,
            fontVariantNumeric: 'tabular-nums', flexShrink: 0, minWidth: 40, textAlign: 'right',
          }}
        >
          {isDone ? '100%' : isRunning ? `${Math.round(progress)}%` : '—'}
        </span>
      </div>

      {/* Log terminal */}
      {(isRunning || isDone) && (
        <div
          style={{
            background: 'var(--color-surface-900)',
            border: '1px solid var(--color-surface-600)',
            borderRadius: 8,
            padding: '12px 14px',
            marginTop: 14,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            minHeight: 80,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
            <span style={{ fontSize: '0.65rem', color: 'var(--color-surface-500)', marginLeft: 4, fontFamily: 'var(--font-mono)' }}>
              agent_{agent.id}.log
            </span>
          </div>
          {agent.subTasks.slice(0, subTaskIndex + 1).map((task, i) => (
            <LogLine key={i} text={task} delay={i * 200} />
          ))}
          {isRunning && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 12 }}>
              <div
                style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: agent.color,
                  animation: 'cursor-blink 1s ease-in-out infinite',
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────
export default function ReportGeneratingPage() {
  const { ticker = 'BBCA' } = useParams<{ ticker: string }>()
  const navigate = useNavigate()

  const [agentStates, setAgentStates] = useState<AgentState[]>(
    AGENTS.map(() => ({ status: 'idle', subTaskIndex: 0, progress: 0 }))
  )
  const [currentAgent, setCurrentAgent] = useState(0) // 0-indexed
  const [overallProgress, setOverallProgress] = useState(0)
  const [done, setDone] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const startTime = useRef(Date.now())

  // Elapsed timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime.current) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Sequence agents one by one
  useEffect(() => {
    if (currentAgent >= AGENTS.length) {
      setDone(true)
      return
    }

    const agent = AGENTS[currentAgent]
    const totalMs = agent.durationMs
    const subTaskCount = agent.subTasks.length
    const subInterval = totalMs / subTaskCount

    // Mark as running
    setAgentStates((prev) => {
      const next = [...prev]
      next[currentAgent] = { status: 'running', subTaskIndex: 0, progress: 0 }
      return next
    })

    // Progress ticker — updates every 120ms
    const progressInterval = setInterval(() => {
      setAgentStates((prev) => {
        const next = [...prev]
        const cur = next[currentAgent]
        if (cur.status !== 'running') return prev
        const newProgress = Math.min(cur.progress + (120 / totalMs) * 100, 99)
        next[currentAgent] = { ...cur, progress: newProgress }
        return next
      })
    }, 120)

    // Sub-task reveal ticker
    const subTimers = agent.subTasks.map((_, i) =>
      setTimeout(() => {
        setAgentStates((prev) => {
          const next = [...prev]
          next[currentAgent] = { ...next[currentAgent], subTaskIndex: i }
          return next
        })
      }, i * subInterval)
    )

    // When this agent finishes
    const doneTimer = setTimeout(() => {
      clearInterval(progressInterval)
      setAgentStates((prev) => {
        const next = [...prev]
        next[currentAgent] = {
          status: 'done',
          subTaskIndex: agent.subTasks.length - 1,
          progress: 100,
        }
        return next
      })

      // Update overall progress
      const doneCount = currentAgent + 1
      setOverallProgress(Math.round((doneCount / AGENTS.length) * 100))

      // Move to next agent
      setCurrentAgent((c) => c + 1)
    }, totalMs)

    return () => {
      clearInterval(progressInterval)
      subTimers.forEach(clearTimeout)
      clearTimeout(doneTimer)
    }
  }, [currentAgent])

  const totalSeconds = AGENTS.reduce((s, a) => s + a.durationMs, 0) / 1000

  return (
    <div
      style={{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 800,
        margin: '0 auto',
        gap: 24,
      }}
    >
      {/* ── Header ──────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span className="ticker-badge" style={{ fontSize: '0.9rem', padding: '4px 12px' }}>{ticker}</span>
            {!done ? (
              <span
                style={{
                  fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-accent-400)',
                  background: 'var(--color-accent-100)', borderRadius: 999, padding: '2px 10px',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent-500)', display: 'inline-block', animation: 'cursor-blink 1s infinite' }} />
                AI Agents Working
              </span>
            ) : (
              <span
                style={{
                  fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-bull-400)',
                  background: 'var(--color-bull-100)', borderRadius: 999, padding: '2px 10px',
                }}
              >
                ✓ Report Ready
              </span>
            )}
          </div>
          <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-surface-50)', letterSpacing: '-0.01em' }}>
            {done ? 'Research complete — Nexus Score ready' : `Generating Nexus Report for ${ticker}`}
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: '0.82rem', color: 'var(--color-surface-400)' }}>
            {done
              ? 'All 3 agents finished. Your one-pager report is ready to view.'
              : `3 specialised agents are collaborating. Estimated time: ~${Math.round(totalSeconds)}s`}
          </p>
        </div>

        <button className="btn btn-ghost" style={{ fontSize: '0.8rem' }} onClick={() => navigate('/dashboard')}>
          <X size={14} /> Cancel
        </button>
      </div>

      {/* ── Overall progress bar ─────────────────────────── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-surface-300)', fontWeight: 500 }}>
            Overall progress
          </span>
          <div style={{ display: 'flex', gap: 16, fontSize: '0.78rem', color: 'var(--color-surface-400)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={11} /> {elapsed}s elapsed
            </span>
            <span style={{ fontWeight: 600, color: done ? 'var(--color-bull-400)' : 'var(--color-surface-200)' }}>
              {overallProgress}%
            </span>
          </div>
        </div>
        <div
          style={{
            height: 6, borderRadius: 3,
            background: 'var(--color-surface-600)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${overallProgress}%`,
              borderRadius: 3,
              background: done
                ? 'var(--color-bull-500)'
                : 'linear-gradient(90deg, var(--color-accent-600), var(--color-accent-400))',
              transition: 'width 0.6s ease-out',
            }}
          />
        </div>

        {/* Agent step indicators */}
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          {AGENTS.map((agent, i) => {
            const s = agentStates[i]
            return (
              <div key={agent.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div
                  style={{
                    width: '100%', height: 3, borderRadius: 2,
                    background: s.status === 'done' ? 'var(--color-bull-500)' : s.status === 'running' ? agent.color : 'var(--color-surface-600)',
                    transition: 'background 0.4s',
                  }}
                />
                <span style={{ fontSize: '0.68rem', color: s.status === 'idle' ? 'var(--color-surface-500)' : 'var(--color-surface-300)', fontWeight: 500 }}>
                  {agent.shortName}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Agent cards ──────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {AGENTS.map((agent, i) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            state={agentStates[i]}
            isActive={currentAgent === i}
          />
        ))}
      </div>

      {/* ── Report Ready CTA ─────────────────────────────── */}
      {done && (
        <div
          className="fade-up"
          style={{
            background: 'var(--color-surface-700)',
            border: '1px solid rgba(34,197,94,0.35)',
            borderRadius: 14,
            padding: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
            boxShadow: '0 0 32px rgba(34,197,94,0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'var(--color-bull-100)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <CheckCircle2 size={22} color="var(--color-bull-500)" />
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-surface-50)' }}>
                Nexus Report for {ticker} is ready
              </p>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--color-surface-400)' }}>
                Generated in {elapsed}s · 1 credit deducted
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary" style={{ fontSize: '0.85rem' }} onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </button>
            <button
              className="btn btn-primary"
              style={{ fontSize: '0.85rem' }}
              onClick={() => navigate('/reports/r1')}
            >
              View Report <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── Info footer ──────────────────────────────────── */}
      {!done && (
        <div
          style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            padding: '14px 16px',
            background: 'var(--color-accent-100)',
            border: '1px solid rgba(59,130,246,0.2)',
            borderRadius: 10,
            fontSize: '0.8rem',
            color: 'var(--color-surface-300)',
            lineHeight: 1.6,
          }}
        >
          <AlertTriangle size={14} color="var(--color-accent-400)" style={{ marginTop: 2, flexShrink: 0 }} />
          <span>
            Your report is being processed asynchronously via a distributed queue.
            You can safely navigate away — we'll notify you when it's done.
            <strong style={{ color: 'var(--color-accent-400)' }}> 1 credit</strong> will be deducted upon completion.
          </span>
        </div>
      )}

      {/* Keyframes for spin + blink */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
