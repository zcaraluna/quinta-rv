"use client"

import Image from "next/image"

const IMAGES = Array.from({ length: 15 }, (_, i) => `/casaquinta/quinta-rv (${i + 1}).jpeg`)

export function PhotoReel() {
  return (
    <div className="w-full overflow-hidden bg-background py-6 sm:py-10">
      <div className="relative flex">
        {/* Infinite scroll container */}
        <div className="flex animate-marquee whitespace-nowrap gap-3 sm:gap-4">
          {[...IMAGES, ...IMAGES].map((src, index) => (
            <div
              key={index}
              className="relative w-40 h-56 sm:w-64 sm:h-80 flex-shrink-0 overflow-hidden rounded-3xl shadow-lg border-4 border-white"
            >
              <Image
                src={src}
                alt={`Casa Quinta View ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 200px, 300px"
                priority={index < 3}
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        @media (max-width: 640px) {
          .animate-marquee {
            animation-duration: 25s;
          }
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
