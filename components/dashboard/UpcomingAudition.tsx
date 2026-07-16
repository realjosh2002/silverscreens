import { Calendar, Clock, MapPin, Users } from 'lucide-react'

interface UpcomingAuditionProps {
  id: string
  title: string
  agency: string
  date: string
  time: string
  location: string
  status: 'In Person' | 'Online'
}

export default function UpcomingAudition({
  id,
  title,
  agency,
  date,
  time,
  location,
  status,
}: UpcomingAuditionProps) {
  return (
    <div
      className="relative rounded-xl p-5 border flex items-start gap-4 hover:border-[#D4A64A] transition-all group cursor-pointer"
      style={{
        background: 'rgba(255,255,255,0.03)',
        borderColor: 'rgba(212,166,74,0.15)',
        backdropFilter: 'blur(14px)',
      }}
    >
      {/* Icon/Badge */}
      <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-[rgba(212,166,74,0.2)] flex items-center justify-center text-[#D4A64A]">
        <Calendar size={24} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Title & Agency */}
        <h3 className="text-[#F5F5F5] font-bold text-base mb-1 group-hover:text-[#D4A64A] transition-colors line-clamp-1">
          {title}
        </h3>
        <p className="text-[#A8B0BD] text-sm mb-3">{agency}</p>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm mb-3">
          {/* Date & Time */}
          <div className="flex items-center gap-2 text-[#A8B0BD]">
            <Clock size={16} className="text-[#D4A64A] flex-shrink-0" />
            <span className="truncate">{date} at {time}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-[#A8B0BD]">
            <MapPin size={16} className="text-[#D4A64A] flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-1 px-2 py-1 bg-[rgba(212,166,74,0.2)] text-[#D4A64A] text-xs rounded-full font-medium">
          <Users size={12} />
          {status}
        </div>
      </div>

      {/* Action */}
      <div className="flex-shrink-0">
        <button className="px-4 py-2 bg-[rgba(212,166,74,0.2)] hover:bg-[#D4A64A] text-[#D4A64A] hover:text-[#050505] font-bold text-xs rounded-lg transition-all whitespace-nowrap">
          View Details
        </button>
      </div>
    </div>
  )
}
