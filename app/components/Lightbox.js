'use client'

import { useState, useEffect, useCallback } from 'react';

export default function Lightbox({ project, onClose, allProjects = [], currentIndex = 0, onNavigate }) {
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowLeft' && onNavigate) {
                onNavigate('prev');
                resetZoom();
            } else if (e.key === 'ArrowRight' && onNavigate) {
                onNavigate('next');
                resetZoom();
            } else if (e.key === '+' || e.key === '=') {
                setZoom(prev => Math.min(prev + 0.5, 5));
            } else if (e.key === '-') {
                setZoom(prev => Math.max(prev - 0.5, 1));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [onClose, onNavigate]);

    const resetZoom = useCallback(() => {
        setZoom(1);
        setPosition({ x: 0, y: 0 });
    }, []);

    const handleWheel = (e) => {
        if (project.type === 'render') {
            e.preventDefault();
            const delta = e.deltaY * -0.001;
            setZoom(prev => Math.min(Math.max(1, prev + delta), 5));

            if (zoom <= 1) {
                setPosition({ x: 0, y: 0 });
            }
        }
    };

    const handleMouseDown = (e) => {
        if (zoom > 1 && project.type === 'render') {
            setIsDragging(true);
            setDragStart({
                x: e.clientX - position.x,
                y: e.clientY - position.y
            });
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging && zoom > 1) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <div
            className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center"
            onClick={onClose}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 text-white/80 hover:text-white text-4xl z-10 w-12 h-12 flex items-center justify-center"
                aria-label="Close"
            >
                ×
            </button>

            {/* Navigation arrows */}
            {onNavigate && allProjects.length > 1 && (
                <>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onNavigate('prev');
                            resetZoom();
                        }}
                        className="absolute left-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/50 hover:bg-black/70 rounded-full p-4 transition-all z-10"
                        aria-label="Previous"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onNavigate('next');
                            resetZoom();
                        }}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/50 hover:bg-black/70 rounded-full p-4 transition-all z-10"
                        aria-label="Next"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}

            {/* Project info */}
            <div className="absolute top-6 left-6 text-white z-10">
                <h2 className="text-2xl font-bold mb-1">{project.title}</h2>
                <p className="text-white/60 text-sm uppercase tracking-wider">{project.category}</p>
                {allProjects.length > 1 && (
                    <p className="text-white/40 text-xs mt-2">{currentIndex + 1} / {allProjects.length}</p>
                )}
            </div>

            {/* Zoom controls */}
            {project.type === 'render' && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-sm px-6 py-3 rounded-full z-10">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setZoom(prev => Math.max(prev - 0.5, 1));
                        }}
                        className="text-white/80 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                        </svg>
                    </button>
                    <span className="text-white/80 text-sm min-w-[60px] text-center">{Math.round(zoom * 100)}%</span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setZoom(prev => Math.min(prev + 0.5, 5));
                        }}
                        className="text-white/80 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                    </button>
                    {zoom > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                resetZoom();
                            }}
                            className="text-white/60 hover:text-white text-xs ml-2 transition-colors"
                        >
                            Reset
                        </button>
                    )}
                </div>
            )}

            {/* Help text */}
            <div className="absolute bottom-6 right-6 text-white/40 text-xs text-right z-10">
                <p>ESC to close</p>
                {onNavigate && <p>← → to navigate</p>}
                {project.type === 'render' && <p>Scroll or +/- to zoom</p>}
            </div>

            {/* Content */}
            <div
                className="max-w-[90vw] max-h-[90vh] relative"
                onClick={(e) => e.stopPropagation()}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ cursor: isDragging ? 'grabbing' : (zoom > 1 ? 'grab' : 'default') }}
            >
                {project.type === 'animation' && project.video ? (
                    <video
                        src={project.video}
                        controls
                        autoPlay
                        loop
                        className="max-w-full max-h-[90vh] object-contain"
                    />
                ) : project.image ? (
                    <img
                        src={project.image}
                        alt={project.title}
                        className="max-w-full max-h-[90vh] object-contain transition-transform select-none"
                        style={{
                            transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                            transformOrigin: 'center center'
                        }}
                        draggable="false"
                    />
                ) : null}
            </div>
        </div>
    );
}
