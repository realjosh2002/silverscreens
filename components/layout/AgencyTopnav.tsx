'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { Bell, MessageSquare } from 'lucide-react'
import SilverScreensLogo from '@/components/ui/SilverScreensLogo'

const PROFILE_MENU = [
  { label: 'Reports & Analytics',   href: '/agency/reports' },
  { label: 'Subscription & Billing', href: '/agency/subscription' },
  { label: 'Company Profile',        href: '/agency/profile' },
  { label: 'Documents',              href: '/agency/documents' },
  { label: 'Calendar',               href: '/agency/calendar' },
  { label: 'Settings',               href: '/agency/settings' },
  { label: 'Support',                href: '/agency/support' },
]

export default function AgencyTopnav() {
  const router = useRouter()
  const pathname = usePathname()
  const [profileOpen, setProfileOpen] = useState(false)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 })
  const profileBtnRef = useRef<HTMLButtonElement>(null)

  const openProfile = () => {
    if (profileBtnRef.current) {
      const r = profileBtnRef.current.getBoundingClientRect()
      setDropdownPos({ top: r.bottom + 8, right: window.innerWidth - r.right })
    }
    setProfileOpen(v => !v)
  }

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (profileBtnRef.current && !profileBtnRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <>
      {/* ── Header bar ─────────────────────────────────────────────────────── */}
      <header className="h-14 bg-[#0B0F14] border-b border-[rgba(212,166,74,0.15)] flex items-center px-5 gap-4 flex-shrink-0">
        <SilverScreensLogo size="sm" href="/agency/dashboard" showTagline={false} />
        <div className="flex-1" />

        {/* Post a Casting */}
        <Link
          href="/agency/casting-calls/new"
          className="bg-[#C8202A] text-white text-[14px] font-semibold px-[14px] py-[7px] rounded-md hover:bg-[#a81a22] transition-colors no-underline"
        >
          + Post a Casting
        </Link>

        {/* Messages */}
        <Link href="/agency/messages" className="relative p-1 text-[#9CA3AF] hover:text-white transition-colors">
          <MessageSquare size={20} />
          <span className="absolute top-0 right-0 bg-[#C8202A] text-white text-[10px] rounded-full px-[4px] py-[1px] leading-none">
            12
          </span>
        </Link>

        {/* Notifications */}
        <Link href="/agency/notifications" className="relative p-1 text-[#9CA3AF] hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute top-0 right-0 bg-[#C8202A] text-white text-[10px] rounded-full px-[4px] py-[1px] leading-none">
            3
          </span>
        </Link>

        {/* Profile button */}
        <button
          ref={profileBtnRef}
          onClick={openProfile}
          className="flex items-center gap-2 bg-[#121821] border border-[rgba(212,166,74,0.2)] rounded-full px-3 py-[5px] hover:border-[#D4A64A] transition-colors cursor-pointer"
        >
          <div className="w-[26px] h-[26px] rounded-full bg-[#8B5CF6] flex items-center justify-center text-white text-[13px] font-semibold">
            D
          </div>
          <span className="text-[14px] text-white font-medium">Dharma Productions</span>
          <span className="text-[#6B7280] text-[12px]">▾</span>
        </button>
      </header>

      {/* ── Profile Dropdown ───────────────────────────────────────────────── */}
      {profileOpen && (
        <div
          style={{ position: 'fixed', top: dropdownPos.top, right: dropdownPos.right, zIndex: 1000 }}
          className="bg-[#121821] border border-[rgba(212,166,74,0.2)] rounded-xl min-w-[220px] shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden"
        >
          {/* Agency ID row */}
          <div className="px-4 py-[10px] border-b border-[rgba(212,166,74,0.15)]">
            <div className="text-[12px] text-[#6B7280]">Agency ID</div>
            <div className="text-[14px] text-[#D4A64A] font-bold">AGE062600001</div>
          </div>

          {/* Menu items */}
          {PROFILE_MENU.map(item => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setProfileOpen(false)}
                className={`block px-4 py-[10px] text-[14px] transition-colors no-underline ${
                  active
                    ? 'text-[#D4A64A] bg-[rgba(212,166,74,0.08)]'
                    : 'text-[#9CA3AF] hover:bg-[#1C2030] hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            )
          })}

          {/* Logout */}
          <div className="border-t border-[rgba(212,166,74,0.15)]">
            <button
              onClick={() => { setProfileOpen(false); router.push('/') }}
              className="w-full text-left px-4 py-[10px] text-[14px] text-[#C8202A] hover:bg-[#1C2030] transition-colors cursor-pointer bg-transparent border-none"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  )
}