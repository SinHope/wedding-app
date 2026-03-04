import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import supabase from '../../config/supabaseClient'
import { ClockLoader } from 'react-spinners'
import { formatDistanceToNow } from 'date-fns'
import confetti from 'canvas-confetti'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

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

const EventPage = () => {
    const { slug } = useParams()

    const [event, setEvent] = useState(null)
    const [postDataArray, setPostDataArray] = useState([])
    const [loading, setLoading] = useState(true)

    const [showSplash, setShowSplash] = useState(false)
    const [guestName, setGuestName] = useState(localStorage.getItem('guestName') || '')

    const [showModal, setShowModal] = useState(false)
    const [lightbox, setLightbox] = useState({ open: false, slides: [], index: 0 })

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

                {postDataArray.length >= 3 && (
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
                                <span className="text-gray-400 text-xs">
                                    {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                                </span>
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
