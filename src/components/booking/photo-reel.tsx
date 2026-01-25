"use client"

import Image from "next/image"

const IMAGES = Array.from({ length: 15 }, (_, i) => `/casaquinta/quinta-rv (${i + 1}).jpeg`)

export function PhotoReel({ watermark = false }: { watermark?: boolean }) {
  return (
    <div className={cn(
      "w-full relative overflow-hidden group transition-all duration-1000",
      watermark ? "py-0 h-full opacity-[0.07] grayscale" : "py-10"
    )}>
      {!watermark && (
        <>
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        </>
      )}

      <div className={cn(
        "flex animate-marquee items-center",
        watermark ? "gap-4 sm:gap-6" : "gap-6 sm:gap-8"
      )}>
        {[...IMAGES, ...IMAGES].map((src, index) => (
          <div
            key={index}
            className={cn(
              "relative flex-shrink-0 overflow-hidden transition-all duration-700",
              watermark
                ? "w-40 h-60 sm:w-60 sm:h-80 rounded-2xl"
                : "w-44 h-64 sm:w-72 sm:h-[420px] rounded-[2.5rem] shadow-2xl hover:scale-110 hover:z-20 border-8 border-white",
              !watermark && (index % 2 === 0 ? "rotate-2 translate-y-4" : "-rotate-2 -translate-y-4")
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
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee ${watermark ? '120s' : '60s'} linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: ${watermark ? 'running' : 'paused'};
        }
        @media (max-width: 640px) {
          .animate-marquee {
            animation-duration: ${watermark ? '80s' : '40s'};
          }
        }
      `}</style>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
