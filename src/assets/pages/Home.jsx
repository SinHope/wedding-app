import React, { useState } from 'react'
import { useEffect } from 'react'
import feather from "feather-icons";
import { NavLink } from 'react-router-dom';
import supabase from '../../config/supabaseClient';
import Carousel from "react-bootstrap/Carousel";
import { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient';

import { useAppContext } from '../components/AppContext';


const Home = () => {

    return (



        <div className='text-center mt-5'>
            Welcome to Manganui

        
        </div>

    )
}

export default Home