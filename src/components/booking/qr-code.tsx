"use client"

import { QRCodeCanvas } from "qrcode.react"
import { useEffect, useState, useRef } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BookingQRCode({ value, id }: { value: string; id: string }) {
    const [mounted, setMounted] = useState(false)
    const canvasRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setMounted(true)
    }, [])

    const downloadQRCode = () => {
        const canvas = canvasRef.current?.querySelector("canvas")
        if (canvas) {
            const pngUrl = canvas
                .toDataURL("image/png")
                .replace("image/png", "image/octet-stream")
            const downloadLink = document.createElement("a")
            downloadLink.href = pngUrl
            downloadLink.download = `QR-Reserva-${id.slice(0, 8)}.png`
            document.body.appendChild(downloadLink)
            downloadLink.click()
            document.body.removeChild(downloadLink)
        }
    }

    if (!mounted) return <div className="w-32 h-32 bg-muted animate-pulse rounded-lg mx-auto" />

    return (
        <div className="flex flex-col items-center gap-4">
            <div ref={canvasRef} className="p-4 bg-white rounded-2xl shadow-md border inline-block overflow-hidden">
                <QRCodeCanvas
                    value={value}
                    size={200}
                    level={"H"}
                    includeMargin
                    imageSettings={{
                        src: "/quinta-rv.png",
                        x: undefined,
                        y: undefined,
                        height: 40,
                        width: 40,
                        excavate: true,
                    }}
                />
            </div>
            <Button
                variant="outline"
                size="sm"
                onClick={downloadQRCode}
                className="rounded-full gap-2 text-xs font-bold border-muted-foreground/20 hover:bg-muted"
            >
                <Download className="h-3.5 w-3.5" />
                Descargar QR
            </Button>
        </div>
    )
}
