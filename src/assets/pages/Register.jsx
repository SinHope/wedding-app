import { useState } from 'react'
import supabase from '../../config/supabaseClient'

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match!')
            return
        }
        setLoading(true)
        const { error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: { data: { name: formData.name } },
        })
        if (error) {
            setError(error.message)
        } else {
            setSuccess('Registration successful! Check your email to confirm your account.')
            setFormData({ name: '', email: '', password: '', confirmPassword: '' })
        }
        setLoading(false)
    }

    const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3E36] focus:border-transparent"

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F0E5DA' }}>
            <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-sm">
                <h2 className="text-center text-2xl font-bold mb-6" style={{ color: '#5A3E36' }}>Create an Account</h2>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>
                )}
                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">{success}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClass} placeholder="John Doe" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} placeholder="you@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required className={inputClass} placeholder="••••••••" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className={inputClass} placeholder="••••••••" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity" style={{ backgroundColor: '#5A3E36' }}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <p className="text-center mt-4 text-sm text-gray-600">
                    Already have an account?{' '}
                    <a href="/login" className="underline" style={{ color: '#5A3E36' }}>Login</a>
                </p>
            </div>
        </div>
    )
}

export default Register
