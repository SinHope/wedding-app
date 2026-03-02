import { useState } from 'react'
import supabase from '../../config/supabaseClient'

const EMOJIS = [
    { key: 'heart', emoji: '❤️' },
    { key: 'cry',   emoji: '😭' },
    { key: 'love',  emoji: '🥰' },
    { key: 'pray',  emoji: '🙏' },
]

// Normalize old number format → array format
const normalize = (r) => {
    const result = {}
    for (const { key } of EMOJIS) {
        const val = r?.[key]
        result[key] = Array.isArray(val) ? val : []
    }
    return result
}

const EmojiReactions = ({ postId, initialReactions, guestName }) => {
    const [reactions, setReactions] = useState(() => normalize(initialReactions))
    const [myReaction, setMyReaction] = useState(() => localStorage.getItem(`reaction-${postId}`) || null)
    const [showWho, setShowWho] = useState(false)

    const name = guestName || localStorage.getItem('guestName') || 'Guest'

    const handleReact = async (key) => {
        const prev = myReaction
        const newReactions = {
            heart: [...(reactions.heart || [])],
            cry:   [...(reactions.cry   || [])],
            love:  [...(reactions.love  || [])],
            pray:  [...(reactions.pray  || [])],
        }

        // Remove from previous reaction
        if (prev) {
            newReactions[prev] = newReactions[prev].filter(n => n !== name)
        }

        // If clicking a different reaction, add to it. If same, just toggle off.
        let nextReaction = null
        if (prev !== key) {
            if (!newReactions[key].includes(name)) {
                newReactions[key] = [...newReactions[key], name]
            }
            nextReaction = key
        }

        setReactions(newReactions)
        setMyReaction(nextReaction)

        if (nextReaction) {
            localStorage.setItem(`reaction-${postId}`, nextReaction)
        } else {
            localStorage.removeItem(`reaction-${postId}`)
        }

        const { error } = await supabase.from('posts').update({ reactions: newReactions }).eq('id', postId)
        if (error) {
            // Revert on failure
            setReactions(reactions)
            setMyReaction(prev)
            if (prev) localStorage.setItem(`reaction-${postId}`, prev)
            else localStorage.removeItem(`reaction-${postId}`)
        }
    }

    const totalCount = EMOJIS.reduce((sum, { key }) => sum + (reactions[key]?.length || 0), 0)

    const reactionList = EMOJIS.flatMap(({ key, emoji }) =>
        (reactions[key] || []).map(n => ({ name: n, emoji, key }))
    )

    return (
        <div className="px-3 pb-3">
            {totalCount > 0 && (
                <div className="mb-2">
                    <button
                        className="text-xs text-gray-400 hover:text-gray-600 transition-colors underline-offset-2 hover:underline"
                        onClick={() => setShowWho(prev => !prev)}
                    >
                        {totalCount} {totalCount === 1 ? 'reaction' : 'reactions'}
                    </button>

                    {showWho && (
                        <div className="mt-1 rounded-lg px-3 py-2 text-xs space-y-0.5" style={{ backgroundColor: '#f9f4f0', color: '#6B4B3E' }}>
                            {reactionList.map((item, idx) => (
                                <div key={idx}>{item.name} {item.emoji} this post</div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="flex gap-2">
                {EMOJIS.map(({ key, emoji }) => (
                    <button
                        key={key}
                        onClick={() => handleReact(key)}
                        className="flex items-center gap-1 px-2 py-1 rounded-full text-sm border transition-all"
                        style={{
                            backgroundColor: myReaction === key ? '#f0e5da' : 'transparent',
                            borderColor: myReaction === key ? '#5A3E36' : '#e0d0c0',
                            fontSize: '0.85rem',
                        }}
                    >
                        <span>{emoji}</span>
                        <span style={{ color: '#6B4B3E' }}>{reactions[key]?.length || 0}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default EmojiReactions
