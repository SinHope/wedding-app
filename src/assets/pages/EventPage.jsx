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
import EventHeader from '../components/EventHeader'
import SmartImage from '../components/SmartImage'


const EventPage = () => {

    const { slug } = useParams()
    const navigate = useNavigate()

    const [event, setEvent] = useState('')
    const [postDataArray, setPostDataArray] = useState([])
    const [loading, setLoading] = useState(true)

    const [response, setResponse] = useState(null)

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
            <div className="d-flex justify-content-center my-5">
                <ClockLoader />
            </div>
        )
    }

    const date = new Date(event.event_date)
    const options = { day: "2-digit", month: "long", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-GB", options);


    return (
        <div className='' style={{ backgroundColor: '#F0E5DA' }}>

            {/* cover image */}
            {event.cover_image && <div>
                <img src={event.cover_image} className='img-fluid w-100' style={{ maxHeight: "550px", minHeight: "400px", objectFit: "cover" }} alt="" />
            </div>}

            <div className='container mx-auto py-4'>

                {/* {showCarousel && <EventCarousel postDataArray={postDataArray} />} */}

                <div className='text-center mt-3'>
                    <h1>{event.name}</h1>
                    <h3 className='mt-2'>{formattedDate}</h3>
                </div>

                <div className='d-grid gap-2 my-5 col-12 col-sm-6 col-md-2 ms-sm-auto'>
                    <button className='btn btn-light w-100 d-flex justify-content-center btn-outline-secondary' onClick={handleShow}>
                        <i className='' data-feather="plus"></i>
                        <span className='text-dark'>Create Post</span>
                    </button>
                </div>

                <ModalCreatePost show={showModal} handleClose={handleClose} setShowModal={setShowModal} fetchEventAndPosts={fetchEventAndPosts} />

                <div className="">

                    {postDataArray.length === 0 && (
                        <div className="text-center mt-4">
                            No messages posted yet. Lets start posting!
                        </div>
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


                            {/* Multiple media in carousel */}
                            {item.photos?.length > 1 && (
                                <Carousel interval={null}>
                                    {item.photos.map((media, idx) => (
                                        <Carousel.Item key={idx}>
                                            {media.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                                                <video
                                                    src={media}
                                                    controls
                                                    style={{
                                                        width: "100%",
                                                        height: "400px",
                                                        objectFit: "contain",
                                                        backgroundColor: "#000"
                                                    }}
                                                />
                                            ) : (
                                                // <img
                                                //     className="d-block w-100"
                                                //     src={media}
                                                //     alt={`Slide ${idx + 1}`}
                                                //     style={{
                                                //         height: "400px",
                                                //         objectFit: "contain",
                                                //     }}
                                                // />
                                                <SmartImage
                                                    src={media}
                                                    alt={idx + 1}
                                                />
                                            )}
                                        </Carousel.Item>
                                    ))}
                                </Carousel>
                            )}


                            {/* single file upload, image or video */}
                            {item.photos?.length === 1 && (
                                <>
                                    {/* if video or else photo */}
                                    {item.photos[0].match(/\.(mp4|webm|ogg|mov)$/i) ? (
                                        <video
                                            src={item.photos[0]}
                                            controls
                                            style={{
                                                width: "100%",
                                                maxHeight: "400px",
                                                objectFit: "contain",
                                                backgroundColor: "#000"
                                            }}
                                        />
                                    ) : (
                                        <SmartImage
                                            src={item.photos[0]}
                                            alt={item.name}
                                        />
                                    )}
                                </>
                            )}

                            {item.photos?.length === 0 &&
                                <div className='ms-3 mt-2'>
                                    {/* No photos uploaded */}
                                    Message:
                                </div>
                            }

                            {/* Message */}
                            <div className="card-body">
                                <p className="card-text">{item.message}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className='mt-4'>
                    <h5 className='text-center'>Our Partners</h5>
                    <div className='p-3 d-flex justify-content-center rounded' style={{ backgroundColor: 'white', width: '100%' }}>
                        <img src="/images/MatTeko.jpg" style={{
                            width: '30%',
                            maxWidth: '200px',
                            height: 'auto',
                            objectFit: 'contain',
                        }} alt="Mat Teko" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventPage