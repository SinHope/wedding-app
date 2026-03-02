import { useState, useEffect } from 'react'

const Upload = ({ handleFileChange, loading, setError }) => {
    const [files, setFiles] = useState([])
    const maxNumber = 4

    const onChange = (e) => {
        const selectedFiles = Array.from(e.target.files)
        const validFiles = selectedFiles.filter(file => {
            const isImage = file.type.startsWith('image/')
            const isVideo = file.type.startsWith('video/')
            const isValidSize = file.size <= 60 * 1024 * 1024
            return (isImage || isVideo) && isValidSize
        })
        if (validFiles.length !== selectedFiles.length) {
            setError('Some files were rejected. Please ensure each file is under 60MB.')
        }
        const existingFiles = files.map(f => f.file)
        const combinedFiles = [...existingFiles, ...validFiles]
        const limitedFiles = combinedFiles.slice(0, maxNumber)
        const fileObjects = limitedFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            type: file.type.startsWith('image/') ? 'image' : 'video'
        }))
        setFiles(fileObjects)
        handleFileChange(limitedFiles)
    }

    const removeFile = (index) => {
        const newFiles = files.filter((_, i) => i !== index)
        setFiles(newFiles)
        handleFileChange(newFiles.map(f => f.file))
    }

    const removeAll = () => {
        files.forEach(f => URL.revokeObjectURL(f.preview))
        setFiles([])
        handleFileChange([])
    }

    useEffect(() => {
        handleFileChange(files.map(f => f.file))
    }, [files])

    return (
        <div className="text-center mt-4">
            <label
                htmlFor="file-input"
                className="block border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-[#5A3E36] hover:bg-[#fffaf6] transition-colors"
            >
                <p className="text-gray-600 text-sm font-medium">
                    {files.length > 0
                        ? `${files.length}/${maxNumber} file${files.length > 1 ? 's' : ''} selected`
                        : '📷 Tap to upload'}
                </p>
                <p className="text-xs text-gray-400 mt-1">Images / Videos (up to 60MB)</p>
            </label>
            <input
                id="file-input"
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={onChange}
                className="hidden"
                disabled={loading}
            />

            {files.length > 0 && (
                <div className="mt-3">
                    <div className="flex flex-wrap justify-center gap-2">
                        {files.map((fileObj, index) => (
                            <div key={index} className="relative border border-gray-200 rounded-lg overflow-hidden" style={{ width: 100 }}>
                                {fileObj.type === 'image' ? (
                                    <img src={fileObj.preview} alt="" className="w-full object-cover" style={{ height: 100 }} />
                                ) : (
                                    <div className="flex items-center justify-center bg-black" style={{ height: 100 }}>
                                        <span className="text-white text-2xl">▶</span>
                                    </div>
                                )}
                                <button
                                    type="button"
                                    className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center"
                                    onClick={() => removeFile(index)}
                                >×</button>
                            </div>
                        ))}
                    </div>
                    <button type="button" className="mt-2 text-xs text-red-500 border border-red-300 px-3 py-1 rounded hover:bg-red-50" onClick={removeAll}>
                        Remove All
                    </button>
                </div>
            )}
        </div>
    )
}

export default Upload
