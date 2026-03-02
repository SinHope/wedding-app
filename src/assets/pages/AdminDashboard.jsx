import { useState, useEffect } from 'react'
import supabase from '../../config/supabaseClient'
import { Plus, Trash2, Lock, Unlock, Eye, X, Download } from 'react-feather'
import { Link } from 'react-router-dom'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { ClockLoader } from 'react-spinners'
import { QRCodeCanvas } from 'qrcode.react'

const QrIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
        <rect x="5" y="5" width="3" height="3" fill="currentColor" stroke="none" />
        <rect x="16" y="5" width="3" height="3" fill="currentColor" stroke="none" />
        <rect x="5" y="16" width="3" height="3" fill="currentColor" stroke="none" />
        <line x1="14" y1="14" x2="14" y2="14" /><line x1="17" y1="14" x2="21" y2="14" /><line x1="14" y1="17" x2="14" y2="21" /><line x1="17" y1="17" x2="21" y2="21" /><line x1="21" y1="17" x2="21" y2="17" />
    </svg>
)

const AdminDashboard = () => {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)

    const [showCreate, setShowCreate] = useState(false)
    const [creating, setCreating] = useState(false)
    const [createError, setCreateError] = useState('')
    const [form, setForm] = useState({ name: '', slug: '', event_date: '', cover_image: '' })

    const [qrEvent, setQrEvent] = useState(null)

    useEffect(() => {
        fetchEvents()
    }, [])

    async function fetchEvents() {
        const { data, error } = await supabase
            .from('events')
            .select()
            .order('created_at', { ascending: false })

        if (data) { setEvents(data); setLoading(false) }
        if (error) { console.error(error.message); setLoading(false) }
    }

    const generateSlug = (name) =>
        name.toLowerCase().trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')

    const handleNameChange = (e) => {
        const name = e.target.value
        setForm(prev => ({ ...prev, name, slug: generateSlug(name) }))
    }

    const handleCreateSubmit = async (e) => {
        e.preventDefault()
        setCreateError('')
        if (!form.name || !form.slug || !form.event_date) {
            setCreateError('Name, slug, and event date are required.')
            return
        }
        setCreating(true)
        const { error } = await supabase.from('events').insert([{
            name: form.name, slug: form.slug, event_date: form.event_date,
            cover_image: form.cover_image || null,
        }])
        setCreating(false)
        if (error) { setCreateError(error.message); return }
        setShowCreate(false)
        setForm({ name: '', slug: '', event_date: '', cover_image: '' })
        fetchEvents()
    }

    const toggleStatus = async (event) => {
        const newStatus = event.status === 'active' ? 'locked' : 'active'
        const { error } = await supabase.from('events').update({ status: newStatus }).eq('id', event.id)
        if (!error) fetchEvents()
    }

    const deleteEvent = async (id) => {
        if (!window.confirm('Delete this event? This will also delete all its posts.')) return
        const { error } = await supabase.from('events').delete().eq('id', id)
        if (!error) fetchEvents()
    }

    const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3E36] focus:border-transparent"

    if (loading) {
        return <div className="flex justify-center my-12"><ClockLoader /></div>
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h4 className="text-center text-xl font-semibold my-4">Admin Dashboard</h4>

            <div className="flex justify-end my-4">
                <button
                    className="flex items-center gap-2 text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#5A3E36' }}
                    onClick={() => setShowCreate(true)}
                >
                    <Plus size={16} /> Create an Event
                </button>
            </div>

            {events.length === 0 && (
                <p className="text-center text-gray-500">No events yet. Create one!</p>
            )}

            {events.length > 0 && (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">#</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {events.map((item, index) => (
                                <tr key={item.id} className="bg-white hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                                    <td className="px-4 py-3">
                                        <Link to={`/event/${item.slug}`} className="font-medium hover:underline" style={{ color: '#5A3E36' }}>
                                            {item.name}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">
                                        {new Date(item.event_date).toLocaleDateString("en-US", {
                                            year: "numeric", month: "short", day: "numeric"
                                        })}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <Link to={`/event/${item.slug}`} className="p-1.5 border border-gray-300 rounded hover:bg-gray-100" title="View">
                                                <Eye size={14} />
                                            </Link>
                                            <button
                                                className="p-1.5 border border-purple-300 rounded text-purple-500 hover:bg-purple-50"
                                                title="Show QR Code"
                                                onClick={() => setQrEvent(item)}
                                            >
                                                <QrIcon />
                                            </button>
                                            <button
                                                className="p-1.5 border border-amber-400 rounded text-amber-600 hover:bg-amber-50"
                                                title={item.status === 'active' ? 'Lock event' : 'Unlock event'}
                                                onClick={() => toggleStatus(item)}
                                            >
                                                {item.status === 'active' ? <Lock size={14} /> : <Unlock size={14} />}
                                            </button>
                                            <button
                                                className="p-1.5 border border-red-300 rounded text-red-500 hover:bg-red-50"
                                                title="Delete event"
                                                onClick={() => deleteEvent(item.id)}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* QR Code Modal */}
            <Dialog open={!!qrEvent} onClose={() => setQrEvent(null)} className="relative z-50">
                <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="bg-white rounded-xl w-full max-w-xs shadow-xl">
                        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100">
                            <DialogTitle className="font-semibold text-gray-800 text-sm">{qrEvent?.name}</DialogTitle>
                            <button onClick={() => setQrEvent(null)} className="text-gray-400 hover:text-gray-600">
                                <X size={16} />
                            </button>
                        </div>
                        <div className="flex flex-col items-center px-5 py-5 gap-4">
                            <div id="qr-canvas-wrapper" className="p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                                {qrEvent && (
                                    <QRCodeCanvas
                                        value={`${window.location.origin}/event/${qrEvent.slug}`}
                                        size={180}
                                        bgColor="#ffffff"
                                        fgColor="#7e22ce"
                                        level="M"
                                    />
                                )}
                            </div>
                            <p className="text-xs text-gray-400">/event/{qrEvent?.slug}</p>
                            <button
                                className="flex items-center gap-2 text-sm px-4 py-1.5 border border-purple-300 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors"
                                onClick={() => {
                                    const canvas = document.querySelector('#qr-canvas-wrapper canvas')
                                    if (!canvas) return
                                    const link = document.createElement('a')
                                    link.download = `${qrEvent.slug}-qr.png`
                                    link.href = canvas.toDataURL()
                                    link.click()
                                }}
                            >
                                <Download size={14} /> Download QR
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>

            {/* Create Event Modal */}
            <Dialog open={showCreate} onClose={() => setShowCreate(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="bg-white rounded-xl w-full max-w-md shadow-xl">
                        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100">
                            <DialogTitle className="font-semibold text-gray-800 text-lg">Create New Event</DialogTitle>
                            <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-600 p-1">
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateSubmit} className="px-6 py-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Event Name *</label>
                                <input type="text" className={inputClass} placeholder="e.g. Sarah & John's Wedding" value={form.name} onChange={handleNameChange} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug *</label>
                                <input type="text" className={inputClass} placeholder="e.g. sarah-and-john" value={form.slug} onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))} required />
                                <p className="text-xs text-gray-500 mt-1">Event URL: /event/{form.slug || 'your-slug'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Event Date *</label>
                                <input type="date" className={inputClass} value={form.event_date} onChange={e => setForm(prev => ({ ...prev, event_date: e.target.value }))} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL <span className="text-gray-400">(optional)</span></label>
                                <input type="url" className={inputClass} placeholder="https://..." value={form.cover_image} onChange={e => setForm(prev => ({ ...prev, cover_image: e.target.value }))} />
                            </div>
                            {createError && <p className="text-red-500 text-sm">{createError}</p>}
                            <div className="flex gap-3 justify-end pt-2">
                                <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                                    Cancel
                                </button>
                                <button type="submit" disabled={creating} className="px-4 py-2 text-sm text-white rounded-lg disabled:opacity-50 hover:opacity-90" style={{ backgroundColor: '#5A3E36' }}>
                                    {creating ? 'Creating...' : 'Create Event'}
                                </button>
                            </div>
                        </form>
                    </DialogPanel>
                </div>
            </Dialog>
        </div>
    )
}

export default AdminDashboard
