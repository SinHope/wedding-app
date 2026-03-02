import { useState } from 'react'

const SentimentSummary = ({ posts }) => {
    const [summary, setSummary] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [generated, setGenerated] = useState(false)

    const generateSummary = async () => {
        if (!import.meta.env.VITE_CLAUDE_API_KEY) { setError('Claude API key not configured.'); return }
        const messages = posts.filter(p => p.message?.trim()).map(p => `${p.name}: "${p.message}"`).join('\n')
        if (!messages) { setError('No guest messages to summarise yet.'); return }

        setLoading(true)
        setError('')
        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': import.meta.env.VITE_CLAUDE_API_KEY,
                    'anthropic-version': '2023-06-01',
                    'anthropic-dangerous-direct-browser-access': 'true',
                },
                body: JSON.stringify({
                    model: 'claude-haiku-4-5-20251001',
                    max_tokens: 300,
                    messages: [{
                        role: 'user',
                        content: `You are summarising wedding guest messages for the couple to read. Write a warm, 2-3 sentence summary of the overall sentiment and themes from these messages. Keep it heartfelt and concise.\n\nMessages:\n${messages}`,
                    }],
                }),
            })
            const data = await response.json()
            if (!response.ok) { setError(data.error?.message || 'Failed to generate summary.'); return }
            setSummary(data.content[0].text)
            setGenerated(true)
        } catch {
            setError('Network error. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="my-4 p-4 rounded-xl" style={{ backgroundColor: '#fff8f2', border: '1px solid #e8d5c4' }}>
            <h6 className="font-semibold mb-2" style={{ color: '#5A3E36' }}>💌 Guest Sentiment Summary</h6>
            {!generated && !loading && (
                <button className="text-sm px-3 py-1.5 rounded-lg text-white hover:opacity-90" style={{ backgroundColor: '#5A3E36' }} onClick={generateSummary}>
                    Generate AI Summary
                </button>
            )}
            {loading && <p className="text-gray-500 text-sm mt-1">Generating summary...</p>}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            {summary && <p className="mt-2 mb-0 text-sm italic" style={{ color: '#6B4B3E' }}>"{summary}"</p>}
            {generated && !loading && (
                <button className="text-xs text-gray-400 mt-2 hover:underline" onClick={() => { setSummary(''); setGenerated(false) }}>
                    Regenerate
                </button>
            )}
        </div>
    )
}

export default SentimentSummary
