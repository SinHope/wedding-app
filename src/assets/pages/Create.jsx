import React, { useEffect } from 'react'
import { useState, useRef } from 'react'
import supabase from '../../config/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'

import { ClockLoader } from "react-spinners";
import Upload from '../components/Upload'


const Create = ({ setShowModal, fetchEventAndPosts }) => {

    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [file, setFile] = useState([]);
    const [loading, setLoading] = useState(false)


    const [event, setEvent] = useState(null)
    const fileInputRef = useRef()

    const { slug } = useParams();

    const fetchEventId = async () => {
        const { data, error } = await supabase
            .from('events')
            .select()
            .eq('slug', slug)
            .single()

        if (error) {
            console.error(error.message)
        }

        if (data) {
            setEvent(data)
        }

    }

    // const handleFileChange = (e) => {

    //     const validFiles = Array.from(e.target.files).filter(file => file.size <= 5 * 1024 * 1024) //to filter only less than 5mb
    //     if (validFiles.length !== e.target.files.length) {
    //         alert('One or more photo filesize is more than 5mb. Please upload photo less than 5mb.')

    //         if (fileInputRef.current) {
    //             fileInputRef.current.value = ''
    //         }

    //         return
    //     }
    //     setFile(Array.from(e.target.files))
    // }

    const handleFileChange = (files) => {
        const validFiles = files.filter(file => file.size <= 50 * 1024 * 1024);

        if (validFiles.length !== files.length) {
            alert('One or more photos are larger than 5MB. Please upload smaller ones.');
            return;
        }

        setFile(validFiles);
    };

    const submitHandler = async (e) => {
        e.preventDefault()

        if (!name) {
            setError("Please insert name.")
        }
        setLoading(true)

        //1. Upload to supabase storage
        const uploadedUrls = []
        for (const f of file) {
            const filePath = `${slug}/${Date.now()}-${f.name}` //to provide a unique name to the file/photo
            console.log(filePath)

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from("manganui_photos")
                .upload(filePath, f)

            if (uploadError) {
                console.error(uploadError)
                setError("File upload failed")
            }

            //2 Get public url
            const { data: publicData } = supabase.storage
                .from("manganui_photos")
                .getPublicUrl(filePath)

            uploadedUrls.push(publicData.publicUrl);

        }

        //3. insert into table
        const { data, error } = await supabase
            .from("posts")
            .insert([{ 'name': name, 'message': message, 'photos': uploadedUrls, 'event_id': event.id }])
            .select()

        if (error) {
            console.error('Error', error)
            return
        }

        setName('')
        setMessage('')
        setError(null)
        setFile(null)

        setLoading(false)
        setShowModal(false)
        // navigate(`/event/${slug}`)
        fetchEventAndPosts()
    }

    useEffect(() => {
        document.title = 'Create Post'
        fetchEventId()
    }, [])


    const nameHandler = (e) => {
        const value = e.target.value
        if (/^[a-zA-Z\s]*$/.test(value)) {
            setName(value);
        }
    }

    return (
        <div className='container'>
            <div className='text-center my-3'>Submit your photos/texts here to the wedding couples!</div>

            {/* form to upload photos and/or texts */}
            <form action="" onSubmit={submitHandler}>
                <label htmlFor="name" className='form-label'>Name*</label>
                <input type="text" placeholder='Enter name' className='form-control' value={name} id='name' onChange={nameHandler} required />
                <div className="form-text text-muted" style={{ fontSize: '12px' }}>
                    This helps the wedding couple know who you are. Use your real name.
                </div>

                <label htmlFor="message" className='form-label mt-2'>Message*</label>
                <input placeholder='Write your message for the couples here' className='form-control' value={message} id='message' onChange={e => setMessage(e.target.value)} required />



                {!loading && <div>
                    <Upload handleFileChange={handleFileChange} loading={loading} />
                </div>}

                {loading && (
                    <div className='d-flex justify-content-center align-items-center flex-column mt-4'>
                        <div className='text-center mb-2'>Please wait..</div>
                        <div><ClockLoader /></div>

                    </div>)}

                {/* Custom button to trigger file input */}
                {error && <p style={{ color: "red" }}>{error}</p>}

                <div className='d-grid col-12 col-sm-2 mx-auto'>
                    <button type='submit' className='btn btn-primary mt-4'>Submit</button>
                </div>

            </form>


        </div>
    )
}

export default Create