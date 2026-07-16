/**
 * SilverScreens — Global Font Constants
 * Import these into every page instead of defining locally.
 *
 * Usage:
 *   import { M, B, BC } from '@/lib/fonts'
 *
 * M  = Barlow Condensed (primary font for ALL body text, labels, UI)
 * B  = Bebas Neue       (display headings, section titles, buttons)
 * BC = Barlow Condensed (alias for M — use either)
 */

export const M  = "'Barlow Condensed', sans-serif"
export const B  = "'Bebas Neue', sans-serif"
export const BC = "'Barlow Condensed', sans-serif"

// Legacy alias — Montserrat is retired. M now points to Barlow Condensed.
// Any page previously using fontFamily: M automatically gets BC.