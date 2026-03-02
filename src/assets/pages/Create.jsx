import { useEffect, useState } from 'react'
import supabase from '../../config/supabaseClient'
import { useParams } from 'react-router-dom'
import Upload from '../components/Upload'

const Create = ({ setShowModal, fetchEventAndPosts, setUploadStatus, defaultName, onSuccess }) => {
    const [name, setName] = useState(defaultName || '')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [files, setFiles] = useState([])
    const [event, setEvent] = useState(null)
    const { slug } = useParams()

    const [suggestions, setSuggestions] = useState([])
    const [loadingSuggestions, setLoadingSuggestions] = useState(false)

    useEffect(() => {
        if (defaultName) setName(defaultName)
    }, [defaultName])

    useEffect(() => {
        document.title = 'Create Post'
        fetchEventId()
    }, [])

    const fetchEventId = async () => {
        const { data, error } = await supabase.from('events').select().eq('slug', slug).single()
        if (error) console.error(error.message)
        if (data) setEvent(data)
    }

    const handleFileChange = (selectedFiles) => {
        const validFiles = selectedFiles.filter(file => file.size <= 60 * 1024 * 1024)
        if (validFiles.length !== selectedFiles.length) {
            setError('One or more files exceed 60MB. Please upload smaller files.')
            return
        }
        setFiles(validFiles)
    }

    const suggestCaption = async () => {
        if (!import.meta.env.VITE_CLAUDE_API_KEY) return
        if (!event) return
        setLoadingSuggestions(true)
        setSuggestions([])
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
                        content: `Generate 3 short, heartfelt message suggestions for a wedding guest to write at "${event.name}". Each should be warm, celebratory, and 1-2 sentences. Return only the 3 messages as a JSON array of strings, e.g. ["msg1","msg2","msg3"]. No extra text.`,
                    }],
                }),
            })
            const data = await response.json()
            if (!response.ok) return
            const text = data.content[0].text.trim()
            // Extract JSON array even if Claude wraps it in markdown code fences
            const match = text.match(/\[[\s\S]*\]/)
            if (match) {
                const parsed = JSON.parse(match[0])
                if (Array.isArray(parsed)) setSuggestions(parsed)
            }
        } catch {
            // silently fail — guest can just type manually
        } finally {
            setLoadingSuggestions(false)
        }
    }

    const nameHandler = (e) => {
        const value = e.target.value
        if (/^[a-zA-Z\s]*$/.test(value)) {
            setName(value)
            setError('')
        } else {
            setError('Name can only contain letters and spaces.')
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        if (!name.trim()) { setError('Please enter your name.'); return }
        if (!message.trim()) { setError('Please write a message.'); return }

        setShowModal(false)
        setUploadStatus('uploading')
        uploadInBackground(files, name.trim(), message.trim(), event.id)
        setName(defaultName || '')
        setMessage('')
        setFiles([])
        setError('')
    }

    const uploadInBackground = async (filesToUpload, userName, userMessage, eventId) => {
        const uploadedUrls = []
        try {
            for (const f of filesToUpload) {
                const filePath = `${slug}/${Date.now()}-${f.name}`
                const { error: uploadError } = await supabase.storage.from('manganui_photos').upload(filePath, f)
                if (uploadError) { console.error('Upload error:', uploadError); continue }
                const { data: publicData } = supabase.storage.from('manganui_photos').getPublicUrl(filePath)
                uploadedUrls.push(publicData.publicUrl)
            }
            const { error } = await supabase.from('posts').insert([{
                name: userName, message: userMessage, photos: uploadedUrls, event_id: eventId,
            }]).select()
            if (error) { console.error('Database error:', error); setUploadStatus('error'); return }
            setUploadStatus('success')
            fetchEventAndPosts()
            if (onSuccess) onSuccess()
            setTimeout(() => setUploadStatus(null), 3000)
        } catch (err) {
            console.error('Unexpected error:', err)
            setUploadStatus('error')
        }
    }

    const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3E36] focus:border-transparent"

    return (
        <div>
            <p className="text-center text-gray-600 text-sm mb-4">Share your photos and messages with the couple!</p>

            <div className="mb-3">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" id="name" placeholder="Enter your name" className={inputClass} value={name} onChange={nameHandler} required />
                <p className="text-xs text-gray-400 mt-1">Use your real name so the couple knows who you are.</p>
            </div>

            <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message *</label>
                    {import.meta.env.VITE_CLAUDE_API_KEY && (
                        <button
                            type="button"
                            onClick={suggestCaption}
                            disabled={loadingSuggestions || !event}
                            className="text-xs px-2 py-1 rounded-lg border transition-colors disabled:opacity-40"
                            style={{ borderColor: '#5A3E36', color: '#5A3E36' }}
                        >
                            {loadingSuggestions ? 'Thinking...' : '✨ Suggest'}
                        </button>
                    )}
                </div>
                <textarea id="message" placeholder="Write your message for the couple here" className={inputClass} value={message} rows={3} onChange={e => setMessage(e.target.value)} required />
                {suggestions.length > 0 && (
                    <div className="mt-2 space-y-1">
                        <p className="text-xs text-gray-400">Click a suggestion to use it:</p>
                        {suggestions.map((s, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => { setMessage(s); setSuggestions([]) }}
                                className="w-full text-left text-xs px-3 py-2 rounded-lg border border-gray-200 hover:border-[#5A3E36] hover:bg-[#fdf6f0] transition-colors"
                                style={{ color: '#6B4B3E' }}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <Upload handleFileChange={handleFileChange} setError={setError} />

            {error && <p className="text-center mt-3 text-red-500 text-sm">{error}</p>}

            <div className="mt-4">
                <button type="button" onClick={submitHandler} className="w-full py-2 rounded-lg text-white font-medium text-sm hover:opacity-90" style={{ backgroundColor: '#5A3E36' }}>
                    Submit
                </button>
            </div>
        </div>
    )
}

export default Create
