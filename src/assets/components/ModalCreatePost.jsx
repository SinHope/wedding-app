import { useState } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { ClockLoader } from 'react-spinners'
import { X } from 'react-feather'
import Create from '../pages/Create'

const ModalCreatePost = ({ show, handleClose, setShowModal, fetchEventAndPosts, defaultName, onSuccess }) => {
    const [uploadStatus, setUploadStatus] = useState(null)

    return (
        <>
            <Dialog open={show} onClose={handleClose} className="relative z-50">
                <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
                        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100">
                            <DialogTitle className="font-semibold text-gray-800">Create Post</DialogTitle>
                            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 p-1">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-4">
                            <Create
                                setShowModal={setShowModal}
                                fetchEventAndPosts={fetchEventAndPosts}
                                setUploadStatus={setUploadStatus}
                                defaultName={defaultName}
                                onSuccess={onSuccess}
                            />
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>

            {uploadStatus === 'uploading' && (
                <div className="fixed bottom-0 left-0 right-0 flex justify-center z-[9999]">
                    <div className="bg-blue-500 text-white w-full m-3 rounded-lg px-4 py-3 flex items-center gap-3">
                        <ClockLoader size={20} color="#fff" />
                        <span>Uploading your post...</span>
                    </div>
                </div>
            )}

            {uploadStatus === 'success' && (
                <div className="fixed bottom-0 left-0 right-0 flex justify-center z-[9999]">
                    <div className="bg-green-500 text-white w-full m-3 rounded-lg px-4 py-3">
                        ✓ Post uploaded successfully!
                    </div>
                </div>
            )}

            {uploadStatus === 'error' && (
                <div className="fixed bottom-0 left-0 right-0 flex justify-center z-[9999]">
                    <div className="bg-red-500 text-white w-full m-3 rounded-lg px-4 py-3">
                        ✗ Upload failed. Please try again.
                    </div>
                </div>
            )}
        </>
    )
}

export default ModalCreatePost
