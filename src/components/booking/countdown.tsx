"use client"

import { useEffect, useState } from "react"
import { differenceInSeconds } from "date-fns"

export function CountdownTimer({ targetDate }: { targetDate: Date }) {
    const [timeLeft, setTimeLeft] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date()
            const diff = differenceInSeconds(new Date(targetDate), now)

            if (diff <= 0) {
                setTimeLeft(0)
                clearInterval(interval)
            } else {
                setTimeLeft(diff)
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [targetDate])

    const hours = Math.floor(timeLeft / 3600)
    const minutes = Math.floor((timeLeft % 3600) / 60)
    const seconds = timeLeft % 60

    if (timeLeft <= 0) return <span className="text-destructive font-bold">Tiempo Expirado</span>

    return (
        <div className="font-mono text-2xl font-bold tracking-widest text-primary">
            {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>
    )
}
