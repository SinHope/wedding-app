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
