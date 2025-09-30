import React from 'react'
import { Modal, Button } from "react-bootstrap";
import { useState, useRef, useEffect } from 'react';
import supabase from '../../config/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import Create from '../pages/Create';


const ModalCreatePost = ({ show, handleClose, setShowModal, fetchEventAndPosts }) => {

    return (
        <Modal
            show={show}
            onHide={handleClose}
            scrollable
            dialogClassName="modal-dialog modal-dialog-centered"
        >

            <div className="modal-content">
                <Modal.Header closeButton>
                    <Modal.Title>Create Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Create setShowModal={setShowModal} fetchEventAndPosts={fetchEventAndPosts} />
                </Modal.Body>
            </div>

        </Modal>
    )
}

export default ModalCreatePost