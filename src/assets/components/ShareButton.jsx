import { Share2 } from 'react-feather'

const ShareButton = ({ eventName, slug, text }) => {
    const url = `${window.location.origin}/event/${slug}`
    const shareText = text || `Join us to celebrate ${eventName}! Share your photos and messages.`

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: eventName, text: shareText, url })
            } catch {}
        } else {
            try {
                await navigator.clipboard.writeText(url)
                alert('Link copied to clipboard!')
            } catch {
                prompt('Copy this link:', url)
            }
        }
    }

    return (
        <button
            className="flex items-center gap-1 text-sm px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={handleShare}
            title="Share event"
        >
            <Share2 size={14} />
            <span>Share</span>
        </button>
    )
}

export default ShareButton
