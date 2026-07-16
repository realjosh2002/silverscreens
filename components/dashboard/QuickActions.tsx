import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { ReactNode } from 'react'

interface QuickActionProps {
  icon: ReactNode
  label: string
  href: string
}

interface QuickActionsProps {
  actions?: QuickActionProps[]
}

const DEFAULT_ACTIONS: QuickActionProps[] = [
  {
    icon: '⚡',
    label: 'Update Availability',
    href: '/aspirant/profile#availability',
  },
  {
    icon: '📸',
    label: 'Upload New Media',
    href: '/aspirant/profile#media',
  },
  {
    icon: '✨',
    label: 'Add New Skill',
    href: '/aspirant/profile#skills',
  },
  {
    icon: '👁',
    label: 'View My Profile',
    href: '/aspirant/profile',
  },
  {
    icon: '📄',
    label: 'Manage Documents',
    href: '/aspirant/profile#documents',
  },
  {
    icon: '🎬',
    label: 'Browse Castings',
    href: '/aspirant/casting-calls',
  },
]

export default function QuickActions({ actions = DEFAULT_ACTIONS }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {actions.map((action, index) => (
        <Link
          key={index}
          href={action.href}
          className="relative rounded-xl p-5 border overflow-hidden hover:border-[#D4A64A] transition-all group"
          style={{
            background: 'rgba(255,255,255,0.03)',
            borderColor: 'rgba(212,166,74,0.15)',
            backdropFilter: 'blur(14px)',
          }}
        >
          {/* Glow on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"
            style={{
              boxShadow: 'inset 0 0 20px rgba(212,166,74,0.1)',
            }}
          />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{action.icon}</span>
              <span className="text-[#F5F5F5] font-bold group-hover:text-[#D4A64A] transition-colors">
                {action.label}
              </span>
            </div>
            <ChevronRight
              size={20}
              className="text-[#D4A64A] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
            />
          </div>
        </Link>
      ))}
    </div>
  )
}
