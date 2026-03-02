import { useState } from 'react'
import { Download } from 'react-feather'

const SaveButton = ({ imageUrl, watermarkEnabled, eventName }) => {
    const [saving, setSaving] = useState(false)

    const handleSave = async () => {
        setSaving(true)
        try {
            const img = new Image()
            img.crossOrigin = 'anonymous'
            img.src = imageUrl
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
                    const x = img.width - textWidth - padding
                    const y = img.height - padding
                    ctx.shadowColor = 'rgba(0,0,0,0.5)'
                    ctx.shadowBlur = 4
                    ctx.fillText(text, x, y)
                }
                canvas.toBlob((blob) => {
                    const link = document.createElement('a')
                    link.href = URL.createObjectURL(blob)
                    link.download = `manganui-${Date.now()}.jpg`
                    link.click()
                    URL.revokeObjectURL(link.href)
                    setSaving(false)
                }, 'image/jpeg', 0.92)
            }
            img.onerror = () => setSaving(false)
        } catch {
            setSaving(false)
        }
    }

    return (
        <button
            className="flex items-center gap-1 text-sm px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 transition-colors"
            onClick={handleSave}
            disabled={saving}
            title="Download photo"
        >
            <Download size={14} />
            <span>{saving ? 'Saving...' : 'Save'}</span>
        </button>
    )
}

export default SaveButton
