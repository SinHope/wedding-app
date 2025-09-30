import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import supabase from '../../config/supabaseClient'
import { useNavigate } from 'react-router-dom'
import ErrorPage from './ErrorPage'
import { NavLink } from 'react-router-dom';
import feather from "feather-icons";
import Carousel from "react-bootstrap/Carousel";
import { ClockLoader } from "react-spinners";
import ModalCreatePost from '../components/ModalCreatePost'
import EventCarousel from '../components/EventCarousel'

const EventPage = () => {

    const { slug } = useParams()
    const navigate = useNavigate()

    const [event, setEvent] = useState('')
    const [postDataArray, setPostDataArray] = useState([])
    const [loading, setLoading] = useState(true)

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
            setEvent(eventData)

            const { data: postData, error: errorPost } = await supabase
                .from("posts")
                .select()
                .eq('event_id', eventData.id)
                .order('created_at', { ascending: false }); // latest first


            if (postData) {
                setPostDataArray(postData)
                setLoading(false)
            }

            if (errorPost) {
                console.error(errorPost.message)
            }
        }

    }

    useEffect(() => {
        document.title = slug
        fetchEventAndPosts()

    }, [slug])


    useEffect(() => {
        if (!loading) {
            feather.replace()
        }
    }, [loading])

    const [showModal, setShowModal] = useState(false);
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);



    if (loading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <ClockLoader />
            </div>
        )
    }

    const date = new Date(event.event_date)
    const options = { day: "2-digit", month: "long", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-GB", options);

    return (
        <div className='py-3' style={{ backgroundColor: '#F0E5DA' }}>

            <div className='container mx-auto'>

                <EventCarousel postDataArray={postDataArray} />

                <div className='text-center mt-3'>
                    <h1>{event.name}</h1>
                    <h3 className='mt-2'>{formattedDate}</h3>
                </div>

                <div className='d-grid gap-2 my-5 col-12 col-sm-6 col-md-2 ms-sm-auto'>
                    <button className='btn btn-light w-100 d-flex justify-content-center btn-outline-secondary' onClick={handleShow}>
                        <i className='' data-feather="plus"></i>
                        <span className=''>Create Post</span>
                    </button>
                </div>


                <ModalCreatePost show={showModal} handleClose={handleClose} setShowModal={setShowModal} fetchEventAndPosts={fetchEventAndPosts} />

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






        </div>
    )
}

export default EventPage