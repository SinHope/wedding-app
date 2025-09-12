import React from 'react'
import { useState, useEffect } from 'react'
import supabase from '../../config/supabaseClient'
import { Plus } from 'react-feather';
import { Link } from 'react-router-dom';




import { ClockLoader } from 'react-spinners'

const AdminDashboard = () => {

    const [events, setEvents] = useState([])

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchEvents()
    }, [])

    async function fetchEvents() {
        const { data, error } = await supabase
            .from('events')
            .select()
            .order('created_at', { ascending: false })

        if (data) {
            setEvents(data)
            setLoading(false)
        }

        if (error) {
            console.error(error.message)
        }

    }

    console.log(events)

    if (loading) {
        return (
            <div className='d-flex justify-content-center mt-5'>
                <ClockLoader />
            </div>
        )
    }

    return (
        <div className='container'>
            <h4 className='text-center my-3'>Admin Dashboard</h4>

            <div className="d-flex my-3">
                <button className="btn btn-light ms-auto d-flex align-items-center">
                    <Plus size={16} className="me-2" /> Create an Event
                </button>
            </div>

            {
                events &&
                <table className='table table-striped table-bordered'>
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Name</th>
                            <th>Event's Date</th>
                        </tr>

                    </thead>
                    <tbody>
                        {events.map((item, index) => {
                            return <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td>
                                    {/* <a href={`/event/${item.slug}`}>{item.name}</a> */}
                                    <Link to={`/event/${item.slug}`} className="text-decoration-none">
                                        {item.name}
                                    </Link>

                                </td>
                                <td>{new Date(item.event_date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric"
                                })}</td>
                            </tr>

                        })}
                    </tbody>

                </table>
            }
        </div>


    )
}

export default AdminDashboard