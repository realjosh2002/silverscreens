'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  User,
  Briefcase,
  MessageSquare,
  Calendar,
  Bookmark,
  Lightbulb,
  Bell,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
} from 'lucide-react'

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', href: '/aspirant/dashboard', icon: LayoutDashboard },
  { label: 'My Profile', href: '/aspirant/profile', icon: User },
  { label: 'Casting Calls', href: '/aspirant/casting-calls', icon: Briefcase },
  { label: 'My Applications', href: '/aspirant/applications', icon: Briefcase },
  { label: 'Messages', href: '/aspirant/messages', icon: MessageSquare, badge: 2 },
  { label: 'Auditions', href: '/aspirant/auditions', icon: Calendar },
  { label: 'Saved Castings', href: '/aspirant/saved-castings', icon: Bookmark },
  { label: 'Recommended', href: '/aspirant/recommended', icon: Lightbulb },
  { label: 'Notifications', href: '/aspirant/notifications', icon: Bell, badge: 3 },
]

const PROFILE_ITEMS = [
  { label: 'Subscription', href: '/aspirant/subscription', icon: CreditCard },
  { label: 'Analytics', href: '/aspirant/analytics', icon: Briefcase },
  { label: 'Settings', href: '/aspirant/settings', icon: Settings },
  { label: 'Support', href: '/aspirant/support', icon: HelpCircle },
]

export default function AspirantSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const isActive = (href: string) => pathname === href

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-[#0B0F14] border-r border-[rgba(212,166,74,0.15)] transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      } pt-20 overflow-y-auto z-40`}
      style={{
        backgroundImage: 'linear-gradient(180deg, #0B0F14 0%, #121821 100%)',
      }}
    >
      <div className="p-4 space-y-8">
        {/* Main Menu */}
        <nav className="space-y-2">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  active
                    ? 'bg-[rgba(212,166,74,0.2)] text-[#D4A64A] border border-[#D4A64A]'
                    : 'text-[#A8B0BD] hover:text-[#F5F5F5] hover:bg-[rgba(212,166,74,0.1)]'
                }`}
                title={collapsed ? item.label : ''}
              >
                <Icon size={20} className="flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-sm font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="bg-[#C8202A] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Divider */}
        <div className="h-px bg-[rgba(212,166,74,0.1)]" />

        {/* Profile Menu */}
        <nav className="space-y-2">
          {PROFILE_ITEMS.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  active
                    ? 'bg-[rgba(212,166,74,0.2)] text-[#D4A64A] border border-[#D4A64A]'
                    : 'text-[#A8B0BD] hover:text-[#F5F5F5] hover:bg-[rgba(212,166,74,0.1)]'
                }`}
                title={collapsed ? item.label : ''}
              >
                <Icon size={20} className="flex-shrink-0" />
                {!collapsed && <span className="flex-1 text-sm font-medium">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Divider */}
        <div className="h-px bg-[rgba(212,166,74,0.1)]" />

        {/* Logout */}
        <button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#A8B0BD] hover:text-[#F5F5F5] hover:bg-[rgba(212,166,74,0.1)] transition-all"
          title={collapsed ? 'Logout' : ''}
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!collapsed && <span className="flex-1 text-sm font-medium text-left">Logout</span>}
        </button>
      </div>
    </aside>
  )
}
