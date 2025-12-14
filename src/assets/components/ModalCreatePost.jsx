import React from 'react'
import { Modal, Button } from "react-bootstrap";
import Create from '../pages/Create';
import { useState } from 'react';
import { ClockLoader } from 'react-spinners';


const ModalCreatePost = ({ show, handleClose, setShowModal, fetchEventAndPosts, slug }) => {

    const [uploadStatus, setUploadStatus] = useState(null); // 'uploading', 'success', 'error'

    return (
        <>
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
                        <Create
                            setShowModal={setShowModal}
                            show={show}
                            fetchEventAndPosts={fetchEventAndPosts}
                            setUploadStatus={setUploadStatus}
                        />
                    </Modal.Body>
                </div>
            </Modal>

            {/* Upload notification toast */}
            {uploadStatus === 'uploading' && (
                <div
                    className="position-fixed bottom-0 end-0 p-3"
                    style={{ zIndex: 9999 }}
                >
                    <div className="toast show bg-info text-white" role="alert">
                        <div className="toast-body d-flex align-items-center">
                            <ClockLoader size={20} color="#fff" className="me-2" />
                            <span>Uploading your post...</span>
                        </div>
                    </div>
                </div>
            )}

            {uploadStatus === 'success' && (
                <div
                    className="position-fixed bottom-0 end-0 p-3"
                    style={{ zIndex: 9999 }}
                >
                    <div className="toast show bg-success text-white" role="alert">
                        <div className="toast-body">
                            ✓ Post uploaded successfully!
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ModalCreatePost