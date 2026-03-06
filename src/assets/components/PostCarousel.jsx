import { useState, useEffect, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import SmartImage from './SmartImage'

const PostCarousel = ({ photos, onImageClick }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
    const [selectedIndex, setSelectedIndex] = useState(0)

    const onSelect = useCallback(() => {
        if (!emblaApi) return
        setSelectedIndex(emblaApi.selectedScrollSnap())
    }, [emblaApi])

    useEffect(() => {
        if (!emblaApi) return
        emblaApi.on('select', onSelect)
        return () => { emblaApi.off('select', onSelect) }
    }, [emblaApi, onSelect])

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
                    {/* Prev / Next arrows */}
                    <button
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/65 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-colors z-10 text-xl leading-none"
                        onClick={() => emblaApi?.scrollPrev()}
                        aria-label="Previous"
                    >‹</button>
                    <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/65 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-colors z-10 text-xl leading-none"
                        onClick={() => emblaApi?.scrollNext()}
                        aria-label="Next"
                    >›</button>

                    {/* Dot indicators */}
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
                        {photos.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => emblaApi?.scrollTo(i)}
                                className="rounded-full transition-all"
                                style={{
                                    width: i === selectedIndex ? '18px' : '6px',
                                    height: '6px',
                                    backgroundColor: i === selectedIndex ? '#fff' : 'rgba(255,255,255,0.5)',
                                }}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>

                    {/* Slide counter */}
                    <div className="absolute top-2 right-2 bg-black/40 text-white text-xs px-2 py-0.5 rounded-full z-10">
                        {selectedIndex + 1} / {photos.length}
                    </div>
                </>
            )}
        </div>
    )
}

export default PostCarousel
