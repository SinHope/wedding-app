import React, { useEffect } from 'react'
import { useState, useRef } from 'react'
import supabase from '../../config/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'

import { ClockLoader } from "react-spinners";


const Create = () => {

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

    const navigate = useNavigate()

    const handleFileChange = (e) => {
        // setFile(e.target.files[0]) //for a single file

        const validFiles = Array.from(e.target.files).filter(file => file.size <= 5 * 1024 * 1024) //to filter only less than 5mb
        if (validFiles.length !== e.target.files.length) {
            alert('Photo filesize is more than 5mb. Please upload less than 5mb.')

            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }

            return
        }
        setFile(Array.from(e.target.files))
    }

    const submitHandler = async (e) => {
        e.preventDefault()

        if (!name) {
            setError("Please insert name.")
        }

        setLoading(true)

        //1. Upload to supabase storage
        const uploadedUrls = []
        for (const f of file) {
            const filePath = `users/${Date.now()}-${f.name}` //to provide a unique name to the file/photo
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

        navigate(`/event/${slug}`)


    }

    // const submitHandler = async (e) => {
    //     e.preventDefault();

    //     if (!name) {
    //         setError("Please insert name.");
    //         return;
    //     }

    //     if (!file || file.length === 0) {
    //         setError("Please select at least one image.");
    //         return;
    //     }

    //     setLoading(true);
    //     setError(null);

    //     try {
    //         // Filter valid files under 5MB
    //         const validFiles = file.filter(f => f.size <= 5 * 1024 * 1024);
    //         if (validFiles.length !== file.length) {
    //             alert("Some photos were larger than 5MB and were skipped.");
    //         }

    //         if (validFiles.length === 0) {
    //             setLoading(false);
    //             return; // nothing to upload
    //         }

    //         // Upload all files in parallel
    //         const uploadedUrls = await Promise.all(
    //             validFiles.map(async (f) => {
    //                 const filePath = `users/${Date.now()}-${f.name}`;
    //                 const { data: uploadData, error: uploadError } = await supabase.storage
    //                     .from("manganui_photos")
    //                     .upload(filePath, f);

    //                 if (uploadError) throw uploadError;

    //                 const { data: publicData } = supabase.storage
    //                     .from("manganui_photos")
    //                     .getPublicUrl(filePath);

    //                 return publicData.publicUrl;
    //             })
    //         );

    //         // Insert into posts table
    //         const { data: postData, error: postError } = await supabase
    //             .from("posts")
    //             .insert([{ name, message, photos: uploadedUrls, event_id: event.id }])
    //             .select();

    //         if (postError) {
    //             console.error(postError);
    //             setError("Failed to submit post.");
    //             setLoading(false);
    //             return;
    //         }

    //         // Reset form
    //         setName("");
    //         setMessage("");
    //         setFile([]);
    //         if (fileInputRef.current) fileInputRef.current.value = "";

    //         // Redirect to event page
    //         navigate(`/event/${slug}`);

    //     } catch (err) {
    //         console.error(err);
    //         setError("An error occurred during upload. Please try again.");
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    useEffect(() => {
        fetchEventId()
    }, [])




    return (
        <div className='container'>
            <div className='text-center my-3'>Submit your photos/texts here to the wedding couples!</div>

            {/* form to upload photos and/or texts */}
            <form action="" onSubmit={submitHandler}>
                <label htmlFor="name" className='form-label'>Name*</label>
                <input type="text" placeholder='Enter your name' className='form-control' value={name} id='name' onChange={e => setName(e.target.value)} required />

                <label htmlFor="message" className='form-label mt-2'>Message*</label>
                <input placeholder='Write your message for the couples here' className='form-control' value={message} id='message' onChange={e => setMessage(e.target.value)} required />

                {/* file/photo upload */}
                <label className="form-label mt-2" htmlFor="file">Upload Image</label>
                <input className="form-control" ref={fileInputRef} type="file" id='file' multiple accept='image/*'
                    onChange={handleFileChange} />
                <div className="text-muted">
                    Please upload clear images (JPEG/PNG) under 5MB for best results.
                </div>

                {/* Custom button to trigger file input */}
                {/* <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => document.getElementById("file").click()}
                    >Choose File
                    </button> */}
                {error && <p style={{ color: "red" }}>{error}</p>}

                <button type='submit' className='btn btn-primary mt-4'>Submit</button>

            </form>

            {file?.length > 0 && <div>
                <h3>Preview</h3>
                <div className='d-flex flex-wrap justify-content-center align-items-center'>
                    {file.map((f, index) => (
                        <div key={index} className='m-1' >
                            <img src={URL.createObjectURL(f)} alt="" style={{ maxWidth: "150px", }} />
                        </div>

                    ))}
                </div>
            </div>}

            {loading && (
                <div className='d-flex justify-content-center align-items-center flex-column mt-4'>
                    <div className='text-center mb-2'>Please wait..</div>
                    <div><ClockLoader /></div>

                </div>)}



        </div>
    )
}

export default Create