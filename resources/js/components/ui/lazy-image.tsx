import React, { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    placeholderClassName?: string
    aspectRatio?: string // e.g., "16/9"
}

export function LazyImage({
    src,
    alt,
    className,
    placeholderClassName,
    aspectRatio = '16/9',
    ...props
}: LazyImageProps) {
    const [isLoaded, setIsLoaded] = useState(false)
    const [isInView, setIsInView] = useState(false)
    const imgRef = useRef<HTMLImageElement>(null)

    useEffect(() => {
        // Create an Intersection Observer to detect when the image is in viewport
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsInView(true)
                    observer.disconnect()
                }
            },
            { rootMargin: '200px' }, // Start loading 200px before the image enters the viewport
        )

        if (imgRef.current) {
            observer.observe(imgRef.current)
        }

        return () => {
            observer.disconnect()
        }
    }, [])

    const handleImageLoad = () => {
        setIsLoaded(true)
    }

    return (
        <div
            className={cn(
                'relative overflow-hidden',
                aspectRatio && `aspect-[${aspectRatio}]`,
                className,
            )}
            ref={imgRef}
        >
            {/* Placeholder */}
            {!isLoaded && (
                <Skeleton
                    className={cn(
                        'absolute inset-0 h-full w-full bg-muted/30',
                        placeholderClassName,
                    )}
                />
            )}

            {/* Actual image */}
            {isInView && (
                <img
                    src={src}
                    alt={alt || ''}
                    className={cn(
                        'h-full w-full object-cover transition-opacity duration-300',
                        isLoaded ? 'opacity-100' : 'opacity-0',
                    )}
                    onLoad={handleImageLoad}
                    {...props}
                />
            )}
        </div>
    )
}
