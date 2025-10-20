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

// Video thumbnail without hover preview - just shows thumbnail with play icon
export function VideoThumbnail({ thumbnail, video, alt, className = '' }) {
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

            {/* Thumbnail image - always visible */}
            {isInView && (
                <img
                    src={thumbnail}
                    alt={alt}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${
                        isLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setIsLoaded(true)}
                    loading="lazy"
                />
            )}

            {/* Play icon overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="w-16 h-16 border-2 border-white/80 rounded-full flex items-center justify-center backdrop-blur-sm bg-black/40 shadow-lg">
                    <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                </div>
            </div>

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
