import useEmblaCarousel from 'embla-carousel-react'
import SmartImage from './SmartImage'

const PostCarousel = ({ photos, onImageClick }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel()

    return (
        <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {photos.map((media, idx) => (
                        <div className="flex-none w-full" key={idx}>
                            {media.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                                <video
                                    src={media}
                                    controls
                                    style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', backgroundColor: '#000' }}
                                />
                            ) : (
                                <div style={{ cursor: 'zoom-in' }} onClick={() => onImageClick && onImageClick(idx)}>
                                    <SmartImage src={media} alt={`Slide ${idx + 1}`} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {photos.length > 1 && (
                <>
                    <button
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full w-8 h-8 flex items-center justify-center shadow text-lg"
                        onClick={() => emblaApi?.scrollPrev()}
                    >‹</button>
                    <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full w-8 h-8 flex items-center justify-center shadow text-lg"
                        onClick={() => emblaApi?.scrollNext()}
                    >›</button>
                </>
            )}
        </div>
    )
}

export default PostCarousel
