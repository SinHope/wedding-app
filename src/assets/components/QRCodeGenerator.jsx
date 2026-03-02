import { useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'

const QRCodeGenerator = ({ slug }) => {
    const canvasRef = useRef(null)
    const url = `${window.location.origin}/event/${slug}`

    const handleDownload = () => {
        const canvas = canvasRef.current?.querySelector('canvas')
        if (!canvas) return
        const link = document.createElement('a')
        link.download = `${slug}-qr.png`
        link.href = canvas.toDataURL()
        link.click()
    }

    return (
        <div className="text-center my-4">
            <p className="text-gray-400 text-sm mb-3">Scan to visit this event</p>
            <div ref={canvasRef} className="inline-block p-2 bg-white rounded-lg shadow-sm">
                <QRCodeCanvas value={url} size={160} bgColor="#ffffff" fgColor="#5A3E36" level="M" />
            </div>
            <div className="mt-3">
                <button
                    className="text-sm px-4 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={handleDownload}
                >
                    Download QR Code
                </button>
            </div>
        </div>
    )
}

export default QRCodeGenerator
