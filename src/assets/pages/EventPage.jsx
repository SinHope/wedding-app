import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import supabase from '../../config/supabaseClient'
import { ClockLoader } from 'react-spinners'
import { formatDistanceToNow } from 'date-fns'
import confetti from 'canvas-confetti'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { Edit2, Trash2, X } from 'react-feather'

import ModalCreatePost from '../components/ModalCreatePost'
import PostCarousel from '../components/PostCarousel'
import SmartImage from '../components/SmartImage'
import WelcomeSplash from '../components/WelcomeSplash'
import CountdownTimer from '../components/CountdownTimer'
import EmojiReactions from '../components/EmojiReactions'
import ShareButton from '../components/ShareButton'
import SaveButton from '../components/SaveButton'
import SentimentSummary from '../components/SentimentSummary'
import ScrollToTop from '../components/ScrollToTop'
import { useAppContext } from '../components/AppContext'

const EventPage = () => {
    const { slug } = useParams()
    const { session } = useAppContext()

    const [event, setEvent] = useState(null)
    const [postDataArray, setPostDataArray] = useState([])
    const [loading, setLoading] = useState(true)

    const [showSplash, setShowSplash] = useState(false)
    const [guestName, setGuestName] = useState(localStorage.getItem('guestName') || '')

    const [showModal, setShowModal] = useState(false)
    const [lightbox, setLightbox] = useState({ open: false, slides: [], index: 0 })

    // Admin edit state
    const [editPost, setEditPost] = useState(null)
    const [editMessage, setEditMessage] = useState('')
    const [editPhotos, setEditPhotos] = useState([])
    const [editSaving, setEditSaving] = useState(false)

    useEffect(() => {
        document.title = slug
        fetchEventAndPosts()
    }, [slug])

    useEffect(() => {
        if (!loading && event) {
            const key = `splashShown-${slug}`
            if (!sessionStorage.getItem(key)) {
                setShowSplash(true)
            }
        }
    }, [loading, event])

    const fetchEventAndPosts = async () => {
        const { data: eventData, error: errorEvent } = await supabase
            .from('events')
            .select()
            .eq('slug', slug)
            .single()

        if (errorEvent) {
            console.error(errorEvent.message)
            setLoading(false)
            return
        }

        if (eventData) {
            setEvent(eventData)
            const { data: postData, error: errorPost } = await supabase
                .from('posts')
                .select()
                .eq('event_id', eventData.id)
                .order('is_pinned', { ascending: false })
                .order('created_at', { ascending: false })

            if (postData) setPostDataArray(postData)
            if (errorPost) console.error(errorPost.message)
            setLoading(false)
        }
    }

    const handleSplashComplete = (name) => {
        setGuestName(name)
        sessionStorage.setItem(`splashShown-${slug}`, 'true')
        setShowSplash(false)
    }

    const handlePostSuccess = () => {
        confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#c9a84c', '#f5e193', '#5A3E36', '#F0E5DA'],
        })
    }

    const openLightbox = (photos, clickedIndex) => {
        const slides = photos
            .filter(url => !url.match(/\.(mp4|webm|ogg|mov)$/i))
            .map(url => ({ src: url }))
        if (slides.length === 0) return
        setLightbox({ open: true, slides, index: clickedIndex })
    }

    const openEditModal = (post) => {
        setEditPost(post)
        setEditMessage(post.message || '')
        setEditPhotos(post.photos || [])
    }

    const handleEditSave = async () => {
        if (!editPost) return
        setEditSaving(true)
        const { error } = await supabase
            .from('posts')
            .update({ message: editMessage, photos: editPhotos })
            .eq('id', editPost.id)
        setEditSaving(false)
        if (error) { console.error(error.message); return }
        setEditPost(null)
        fetchEventAndPosts()
    }

    const handleDeletePost = async (postId) => {
        if (!window.confirm('Delete this post? This cannot be undone.')) return
        const { error } = await supabase.from('posts').delete().eq('id', postId)
        if (error) { console.error(error.message); return }
        fetchEventAndPosts()
    }

    if (loading) {
        return (
            <div className="flex justify-center my-12">
                <ClockLoader />
            </div>
        )
    }

    if (!event) {
        return <div className="text-center my-12">Event not found.</div>
    }

    const isLocked = event.status === 'locked' || new Date() > new Date(event.event_date)

    const coverDate = new Date(event.event_date).toLocaleDateString('en-GB', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    })

    return (
        <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>

            {showSplash && (
                <WelcomeSplash eventName={event.name} onComplete={handleSplashComplete} />
            )}

            <Lightbox
                open={lightbox.open}
                close={() => setLightbox(prev => ({ ...prev, open: false }))}
                slides={lightbox.slides}
                index={lightbox.index}
            />

            {/* Admin Edit Post Modal */}
            {editPost && (
                <Dialog open={!!editPost} onClose={() => setEditPost(null)} className="relative z-50">
                    <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <DialogPanel className="bg-white rounded-xl w-full max-w-md shadow-xl">
                            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100">
                                <DialogTitle className="font-semibold text-gray-800">Edit Post — {editPost.name}</DialogTitle>
                                <button onClick={() => setEditPost(null)} className="text-gray-400 hover:text-gray-600 p-1">
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="p-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                    <textarea
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3E36]"
                                        rows={4}
                                        value={editMessage}
                                        onChange={e => setEditMessage(e.target.value)}
                                    />
                                </div>
                                {editPhotos.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Photos / Videos</label>
                                        <div className="flex flex-wrap gap-2">
                                            {editPhotos.map((url, idx) => (
                                                <div key={idx} className="relative rounded overflow-hidden" style={{ width: 80, height: 80 }}>
                                                    {url.match(/\.(mp4|webm|ogg|mov)$/i)
                                                        ? <div className="w-full h-full bg-black flex items-center justify-center text-white text-xs">Video</div>
                                                        : <img src={url} alt="" className="w-full h-full object-cover" />
                                                    }
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditPhotos(prev => prev.filter((_, i) => i !== idx))}
                                                        className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 flex items-center justify-center text-xs"
                                                    >×</button>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">Click × to remove a photo/video.</p>
                                    </div>
                                )}
                                <button
                                    onClick={handleEditSave}
                                    disabled={editSaving}
                                    className="w-full py-2 rounded-lg text-white font-medium text-sm hover:opacity-90 disabled:opacity-50"
                                    style={{ backgroundColor: '#5A3E36' }}
                                >
                                    {editSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>
            )}

            {/* Cover image with text overlay */}
            <div className="relative w-full" style={{ height: '480px' }}>
                {event.cover_image ? (
                    <img
                        src={event.cover_image}
                        className="w-full h-full object-cover"
                        alt="Cover"
                    />
                ) : (
                    <div className="w-full h-full" style={{ background: 'linear-gradient(180deg, #7a5248 0%, #5A3E36 100%)' }} />
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 25%, rgba(0,0,0,0.6) 100%)' }} />
                {/* Name + date text */}
                <div className="absolute bottom-10 left-0 right-0 text-center text-white px-4">
                    <h1 style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(2.5rem, 8vw, 4rem)', textShadow: '0 2px 12px rgba(0,0,0,0.4)', lineHeight: 1.2, margin: 0 }}>
                        {event.name}
                    </h1>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.05rem', letterSpacing: '0.12em', opacity: 0.9, margin: '6px 0 0' }}>
                        {coverDate}
                    </p>
                </div>
            </div>

            <div className="max-w-xl mx-auto px-4">

                {/* Wedding Album header */}
                <div className="text-center py-7">
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', color: '#c9a84c', fontWeight: 600, margin: 0 }}>
                        Wedding Album
                    </h2>
                    <p className="text-gray-400 text-sm mt-2 mx-auto" style={{ maxWidth: '280px', lineHeight: 1.6 }}>
                        Let's memorize their very special day with creating an album of beautiful moments
                    </p>
                </div>

                <CountdownTimer eventDate={event.event_date} />

                {postDataArray.length > 0 && (
                    <p className="text-center text-gray-500 text-sm mb-2">
                        {postDataArray.length} {postDataArray.length === 1 ? 'guest has' : 'guests have'} posted
                    </p>
                )}

                <div className="flex justify-center gap-2 my-3 flex-wrap">
                    <ShareButton eventName={event.name} slug={slug} />
                </div>

                {isLocked && postDataArray.length >= 3 && (
                    <SentimentSummary posts={postDataArray} />
                )}

                {isLocked ? (
                    <div className="text-center my-4 py-3 px-4 rounded-xl" style={{ backgroundColor: '#f3e8e2', color: '#5A3E36', border: '1px solid #d4bfb5' }}>
                        <strong>This event has ended.</strong>
                        <p className="mb-0 text-sm mt-1">No new posts can be added. The memories are locked forever. 🔒</p>
                    </div>
                ) : (
                    <>
                        <div className="my-4">
                            <button
                                className="w-full py-3 rounded-full font-medium text-sm hover:opacity-90 transition-opacity tracking-wide"
                                onClick={() => setShowModal(true)}
                                style={{ backgroundColor: '#F4D9A9', color: '#5A3E36' }}
                            >
                                Create Post
                            </button>
                        </div>

                        <ModalCreatePost
                            show={showModal}
                            handleClose={() => setShowModal(false)}
                            setShowModal={setShowModal}
                            fetchEventAndPosts={fetchEventAndPosts}
                            defaultName={guestName}
                            onSuccess={handlePostSuccess}
                        />
                    </>
                )}

                {postDataArray.length === 0 && (
                    <div className="text-center mt-4 text-gray-500">
                        No posts yet. Be the first to share!
                    </div>
                )}

                {postDataArray.map((item) => {
                    const images = (item.photos || []).filter(url => !url.match(/\.(mp4|webm|ogg|mov)$/i))

                    return (
                        <div
                            key={item.id}
                            className="bg-white rounded-xl my-4 overflow-hidden"
                            style={{ maxWidth: '500px', margin: '16px auto', border: '1px solid #F4D9A9' }}
                        >
                            <div className="flex items-center justify-between px-4 py-3 border-b border-[#F4D9A9]">
                                <strong className="text-gray-800">{item.name}</strong>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400 text-xs">
                                        {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                                    </span>
                                    {session && (
                                        <>
                                            <button
                                                onClick={() => openEditModal(item)}
                                                className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-[#5A3E36] transition-colors"
                                                title="Edit post"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDeletePost(item.id)}
                                                className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                                title="Delete post"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {item.photos?.length > 1 && (
                                <PostCarousel
                                    photos={item.photos}
                                    onImageClick={(idx) => openLightbox(item.photos, idx)}
                                />
                            )}

                            {item.photos?.length === 1 && (
                                item.photos[0].match(/\.(mp4|webm|ogg|mov)$/i) ? (
                                    <video
                                        src={item.photos[0]}
                                        controls
                                        style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', backgroundColor: '#000' }}
                                    />
                                ) : (
                                    <div style={{ cursor: 'zoom-in' }} onClick={() => openLightbox(item.photos, 0)}>
                                        <SmartImage src={item.photos[0]} alt={item.name} />
                                    </div>
                                )
                            )}

                            <div className="px-4 py-3">
                                <p className="text-gray-700 text-sm">{item.message}</p>
                            </div>

                            <div className="px-3 pb-2 flex items-center justify-between">
                                <div className="flex flex-wrap gap-2">
                                    {images.map((url, idx) => (
                                        <SaveButton
                                            key={idx}
                                            imageUrl={url}
                                            watermarkEnabled={event.watermark_enabled}
                                            eventName={event.name}
                                        />
                                    ))}
                                </div>
                                <ShareButton
                                    eventName={event.name}
                                    slug={slug}
                                    text={`Check out ${item.name}'s post at ${event.name}!`}
                                />
                            </div>

                            <EmojiReactions postId={item.id} initialReactions={item.reactions} guestName={guestName} />
                        </div>
                    )
                })}

                <div className="mt-10">
                    <h5 className="text-center font-semibold text-gray-700 mb-3">Our Partners</h5>
                    <div className="p-4 bg-white rounded-xl">
                        <div className="flex items-center justify-center gap-6 flex-wrap text-center">
                            <img src="/images/MatTeko.jpg" style={{ maxHeight: '120px', objectFit: 'contain', maxWidth: '140px' }} alt="Mat Teko" />
                            <img src="/images/BO555KU_Motoring_Black.jpg" style={{ maxHeight: '120px', objectFit: 'contain', width: '130px' }} alt="Bossku Motoring" />
                        </div>
                    </div>
                </div>
            </div>

            <ScrollToTop />
        </div>
    )
}

export default EventPage
