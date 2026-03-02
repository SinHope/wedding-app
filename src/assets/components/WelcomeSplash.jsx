import { useState } from 'react'

const WelcomeSplash = ({ eventName, onComplete }) => {
    const [name, setName] = useState(localStorage.getItem('guestName') || '')
    const [error, setError] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        const trimmed = name.trim()
        if (!trimmed) { setError('Please enter your name.'); return }
        localStorage.setItem('guestName', trimmed)
        onComplete(trimmed)
    }

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-[9999]"
            style={{ backgroundColor: 'rgba(90, 62, 54, 0.92)', backdropFilter: 'blur(4px)' }}
        >
            <div className="bg-white rounded-2xl shadow-xl text-center p-8 w-[90%] max-w-md">
                <h2 className="text-2xl font-semibold mb-1" style={{ color: '#5A3E36', fontFamily: 'Cormorant Garamond, serif' }}>
                    Welcome
                </h2>
                <p className="text-gray-500 text-sm mb-1">You're invited to celebrate</p>
                <h4 className="text-lg font-medium mb-4" style={{ color: '#5A3E36' }}>{eventName}</h4>

                <hr className="my-4 border-gray-200" />

                <p className="mb-4 text-sm text-gray-700">What's your name? We'd love to know who's celebrating with us!</p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-[#5A3E36]"
                        placeholder="Your name"
                        value={name}
                        onChange={e => { setName(e.target.value); setError('') }}
                        autoFocus
                    />
                    {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
                    <button type="submit" className="w-full py-2 rounded-lg text-white font-medium text-sm hover:opacity-90" style={{ backgroundColor: '#5A3E36' }}>
                        Enter
                    </button>
                </form>
            </div>
        </div>
    )
}

export default WelcomeSplash
