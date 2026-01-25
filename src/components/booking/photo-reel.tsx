"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

const IMAGES = Array.from({ length: 15 }, (_, i) => `/casaquinta/quinta-rv (${i + 1}).jpeg`)

interface PhotoReelProps {
  direction?: 'horizontal' | 'vertical';
}

export function PhotoReel({ direction = 'horizontal' }: PhotoReelProps) {
  const isVertical = direction === 'vertical';

  return (
    <div className={cn(
      "w-full relative overflow-hidden",
      isVertical ? "h-[600px] sm:h-full" : "py-6"
    )}>
      <div className={cn(
        "flex items-center",
        isVertical
          ? "flex-col animate-marquee-vertical gap-6"
          : "animate-marquee gap-4 sm:gap-6"
      )}>
        {[...IMAGES, ...IMAGES].map((src, index) => (
          <div
            key={index}
            className={cn(
              "relative flex-shrink-0 overflow-hidden rounded-[2rem] shadow-xl border-4 border-white transition-all duration-300 hover:scale-105 active:scale-95",
              isVertical
                ? "w-full aspect-[3/4]"
                : "w-48 h-64 sm:w-80 sm:h-[400px]"
            )}
          >
            <Image
              src={src}
              alt={`Casa Quinta View ${index + 1}`}
              fill
              className="object-cover"
              sizes={isVertical ? "400px" : "(max-width: 640px) 200px, 400px"}
              priority={index < 4}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
