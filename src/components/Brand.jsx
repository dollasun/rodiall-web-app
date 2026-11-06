import { useId } from 'react'
import { siWhatsapp, siTiktok, siYoutube, siInstagram, siFacebook, siSnapchat, siNetflix } from 'simple-icons'
import { Landmark } from 'lucide-react'

export function MtnLogo({ width = 78 }) {
  return (
    <svg width={width} viewBox="0 0 80 40" aria-label="MTN" role="img">
      <ellipse cx="40" cy="20" rx="37.5" ry="17.5" fill="none" stroke="currentColor" strokeWidth="3" />
      <text x="40" y="26.5" textAnchor="middle" fontFamily="Manrope, Arial, sans-serif" fontWeight="800" fontSize="18" fill="currentColor" letterSpacing="0.5">
        MTN
      </text>
    </svg>
  )
}

export function RodiallLogo({ height = 30, color = '#1e1b4b' }) {
  return (
    <svg height={height} viewBox="0 0 132 34" aria-label="Rodiall" role="img">
      <circle className="rd-ring" cx="16" cy="16" r="11.5" fill="none" style={{ stroke: `var(--rd-ring, ${color})` }} strokeWidth="6.5" />
      <path className="rd-ring" d="M22 22 L29 29" style={{ stroke: `var(--rd-ring, ${color})` }} strokeWidth="6.5" strokeLinecap="round" />
      <path d="M12.3 22.6 a3.4 3.4 0 0 1 4.6 0" fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M10.6 20.6 a6 6 0 0 1 8 0" fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="14.6" cy="24.6" r="1.1" fill={color} />
      <text x="36" y="25" fontFamily="Lato, Manrope, Arial, sans-serif" fontWeight="900" fontSize="22" fill={color} letterSpacing="-0.4">
        Rodiall
      </text>
    </svg>
  )
}

const WALLPAPERS = {
  lilac: ['#f6f3fb', '#cfc4ec', '#9d8bd6', '#6c5bb5', '#e9e2f7'],
  ocean: ['#eef6fb', '#b9daf0', '#6fa8d8', '#2f6aa8', '#dcebf7'],
  sunset: ['#fff5ec', '#f8d0a8', '#ef9d6a', '#c45d3f', '#fde6d2'],
}

/** Crisp SVG smartphone mockup. view: 'front' | 'back' */
export function PhoneMockup({ height = 300, view = 'front', wallpaper = 'lilac', time = '23:48' }) {
  const id = useId().replace(/:/g, '')
  const [w0, w1, w2, w3, w4] = WALLPAPERS[wallpaper] || WALLPAPERS.lilac
  const width = height * (200 / 410)
  if (view === 'back') {
    return (
      <svg width={width} height={height} viewBox="0 0 200 410" aria-label="Phone back view" role="img">
        <defs>
          <linearGradient id={`b${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2b2c3a" />
            <stop offset="0.55" stopColor="#1b1c26" />
            <stop offset="1" stopColor="#34303f" />
          </linearGradient>
          <linearGradient id={`s${id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="0.4" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <ellipse cx="100" cy="404" rx="80" ry="5" fill="#000" opacity="0.12" />
        <rect x="6" y="4" width="188" height="398" rx="30" fill={`url(#b${id})`} />
        <rect x="6" y="4" width="188" height="398" rx="30" fill={`url(#s${id})`} />
        <rect x="22" y="22" width="62" height="96" rx="20" fill="#121219" stroke="#3a3b4a" strokeWidth="1.5" />
        {[46, 88].map((cy) => (
          <g key={cy}>
            <circle cx="53" cy={cy} r="15" fill="#0b0b10" stroke="#4a4b5c" strokeWidth="2" />
            <circle cx="53" cy={cy} r="8" fill="#1d2140" />
            <circle cx="50" cy={cy - 3} r="2.5" fill="#6b74c9" opacity="0.7" />
          </g>
        ))}
        <circle cx="72" cy="108" r="3.5" fill="#f5e7b5" />
        <text x="100" y="330" textAnchor="middle" fontFamily="Lato, Arial" fontWeight="900" fontSize="18" fill="#d8d8e6" opacity="0.85">
          Rodiall
        </text>
        <rect x="194" y="96" width="3" height="40" rx="1.5" fill="#22232e" />
        <rect x="194" y="150" width="3" height="24" rx="1.5" fill="#22232e" />
      </svg>
    )
  }
  const apps1 = ['#e8483f', '#ffffff', '#f3f1e9', '#ffffff']
  const apps2 = ['#2fae4f', '#3b82f6', '#e94235', '#e8483f']
  return (
    <svg width={width} height={height} viewBox="0 0 200 410" aria-label="Phone front view" role="img">
      <defs>
        <linearGradient id={`w${id}`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor={w0} />
          <stop offset="0.6" stopColor={w4} />
          <stop offset="1" stopColor={w0} />
        </linearGradient>
        <clipPath id={`c${id}`}>
          <rect x="14" y="12" width="172" height="382" rx="24" />
        </clipPath>
      </defs>
      <ellipse cx="100" cy="404" rx="80" ry="5" fill="#000" opacity="0.12" />
      <rect x="6" y="4" width="188" height="398" rx="30" fill="#1a1a1f" />
      <rect x="8" y="6" width="184" height="394" rx="28" fill="#0d0d10" />
      <g clipPath={`url(#c${id})`}>
        <rect x="14" y="12" width="172" height="382" fill={`url(#w${id})`} />
        {/* crystal wallpaper */}
        <polygon points="40,40 120,10 186,60 150,210 70,190" fill={w1} opacity="0.85" />
        <polygon points="120,10 186,60 186,10" fill={w2} opacity="0.55" />
        <polygon points="70,190 150,210 110,250" fill={w2} opacity="0.75" />
        <polygon points="40,40 70,190 14,140" fill={w2} opacity="0.35" />
        <polygon points="120,10 150,210 105,90" fill={w3} opacity="0.45" />
        <polygon points="105,90 150,210 70,190" fill={w3} opacity="0.3" />
        <polygon points="14,240 90,215 186,280 186,394 14,394" fill={w4} opacity="0.6" />
        {/* status bar */}
        <text x="30" y="30" fontSize="8" fontFamily="Arial" fill="#222" fontWeight="600">{time}</text>
        <circle cx="100" cy="26" r="5" fill="#0d0d10" />
        <rect x="148" y="23" width="14" height="7" rx="2" fill="none" stroke="#222" strokeWidth="1" />
        <rect x="149.5" y="24.5" width="10" height="4" rx="1" fill="#222" />
        <path d="M136 30 l4 -6 l4 6 z" fill="#222" />
        {/* weather */}
        <g transform="translate(86 160)">
          <circle cx="8" cy="8" r="6" fill="#fff" opacity="0.95" />
          <circle cx="15" cy="10" r="5" fill="#fff" opacity="0.95" />
          <text x="24" y="14" fontSize="13" fontFamily="Arial" fill="#fff" fontWeight="600">2°</text>
        </g>
        <text x="100" y="186" textAnchor="middle" fontSize="6" fontFamily="Arial" fill="#fff" opacity="0.9">Kampala · Cloudy</text>
        {/* search bar */}
        <rect x="28" y="236" width="144" height="16" rx="8" fill="#fff" opacity="0.95" />
        <text x="38" y="247" fontSize="6" fontFamily="Arial" fill="#888">Search</text>
        <circle cx="162" cy="244" r="3" fill="#4a7af0" />
        <circle cx="96" cy="270" r="1.6" fill="#fff" />
        <circle cx="104" cy="270" r="1.6" fill="#fff" opacity="0.6" />
        {/* app rows */}
        {[apps1, apps2].map((row, ri) =>
          row.map((c, i) => (
            <g key={`${ri}-${i}`}>
              <rect x={30 + i * 37} y={290 + ri * 40} width="26" height="26" rx="8" fill={c} />
              <circle cx={43 + i * 37} cy={303 + ri * 40} r="6" fill={ri === 0 && i > 0 ? ['#34a853', '#fbbc05', '#ea4335'][i - 1] : '#fff'} opacity={ri === 0 && i > 0 ? 0.9 : 0.85} />
            </g>
          )),
        )}
        <rect x="70" y="378" width="60" height="3" rx="1.5" fill="#333" opacity="0.4" />
      </g>
      <rect x="194" y="96" width="3" height="40" rx="1.5" fill="#22232e" />
      <rect x="194" y="150" width="3" height="24" rx="1.5" fill="#22232e" />
    </svg>
  )
}

// ---------- App tiles (onboarding Q1) ----------
const BRAND = {
  whatsapp: { icon: siWhatsapp, bg: '#25D366', fg: '#fff' },
  tiktok: { icon: siTiktok, bg: '#000', fg: '#fff' },
  youtube: { icon: siYoutube, bg: '#FF0033', fg: '#fff' },
  instagram: { icon: siInstagram, bg: 'linear-gradient(45deg,#f9ce34,#ee2a7b,#6228d7)', fg: '#fff' },
  facebook: { icon: siFacebook, bg: '#1877F2', fg: '#fff' },
  snapchat: { icon: siSnapchat, bg: '#FFFC00', fg: '#111' },
  netflix: { icon: siNetflix, bg: '#000', fg: '#E50914' },
}
export function AppTile({ app, size = 22 }) {
  if (app === 'boomplay') {
    return (
      <span className="app-tile" style={{ width: size, height: size, background: '#0b0b0b' }}>
        <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" fill="none" stroke="#2fd4ff" strokeWidth="2.4" />
          <path d="M10 8 v8 l6 -4 z" fill="#ffd400" />
        </svg>
      </span>
    )
  }
  if (app === 'banking') {
    return (
      <span className="app-tile" style={{ width: size, height: size, background: '#39b56a', color: '#fff' }}>
        <Landmark size={size * 0.58} />
      </span>
    )
  }
  const b = BRAND[app]
  return (
    <span className="app-tile" style={{ width: size, height: size, background: b.bg }}>
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill={b.fg}>
        <path d={b.icon.path} />
      </svg>
    </span>
  )
}

// ---------- Coming soon illustration (box with wings) ----------
export function FlyingBox({ width = 180 }) {
  return (
    <svg width={width} viewBox="0 0 200 140" aria-hidden="true">
      <defs>
        <linearGradient id="fbTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f0b878" />
          <stop offset="1" stopColor="#d99353" />
        </linearGradient>
        <linearGradient id="fbL" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e9a35f" />
          <stop offset="1" stopColor="#cf8441" />
        </linearGradient>
        <linearGradient id="fbR" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d58a48" />
          <stop offset="1" stopColor="#b8702f" />
        </linearGradient>
      </defs>
      {/* left wing */}
      <path d="M58 52 C30 30 8 34 2 22 C24 26 40 20 52 28 C38 18 30 10 34 4 C46 18 60 26 70 44 Z" fill="#fff" stroke="#e3e6ef" strokeWidth="1.2" />
      <path d="M60 58 C40 50 22 52 12 44 C30 44 44 42 58 50 Z" fill="#f4f5fa" stroke="#e3e6ef" strokeWidth="1" />
      {/* box */}
      <polygon points="100,30 152,52 100,74 48,52" fill="url(#fbTop)" />
      <polygon points="48,52 100,74 100,132 48,108" fill="url(#fbL)" />
      <polygon points="152,52 100,74 100,132 152,108" fill="url(#fbR)" />
      <polygon points="74,41 126,63 126,78 74,56" fill="#f6f6f6" opacity="0.95" />
      <polygon points="126,63 126,78 116,82 116,67" fill="#e6e6e6" />
      {/* right wing */}
      <path d="M146 60 C170 40 190 44 198 30 C178 36 162 32 150 40 C164 28 170 18 166 12 C154 26 142 36 134 54 Z" fill="#fff" stroke="#e3e6ef" strokeWidth="1.2" />
      <path d="M146 66 C164 60 182 62 192 54 C174 54 160 52 146 58 Z" fill="#f4f5fa" stroke="#e3e6ef" strokeWidth="1" />
    </svg>
  )
}
