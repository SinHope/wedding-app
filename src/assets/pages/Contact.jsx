import { useState } from 'react'

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' })
    const [submitted, setSubmitted] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await fetch('https://formspree.io/f/xnngvqbk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })
        if (response.ok) {
            setSubmitted(true)
            setFormData({ name: '', email: '', message: '' })
        } else {
            alert('There was an error. Please try again.')
        }
    }

    const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3E36] focus:border-transparent"

    return (
        <div style={{ backgroundColor: '#F0E5DA', minHeight: '100vh', padding: '4rem 1rem' }}>
            <div className="max-w-xl mx-auto">
                <h1 className="text-center text-3xl font-bold mb-4" style={{ color: '#5A3E36' }}>
                    Contact Us
                </h1>
                <p className="text-center mb-6" style={{ color: '#6b4b43' }}>
                    We'd love to hear from you! Reach out to us for enquiries or to set up your personalized wedding page.
                </p>

                <div className="mb-6 text-center">
                    <p className="mb-1">📧 Email: <a href="mailto:ridwanyusoff93@gmail.com" className="underline" style={{ color: '#5A3E36' }}>ridwanyusoff93@gmail.com</a></p>
                    <p>📞 Phone: +65 91198614</p>
                </div>

                <h5 className="mb-3 font-semibold" style={{ color: '#5A3E36' }}>Or send us a message directly:</h5>

                {submitted && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
                        Thank you! Your message has been sent.
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="Your Name" required />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="Your Email" required />
                    <textarea name="message" value={formData.message} onChange={handleChange} className={inputClass} rows="5" placeholder="Your Message" required />
                    <div className="text-center">
                        <button type="submit" className="px-8 py-2.5 rounded-lg text-white font-medium hover:opacity-90 transition-opacity" style={{ backgroundColor: '#5A3E36' }}>
                            Send Message
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Contact
