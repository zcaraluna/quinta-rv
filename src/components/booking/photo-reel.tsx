"use client"

import Image from "next/image"

const IMAGES = Array.from({ length: 15 }, (_, i) => `/casaquinta/quinta-rv (${i + 1}).jpeg`)

export function PhotoReel() {
    return (
        <div className="w-full overflow-hidden bg-background py-10">
            <div className="relative flex">
                {/* Infinite scroll container */}
                <div className="flex animate-marquee whitespace-nowrap gap-4">
                    {[...IMAGES, ...IMAGES].map((src, index) => (
                        <div key={index} className="relative w-[300px] h-[400px] flex-shrink-0 overflow-hidden rounded-xl shadow-md border">
                            <Image
                                src={src}
                                alt={`Casa Quinta View ${index + 1}`}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-500"
                                sizes="300px"
                                priority={index < 5}
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
          animation: marquee 60s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
        </div>
    )
}
