import Link from 'next/link'
import { MapPin, Calendar, DollarSign } from 'lucide-react'

interface CastingCallCardProps {
  id: string
  title: string
  agency: string
  location: string
  deadline: string
  budget?: string
  image?: string
  projectType?: string
}

export default function CastingCallCard({
  id,
  title,
  agency,
  location,
  deadline,
  budget,
  image,
  projectType,
}: CastingCallCardProps) {
  return (
    <div
      className="relative rounded-xl overflow-hidden border hover:border-[#D4A64A] transition-all hover:shadow-lg group cursor-pointer"
      style={{
        background: 'rgba(255,255,255,0.03)',
        borderColor: 'rgba(212,166,74,0.15)',
        backdropFilter: 'blur(14px)',
      }}
    >
      <Link href={`/aspirant/casting-calls/${id}`} className="block">
        {/* Image */}
        {image ? (
          <div className="w-full h-40 bg-[#121821] overflow-hidden relative">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="w-full h-40 bg-gradient-to-br from-[rgba(212,166,74,0.2)] to-[rgba(212,166,74,0.05)] flex items-center justify-center">
            <span className="text-[#D4A64A] opacity-50">No image</span>
          </div>
        )}

        {/* Content */}
        <div className="p-5">
          {/* Project Type Badge */}
          {projectType && (
            <div className="inline-block px-2 py-1 bg-[rgba(212,166,74,0.2)] text-[#D4A64A] text-xs rounded-full mb-3 font-medium">
              {projectType}
            </div>
          )}

          {/* Title */}
          <h3 className="text-[#F5F5F5] font-bold text-base mb-1 line-clamp-2 group-hover:text-[#D4A64A] transition-colors">
            {title}
          </h3>

          {/* Agency */}
          <p className="text-[#A8B0BD] text-sm mb-4">{agency}</p>

          {/* Details Grid */}
          <div className="space-y-2 text-sm">
            {/* Location */}
            <div className="flex items-center gap-2 text-[#A8B0BD]">
              <MapPin size={16} className="text-[#D4A64A] flex-shrink-0" />
              <span className="truncate">{location}</span>
            </div>

            {/* Deadline */}
            <div className="flex items-center gap-2 text-[#A8B0BD]">
              <Calendar size={16} className="text-[#D4A64A] flex-shrink-0" />
              <span>{deadline}</span>
            </div>

            {/* Budget */}
            {budget && (
              <div className="flex items-center gap-2 text-[#A8B0BD]">
                <DollarSign size={16} className="text-[#D4A64A] flex-shrink-0" />
                <span>{budget}</span>
              </div>
            )}
          </div>

          {/* Apply Button */}
          <button className="w-full mt-5 px-4 py-2 bg-[#D4A64A] hover:bg-[#E5BF63] text-[#050505] font-bold text-sm rounded-lg transition-colors">
            Apply Now
          </button>
        </div>
      </Link>
    </div>
  )
}
