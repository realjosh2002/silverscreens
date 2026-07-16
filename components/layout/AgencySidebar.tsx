'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  Film,
  Users,
  Mic2,
  Star,
  MessageSquare,
  BarChart2,
  CreditCard,
  Settings,
  ChevronLeft,
  Menu,
} from 'lucide-react'
import SilverScreensLogo from '@/components/ui/SilverScreensLogo'

const NAV_ITEMS = [
  { label: 'Dashboard',           href: '/agency/dashboard',    icon: LayoutDashboard },
  { label: 'Casting Calls',       href: '/agency/casting-calls',icon: Film },
  { label: 'Applicants',          href: '/agency/applications', icon: Users },
  { label: 'Auditions',           href: '/agency/auditions',    icon: Mic2 },
  { label: 'Saved Talents',       href: '/agency/saved-talents',icon: Star },
  { label: 'Messages',            href: '/agency/messages',     icon: MessageSquare, badge: 12 },
  { label: 'Reports & Analytics', href: '/agency/reports',      icon: BarChart2 },
  { label: 'Subscription',        href: '/agency/subscription', icon: CreditCard },
  { label: 'Settings',            href: '/agency/settings',     icon: Settings },
]

export default function AgencySidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(true)

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/')

  return (
    <aside
      className={`h-screen bg-[#0B0F14] border-r border-[rgba(212,166,74,0.15)] transition-all duration-300 flex flex-col flex-shrink-0 z-40 ${
        collapsed ? 'w-[52px]' : 'w-[230px]'
      }`}
      style={{ backgroundImage: 'linear-gradient(180deg, #0B0F14 0%, #121821 100%)' }}
    >
      {/* ── Logo ─────────────────────────────────────────────────────────────── */}
      <div className={`h-14 flex items-center border-b border-[rgba(212,166,74,0.15)] flex-shrink-0 ${
        collapsed ? 'justify-center px-2' : 'px-4'
      }`}>
        <SilverScreensLogo size="sm" href="/agency/dashboard" showTagline={false} />
      </div>

      {/* ── Nav Items ────────────────────────────────────────────────────────── */}
      <nav className="flex-1 py-2 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 py-[10px] relative transition-all duration-150 ${
                collapsed ? 'px-[14px]' : 'px-4'
              } ${
                active
                  ? 'bg-[rgba(212,166,74,0.08)] border-l-[3px] border-[#D4A64A] text-[#D4A64A]'
                  : 'border-l-[3px] border-transparent text-[#9CA3AF] hover:bg-[#121821] hover:text-[#F9FAFB]'
              }`}
            >
              <Icon size={18} className="flex-shrink-0" />

              {!collapsed && (
                <>
                  <span className="text-[14px] font-medium whitespace-nowrap flex-1">
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="bg-[#C8202A] text-white text-[10px] rounded-full px-[5px] py-[1px] ml-auto leading-none">
                      {item.badge}
                    </span>
                  )}
                </>
              )}

              {/* Collapsed: badge dot only */}
              {collapsed && item.badge && (
                <span className="absolute top-[6px] right-[6px] w-2 h-2 bg-[#C8202A] rounded-full" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* ── Agency Identity (expanded only) ──────────────────────────────────── */}
      {!collapsed && (
        <div className="border-t border-[rgba(212,166,74,0.15)] px-[14px] py-3 flex items-center gap-[10px]">
          <div className="w-[30px] h-[30px] rounded-full bg-[#8B5CF6] flex items-center justify-center text-white text-[13px] font-semibold flex-shrink-0">
            D
          </div>
          <div className="overflow-hidden">
            <div className="text-[13px] text-white font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
              Dharma Productions
            </div>
            <div className="text-[11px] text-[#6B7280]">Agency</div>
          </div>
        </div>
      )}

      {/* ── Toggle Button ─────────────────────────────────────────────────────── */}
      <button
        onClick={() => setCollapsed(v => !v)}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className={`border-t border-[rgba(212,166,74,0.15)] p-3 flex items-center text-[#6B7280] hover:text-[#F9FAFB] transition-colors bg-transparent cursor-pointer ${
          collapsed ? 'justify-center' : 'justify-end'
        }`}
      >
        {collapsed ? <Menu size={19} /> : <ChevronLeft size={19} />}
      </button>
    </aside>
  )
}