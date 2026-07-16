import Link from 'next/link'

interface ProfileCompletionCardProps {
  completionPercentage?: number
}

export default function ProfileCompletionCard({
  completionPercentage = 98,
}: ProfileCompletionCardProps) {
  const circumference = 2 * Math.PI * 45
  const offset = circumference - (completionPercentage / 100) * circumference

  return (
    <div
      className="relative rounded-2xl p-8 border overflow-hidden"
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
          boxShadow: 'inset 0 0 30px rgba(212,166,74,0.12)',
        }}
      />

      <div className="relative z-10 flex items-center justify-between gap-8">
        <div className="flex-1">
          <h3 className="text-[#F5F5F5] font-bold text-lg mb-2">Profile Completion</h3>
          <p className="text-[#A8B0BD] text-sm mb-6">
            You're all set to get noticed by top agencies.
          </p>
          <Link
            href="/aspirant/profile"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-[#D4A64A] hover:bg-[#E5BF63] text-[#050505] font-bold rounded-lg transition-colors text-sm"
          >
            View Profile
          </Link>
        </div>

        {/* Circular Progress */}
        <div className="w-40 h-40 flex-shrink-0 flex items-center justify-center relative">
          <svg width="160" height="160" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r="45"
              fill="none"
              stroke="rgba(212,166,74,0.2)"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="80"
              cy="80"
              r="45"
              fill="none"
              stroke="#D4A64A"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          {/* Percentage Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[#D4A64A] text-3xl font-bold">{completionPercentage}%</span>
            <span className="text-[#A8B0BD] text-xs">Complete</span>
          </div>
        </div>
      </div>
    </div>
  )
}
