import React, { useState } from 'react'
import { useEffect } from 'react'
import feather from "feather-icons";
import { NavLink } from 'react-router-dom';
import supabase from '../../config/supabaseClient';
import Carousel from "react-bootstrap/Carousel";
import { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient';

import { useAppContext } from '../components/AppContext';


const Home = () => {

    const [data, setData] = useState([])
    const [name, setName] = useState('')

    const [eventName, setEventName] = useState('')

    useEffect(() => {
        feather.replace()
        fetchData()

        getName()

    }, [])

    async function getName() {
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            setName(user.user_metadata.name)
        }
    }

    const postHandler = () => {
        console.log('create a post button clicked')
    }

    const fetchData = async () => {
        const { data, error } = await supabase
            .from('posts')
            .select()
            .order('created_at', { ascending: false })

        if (error) {
            console.error("Error:", error)
        }

        if (data) {
            setData(data)
        }
    }

    return (

        // <div className="container my-4">

        //     {
        //         name && (
        //             <div className="text-end text-muted fw-bold my-3">
        //                 Hello, {name}!
        //             </div>)
        //     }

        //     <div className="d-flex justify-content-between align-items-center mt-1">
        //         <h3 className="mt-1">Event ABC</h3>
        //         <NavLink to="/create" onClick={postHandler} className="btn btn-primary">
        //             <i data-feather="plus"></i>
        //         </NavLink>
        //     </div>

        //     {data.length === 0 && (
        //         <div className="text-center mt-4">No messages posted yet.</div>
        //     )}

        //     {data.map((item, index) => (
        //         <div
        //             key={index}
        //             className="card my-3 shadow-sm"
        //             style={{ maxWidth: "500px", margin: "0 auto" }} // IG-style centered post
        //         >
        //             {/* Header */}
        //             <div className="card-header d-flex align-items-center">
        //                 <strong>{item.name}</strong>
        //             </div>

        //             {/* Photo */}
        //             {item.photos.length > 1 && <Carousel>
        //                 {item.photos.map((photo, idx) => (
        //                     <Carousel.Item key={idx}>
        //                         <img
        //                             className="d-block w-100"
        //                             src={photo}
        //                             alt={`Slide ${idx + 1}`}
        //                             style={{
        //                                 maxHeight: "400px",
        //                                 objectFit: "cover",
        //                             }}
        //                         />
        //                     </Carousel.Item>
        //                 ))}
        //             </Carousel>}

        //             {item.photos.length === 1 &&
        //                 <img
        //                     src={item.photos}
        //                     alt={item.name}
        //                     style={{
        //                         width: "100%",
        //                         height: "400px",
        //                         objectFit: "cover",
        //                     }}
        //                 />
        //             }

        //             {/* Message */}
        //             <div className="card-body">
        //                 <p className="card-text">{item.message}</p>
        //             </div>
        //         </div>
        //     ))}
        // </div>

        <div className='text-center mt-5'>
            Welcome to Manganui
        </div>

    )
}

export default Home