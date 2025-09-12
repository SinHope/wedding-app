import React, { useEffect } from 'react'
import { useState } from 'react'
import supabase from '../../config/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'

const Create = () => {

    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [file, setFile] = useState([]);

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

        if(data){
            console.log(data.id)
            setEvent(data)
        
        }

    }

    const navigate = useNavigate()

    const handleFileChange = (e) => {
        // setFile(e.target.files[0]) //for a single file
        setFile(Array.from(e.target.files))
    }

    console.log(file)

    const submitHandler = async (e) => {
        e.preventDefault()
        console.log(name, message, file)

        if (!name) {
            setError("Please insert name.")
        }

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

    useEffect(()=>{
        fetchEventId()
    }, [])




    return (
        <div className='container'>
            <div className='text-center my-3'>Submit your photos/texts here to the wedding couples!</div>

            {/* form to upload photos and/or texts */}
            <form action="" onSubmit={submitHandler}>
                <label htmlFor="name" className='form-label'>Name:</label>
                <input type="text" placeholder='Enter your name' className='form-control' value={name} id='name' onChange={e => setName(e.target.value)} />

                <label htmlFor="message" className='form-label mt-2'>Message</label>
                <input placeholder='Write your message for the couples here' className='form-control' value={message} id='message' onChange={e => setMessage(e.target.value)} />

                {/* file/photo upload */}
                <label className="form-label mt-2" htmlFor="file">Upload Image</label>
                <input className="form-control" type="file" id='file' multiple accept='image/*'
                    onChange={handleFileChange} />

                {/* Custom button to trigger file input */}
                {/* <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => document.getElementById("file").click()}
                    >Choose File
                    </button> */}
                {error && <p style={{ color: "red" }}>{error}</p>}

                <button type='submit' className='btn btn-primary mt-3'>Submit</button>



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



        </div>
    )
}

export default Create