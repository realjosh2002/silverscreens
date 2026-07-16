import { ReactNode } from 'react'

interface StatsCardProps {
  icon: ReactNode
  label: string
  value: string | number
  subtext?: string
}

export default function StatsCard({ icon, label, value, subtext }: StatsCardProps) {
  return (
    <div
      className="relative rounded-xl p-6 border overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.03)',
        borderColor: 'rgba(212,166,74,0.15)',
        backdropFilter: 'blur(14px)',
      }}
    >
      {/* Glow Effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 20px rgba(212,166,74,0.08)',
        }}
      />

      <div className="relative z-10">
        {/* Icon */}
        <div className="w-12 h-12 rounded-lg bg-[rgba(212,166,74,0.15)] flex items-center justify-center mb-4 text-[#D4A64A]">
          {icon}
        </div>

        {/* Value */}
        <div className="mb-2">
          <div className="text-[#F5F5F5] text-3xl font-bold">{value}</div>
        </div>

        {/* Label */}
        <div className="text-[#A8B0BD] text-sm">{label}</div>

        {/* Subtext */}
        {subtext && <div className="text-[#A8B0BD] text-xs mt-2 opacity-70">{subtext}</div>}
      </div>
    </div>
  )
}
