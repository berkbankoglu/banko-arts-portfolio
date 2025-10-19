'use client'

import { useState, useEffect, useRef } from 'react';

export default function LazyImage({ src, alt, className = '', blurDataURL }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                }
            },
            { rootMargin: '50px' }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (imgRef.current) {
                observer.unobserve(imgRef.current);
            }
        };
    }, []);

    return (
        <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
            {/* Blur placeholder */}
            <div
                className={`absolute inset-0 bg-neutral-800 transition-opacity duration-500 pointer-events-none ${
                    isLoaded ? 'opacity-0' : 'opacity-100'
                }`}
            >
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
            </div>

            {/* Actual image */}
            {isInView && (
                <img
                    src={src}
                    alt={alt}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${
                        isLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setIsLoaded(true)}
                    loading="lazy"
                />
            )}

            <style jsx>{`
                @keyframes shimmer {
                    100% {
                        transform: translateX(100%);
                    }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </div>
    );
}

// Video thumbnail with hover preview
export function VideoThumbnail({ thumbnail, video, alt, className = '' }) {
    const [isHovering, setIsHovering] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            if (isHovering) {
                videoRef.current.play().catch(() => {
                    // Autoplay might be blocked
                });
            } else {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
            }
        }
    }, [isHovering]);

    return (
        <div
            className={`relative overflow-hidden ${className}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Thumbnail image */}
            <LazyImage
                src={thumbnail}
                alt={alt}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                    isHovering ? 'opacity-0' : 'opacity-100'
                }`}
            />

            {/* Hover video preview */}
            <video
                ref={videoRef}
                src={video}
                muted
                loop
                playsInline
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                    isHovering ? 'opacity-100' : 'opacity-0'
                }`}
            />

            {/* Play icon overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className={`w-16 h-16 border-2 border-white/80 rounded-full flex items-center justify-center backdrop-blur-sm bg-black/40 transition-all duration-300 ${
                    isHovering ? 'scale-110' : 'scale-100'
                }`}>
                    <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                </div>
            </div>
        </div>
    );
}
