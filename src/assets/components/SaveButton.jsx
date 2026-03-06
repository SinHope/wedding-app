import { useState } from 'react'
import { Download, X } from 'react-feather'
import { Dialog, DialogPanel } from '@headlessui/react'

const SaveButton = ({ images = [], watermarkEnabled, eventName }) => {
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState([])
    const [downloading, setDownloading] = useState(false)

    const toggleSelect = (url) => {
        setSelected(prev => prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url])
    }

    const downloadImage = (url) => new Promise((resolve) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = url
        img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0)
            if (watermarkEnabled) {
                const text = `© Manganui | ${eventName}`
                const fontSize = Math.max(16, Math.floor(img.width / 30))
                ctx.font = `bold ${fontSize}px sans-serif`
                ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
                const padding = 12
                const textWidth = ctx.measureText(text).width
                ctx.shadowColor = 'rgba(0,0,0,0.5)'
                ctx.shadowBlur = 4
                ctx.fillText(text, img.width - textWidth - padding, img.height - padding)
            }
            canvas.toBlob((blob) => {
                const link = document.createElement('a')
                link.href = URL.createObjectURL(blob)
                link.download = `manganui-${Date.now()}.jpg`
                link.click()
                URL.revokeObjectURL(link.href)
                resolve()
            }, 'image/jpeg', 0.92)
        }
        img.onerror = () => resolve()
    })

    const handleButtonClick = () => {
        if (images.length === 1) {
            downloadImage(images[0])
        } else {
            setSelected([])
            setOpen(true)
        }
    }

    const handleDownload = async () => {
        setDownloading(true)
        for (const url of selected) {
            await downloadImage(url)
        }
        setDownloading(false)
        setSelected([])
        setOpen(false)
    }

    if (images.length === 0) return null

    return (
        <>
            <button
                className="flex items-center gap-1 text-sm px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                onClick={handleButtonClick}
                title="Download photo(s)"
            >
                <Download size={14} />
                <span>Save</span>
            </button>

            <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="bg-white rounded-xl w-full max-w-sm shadow-xl">
                        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100">
                            <p className="font-semibold text-gray-800 text-sm">Select photos to download</p>
                            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="p-4 grid grid-cols-3 gap-2">
                            {images.map((url, idx) => {
                                const isSelected = selected.includes(url)
                                return (
                                    <div
                                        key={idx}
                                        className="relative cursor-pointer rounded-lg overflow-hidden"
                                        style={{ height: '90px' }}
                                        onClick={() => toggleSelect(url)}
                                    >
                                        <img src={url} alt="" className="w-full h-full object-cover" />

                                        {/* Green overlay when selected */}
                                        {isSelected && (
                                            <div className="absolute inset-0 rounded-lg ring-2 ring-green-500" style={{ backgroundColor: 'rgba(34,197,94,0.12)' }} />
                                        )}

                                        {/* Circular checkbox */}
                                        <div
                                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center transition-all shadow"
                                            style={{
                                                backgroundColor: isSelected ? '#16a34a' : 'rgba(255,255,255,0.75)',
                                                border: isSelected ? 'none' : '2px solid rgba(200,200,200,0.9)',
                                            }}
                                        >
                                            {isSelected && (
                                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                    <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="px-4 pb-4">
                            <button
                                onClick={handleDownload}
                                disabled={selected.length === 0 || downloading}
                                className="w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-40 hover:opacity-90 transition-opacity"
                                style={{ backgroundColor: '#F4D9A9', color: '#5A3E36' }}
                            >
                                <Download size={14} />
                                {downloading
                                    ? 'Downloading...'
                                    : selected.length > 0
                                        ? `Download (${selected.length})`
                                        : 'Download'}
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    )
}

export default SaveButton
