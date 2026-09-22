// ── Mock data for all pages ─────────────────────────────────

export const WATCHLIST = [
  { ticker: 'BBCA', name: 'Bank Central Asia', price: 9_350, change: 1.23, volume: '245M', sector: 'Finance' },
  { ticker: 'TLKM', name: 'Telkom Indonesia', price: 3_870, change: -0.77, volume: '189M', sector: 'Telecom' },
  { ticker: 'ASII', name: 'Astra International', price: 5_125, change: 0.49, volume: '132M', sector: 'Auto' },
  { ticker: 'GOTO', name: 'GoTo Gojek Tokopedia', price: 62, change: -3.12, volume: '891M', sector: 'Tech' },
  { ticker: 'PGEO', name: 'Pertamina Geothermal', price: 1_340, change: 2.14, volume: '78M', sector: 'Energy' },
  { ticker: 'MBMA', name: 'Merdeka Battery Materials', price: 460, change: -1.08, volume: '312M', sector: 'Mining' },
]

export const RECENT_REPORTS = [
  { id: 'r1', ticker: 'BBCA', score: 82, status: 'completed', date: '22 Sep 2026, 09:14', label: 'Strong Bull' },
  { id: 'r2', ticker: 'GOTO', score: 34, status: 'completed', date: '21 Sep 2026, 15:40', label: 'Strong Bear' },
  { id: 'r3', ticker: 'PGEO', score: 67, status: 'completed', date: '20 Sep 2026, 11:22', label: 'Bull' },
  { id: 'r4', ticker: 'NEST', score: 0,  status: 'processing', date: '22 Sep 2026, 10:01', label: '—' },
]

export const PRICE_HISTORY = [
  { date: 'Apr', BBCA: 8900, BMRI: 6200, BBNI: 4700 },
  { date: 'May', BBCA: 9100, BMRI: 6350, BBNI: 4850 },
  { date: 'Jun', BBCA: 8950, BMRI: 6100, BBNI: 4600 },
  { date: 'Jul', BBCA: 9200, BMRI: 6500, BBNI: 5000 },
  { date: 'Aug', BBCA: 9050, BMRI: 6300, BBNI: 4900 },
  { date: 'Sep', BBCA: 9350, BMRI: 6600, BBNI: 5100 },
]

export const REVENUE_DATA = [
  { period: 'Q1 23', revenue: 22.4, profit: 8.1 },
  { period: 'Q2 23', revenue: 24.1, profit: 9.3 },
  { period: 'Q3 23', revenue: 25.8, profit: 10.2 },
  { period: 'Q4 23', revenue: 27.3, profit: 11.5 },
  { period: 'Q1 24', revenue: 26.9, profit: 10.8 },
  { period: 'Q2 24', revenue: 28.7, profit: 12.4 },
]

export const TOKEN_USAGE = [
  { date: 'Mon', tokens: 142000, cost: 4.26 },
  { date: 'Tue', tokens: 198000, cost: 5.94 },
  { date: 'Wed', tokens: 167000, cost: 5.01 },
  { date: 'Thu', tokens: 221000, cost: 6.63 },
  { date: 'Fri', tokens: 183000, cost: 5.49 },
  { date: 'Sat', tokens: 95000,  cost: 2.85 },
  { date: 'Sun', tokens: 78000,  cost: 2.34 },
]

export const QUEUE_JOBS = [
  { id: 'job-001', ticker: 'BBCA', user: 'user_4821', status: 'completed', duration: '28s', created: '09:14:32' },
  { id: 'job-002', ticker: 'NEST', user: 'user_1093', status: 'processing', duration: '12s', created: '10:01:15' },
  { id: 'job-003', ticker: 'ANTM', user: 'b2b_mandiri', status: 'queued', duration: '—', created: '10:03:44' },
  { id: 'job-004', ticker: 'WIFI', user: 'user_7752', status: 'failed', duration: '—', created: '09:58:10' },
  { id: 'job-005', ticker: 'TOBA', user: 'b2b_stockbit', status: 'queued', duration: '—', created: '10:04:02' },
]

export const ADMIN_STATS = {
  reportsToday: 147,
  reportsChange: 12.4,
  tokenCostToday: 32.18,
  tokenCostChange: -4.2,
  activeUsers: 834,
  activeUsersChange: 8.1,
  pendingB2B: 3,
}

export const B2B_PENDING = [
  { id: 'b2b-01', company: 'PT Stockbit Sekuritas', email: 'api@stockbit.com', plan: 'Enterprise', submitted: '21 Sep 2026' },
  { id: 'b2b-02', company: 'Mandiri Sekuritas', email: 'tech@mandiri.co.id', plan: 'Professional', submitted: '20 Sep 2026' },
  { id: 'b2b-03', company: 'Pluang Investasi', email: 'dev@pluang.com', plan: 'Professional', submitted: '19 Sep 2026' },
]

export const CREDIT_TRANSACTIONS = [
  { id: 'tx-01', user: 'user_4821', email: 'budi@email.com', action: 'Report Generated', credits: -1, balance: 14, date: '22 Sep, 09:14' },
  { id: 'tx-02', user: 'user_1093', email: 'sari@email.com', action: 'Top-up (Admin)', credits: +10, balance: 10, date: '22 Sep, 08:30' },
  { id: 'tx-03', user: 'user_7752', email: 'andi@email.com', action: 'Report Failed', credits: 0, balance: 3, date: '21 Sep, 09:58' },
  { id: 'tx-04', user: 'user_3301', email: 'dewi@email.com', action: 'Report Generated', credits: -1, balance: 6, date: '21 Sep, 15:40' },
]

export const TICKER_SUGGESTIONS = [
  { ticker: 'BBCA', name: 'Bank Central Asia Tbk', sector: 'Finance' },
  { ticker: 'BBRI', name: 'Bank Rakyat Indonesia Tbk', sector: 'Finance' },
  { ticker: 'BMRI', name: 'Bank Mandiri Tbk', sector: 'Finance' },
  { ticker: 'TLKM', name: 'Telkom Indonesia Tbk', sector: 'Telecom' },
  { ticker: 'ASII', name: 'Astra International Tbk', sector: 'Auto' },
  { ticker: 'GOTO', name: 'GoTo Gojek Tokopedia Tbk', sector: 'Tech' },
  { ticker: 'PGEO', name: 'Pertamina Geothermal Energy Tbk', sector: 'Energy' },
  { ticker: 'MBMA', name: 'Merdeka Battery Materials Tbk', sector: 'Mining' },
  { ticker: 'NEST', name: 'Nestle Indonesia Tbk', sector: 'FMCG' },
  { ticker: 'ANTM', name: 'Aneka Tambang Tbk', sector: 'Mining' },
  { ticker: 'WIFI', name: 'Solusi Sinergi Digital Tbk', sector: 'Tech' },
  { ticker: 'TOBA', name: 'TBS Energi Utama Tbk', sector: 'Energy' },
  { ticker: 'PTMP', name: 'Patimban International Car Terminal', sector: 'Infra' },
]
