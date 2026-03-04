import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <div style={{ backgroundColor: '#F0E5DA', minHeight: '100vh' }}>
            {/* Hero Section */}
            <section
                className="text-center flex flex-col justify-center items-center px-4"
                style={{
                    minHeight: '80vh',
                    background: 'linear-gradient(135deg, #fffaf6, #f6e4d8)',
                    padding: '3rem 1rem',
                }}
            >
                <h1 className="text-4xl font-bold max-w-2xl" style={{ color: '#5A3E36' }}>
                    Capture Every Wedding Memory in One Place
                </h1>
                <p className="mt-4 text-lg max-w-xl" style={{ color: '#6b4b43' }}>
                    Let your guests share photos, videos, and heartfelt wishes easily.
                    With just a QR code, everything is collected into a beautiful digital
                    album for the couple to cherish forever.
                </p>
                <Link
                    to="/contact"
                    className="mt-6 inline-block px-8 py-3 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#5A3E36' }}
                >
                    Book Your Page
                </Link>
            </section>

            {/* Features Section */}
            <section className="max-w-4xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div>
                        <h3 className="text-xl font-semibold mb-2">🎉 Simple & Fun</h3>
                        <p className="text-gray-600">No app downloads needed. Guests scan a QR code and start posting instantly.</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-2">💌 Heartfelt Messages</h3>
                        <p className="text-gray-600">Friends and family can leave personal notes alongside photos and videos.</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-2">📸 All in One Album</h3>
                        <p className="text-gray-600">Every post is collected in a single event page — the couple's own wedding wall.</p>
                    </div>
                </div>
            </section>

            {/* Testimonials Snippet */}
            <section className="py-16 px-4" style={{ background: 'linear-gradient(135deg, #fffaf6, #f6e4d8)' }}>
                <div className="max-w-2xl mx-auto text-center">
                    <p style={{ color: '#c9a84c', fontFamily: "'Cormorant Garamond', serif", letterSpacing: '0.18em', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                        Kind Words
                    </p>
                    <h2 style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(2rem, 5vw, 2.8rem)', color: '#5A3E36', marginBottom: '2rem' }}>
                        What Couples Say
                    </h2>
                    <div className="rounded-2xl p-8 text-left" style={{ backgroundColor: '#fffaf6', border: '1px solid #e8d5c4' }}>
                        <span style={{ color: '#c9a84c', fontSize: '3rem', fontFamily: 'Georgia, serif', lineHeight: 1 }}>"</span>
                        <p className="italic text-lg leading-relaxed mt-1" style={{ color: '#5A3E36', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem' }}>
                            Every guest was able to share their moments effortlessly, and now we have a treasure trove of photos and heartfelt messages to look back on forever.
                        </p>
                        <p className="mt-4" style={{ fontFamily: "'Great Vibes', cursive", fontSize: '1.6rem', color: '#5A3E36' }}>
                            Ridwan & Aisyah
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>January 2026</p>
                    </div>
                    <Link
                        to="/testimonials"
                        className="mt-6 inline-block px-6 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: '#5A3E36', color: '#fff' }}
                    >
                        Read More Stories →
                    </Link>
                </div>
            </section>

            {/* Call To Action Section */}
            <section className="text-center py-16 px-4" style={{ background: '#5A3E36', color: '#fff' }}>
                <h2 className="text-2xl font-bold">Make Your Wedding Memories Last Forever</h2>
                <p className="mt-3 max-w-lg mx-auto">
                    Let us set up a personalized wedding page for you.
                    Your guests will be able to share photos, videos, and heartfelt wishes with ease.
                </p>
                <Link
                    to="/contact"
                    className="mt-6 inline-block bg-white px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                    style={{ color: '#5A3E36' }}
                >
                    Get in Touch
                </Link>
            </section>
        </div>
    )
}

export default Home
