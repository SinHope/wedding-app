import { useState, useEffect } from 'react'
import supabase from '../../config/supabaseClient'
import { Plus, Trash2, Lock, Unlock, Eye, X, Download, Edit2, Search } from 'react-feather'
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

const emptyForm = { name: '', slug: '', event_date: '', groom_name: '', bride_name: '', location: '', phone_number: '' }

const AdminDashboard = () => {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)

    // Create
    const [showCreate, setShowCreate] = useState(false)
    const [creating, setCreating] = useState(false)
    const [createError, setCreateError] = useState('')
    const [form, setForm] = useState(emptyForm)
    const [coverFile, setCoverFile] = useState(null)

    // Edit
    const [editEvent, setEditEvent] = useState(null)
    const [editForm, setEditForm] = useState(emptyForm)
    const [editCoverFile, setEditCoverFile] = useState(null)
    const [editing, setEditing] = useState(false)
    const [editError, setEditError] = useState('')

    // QR
    const [qrEvent, setQrEvent] = useState(null)

    // Search & Sort
    const [searchTerm, setSearchTerm] = useState('')
    const [sortField, setSortField] = useState('created_at')
    const [sortDir, setSortDir] = useState('desc')
    const [dateFilter, setDateFilter] = useState('')

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

        let coverUrl = null
        if (coverFile) {
            const ext = coverFile.name.split('.').pop()
            const path = `covers/${form.slug}-cover.${ext}`
            const { error: uploadError } = await supabase.storage
                .from('manganui_photos')
                .upload(path, coverFile, { upsert: true })
            if (uploadError) {
                setCreateError('Cover image upload failed: ' + uploadError.message)
                setCreating(false)
                return
            }
            const { data: urlData } = supabase.storage.from('manganui_photos').getPublicUrl(path)
            coverUrl = urlData.publicUrl
        }

        const { error } = await supabase.from('events').insert([{
            name: form.name, slug: form.slug, event_date: form.event_date,
            cover_image: coverUrl,
            groom_name: form.groom_name || null,
            bride_name: form.bride_name || null,
            location: form.location || null,
            phone_number: form.phone_number || null,
        }])
        setCreating(false)
        if (error) { setCreateError(error.message); return }
        setShowCreate(false)
        setForm(emptyForm)
        setCoverFile(null)
        fetchEvents()
    }

    const openEditModal = (ev) => {
        setEditEvent(ev)
        setEditForm({
            name: ev.name || '',
            slug: ev.slug || '',
            event_date: ev.event_date ? ev.event_date.split('T')[0] : '',
            groom_name: ev.groom_name || '',
            bride_name: ev.bride_name || '',
            location: ev.location || '',
            phone_number: ev.phone_number || '',
        })
        setEditCoverFile(null)
        setEditError('')
    }

    const handleEditSubmit = async (e) => {
        e.preventDefault()
        setEditError('')
        if (!editForm.name || !editForm.event_date) {
            setEditError('Name and event date are required.')
            return
        }
        setEditing(true)

        let coverUrl = editEvent.cover_image || null
        if (editCoverFile) {
            const ext = editCoverFile.name.split('.').pop()
            const path = `covers/${editEvent.slug}-cover.${ext}`
            const { error: uploadError } = await supabase.storage
                .from('manganui_photos')
                .upload(path, editCoverFile, { upsert: true })
            if (uploadError) {
                setEditError('Cover image upload failed: ' + uploadError.message)
                setEditing(false)
                return
            }
            const { data: urlData } = supabase.storage.from('manganui_photos').getPublicUrl(path)
            coverUrl = urlData.publicUrl
        }

        const { error } = await supabase.from('events').update({
            name: editForm.name,
            event_date: editForm.event_date,
            groom_name: editForm.groom_name || null,
            bride_name: editForm.bride_name || null,
            location: editForm.location || null,
            phone_number: editForm.phone_number || null,
            cover_image: coverUrl,
        }).eq('id', editEvent.id)

        setEditing(false)
        if (error) { setEditError(error.message); return }
        setEditEvent(null)
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

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortDir('asc')
        }
    }

    // Filter + sort
    const filteredEvents = events
        .filter(ev => {
            const term = searchTerm.toLowerCase()
            const matchSearch = !term ||
                ev.name?.toLowerCase().includes(term) ||
                ev.groom_name?.toLowerCase().includes(term) ||
                ev.bride_name?.toLowerCase().includes(term)
            const matchDate = !dateFilter || ev.event_date?.startsWith(dateFilter)
            return matchSearch && matchDate
        })
        .sort((a, b) => {
            let valA, valB
            if (sortField === 'name') {
                valA = a.name?.toLowerCase() || ''
                valB = b.name?.toLowerCase() || ''
            } else {
                valA = new Date(a.event_date || a.created_at)
                valB = new Date(b.event_date || b.created_at)
            }
            if (valA < valB) return sortDir === 'asc' ? -1 : 1
            if (valA > valB) return sortDir === 'asc' ? 1 : -1
            return 0
        })

    const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3E36] focus:border-transparent"

    if (loading) {
        return <div className="flex justify-center my-12"><ClockLoader /></div>
    }

    const SortArrow = ({ field }) => {
        if (sortField !== field) return <span className="text-gray-300 ml-1">↕</span>
        return <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h4 className="text-center text-xl font-semibold my-4">Admin Dashboard</h4>

            {/* Search + Sort + Create row */}
            <div className="flex flex-wrap items-center gap-3 my-4">
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by event or couple name..."
                        className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3E36]"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <input
                    type="date"
                    title="Filter by event date"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3E36]"
                    value={dateFilter}
                    onChange={e => setDateFilter(e.target.value)}
                />
                {dateFilter && (
                    <button onClick={() => setDateFilter('')} className="text-xs text-gray-400 hover:text-gray-600">Clear date</button>
                )}
                <button
                    className="flex items-center gap-2 text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#5A3E36' }}
                    onClick={() => setShowCreate(true)}
                >
                    <Plus size={16} /> Create an Event
                </button>
            </div>

            {filteredEvents.length === 0 && (
                <p className="text-center text-gray-500 mt-8">
                    {events.length === 0 ? 'No events yet. Create one!' : 'No events match your search.'}
                </p>
            )}

            {filteredEvents.length > 0 && (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">#</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">
                                    <button onClick={() => handleSort('name')} className="flex items-center hover:text-gray-900">
                                        Name <SortArrow field="name" />
                                    </button>
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">
                                    <button onClick={() => handleSort('event_date')} className="flex items-center hover:text-gray-900">
                                        Date <SortArrow field="event_date" />
                                    </button>
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">Location</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">Phone</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredEvents.map((item, index) => (
                                <tr key={item.id} className="bg-white hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                                    <td className="px-4 py-3">
                                        <Link to={`/event/${item.slug}`} className="font-medium hover:underline" style={{ color: '#5A3E36' }}>
                                            {item.name}
                                        </Link>
                                        {(item.groom_name || item.bride_name) && (
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {[item.groom_name, item.bride_name].filter(Boolean).join(' & ')}
                                            </p>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">
                                        {new Date(item.event_date).toLocaleDateString("en-US", {
                                            year: "numeric", month: "short", day: "numeric"
                                        })}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600 text-xs">{item.location || <span className="text-gray-300">—</span>}</td>
                                    <td className="px-4 py-3 text-gray-600 text-xs">{item.phone_number || <span className="text-gray-300">—</span>}</td>
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
                                                className="p-1.5 border border-blue-300 rounded text-blue-500 hover:bg-blue-50"
                                                title="Edit event"
                                                onClick={() => openEditModal(item)}
                                            >
                                                <Edit2 size={14} />
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
                <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
                    <DialogPanel className="bg-white rounded-xl w-full max-w-md shadow-xl my-4">
                        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100">
                            <DialogTitle className="font-semibold text-gray-800 text-lg">Create New Event</DialogTitle>
                            <button onClick={() => { setShowCreate(false); setCoverFile(null) }} className="text-gray-400 hover:text-gray-600 p-1">
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateSubmit} className="px-6 py-4 space-y-4 max-h-[75vh] overflow-y-auto">
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
                            <div className="border-t border-gray-100 pt-4">
                                <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">Couple Details (Admin Only)</p>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name of Groom</label>
                                        <input type="text" className={inputClass} placeholder="e.g. Muhammad Ridwan Bin Yusoff" value={form.groom_name} onChange={e => setForm(prev => ({ ...prev, groom_name: e.target.value }))} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name of Bride</label>
                                        <input type="text" className={inputClass} placeholder="e.g. Siti Aisyah Binte Rahman" value={form.bride_name} onChange={e => setForm(prev => ({ ...prev, bride_name: e.target.value }))} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Location Name</label>
                                        <input type="text" className={inputClass} placeholder="e.g. Dewan Merak, Shah Alam" value={form.location} onChange={e => setForm(prev => ({ ...prev, location: e.target.value }))} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <input type="tel" className={inputClass} placeholder="e.g. +601X-XXXXXXX" value={form.phone_number} onChange={e => setForm(prev => ({ ...prev, phone_number: e.target.value }))} />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image <span className="text-gray-400">(optional)</span></label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:text-white file:bg-[#5A3E36] file:cursor-pointer cursor-pointer"
                                    onChange={e => setCoverFile(e.target.files[0] || null)}
                                />
                                {coverFile && (
                                    <img src={URL.createObjectURL(coverFile)} alt="Preview" className="mt-2 h-24 rounded-lg object-cover" />
                                )}
                            </div>
                            {createError && <p className="text-red-500 text-sm">{createError}</p>}
                            <div className="flex gap-3 justify-end pt-2">
                                <button type="button" onClick={() => { setShowCreate(false); setCoverFile(null) }} className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                                    Cancel
                                </button>
                                <button type="submit" disabled={creating} className="px-4 py-2 text-sm text-white rounded-lg disabled:opacity-50 hover:opacity-90 font-medium" style={{ backgroundColor: '#16a34a' }}>
                                    {creating ? 'Creating...' : 'Create Event'}
                                </button>
                            </div>
                        </form>
                    </DialogPanel>
                </div>
            </Dialog>

            {/* Edit Event Modal */}
            <Dialog open={!!editEvent} onClose={() => setEditEvent(null)} className="relative z-50">
                <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
                    <DialogPanel className="bg-white rounded-xl w-full max-w-md shadow-xl my-4">
                        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100">
                            <DialogTitle className="font-semibold text-gray-800 text-lg">Edit Event</DialogTitle>
                            <button onClick={() => setEditEvent(null)} className="text-gray-400 hover:text-gray-600 p-1">
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="px-6 py-4 space-y-4 max-h-[75vh] overflow-y-auto">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Event Name *</label>
                                <input type="text" className={inputClass} value={editForm.name} onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
                                <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" value={editForm.slug} readOnly />
                                <p className="text-xs text-gray-400 mt-1">Slug cannot be changed (would break existing links).</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Event Date *</label>
                                <input type="date" className={inputClass} value={editForm.event_date} onChange={e => setEditForm(prev => ({ ...prev, event_date: e.target.value }))} required />
                            </div>
                            <div className="border-t border-gray-100 pt-4">
                                <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">Couple Details (Admin Only)</p>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name of Groom</label>
                                        <input type="text" className={inputClass} value={editForm.groom_name} onChange={e => setEditForm(prev => ({ ...prev, groom_name: e.target.value }))} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name of Bride</label>
                                        <input type="text" className={inputClass} value={editForm.bride_name} onChange={e => setEditForm(prev => ({ ...prev, bride_name: e.target.value }))} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Location Name</label>
                                        <input type="text" className={inputClass} value={editForm.location} onChange={e => setEditForm(prev => ({ ...prev, location: e.target.value }))} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <input type="tel" className={inputClass} value={editForm.phone_number} onChange={e => setEditForm(prev => ({ ...prev, phone_number: e.target.value }))} />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image <span className="text-gray-400">(upload to replace)</span></label>
                                {editEvent?.cover_image && !editCoverFile && (
                                    <img src={editEvent.cover_image} alt="Current cover" className="mb-2 h-24 rounded-lg object-cover" />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:text-white file:bg-[#5A3E36] file:cursor-pointer cursor-pointer"
                                    onChange={e => setEditCoverFile(e.target.files[0] || null)}
                                />
                                {editCoverFile && (
                                    <img src={URL.createObjectURL(editCoverFile)} alt="New cover preview" className="mt-2 h-24 rounded-lg object-cover" />
                                )}
                            </div>
                            {editError && <p className="text-red-500 text-sm">{editError}</p>}
                            <div className="flex gap-3 justify-end pt-2">
                                <button type="button" onClick={() => setEditEvent(null)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                                    Cancel
                                </button>
                                <button type="submit" disabled={editing} className="px-4 py-2 text-sm text-white rounded-lg disabled:opacity-50 hover:opacity-90 font-medium" style={{ backgroundColor: '#5A3E36' }}>
                                    {editing ? 'Saving...' : 'Save Changes'}
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
