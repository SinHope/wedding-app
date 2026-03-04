import { Link, useLocation } from 'react-router-dom'

const Footer = () => {
    const location = useLocation()
    const isEventPage = location.pathname.startsWith('/event/')

    return (
        <footer className="flex justify-between items-center py-3 border-t border-gray-200 bg-gray-50 px-4 gap-2">
            <span className="text-gray-500 text-sm">© 2026 Ridwan Yusoff And Nasmer Fontanilla</span>
            {isEventPage && (
                <Link
                    to="/contact"
                    className="text-sm border border-[#5A3E36] text-[#5A3E36] px-3 py-1 rounded hover:bg-[#5A3E36] hover:text-white transition-colors whitespace-nowrap text-center"
                >
                    Enquire Here
                </Link>
            )}
        </footer>
    )
}

export default Footer
