import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import supabase from '../../config/supabaseClient';
import { useNavigate } from 'react-router-dom';

import { useAppContext } from './AppContext';

function AppNavbar() {
    const [expanded, setExpanded] = useState(false);

    const navigate = useNavigate()
    const {logout, session} = useAppContext()


    const logoutHandler = async() => {
        await logout()
        navigate('/')
    }


    return (

        <Navbar expanded={expanded} expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand as={NavLink} to="/" end>
                    Manganui
                </Navbar.Brand>

                <Navbar.Toggle
                    aria-controls="responsive-navbar-nav"
                    onClick={() => setExpanded(!expanded)}
                />

                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/" end onClick={() => setExpanded(false)}>
                            Home
                        </Nav.Link>
                        
                        <Nav.Link as={NavLink} to="/contact" onClick={() => setExpanded(false)}>
                            Contact
                        </Nav.Link>

                        <Nav.Link as={NavLink} to='/about-us' onClick={() => setExpanded(false)}>
                            About Us
                        </Nav.Link>

                        {/* {!session && <Nav.Link as={NavLink} to="/login" onClick={() => setExpanded(false)}>
                            Login (Admin)
                        </Nav.Link>} */}

                        {/* {!session && <Nav.Link as={NavLink} to="/register" onClick={() => setExpanded(false)}>
                            Register
                        </Nav.Link>} */}


                        {session && <Nav.Link as={NavLink} to="/admin-dashboard" onClick={() => setExpanded(false)}>
                            Admin Dashboard
                        </Nav.Link>}
                    </Nav>

                    <Nav className="ms-auto">
                        {session && (
                            <Nav.Link onClick={logoutHandler}>Log out</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>


            </Container>
        </Navbar>

    );
}

export default AppNavbar;
