import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../../config/supabaseClient'

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        const { error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
        })
        setLoading(false)
        if (error) {
            setError(error.message)
        } else {
            navigate('/')
        }
    }

    const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3E36] focus:border-transparent"

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F0E5DA' }}>
            <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-sm">
                <h2 className="text-center text-2xl font-bold mb-6" style={{ color: '#5A3E36' }}>Login</h2>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required className={inputClass} />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: '#5A3E36' }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login
