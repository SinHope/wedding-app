import React from 'react'
import Carousel from 'react-bootstrap/Carousel';


const EventCarousel = ({ postDataArray }) => {
    return (
        <Carousel>
            {postDataArray.map((item, index) => {
                return <Carousel.Item key={item.id} interval={3000}>
                    <div className='d-flex justify-content-center'>
                        <img src={item.photos[0]} style={{ maxHeight: '300px', objectFit: "contain" }} alt={`slide ${index = 1}`} />
                    </div>
                    <Carousel.Caption>
                        <p>{item.message}</p>
                        {/* <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p> */}
                    </Carousel.Caption>
                </Carousel.Item>
            })}
        </Carousel>
    )
}

export default EventCarousel