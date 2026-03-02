import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAppContext } from './AppContext'
import { Menu, X } from 'react-feather'

function AppNavbar() {
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()
    const { logout, session } = useAppContext()

    const logoutHandler = async () => {
        await logout()
        navigate('/')
    }

    const linkClass = ({ isActive }) =>
        `block px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'text-[#5A3E36]' : 'text-gray-700 hover:text-[#5A3E36]'}`

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex items-center justify-between h-14">
                    <NavLink to="/" className="text-[#5A3E36] font-semibold text-lg tracking-wide">
                        Manganui
                    </NavLink>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-1">
                        <NavLink to="/" end className={linkClass}>Home</NavLink>
                        <NavLink to="/contact" className={linkClass}>Contact</NavLink>
                        {session && <NavLink to="/admin-dashboard" className={linkClass}>Admin Dashboard</NavLink>}
                        {session && (
                            <button onClick={logoutHandler} className="px-3 py-2 text-sm text-gray-700 hover:text-[#5A3E36] transition-colors">
                                Log out
                            </button>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button className="md:hidden p-2 text-gray-700" onClick={() => setOpen(!open)}>
                        {open ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Mobile menu */}
                {open && (
                    <div className="md:hidden border-t border-gray-100 py-2">
                        <NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>Home</NavLink>
                        <NavLink to="/contact" className={linkClass} onClick={() => setOpen(false)}>Contact</NavLink>
                        {session && (
                            <NavLink to="/admin-dashboard" className={linkClass} onClick={() => setOpen(false)}>
                                Admin Dashboard
                            </NavLink>
                        )}
                        {session && (
                            <button
                                onClick={() => { logoutHandler(); setOpen(false) }}
                                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:text-[#5A3E36]"
                            >
                                Log out
                            </button>
                        )}
                    </div>
                )}
            </div>
        </nav>
    )
}

export default AppNavbar
