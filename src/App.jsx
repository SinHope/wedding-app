import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';

import AppNavbar from './assets/components/AppNavbar';
import Home from './assets/pages/Home';
import Contact from './assets/pages/Contact';
import Create from './assets/pages/Create';
import Register from './assets/pages/Register';
import Login from './assets/pages/Login';
import AdminDashboard from './assets/pages/AdminDashboard';
import EventPage from './assets/pages/EventPage';
import ErrorPage from './assets/pages/ErrorPage';
import AboutUs from './assets/pages/AboutUs';

import ProtectedRoute from './assets/components/ProtectedRoute';

import { AppProvider } from './assets/components/AppContext';
import Footer from './assets/components/Footer';


function App({ session }) {

  return (
    <>
      <div className=''>
        <AppProvider>
          <AppNavbar />

          <Routes>
            <Route path="/" element={<Home />} />

            <Route path='/contact' element={<Contact />} />
            <Route path='/create/:slug' element={<Create />} />

            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='about-us' element={<AboutUs />} />
            <Route path='/admin-dashboard' element={<ProtectedRoute session={session}><AdminDashboard /></ProtectedRoute>} />

            <Route path="/event/:slug" element={<EventPage />} />
            <Route path='*' element={<ErrorPage />} />

          </Routes>
          <Footer/>
        </AppProvider>



      </div>
    </>
  )
}

export default App
