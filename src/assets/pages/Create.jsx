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
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea id="message" placeholder="Write your message for the couple here" className={inputClass} value={message} rows={3} onChange={e => setMessage(e.target.value)} required />
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
