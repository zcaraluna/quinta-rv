"use client"

import { QRCodeSVG } from "qrcode.react"
import { useEffect, useState } from "react"

export function BookingQRCode({ value }: { value: string }) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return <div className="w-32 h-32 bg-muted animate-pulse rounded-lg" />

    return (
        <div className="p-4 bg-white rounded-lg shadow-sm border inline-block">
            <QRCodeSVG
                value={value}
                size={180}
                level={"H"}
                includeMargin
                className="w-full h-auto"
            />
        </div>
    )
}
