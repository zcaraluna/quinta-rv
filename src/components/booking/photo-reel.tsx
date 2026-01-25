"use client"

import Image from "next/image"

const IMAGES = Array.from({ length: 15 }, (_, i) => `/casaquinta/quinta-rv (${i + 1}).jpeg`)

export function PhotoReel() {
  return (
    <div className="w-full relative py-10 overflow-hidden group">
      {/* Side gradients to hide edges */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div className="flex animate-marquee gap-6 sm:gap-8 items-center">
        {[...IMAGES, ...IMAGES].map((src, index) => (
          <div
            key={index}
            className={cn(
              "relative w-44 h-64 sm:w-72 sm:h-[420px] flex-shrink-0 overflow-hidden rounded-[2.5rem] shadow-2xl transition-all duration-700 hover:scale-110 hover:z-20 border-8 border-white",
              index % 2 === 0 ? "rotate-2 translate-y-4" : "-rotate-2 -translate-y-4"
            )}
          >
            <Image
              src={src}
              alt={`Casa Quinta View ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 200px, 400px"
              priority={index < 4}
            />
            {/* Subtle overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        @media (max-width: 640px) {
          .animate-marquee {
            animation-duration: 40s;
          }
        }
      `}</style>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
