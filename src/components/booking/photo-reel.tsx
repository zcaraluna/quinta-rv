"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

const IMAGES = Array.from({ length: 15 }, (_, i) => `/casaquinta/quinta-rv (${i + 1}).jpeg`)

export function PhotoReel() {
  return (
    <div className="w-full relative py-6 overflow-hidden">
      <div className="flex animate-marquee gap-4 sm:gap-6 items-center">
        {[...IMAGES, ...IMAGES].map((src, index) => (
          <div
            key={index}
            className="relative w-48 h-64 sm:w-80 sm:h-[400px] flex-shrink-0 overflow-hidden rounded-[2rem] shadow-xl border-4 border-white transition-all duration-300 hover:scale-105 active:scale-95"
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
    </div>
  )
}
