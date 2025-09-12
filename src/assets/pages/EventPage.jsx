import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import supabase from '../../config/supabaseClient'
import { useNavigate } from 'react-router-dom'
import ErrorPage from './ErrorPage'
import { NavLink } from 'react-router-dom';
import feather from "feather-icons";
import Carousel from "react-bootstrap/Carousel";

import { ClockLoader } from "react-spinners";

const EventPage = () => {

    const { slug } = useParams()
    const navigate = useNavigate()

    const [eventsList, setEventsList] = useState([])
    const [event, setEvent] = useState('')
    const [postDataArray, setPostDataArray] = useState([])

    const [loading, setLoading] = useState('true')

    const postHandler = () => {
        console.log('create a post button clicked')
    }


    const fetchEventAndPosts = async () => {
        const { data: eventData, error: errorEvent } = await supabase
            .from("events")
            .select()
            .eq('slug', slug)
            .single()

        if (errorEvent) {
            console.error(errorEvent.message)
            return
        }

        if (eventData) {
            console.log(eventData)
            setEvent(eventData)

            const { data: postData, error: errorPost } = await supabase
                .from("posts")
                .select()
                .eq('event_id', eventData.id)

            if (postData) {
                console.log(postData)
                setPostDataArray(postData)
                setLoading(false)
            }

            if (errorPost) {
                console.error(errorPost.message)
            }
        }

    }

    useEffect(() => {
        fetchEventAndPosts()
    }, [slug])


    useEffect(()=>{
        if(!loading){
            feather.replace()
        }
    }, [loading])

    // if (!eventsList.includes(slug)) {
    //     console.log(" No page found")
    //     // navigate('*')
    //     return <ErrorPage />
    // }

    if (loading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <ClockLoader />
            </div>
        )
    }


    return (
        <div className='container mt-3'>
            <div className='d-flex justify-content-between align-items-center'>
                <div>
                    {event.name}
                </div>

                <div>
                    <NavLink to={`/create/${slug}`} className="btn btn-primary">
                        <i data-feather="plus"></i>
                    </NavLink>
                </div>
            </div>

            <div className="">

                {postDataArray.length === 0 && (
                    <div className="text-center mt-4">No messages posted yet.</div>
                )}

                {postDataArray.map((item, index) => (
                    <div
                        key={index}
                        className="card my-3 shadow-sm"
                        style={{ maxWidth: "500px", margin: "0 auto" }} // IG-style centered post
                    >
                        {/* Header */}
                        <div className="card-header d-flex align-items-center">
                            <strong>{item.name}</strong>
                        </div>

                        {/* Photo */}
                        {item.photos?.length > 1 && <Carousel>
                            {item.photos.map((photo, idx) => (
                                <Carousel.Item key={idx}>
                                    <img
                                        className="d-block w-100"
                                        src={photo}
                                        alt={`Slide ${idx + 1}`}
                                        style={{
                                            maxHeight: "400px",
                                            objectFit: "cover",
                                        }}
                                    />
                                </Carousel.Item>
                            ))}
                        </Carousel>}

                        {item.photos?.length === 1 &&
                            <img
                                src={item.photos[0]}
                                alt={item.name}
                                style={{
                                    width: "100%",
                                    height: "400px",
                                    objectFit: "cover",
                                }}
                            />
                        }

                        {item.photos?.length === 0 &&
                            <div>
                                No photos uploaded
                            </div>
                        }

                        {/* Message */}
                        <div className="card-body">
                            <p className="card-text">{item.message}</p>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default EventPage