import { useState } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { X } from 'react-feather'
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
    const [showModal, setShowModal] = useState(false)

    const name = guestName || localStorage.getItem('guestName') || 'Guest'

    const handleReact = async (key) => {
        const prev = myReaction
        const newReactions = {
            heart: [...(reactions.heart || [])],
            cry:   [...(reactions.cry   || [])],
            love:  [...(reactions.love  || [])],
            pray:  [...(reactions.pray  || [])],
        }

        if (prev) {
            newReactions[prev] = newReactions[prev].filter(n => n !== name)
        }

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
                <button
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors hover:underline underline-offset-2 mb-2 block"
                    onClick={() => setShowModal(true)}
                >
                    {totalCount} {totalCount === 1 ? 'reaction' : 'reactions'}
                </button>
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

            <Dialog open={showModal} onClose={() => setShowModal(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="bg-white rounded-2xl w-full max-w-xs shadow-xl overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                            <DialogTitle className="font-semibold text-sm" style={{ color: '#5A3E36' }}>
                                Reactions
                            </DialogTitle>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="overflow-y-auto max-h-72 px-4 py-3 space-y-3">
                            {reactionList.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-4">No reactions yet</p>
                            ) : (
                                reactionList.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <span className="text-sm text-gray-700">{item.name}</span>
                                        <span className="text-lg">{item.emoji}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </div>
    )
}

export default EmojiReactions
