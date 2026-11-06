// ---------- Helpers ----------
export const pad2 = (n) => String(n).padStart(2, '0')
export const fmtDMY = (d) => `${pad2(d.getDate())}-${pad2(d.getMonth() + 1)}-${d.getFullYear()}`
export const parseDMY = (s) => {
  const [d, m, y] = s.split(' ')[0].split('-').map(Number)
  return new Date(y, m - 1, d)
}
export const naira = (n) => `N${Number(n).toLocaleString('en-NG')}`
export const ugx = (n) => `UGX ${Number(n).toLocaleString('en-US')}`

// deterministic pseudo random
function rng(seed) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

// ---------- User ----------
export const USER = {
  firstName: 'Oyindamola',
  lastName: 'Oladayo',
  fullName: 'Oyindamola Oladayo',
  email: 'oyindamola.oladayo@email.com',
  primaryPhone: '0902 345 6788',
  secondaryPhone: '0803 123 4567',
  createdAt: '2025-01-10T09:42:00',
  initials: 'OO',
  deviceId: '123456789',
  phone: '0772 123 456',
  lastLogin: '25-01-2025  12:15pm',
}

// ---------- Devices (active scenario) ----------
export const DEVICES = [
  {
    id: 'phone',
    label: 'Rodiall Phone 13 Pro',
    kind: 'phone',
    model: 'Rodiall Pro 13 (RP13-4G)',
    serial: 'RDL13P2501048213',
    uid: '8F2C41AD-9B7E-4C02-A1D7-5E93B0C4F218',
    summaryTitle: 'Device Summary',
    summary: [
      ['Phone Number', '090234567880'],
      ['Device IMEI', '1234567890123456'],
      ['Device Type', 'Smartphone'],
      ['Model', 'Rodiall Pro'],
      ['Last Payment', '23 / 09 / 2026'],
    ],
  },
  {
    id: 'mifi',
    label: 'MTN MiFi M5 CPE',
    kind: 'mifi',
    model: 'MTN MiFi M5 CPE (M5-5G)',
    serial: 'MTNM5C2412077360',
    uid: '3B91E7C0-52AF-4D18-9E6B-C2047A8D1F95',
    summaryTitle: 'Account Summary',
    summary: [
      ['Phone Number', '090234567880'],
      ['Device IMEI', '1234567890123456'],
      ['Device Type', 'Portable Mifi'],
      ['Model', 'Rodiall Pro'],
      ['Last Payment', '23 / 09 / 2026'],
    ],
  },
]

export const OVERVIEW = [
  { key: 'outstanding', label: 'Outstanding balance', value: 'N51,000.00', tone: 'yellow', icon: 'wallet' },
  { key: 'repayment', label: 'Total Repayment Amount', value: 'N65,199.94', tone: 'blue', icon: 'calendar' },
  { key: 'paid', label: 'Total Amount Paid', value: 'N20,000.00', tone: 'peach', icon: 'check' },
  { key: 'repayment-total', label: 'Total Repayment Amount', value: 'N250,000.00', tone: 'lavender', icon: 'coins' },
]

export const MIFI_SUBSCRIPTIONS = [
  { type: 'MTN 5GB for ₦1,500', expiry: '22-12-2025' },
  { type: 'MTN 15GB for ₦10,500', expiry: '22-12-2025' },
  { type: 'MTN 2GB for ₦750', expiry: '29-12-2025' },
  { type: 'MTN 1GB Daily for ₦350', expiry: '05-01-2026' },
]

const phoneHistory = [
  ['Storage Upgrade', 'Bank Transfer', 'Successful', '02:23'],
  ['Repayment', 'Card', 'Failed', '14:15'],
  ['Repay+ Airtime Advance', 'MoMo', 'Successful', '02:23'],
  ['Storage Renewal', 'Bank Transfer', 'Pending', '02:23'],
  ['MOMO', 'Card', 'Successful', '02:23'],
  ['Card', 'MoMo', 'Failed', '02:23'],
  ['MOMO', 'Bank Transfer', 'Failed', '02:23'],
]
export const PHONE_PURCHASES = phoneHistory.map(([description, method, status, time], i) => ({
  id: `pp-${i}`,
  sn: pad2(i + 1),
  ref: '1234567ABC',
  description,
  amount: 2000,
  date: `10-01-2025 | ${time}`,
  method,
  status,
}))
export const MIFI_PURCHASES = PHONE_PURCHASES.map((r) => ({ ...r, id: r.id.replace('pp', 'mp'), description: 'Repayment' }))

// ---------- Purchase history (subscriptions) ----------
const subSeed = [
  ['PAYG', 'MOMO', '24 hours', 'Successful'],
  ['Renewal', 'Card', '7 Days', 'Failed'],
  ['PAYG', 'MOMO', '24 hours', 'Successful'],
  ['PAYG', 'Card', '1 month', 'Failed'],
  ['PAYG', 'MOMO', '24 hours', 'Successful'],
  ['Renewal', 'Card', '24 hours', 'Failed'],
  ['Renewal', 'MOMO', '1 month', 'Failed'],
]
const durDays = { '24 hours': 1, '7 Days': 7, '1 month': 30 }
const amountFor = { '24 hours': 2000, '7 Days': 5000, '1 month': 15000 }

function buildSubscriptions() {
  const r = rng(17)
  const rows = []
  for (let i = 0; i < 70; i++) {
    let type, payment, duration, status, date
    if (i < subSeed.length) {
      ;[type, payment, duration, status] = subSeed[i]
      date = new Date(2025, 0, 10)
    } else {
      type = r() > 0.5 ? 'PAYG' : 'Renewal'
      payment = r() > 0.5 ? 'MOMO' : 'Card'
      duration = ['24 hours', '7 Days', '1 month'][Math.floor(r() * 3)]
      status = r() > 0.35 ? 'Successful' : 'Failed'
      date = new Date(2025, 0, 10 - Math.floor((i - 6) / 2))
    }
    const amount = i < subSeed.length ? 2000 : amountFor[duration]
    const exp = i < subSeed.length ? new Date(2025, 0, 10) : new Date(date.getTime() + durDays[duration] * 864e5)
    rows.push({
      id: `sub-${i}`,
      sn: pad2(i + 1),
      type,
      payment,
      duration,
      amount,
      date: fmtDMY(date),
      expiry: fmtDMY(exp),
      status,
      ref: `RDL${(830120 + i * 37).toString()}`,
    })
  }
  return rows
}
export const SUBSCRIPTIONS = buildSubscriptions()

const paySeed = [
  ['PAYG', 'MOMO wallet', 'Successful'],
  ['Renewal', 'Card', 'Failed'],
  ['Renewal', 'MOMO Wallet', 'Successful'],
  ['PAYG', 'Card', 'Pending'],
  ['Renewal', 'Card', 'Successful'],
  ['PAYG', 'Card', 'Pending'],
  ['PAYG', 'Card', 'Pending'],
]
function buildPayments() {
  const r = rng(91)
  const rows = []
  for (let i = 0; i < 70; i++) {
    let type, method, status, date, bundle
    if (i < paySeed.length) {
      ;[type, method, status] = paySeed[i]
      date = new Date(2025, 0, 10)
      bundle = '2GB Daily'
    } else {
      type = r() > 0.5 ? 'PAYG' : 'Renewal'
      method = r() > 0.5 ? 'MOMO Wallet' : 'Card'
      const s = r()
      status = s > 0.4 ? 'Successful' : s > 0.18 ? 'Failed' : 'Pending'
      bundle = ['2GB Daily', '5GB Weekly', '10GB Monthly'][Math.floor(r() * 3)]
      date = new Date(2025, 0, 10 - Math.floor((i - 6) / 2))
    }
    rows.push({
      id: `pay-${i}`,
      sn: pad2(i + 1),
      type,
      bundle,
      method,
      amount: 2000,
      date: fmtDMY(date),
      status,
      ref: `TXN${(552019 + i * 53).toString()}`,
    })
  }
  return rows
}
export const PAYMENTS = buildPayments()

// ---------- Storage ----------
export const STORAGE_PLANS = [
  { gb: 2, price: 2000, popular: true },
  { gb: 4, price: 2000, popular: true },
  { gb: 6, price: 2000 },
  { gb: 8, price: 2000 },
  { gb: 16, price: 2000 },
  { gb: 25, price: 2000 },
]

// ---------- Rodiall onboarding catalogue ----------
export const RODIALL_DEVICES = [
  {
    id: 'pro4g',
    short: 'Rodiall 4G',
    name: 'RodiallPro 4G',
    price: 150000,
    chips: ['4GB RAM', '20GB ROM', '6.5” Display', '13MP Dual Camera'],
    specs: [
      ['20GB ROM (Expandable in app)', '13MP Dual Camera'],
      ['4GB RAM', '5,000 mAh Battery'],
      ['6.5” Display', '4G Network'],
    ],
  },
  {
    id: 'pro5g',
    short: 'Rodiall 5G',
    name: 'RodiallPro 5G',
    price: 250000,
    chips: ['6GB RAM', '64GB ROM', '6.7” Display', '50MP Dual Camera'],
    specs: [
      ['64GB ROM (Expandable in app)', '50MP Dual Camera'],
      ['6GB RAM', '5,000 mAh Battery'],
      ['6.7” Display', '5G Network'],
    ],
  },
]

export const STORES = [
  {
    id: 'ntinda',
    name: 'Rodiall Agent Hub, Ntinda',
    address: 'Ntinda Complex, Ntinda Road, Nakawa Division, Kampala.',
    hours: 'Mon - Sat, 09AM - 06PM',
    left: 2,
    keywords: ['ntinda', 'nakawa', 'naguru', 'kyambogo', 'bukoto'],
  },
  {
    id: 'kololo',
    name: 'Rodiall Agent Hub, Kololo',
    address: 'Plot 12, Acacia Avenue, Kololo, Kampala.',
    hours: 'Mon - Sat, 09AM - 07PM',
    left: 5,
    keywords: ['kololo', 'acacia', 'bugolobi', 'nakasero', 'kamwokya'],
  },
  {
    id: 'wandegeya',
    name: 'Rodiall Agent Hub, Wandegeya',
    address: 'Wandegeya Market Complex, Bombo Road, Kampala.',
    hours: 'Mon - Sun, 08AM - 06PM',
    left: 3,
    keywords: ['wandegeya', 'makerere', 'bombo', 'kawempe', 'mulago'],
  },
]

// Areas where home delivery is currently live
export const DELIVERY_AREAS = [
  'kampala', 'ntinda', 'nakawa', 'kololo', 'naguru', 'bugolobi', 'bukoto', 'kira', 'najjera',
  'wandegeya', 'makerere', 'kamwokya', 'nakasero', 'muyenga', 'kansanga', 'kabalagala', 'makindye', 'rubaga', 'kyambogo',
]

export function nearestStore(address = '') {
  const a = address.toLowerCase()
  return STORES.find((s) => s.keywords.some((k) => a.includes(k))) || STORES[0]
}
export function deliveryAvailable(address = '') {
  const a = address.toLowerCase()
  return DELIVERY_AREAS.some((k) => a.includes(k))
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export function collectByLabel(iso) {
  const d = new Date(new Date(iso).getTime() + 864e5)
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`
}
export function agentCallLabel(iso) {
  const d = new Date(new Date(iso).getTime() + 864e5)
  let h = d.getHours() + 1
  if (h < 9) h = 10
  if (h > 18) h = 16
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hh = h % 12 === 0 ? 12 : h % 12
  return `${DAYS[d.getDay()].slice(0, 3)} ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}  |  ${hh}${ampm}`
}
export function makeReservationCode() {
  const L = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const pick = () => L[Math.floor(Math.random() * L.length)]
  return `${pick()}${pick()}${pick()} ${pick()}${pick()}${pick()} ${Math.floor(100 + Math.random() * 900)}`
}

export const DEFAULT_RESERVATION = {
  deviceId: 'pro4g',
  method: 'pickup',
  code: 'ABC DEF 123',
  address: '14, Ntinda Road, Kampala',
  storeId: 'ntinda',
  createdAt: new Date().toISOString(),
}

// ---------- Cards ----------
export const DEFAULT_CARDS = [
  { id: 'c1', first4: '4562', last4: '7852', name: 'AR Jonson', brand: 'Mastercard', isDefault: true },
  { id: 'c2', first4: '4562', last4: '3021', name: 'AR Jonson', brand: 'Mastercard', isDefault: false },
  { id: 'c3', first4: '4562', last4: '9914', name: 'AR Jonson', brand: 'Mastercard', isDefault: false },
]

// ---------- Notifications ----------
// `ago` = minutes before "now"; converted to an exact timestamp (`at`) when seeded.
const PAY = { label: 'Go to payments', to: '/purchase-history?tab=payments' }
const SEEDS = {
  active: [
    { id: 'n0', tone: 'celebrate', icon: 'party', ago: 1, read: false, cat: 'Repayment', title: 'Your device is paid off!', body: 'N108,000.00 has been fully repaid. Your Rodiall Phone 13 Pro is permanently unlocked and belongs to you. No more deductions, ever. Rodiall is proud of you!', action: { label: 'View dashboard', to: '/dashboard' } },
    { id: 'n1', tone: 'warning', icon: 'clock', ago: 2, read: false, cat: 'Payments', title: 'Repayment due soon', body: 'Your next repayment of N2,000 for MTN MiFi M5 CPE is due on 12-01-2025. Pay early to keep your device active without interruption.', action: { ...PAY, label: 'Pay now' } },
    { id: 'n2', tone: 'success', icon: 'database', ago: 60, read: false, cat: 'Storage', title: 'Storage upgrade successful', body: '2 GB fractional storage has been added to your Rodiall Phone 13 Pro. It is valid for 30 days.', action: { label: 'View storage', to: '/storage' } },
    { id: 'n3', tone: 'danger', icon: 'card', ago: 180, read: false, cat: 'Payments', title: 'Payment failed', body: 'Your card payment of N2,000 for Renewal could not be completed. Please retry, or switch to MoMo from MTN.', action: { ...PAY, label: 'Retry payment' } },
    { id: 'n4', tone: 'info', icon: 'wifi', ago: 1440, read: true, cat: 'Subscriptions', title: 'Data bundle renewal', body: 'Your MTN 5GB for ₦1,500 bundle on MTN MiFi M5 CPE renews on 22-12-2025.', action: { label: 'View subscriptions', to: '/purchase-history' } },
    { id: 'n5', tone: 'success', icon: 'coins', ago: 4320, read: true, cat: 'Repay+', title: 'Repay+ Airtime Advance credited', body: 'N2,000 airtime advance has been credited to 090234567880.', action: { label: 'Open Repay+ Plus', to: '/repay-plus' } },
    { id: 'n6', tone: 'info', icon: 'shield', ago: 5760, read: true, cat: 'Security', title: 'New sign-in detected', body: 'A new sign-in to your account from Chrome Desktop (macOS) was recorded. If this wasn’t you, change your password right away.', action: { label: 'Review security', to: '/settings?tab=security' } },
  ],
  reserved: [
    { id: 'r1', tone: 'success', icon: 'package', ago: 0, read: false, cat: 'Device', title: 'Your device is reserved', body: 'Your Rodiall device has been reserved. Visit the pickup store or wait for the activation agent to complete activation.', action: { label: 'View activation details', to: '/dashboard' } },
    { id: 'r2', tone: 'info', icon: 'message', ago: 0, read: false, cat: 'Device', title: 'Activation details sent', body: `An SMS with your reservation code and activation details was sent to ${USER.phone}.` },
    { id: 'r3', tone: 'info', icon: 'clipboard-check', ago: 5, read: true, cat: 'Account', title: 'Profiling completed', body: 'Thanks for answering a few questions. We matched you with a phone that fits how you use your device.' },
    { id: 'r4', tone: 'info', icon: 'user', ago: 30, read: true, cat: 'Account', title: 'Welcome to Rodiall', body: 'Your account has been created successfully.' },
  ],
  new: [
    { id: 'w1', tone: 'warning', icon: 'clipboard-list', ago: 0, read: false, cat: 'Account', title: 'Complete your profiling', body: 'Answer two quick questions so we can match and reserve the right device for you.', action: { label: 'Complete profiling', to: '/get-started' } },
    { id: 'w2', tone: 'success', icon: 'user', ago: 20, read: false, cat: 'Account', title: 'Welcome to Rodiall', body: 'Your account has been created successfully. Explore Repay+ Plus while you get set up.', action: { label: 'Explore Repay+ Plus', to: '/repay-plus' } },
    { id: 'w3', tone: 'info', icon: 'shield', ago: 25, read: true, cat: 'Security', title: 'Secure your account', body: 'Two-factor authentication is active on your account with Google Authenticator.', action: { label: 'Security settings', to: '/settings?tab=security' } },
  ],
}

export function seedNotifications(scenario) {
  const now = Date.now()
  return (SEEDS[scenario] || SEEDS.new).map(({ ago, ...n }) => ({ ...n, at: new Date(now - ago * 60000).toISOString() }))
}

export function relativeTime(iso) {
  if (!iso) return ''
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`
  const days = Math.round(hrs / 24)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function fullDateTime(iso) {
  const d = new Date(iso)
  const date = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: '2-digit', year: 'numeric' })
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  return `${date} · ${time}`
}
