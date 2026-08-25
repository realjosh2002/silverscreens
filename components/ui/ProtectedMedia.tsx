'use client'

/**
 * ProtectedMedia — SilverScreens
 *
 * A drop-in replacement for <img> and <video> tags wherever aspirant
 * photos or videos appear (except admin pages).
 *
 * Protections applied:
 *  - Right-click context menu disabled
 *  - Drag-to-desktop disabled
 *  - Long-press save disabled (mobile)
 *  - Native video download button hidden
 *  - Transparent overlay blocks all pointer interactions on the media
 *  - SilverScreens watermark logo overlaid on every image and video
 *
 * Note: Screenshots and screen recording cannot be prevented by the
 * browser — these protections are deterrents, not absolute barriers.
 *
 * Usage:
 *   <ProtectedMedia type="image" src={url} alt="Headshot" style={{ width: '100%' }} />
 *   <ProtectedMedia type="video" src={url} style={{ width: '100%' }} controls />
 *
 * For profile photo avatars (circular):
 *   <ProtectedMedia type="image" src={url} alt="" avatar />
 *
 * To disable watermark (e.g. during upload preview — before saving):
 *   <ProtectedMedia type="image" src={url} noWatermark />
 */

import React from 'react'

/* ── Watermark logo — SVG inline so no extra network request ── */
function Watermark({ position = 'top-right' }: { position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' }) {
  const pos: React.CSSProperties =
    position === 'top-left'
      ? { top: 7, left: 8 }
      : position === 'bottom-left'
      ? { bottom: 7, left: 8 }
      : position === 'bottom-right'
      ? { bottom: 7, right: 8 }
      : { top: 7, right: 8 } // top-right (default)

  return (
    <div
      style={{
        position: 'absolute',
        ...pos,
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        padding: '2px 6px',
        background: 'rgba(0,0,0,0.38)',
        borderRadius: 3,
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 3,
      }}
    >
      {/* Inline SVG mask icon */}
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2C7.5 2 3.5 5 2 9.5c2 .5 4 .5 6-1 1.5 2.5 4 4 7 4 1.5 0 3-.5 4-1.5.5 1 .8 2 .8 3C19.8 18.5 16.5 22 12 22S4 18.5 4 14"
          stroke="white" strokeWidth="1.5" strokeLinecap="round"
        />
        <circle cx="9" cy="9" r="1.5" fill="white" />
        <circle cx="15" cy="7" r="1.5" fill="white" />
      </svg>
      <span style={{
        fontFamily: "'Bebas Neue', 'Barlow Condensed', sans-serif",
        fontSize: 9,
        letterSpacing: 0.8,
        color: 'rgba(255,255,255,0.85)',
        fontWeight: 700,
        whiteSpace: 'nowrap',
      }}>
        SILVER<span style={{ color: '#C8202A' }}>SCREENS</span>
      </span>
    </div>
  )
}

/* ── Shared event blockers ── */
const block = (e: React.SyntheticEvent) => e.preventDefault()
const blockMouse = (e: React.MouseEvent) => { if (e.button === 2) e.preventDefault() }

/* ── Types ── */
interface BaseProps {
  src: string
  style?: React.CSSProperties
  className?: string
  noWatermark?: boolean
  watermarkPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  /** Renders as a circle — for avatar/profile photo use */
  avatar?: boolean
  /** Width of the container — defaults to '100%' */
  width?: string | number
  /** Height of the container */
  height?: string | number
  onClick?: () => void
}

interface ImageProps extends BaseProps {
  type: 'image'
  alt?: string
}

interface VideoProps extends BaseProps {
  type: 'video'
  controls?: boolean
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  poster?: string
}

type ProtectedMediaProps = ImageProps | VideoProps

/* ── Component ── */
export default function ProtectedMedia(props: ProtectedMediaProps) {
  const {
    src, style, className, noWatermark = false,
    watermarkPosition = 'top-right',
    avatar = false, width = '100%', height, onClick,
  } = props

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    width,
    height,
    overflow: 'hidden',
    borderRadius: avatar ? '50%' : (style?.borderRadius ?? undefined),
    cursor: onClick ? 'pointer' : 'default',
    userSelect: 'none',
    WebkitUserSelect: 'none',
  }

  const mediaStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    height: height ? '100%' : undefined,
    objectFit: (style?.objectFit as React.CSSProperties['objectFit']) ?? 'cover',
    pointerEvents: 'none', // media itself is not interactive
    userSelect: 'none',
    ...style,
    // Override any positioning from style — container handles that
    position: undefined,
    borderRadius: undefined,
  }

  /* Transparent overlay — sits above media, below watermark.
     Blocks right-click on the media element itself. */
  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    zIndex: 2,
    background: 'transparent',
    cursor: onClick ? 'pointer' : 'default',
  }

  return (
    <div
      style={containerStyle}
      className={className}
      onClick={onClick}
      onContextMenu={block}
      onDragStart={block}
    >
      {props.type === 'image' ? (
        <img
          src={src}
          alt={(props as ImageProps).alt ?? ''}
          style={mediaStyle}
          onContextMenu={block}
          onDragStart={block}
          draggable={false}
        />
      ) : (
        <video
          src={src}
          style={mediaStyle}
          controls={(props as VideoProps).controls ?? true}
          autoPlay={(props as VideoProps).autoPlay ?? false}
          muted={(props as VideoProps).muted ?? false}
          loop={(props as VideoProps).loop ?? false}
          poster={(props as VideoProps).poster}
          controlsList="nodownload nofullscreen noremoteplayback"
          disablePictureInPicture
          onContextMenu={block}
          onDragStart={block}
        />
      )}

      {/* Transparent interaction blocker */}
      <div
        style={overlayStyle}
        onContextMenu={block}
        onMouseDown={blockMouse}
        onTouchStart={block}
        onDragStart={block}
      />

      {/* Watermark */}
      {!noWatermark && !avatar && <Watermark position={watermarkPosition} />}
    </div>
  )
}