import Link from 'next/link'

type LogoSize = 'sm' | 'md' | 'lg' | 'xl'

interface LogoProps {
  size?: LogoSize
  href?: string
  showTagline?: boolean
}

const sizes = {
  sm: { fontSize: 15, underlineH: 2, underlineTop: 18 },
  md: { fontSize: 26, underlineH: 2, underlineTop: 30 },
  lg: { fontSize: 26, underlineH: 3, underlineTop: 31 },
  xl: { fontSize: 34, underlineH: 3, underlineTop: 40 },
}

export default function SilverScreensLogo({
  size = 'md',
  href = '/',
  showTagline = false,
}: LogoProps) {
  const s = sizes[size]

  const logoContent = (
    <span style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1, cursor: 'pointer', gap: 6 }}>

      {/* SILVER — white */}
      <span style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: s.fontSize,
        fontWeight: 400,
        letterSpacing: 2,
        color: '#F5F5F5',
        lineHeight: 1,
      }}>
        SILVER
      </span>

      {/* SCREENS — red, with underline via position relative */}
      <span style={{ position: 'relative', display: 'inline-block', lineHeight: 1 }}>
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: s.fontSize,
          fontWeight: 400,
          letterSpacing: 2,
          color: '#C8202A',
          lineHeight: 1,
          display: 'inline-block',
        }}>
          SCREENS
        </span>
        {/* Underline sits just below the text */}
        <span style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: -4,
          height: s.underlineH,
          background: '#C8202A',
          borderRadius: 1,
          display: 'block',
        }} />
      </span>

    </span>
  )

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
        {logoContent}
      </Link>
    )
  }

  return <span style={{ display: 'inline-flex', alignItems: 'center' }}>{logoContent}</span>
}