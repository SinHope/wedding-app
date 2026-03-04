import { Link } from 'react-router-dom'

const testimonials = [
    {
        id: 1,
        coupleName: "Ridwan & Aisyah",
        quote: "We couldn't have imagined our wedding memories being captured so beautifully. Every guest was able to share their moments effortlessly, and now we have a treasure trove of photos and heartfelt messages to look back on forever. Manganui made our special day even more memorable.",
        photo: "/images/Assyafaah-Mosque-wedding-23.jpg",
        wedding: "January 2026",
    },
]

const Testimonials = () => {
    return (
        <div style={{ backgroundColor: '#F0E5DA', minHeight: '100vh' }}>

            {/* Page Header */}
            <div className="text-center py-14 px-4" style={{ background: 'linear-gradient(135deg, #fffaf6, #f6e4d8)' }}>
                <p style={{ color: '#c9a84c', fontFamily: "'Cormorant Garamond', serif", letterSpacing: '0.18em', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Kind Words
                </p>
                <h1 style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', color: '#5A3E36' }}>
                    Couples We've Loved
                </h1>
                <p className="mt-3 text-gray-500 text-sm max-w-md mx-auto">
                    Real stories from real couples who trusted us to help preserve their most precious memories.
                </p>
            </div>

            {/* Testimonials */}
            {testimonials.map((t, index) => {
                const photoLeft = index % 2 === 0

                return (
                    <div
                        key={t.id}
                        className={`flex flex-col ${photoLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                        style={{ minHeight: '520px' }}
                    >
                        {/* Photo */}
                        <div className="w-full md:w-1/2 overflow-hidden" style={{ minHeight: '320px' }}>
                            <img
                                src={t.photo}
                                alt={t.coupleName}
                                className="w-full h-full object-cover"
                                style={{ minHeight: '320px' }}
                                onError={e => { e.target.style.display = 'none'; e.target.parentNode.style.backgroundColor = '#d4bfb5' }}
                            />
                        </div>

                        {/* Text */}
                        <div
                            className="w-full md:w-1/2 flex flex-col justify-center px-10 py-14"
                            style={{ backgroundColor: index % 2 === 0 ? '#fffaf6' : '#F0E5DA' }}
                        >
                            <span style={{ color: '#c9a84c', fontSize: '4rem', fontFamily: 'Georgia, serif', lineHeight: 1, display: 'block', marginBottom: '-0.5rem' }}>"</span>
                            <p
                                className="text-lg leading-relaxed"
                                style={{ color: '#5A3E36', fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1rem, 2vw, 1.2rem)', lineHeight: 1.9 }}
                            >
                                {t.quote}
                            </p>
                            <div className="mt-8">
                                <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: '#5A3E36' }}>
                                    {t.coupleName}
                                </p>
                                <p className="text-sm mt-1" style={{ color: '#c9a84c', letterSpacing: '0.1em', fontFamily: "'Cormorant Garamond', serif" }}>
                                    {t.wedding}
                                </p>
                            </div>
                        </div>
                    </div>
                )
            })}

            {/* CTA */}
            <div className="text-center py-16 px-4" style={{ backgroundColor: '#5A3E36' }}>
                <h2 className="text-2xl font-bold text-white">Ready to Create Your Own Story?</h2>
                <p className="mt-3 text-white/80 max-w-md mx-auto text-sm">
                    Let your guests share beautiful moments from your wedding day in one place.
                </p>
                <Link
                    to="/contact"
                    className="mt-6 inline-block px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#c9a84c', color: '#fff' }}
                >
                    Book Your Page
                </Link>
            </div>
        </div>
    )
}

export default Testimonials
