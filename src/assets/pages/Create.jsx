import React, { useEffect } from 'react'
import { useState, useRef } from 'react'
import supabase from '../../config/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'

import { ClockLoader } from "react-spinners";
import Upload from '../components/Upload'
import { Modal } from "react-bootstrap";



const Create = ({ setShowModal, fetchEventAndPosts, show, setUploadStatus }) => {

    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false)

    const [event, setEvent] = useState(null)
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

    const handleFileChange = (files) => {
        const validFiles = files.filter(file => file.size <= 60 * 1024 * 1024);

        if (validFiles.length !== files.length) {
            setError('One or more files are larger than 60MB. Please upload smaller ones.')
            return;
        }

        setFiles(validFiles);
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!name) {
            setError("Please insert name.");
            return;
        }

        if (!message) {
            setError("Please insert a message.");
            return;
        }

        // Close modal immediately
        setShowModal(false);

        // Show upload notification
        setUploadStatus('uploading');

        // Start upload in background
        uploadInBackground(files, name, message, event.id);

        // Reset form
        setName('');
        setMessage('');
        setFiles([]);
        setError('');
    };


    const uploadInBackground = async (files, userName, userMessage, eventId) => {
        const uploadedUrls = [];

        try {
            // 1️⃣ Upload all files
            for (const f of files) {
                console.log(f)
                const filePath = `${slug}/${Date.now()}-${f.name}`;

                const { error: uploadError } = await supabase.storage
                    .from("manganui_photos")
                    .upload(filePath, f);

                if (uploadError) {
                    console.error('Upload error:', uploadError);
                    continue;
                }

                const { data: publicData } = supabase.storage
                    .from("manganui_photos")
                    .getPublicUrl(filePath);

                uploadedUrls.push(publicData.publicUrl);

                // Insert into database
                // const { data, error } = await supabase
                //     .from("posts")
                //     .insert([{
                //         name: userName,
                //         message: userMessage,
                //         photos: uploadedUrls,
                //         event_id: eventId
                //     }])
                //     .select();

                // if (error) {
                //     console.error('Database error:', error);
                //     setUploadStatus('error');
                //     return;
                // }
            }

            // Insert into database
            const { data, error } = await supabase
                .from("posts")
                .insert([{
                    name: userName,
                    message: userMessage,
                    photos: uploadedUrls,
                    event_id: eventId
                }])
                .select();

            if (error) {
                console.error('Database error:', error);
                setUploadStatus('error');
                return;
            }


            // 3️⃣ Success
            setUploadStatus('success');
            fetchEventAndPosts();

            setTimeout(() => setUploadStatus(null), 3000);

        } catch (error) {
            console.error('Upload error:', error);
            setUploadStatus('error');
        }
    };



    useEffect(() => {
        document.title = 'Create Post'
        fetchEventId()
    }, [])

    const nameHandler = (e) => {
        const value = e.target.value
        // if (/^[a-zA-Z\s]*$/.test(value)) {
        //     setName(value);
        // }
        setName(value)
    }

    if (!/^[a-zA-Z\s]*$/.test(value)) {
        setError("Name can only contain letters and spaces")
        return
    }

    return (
        <div className='container'>
            <div className='text-center my-3'>Submit your photos/texts here to the wedding couples!</div>

            <div>
                <label htmlFor="name" className='form-label'>Name*</label>
                <input
                    type="text"
                    placeholder='Enter name'
                    className='form-control'
                    value={name}
                    id='name'
                    onChange={nameHandler}
                    required
                    disabled={loading}
                />
                <div className="form-text text-muted" style={{ fontSize: '12px' }}>
                    This helps the wedding couple know who you are. Use your real name.
                </div>

                <label htmlFor="message" className='form-label mt-2'>Message*</label>
                <input
                    placeholder='Write your message for the couples here'
                    className='form-control'
                    value={message}
                    id='message'
                    onChange={e => setMessage(e.target.value)}
                    required
                    disabled={loading}
                />

                {!loading && (
                    <div>
                        <Upload handleFileChange={handleFileChange} loading={loading} setError={setError} />
                    </div>
                )}

                {loading && (
                    <div className='d-flex justify-content-center align-items-center flex-column mt-4'>
                        <div className='text-center mb-2'>Uploading in background...</div>
                        <div><ClockLoader /></div>
                    </div>
                )}

                {error && <p className='text-center mt-3' style={{ color: "red" }}>{error}</p>}

                <div className='d-grid col-12 col-sm-2 mx-auto'>
                    <button
                        type="button"
                        onClick={submitHandler}
                        className='btn btn-primary mt-4'
                        disabled={loading}
                    >
                        Submit
                    </button>
                </div>

            </div>
        </div>
    )
}

export default Create