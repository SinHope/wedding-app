import { useState, useEffect } from 'react'
import { ArrowUp } from 'react-feather'

const ScrollToTop = () => {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 300)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    if (!visible) return null

    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 left-6 w-11 h-11 flex items-center justify-center rounded-full z-50 hover:opacity-60 transition-opacity"
            style={{ backgroundColor: 'transparent', color: '#5A3E36', border: '2px solid #5A3E36' }}
            title="Scroll to top"
        >
            <ArrowUp size={18} />
        </button>
    )
}

export default ScrollToTop
