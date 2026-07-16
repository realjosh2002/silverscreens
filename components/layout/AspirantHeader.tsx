'use client'

import Link from 'next/link'
import { Search, Bell, MessageSquare, User, LogOut } from 'lucide-react'
import { useState } from 'react'
import SilverScreensLogo from '@/components/ui/SilverScreensLogo'

export default function AspirantHeader() {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-[#050505] border-b border-[rgba(212,166,74,0.15)] z-50">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left: Logo */}
        <Link href="/aspirant/dashboard">
          <SilverScreensLogo size="sm" href={undefined} />
        </Link>

        {/* Center: Search Bar */}
        <div className="hidden md:flex flex-1 mx-8">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8B0BD]" size={18} />
            <input
              type="text"
              placeholder="Search casting calls, agencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#0B0F14] border border-[rgba(212,166,74,0.15)] rounded-lg text-[#F5F5F5] placeholder-[#A8B0BD] focus:outline-none focus:border-[#D4A64A] transition-colors"
            />
          </div>
        </div>

        {/* Right: Icons & Profile */}
        <div className="flex items-center gap-6">
          {/* Notifications */}
          <Link
            href="/aspirant/notifications"
            className="relative text-[#A8B0BD] hover:text-[#D4A64A] transition-colors"
          >
            <Bell size={22} />
            <span className="absolute -top-2 -right-2 bg-[#C8202A] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </Link>

          {/* Messages */}
          <Link
            href="/aspirant/messages"
            className="relative text-[#A8B0BD] hover:text-[#D4A64A] transition-colors"
          >
            <MessageSquare size={22} />
            <span className="absolute -top-2 -right-2 bg-[#C8202A] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              2
            </span>
          </Link>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[rgba(212,166,74,0.1)] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[rgba(212,166,74,0.3)] flex items-center justify-center">
                <User size={16} className="text-[#D4A64A]" />
              </div>
              <span className="text-[#F5F5F5] text-sm hidden sm:inline">Arjun Malhotra</span>
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#0B0F14] border border-[rgba(212,166,74,0.15)] rounded-lg shadow-lg overflow-hidden">
                <Link
                  href="/aspirant/profile"
                  className="block px-4 py-3 text-[#F5F5F5] hover:bg-[rgba(212,166,74,0.1)] transition-colors border-b border-[rgba(212,166,74,0.1)]"
                >
                  View Profile
                </Link>
                <Link
                  href="/aspirant/settings"
                  className="block px-4 py-3 text-[#F5F5F5] hover:bg-[rgba(212,166,74,0.1)] transition-colors border-b border-[rgba(212,166,74,0.1)]"
                >
                  Settings
                </Link>
                <button
                  className="w-full text-left px-4 py-3 text-[#A8B0BD] hover:text-[#F5F5F5] hover:bg-[rgba(212,166,74,0.1)] transition-colors flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
