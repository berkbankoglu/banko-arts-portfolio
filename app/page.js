'use client'

import React, { useState } from 'react';
import { Building2, Gamepad2, Mail, Briefcase, Instagram, Menu, X, ChevronLeft, ChevronRight, UtensilsCrossed, ShowerHead, Bed, Sofa } from 'lucide-react';
import ContactForm from './components/ContactForm';
import TiltCard from './components/TiltCard';
import { ScrollProgressBar, BackToTopButton, AnimatedCounter, FadeInSection } from './components/ScrollAnimations';
import Lightbox from './components/Lightbox';
import LazyImage, { VideoThumbnail } from './components/LazyImage';

export default function BankoArtsPortfolio() {
    const [activeSection, setActiveSection] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedProject, setSelectedProject] = useState(null);
    const [imageZoom, setImageZoom] = useState(1);
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [lightboxProject, setLightboxProject] = useState(null);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [scrollY, setScrollY] = useState(0);
    const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
    const [currentInstagramIndex, setCurrentInstagramIndex] = useState(0);
    const [instagramFilter, setInstagramFilter] = useState('renders');

    // Video list for hero background
    const heroVideos = [
        '/videos/AnimateDiff_00005.mp4',
        '/videos/AnimateDiff_00006.mp4',
        '/videos/AnimateDiff_00007.mp4',
        '/videos/AnimateDiff_00008.mp4',
        '/videos/AnimateDiff_00009.mp4',
        '/videos/AnimateDiff_00010.mp4',
        '/videos/AnimateDiff_00011.mp4',
        '/videos/AnimateDiff_00012.mp4',
        '/videos/AnimateDiff_00013.mp4'
    ];

    // ESC tuşu ile modal'ı kapat ve scroll kontrolü
    React.useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                setSelectedProject(null);
                setImageZoom(1);
                setImagePosition({ x: 0, y: 0 });
            }
        };

        if (selectedProject) {
            // Modal açıkken body scroll'unu engelle
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEscape);
            return () => {
                document.body.style.overflow = 'unset';
                window.removeEventListener('keydown', handleEscape);
            };
        }
    }, [selectedProject]);

    // Zoom fonksiyonları
    const handleWheel = (e) => {
        if (selectedProject && selectedProject.type === 'render') {
            e.preventDefault();
            const delta = e.deltaY * -0.001;
            const newZoom = Math.min(Math.max(1, imageZoom + delta), 5);
            setImageZoom(newZoom);

            if (newZoom === 1) {
                setImagePosition({ x: 0, y: 0 });
            }
        }
    };

    const handleMouseDown = (e) => {
        if (imageZoom > 1 && selectedProject && selectedProject.type === 'render') {
            e.preventDefault();
            setIsDragging(true);
            setDragStart({
                x: e.clientX - imagePosition.x / 0.4,
                y: e.clientY - imagePosition.y / 0.4
            });
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging && imageZoom > 1 && selectedProject && selectedProject.type === 'render') {
            const container = e.currentTarget;
            const rect = container.getBoundingClientRect();
            const img = container.querySelector('img');

            if (img) {
                const imgRect = img.getBoundingClientRect();

                // Yeni pozisyonu hesapla - hızı %40'a düşür
                let newX = (e.clientX - dragStart.x) * 0.4;
                let newY = (e.clientY - dragStart.y) * 0.4;

                // Sınırları hesapla - görselin dışarı taşmamasını sağla
                const maxX = Math.max(0, (imgRect.width * imageZoom - rect.width) / 2);
                const maxY = Math.max(0, (imgRect.height * imageZoom - rect.height) / 2);

                newX = Math.max(-maxX, Math.min(maxX, newX));
                newY = Math.max(-maxY, Math.min(maxY, newY));

                setImagePosition({ x: newX, y: newY });
            }
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const resetZoom = () => {
        setImageZoom(1);
        setImagePosition({ x: 0, y: 0 });
        setIsDragging(false);
    };

    const handleLightboxNavigate = (direction) => {
        // Navigate through projects based on current filter
        const filteredProjects = getFilteredInstagramPosts();
        const currentFilteredIndex = filteredProjects.findIndex(p => p.title === lightboxProject.title);

        if (direction === 'next') {
            const newFilteredIndex = (currentFilteredIndex + 1) % filteredProjects.length;
            const newProject = filteredProjects[newFilteredIndex];
            const newIndex = architectureProjects.findIndex(p => p.title === newProject.title);
            setLightboxIndex(newIndex);
            setLightboxProject(newProject);
        } else {
            const newFilteredIndex = (currentFilteredIndex - 1 + filteredProjects.length) % filteredProjects.length;
            const newProject = filteredProjects[newFilteredIndex];
            const newIndex = architectureProjects.findIndex(p => p.title === newProject.title);
            setLightboxIndex(newIndex);
            setLightboxProject(newProject);
        }
    };

    // Handle video end - switch to next video when current one ends with smooth fade
    const handleVideoEnd = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentVideoIndex((prevIndex) =>
                (prevIndex + 1) % heroVideos.length
            );
            setTimeout(() => {
                setIsTransitioning(false);
            }, 50);
        }, 1000); // Wait for fade out
    };

    // Scroll to top when activeSection changes
    React.useEffect(() => {
        if (activeSection) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [activeSection]);

    // Parallax scroll effect
    React.useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Testimonials data
    const testimonialsData = [
        {
            quote: "Outstanding work! The visualizations were exactly what we needed for our presentation. The attention to detail and photorealistic quality exceeded our expectations.",
            author: "Michael Anderson",
            position: "Architect, Anderson Design Studio"
        },
        {
            quote: "Professional service from start to finish. Fast delivery and excellent communication throughout the project. Highly recommended!",
            author: "Sarah Johnson",
            position: "Developer, Urban Spaces Inc."
        },
        {
            quote: "The 3D animations brought our project to life in ways we couldn't imagine. Clients were impressed and we secured the deal thanks to these visuals.",
            author: "David Chen",
            position: "Interior Designer, Chen Interiors"
        },
        {
            quote: "Exceptional quality and remarkable turnaround time. The team understood our vision perfectly and delivered renders that truly captured the essence of our design.",
            author: "Emily Rodriguez",
            position: "Project Manager, Vista Developers"
        },
        {
            quote: "Working with Banko Arts was a game-changer for our firm. The level of detail and photorealism in their work helped us win multiple high-value contracts.",
            author: "Robert Williams",
            position: "Principal Architect, Williams & Partners"
        },
        {
            quote: "Incredible talent and professionalism. The kitchen and bathroom visualizations were so realistic that our clients thought they were photographs!",
            author: "Jennifer Lee",
            position: "Interior Designer, Modern Living Spaces"
        },
        {
            quote: "Best visualization service we've ever used. The lighting design expertise really shows in every render. Worth every penny!",
            author: "Thomas Martinez",
            position: "CEO, Skyline Construction"
        },
        {
            quote: "The exterior visualizations helped us sell our entire development before construction even began. Absolutely stunning work!",
            author: "Amanda Foster",
            position: "Real Estate Developer, Foster Group"
        },
        {
            quote: "Amazing attention to materials and textures. The post-production work is magazine-quality. Our marketing materials have never looked better!",
            author: "James Patterson",
            position: "Marketing Director, Prestige Homes"
        },
        {
            quote: "The 3D walkthrough animations were a hit at our investor presentation. Secured funding within a week. Couldn't be happier with the results!",
            author: "Lisa Thompson",
            position: "Founder, Thompson Real Estate Ventures"
        },
        {
            quote: "Delivered exactly what we asked for, on time and within budget. The bedroom renderings captured the mood and ambiance perfectly. Will definitely work together again!",
            author: "Marcus Brown",
            position: "Senior Designer, Elegant Interiors"
        },
        {
            quote: "The level of realism in the lighting and shadows is unmatched. Our clients are always amazed when they see the final renders. Truly exceptional work!",
            author: "Sofia Hernandez",
            position: "Creative Director, Luxe Living Co."
        },
        {
            quote: "Fast turnaround without sacrificing quality. The architectural visualizations helped us close deals 30% faster. An invaluable partner for our business!",
            author: "Christopher Taylor",
            position: "Sales Director, Prime Properties"
        },
        {
            quote: "Every single detail was perfect - from the fabric textures to the natural lighting. The team's understanding of materials and composition is outstanding!",
            author: "Rachel Kim",
            position: "Lead Architect, Studio Kim & Associates"
        },
        {
            quote: "We've worked with many visualization studios, but none compare to this level of professionalism and artistry. The renders are simply breathtaking!",
            author: "Daniel White",
            position: "Principal, White Architecture Group"
        },
        {
            quote: "The exterior night renders with lighting effects were phenomenal. They captured the exact atmosphere we wanted to convey. Absolutely brilliant work!",
            author: "Nicole Davis",
            position: "Design Manager, Metropolitan Developers"
        },
        {
            quote: "Responsive, creative, and incredibly skilled. The 3D visualizations exceeded our expectations and helped us win a major commercial project. Highly professional!",
            author: "Andrew Wilson",
            position: "Project Lead, Wilson Construction Ltd."
        },
        {
            quote: "The kitchen renderings were so detailed and realistic that our clients made material selections based directly on them. Saved us countless hours in revisions!",
            author: "Maria Garcia",
            position: "Interior Architect, Garcia Design Studio"
        },
        {
            quote: "Exceptional understanding of architectural vision and design intent. The team translated our sketches into stunning photorealistic renders. Couldn't ask for better!",
            author: "Benjamin Scott",
            position: "Founder, Scott & Partners Architects"
        },
        {
            quote: "The attention to detail in every render is remarkable. From furniture placement to lighting angles - everything is perfectly executed. A true professional!",
            author: "Victoria Moore",
            position: "Senior Interior Designer, Moore Spaces"
        }
    ];


    const architectureProjects = [
        {
            title: "Bedroom",
            category: "Interior",
            type: "render",
            image: "/images/architecture/Bedroom.png"
        },
        {
            title: "Bedroom Animation",
            category: "Interior",
            type: "animation",
            thumbnail: "/images/architecture/Bedroom.png",
            video: "/videos/bedroom_animation.mp4"
        },
        {
            title: "Living Room",
            category: "Interior",
            type: "render",
            image: "/images/architecture/Living Room.png"
        },
        {
            title: "Living Room Animation",
            category: "Interior",
            type: "animation",
            thumbnail: "/images/architecture/Living Room.png",
            video: "/videos/livingroom_animation.mp4"
        },
        {
            title: "Kitchen",
            category: "Interior",
            type: "render",
            image: "/images/architecture/Kitchen.png"
        },
        {
            title: "Bathroom",
            category: "Interior",
            type: "render",
            image: "/images/architecture/Bathroom.png"
        },
        {
            title: "Bathroom 2",
            category: "Interior",
            type: "render",
            image: "/images/architecture/Bathroom 2.png"
        },
        {
            title: "Exterior View",
            category: "Exterior",
            type: "render",
            image: "/images/architecture/Exterior.png"
        },
        {
            title: "Kitchen Animation",
            category: "Interior",
            type: "animation",
            thumbnail: "/images/architecture/Kitchen.png",
            video: "/videos/kitchen_animation.mp4"
        },
        {
            title: "Exterior 1",
            category: "Exterior",
            type: "render",
            image: "/images/architecture/Exterior 1.png"
        },
        {
            title: "Exterior 1 Animation",
            category: "Exterior",
            type: "animation",
            thumbnail: "/images/architecture/Exterior 1.png",
            video: "/videos/exterior1_animation.mp4"
        },
        {
            title: "Exterior 2",
            category: "Exterior",
            type: "render",
            image: "/images/architecture/Exterior 2.png"
        },
        {
            title: "Exterior 2 Animation",
            category: "Exterior",
            type: "animation",
            thumbnail: "/images/architecture/Exterior 2.png",
            video: "/videos/exterior2_animation.mp4"
        },
        {
            title: "Exterior 3",
            category: "Exterior",
            type: "render",
            image: "/images/architecture/Exterior 3.png"
        },
        {
            title: "Exterior 3.1",
            category: "Exterior",
            type: "render",
            image: "/images/architecture/Exterior 3.1.png"
        },
        {
            title: "Exterior 3.2",
            category: "Exterior",
            type: "render",
            image: "/images/architecture/Exterior 3.2.png"
        },
        {
            title: "RoofTop",
            category: "Exterior",
            type: "render",
            image: "/images/architecture/RoofTop.png"
        },
        {
            title: "RoofTop Animation",
            category: "Exterior",
            type: "animation",
            thumbnail: "/images/architecture/RoofTop.png",
            video: "/videos/rooftop_animation.mp4"
        },
        {
            title: "Both Views",
            category: "Mixed",
            type: "render",
            image: "/images/architecture/Both.png"
        },
        {
            title: "Both Views Animation",
            category: "Mixed",
            type: "animation",
            thumbnail: "/images/architecture/Both.png",
            video: "/videos/both_views_animation.mp4"
        }
    ];

    const filters = [
        { id: 'all', label: 'All Projects' },
        { id: 'render', label: 'Renders' },
        { id: 'animation', label: 'Animations' },
        { id: 'interior', label: 'Interior' },
        { id: 'exterior', label: 'Exterior' },
        { id: 'bedroom', label: 'Bedroom' },
        { id: 'bathroom', label: 'Bathroom' }
    ];

    const filteredProjects = activeFilter === 'all'
        ? architectureProjects.filter(project => project.type === 'render')
        : activeFilter === 'interior'
        ? architectureProjects.filter(project => project.category === 'Interior')
        : activeFilter === 'exterior'
        ? architectureProjects.filter(project => project.category === 'Exterior')
        : activeFilter === 'bedroom'
        ? architectureProjects.filter(project => project.title.toLowerCase().includes('bedroom'))
        : activeFilter === 'bathroom'
        ? architectureProjects.filter(project => project.title.toLowerCase().includes('bathroom'))
        : architectureProjects.filter(project => project.type === activeFilter);

    if (activeSection === 'architecture') {
        return (
            <div className="min-h-screen bg-neutral-950 text-white">
                <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Bebas+Neue&display=swap');
        `}</style>

                <nav className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-sm border-b border-white/10 px-8 py-6">
                    <div className="max-w-[1600px] mx-auto">
                        <button
                            onClick={() => setActiveSection(null)}
                            className="text-sm tracking-wider text-white/60 hover:text-white transition-colors"
                        >
                            ← BACK
                        </button>
                    </div>
                </nav>

                <div className="max-w-[1600px] mx-auto px-8 py-16">
                    <div className="mb-16 text-center">
                        <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>3D VISUALIZATION & RENDERS</h2>

                        <div className="flex justify-center gap-4 flex-wrap">
                            {filters.map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => setActiveFilter(filter.id)}
                                    className={`px-8 py-3 border rounded-lg transition-all tracking-wider text-sm ${activeFilter === filter.id
                                            ? 'border-white bg-white text-black'
                                            : 'border-white/30 text-white/60 hover:border-white/60 hover:text-white'
                                        }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.map((project, idx) => {
                            // Her projenin orijinal indeksini bul
                            const originalIndex = architectureProjects.findIndex(p => p.title === project.title);

                            return (
                            <div key={idx} className="group cursor-pointer">
                                <div className="aspect-[16/10] bg-neutral-900 overflow-hidden relative border border-white/10 hover:border-white/30 transition-all">
                                    <div className="w-full h-full relative">
                                        {project.type === 'render' && (
                                            <div
                                                onClick={() => {
                                                    setLightboxProject(project);
                                                    setLightboxIndex(originalIndex);
                                                }}
                                                className="w-full h-full cursor-pointer"
                                            >
                                                <LazyImage
                                                    src={project.image || project.thumbnail}
                                                    alt={project.title}
                                                    className="w-full h-full"
                                                />
                                            </div>
                                        )}

                                        {project.type === 'animation' && (
                                            <VideoThumbnail
                                                thumbnail={project.image || project.thumbnail}
                                                video={project.video}
                                                alt={project.title}
                                                className="w-full h-full"
                                                onThumbnailClick={() => {
                                                    setLightboxProject(project);
                                                    setLightboxIndex(originalIndex);
                                                }}
                                            />
                                        )}

                                        {project.type === '360tour' && (
                                            <div className="absolute top-4 right-4 pointer-events-none">
                                                <div className="bg-blue-500/80 px-3 py-1 text-xs font-semibold rounded backdrop-blur-sm">360°</div>
                                            </div>
                                        )}

                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                            <p className="text-xs text-white/60 mb-1 tracking-wider uppercase">{project.category}</p>
                                            <h3 className="text-lg font-semibold">{project.title}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            );
                        })}
                    </div>

                    <div className="border-t border-white/10 py-16 mt-16">
                        <div className="flex flex-col items-center gap-6">
                            <div className="flex justify-center gap-4 flex-wrap">
                                <a
                                    href="https://www.instagram.com/bankoarts"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-3 border border-white/30 rounded-lg text-white/60 hover:border-white hover:text-white transition-all flex items-center gap-2 text-sm tracking-wider"
                                >
                                    <Instagram size={18} />
                                    <span>INSTAGRAM</span>
                                </a>
                                <a
                                    href="https://www.freelancer.com/u/brkbnkgll"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-3 border border-white/30 rounded-lg text-white/60 hover:border-white hover:text-white transition-all flex items-center gap-2 text-sm tracking-wider"
                                >
                                    <Briefcase size={18} />
                                    <span>FREELANCER</span>
                                </a>
                                <a
                                    href="https://www.upwork.com/freelancers/berkbanko"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-3 border border-white/30 rounded-lg text-white/60 hover:border-white hover:text-white transition-all flex items-center gap-2 text-sm tracking-wider"
                                >
                                    <Briefcase size={18} />
                                    <span>UPWORK</span>
                                </a>
                            </div>
                            <a href="mailto:contact@bankoarts.com" className="text-white/40 hover:text-white/60 transition-colors flex items-center gap-2 text-sm">
                                <Mail size={16} />
                                <span>contact@bankoarts.com</span>
                            </a>
                        </div>
                    </div>

                    {selectedProject && (
                        <div
                            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-8"
                            onClick={() => {
                                setSelectedProject(null);
                                resetZoom();
                            }}
                        >
                            <button
                                className="absolute top-8 right-8 text-white/60 hover:text-white text-4xl font-light z-10"
                                onClick={() => {
                                    setSelectedProject(null);
                                    resetZoom();
                                }}
                            >
                                ×
                            </button>

                            {selectedProject.type === 'render' && imageZoom > 1 && (
                                <button
                                    className="absolute top-8 left-8 text-white/60 hover:text-white text-sm tracking-wider z-10 bg-white/10 px-4 py-2 rounded"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        resetZoom();
                                    }}
                                >
                                    RESET ZOOM ({imageZoom.toFixed(1)}x)
                                </button>
                            )}

                            {selectedProject.type === 'render' && (
                                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/40 text-xs tracking-wider z-10">
                                    SCROLL TO ZOOM • CLICK & DRAG TO PAN
                                </div>
                            )}

                            <div className="max-w-7xl w-full" onClick={(e) => e.stopPropagation()}>
                                <div className="mb-6 text-center">
                                    <h2 className="text-3xl font-light mb-2">{selectedProject.title}</h2>
                                    <p className="text-white/40 text-sm uppercase tracking-widest">{selectedProject.category}</p>
                                </div>

                                {selectedProject.type === 'animation' && selectedProject.video ? (
                                    <video
                                        src={selectedProject.video}
                                        controls
                                        autoPlay
                                        loop
                                        className="w-full max-h-[80vh] object-contain"
                                    />
                                ) : selectedProject.image ? (
                                    <div
                                        className="relative overflow-hidden"
                                        onWheel={handleWheel}
                                        onMouseDown={handleMouseDown}
                                        onMouseMove={handleMouseMove}
                                        onMouseUp={handleMouseUp}
                                        onMouseLeave={handleMouseUp}
                                        style={{
                                            cursor: isDragging ? 'grabbing' : (imageZoom > 1 ? 'grab' : 'default'),
                                            userSelect: 'none'
                                        }}
                                    >
                                        <img
                                            src={selectedProject.image}
                                            alt={selectedProject.title}
                                            className="w-full max-h-[80vh] object-contain transition-transform"
                                            style={{
                                                transform: `scale(${imageZoom}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                                                transformOrigin: 'center center',
                                                transitionDuration: isDragging ? '0ms' : '100ms',
                                                pointerEvents: 'none'
                                            }}
                                            draggable="false"
                                        />
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Testimonials navigation
    const nextTestimonial = () => {
        setCurrentTestimonialIndex((prev) => (prev + 3) % testimonialsData.length);
    };

    const prevTestimonial = () => {
        setCurrentTestimonialIndex((prev) => (prev - 3 + testimonialsData.length) % testimonialsData.length);
    };

    // Get current 3 testimonials to show
    const getCurrentTestimonials = () => {
        const testimonials = [];
        for (let i = 0; i < 3; i++) {
            testimonials.push(testimonialsData[(currentTestimonialIndex + i) % testimonialsData.length]);
        }
        return testimonials;
    };

    // Instagram carousel navigation
    const nextInstagramSlide = () => {
        const filteredPosts = getFilteredInstagramPosts();
        setCurrentInstagramIndex((prev) => (prev + 6) % filteredPosts.length);
    };

    const prevInstagramSlide = () => {
        const filteredPosts = getFilteredInstagramPosts();
        setCurrentInstagramIndex((prev) => (prev - 6 + filteredPosts.length) % filteredPosts.length);
    };

    // Get filtered Instagram posts based on type
    const getFilteredInstagramPosts = () => {
        if (instagramFilter === 'renders') {
            return architectureProjects.filter(p => p.type === 'render');
        } else if (instagramFilter === 'animations') {
            return architectureProjects.filter(p => p.type === 'animation');
        } else if (instagramFilter === 'exterior') {
            return architectureProjects.filter(p => p.category === 'Exterior' && p.type === 'render');
        } else if (instagramFilter === 'interior') {
            return architectureProjects.filter(p => p.category === 'Interior' && p.type === 'render');
        } else if (instagramFilter === 'kitchen') {
            return architectureProjects.filter(p => p.title.toLowerCase().includes('kitchen') && p.type === 'render');
        } else if (instagramFilter === 'bathroom') {
            return architectureProjects.filter(p => p.title.toLowerCase().includes('bathroom') && p.type === 'render');
        } else if (instagramFilter === 'bedroom') {
            return architectureProjects.filter(p => p.title.toLowerCase().includes('bedroom') && p.type === 'render');
        } else if (instagramFilter === 'livingroom') {
            return architectureProjects.filter(p => p.title.toLowerCase().includes('living') && p.type === 'render');
        }
        return architectureProjects.filter(p => p.type === 'render'); // default to renders
    };

    // Get current 6 Instagram posts to show (2 rows x 3 columns)
    const getCurrentInstagramPosts = () => {
        const filteredPosts = getFilteredInstagramPosts();
        const posts = [];
        // Only show available posts, don't repeat if less than 6
        for (let i = 0; i < 6; i++) {
            const index = currentInstagramIndex + i;
            if (index < filteredPosts.length) {
                posts.push(filteredPosts[index]);
            }
        }
        return posts;
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white relative">
            <ScrollProgressBar />
            <BackToTopButton />
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap');
        .hide-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>

            {/* Top Navigation Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-[1600px] mx-auto px-8 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center justify-center">
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="text-2xl font-bold tracking-widest hover:text-[#5B8BA0] transition-colors"
                            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}
                        >
                            BANKO ARTS
                        </button>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <button onClick={() => scrollToSection('services')} className="text-sm tracking-wider text-white/60 hover:text-white transition-colors">
                            SERVICES
                        </button>
                        <button onClick={() => scrollToSection('contact')} className="text-sm tracking-wider text-white/60 hover:text-white transition-colors">
                            CONTACT
                        </button>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-neutral-950 border-t border-white/10">
                        <nav className="flex flex-col px-8 py-4 gap-4">
                            <button
                                onClick={() => {
                                    scrollToSection('services');
                                    setMobileMenuOpen(false);
                                }}
                                className="text-left text-sm tracking-wider text-white/60 hover:text-white transition-colors py-2"
                            >
                                SERVICES
                            </button>
                            <button
                                onClick={() => {
                                    scrollToSection('contact');
                                    setMobileMenuOpen(false);
                                }}
                                className="text-left text-sm tracking-wider text-white/60 hover:text-white transition-colors py-2"
                            >
                                CONTACT
                            </button>
                        </nav>
                    </div>
                )}
            </header>

            {/* Right Side Navigation */}
            <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
                <div className="flex flex-col items-end gap-4">
                    <div className="w-px h-16 bg-white/20"></div>

                    <button
                        onClick={() => scrollToSection('services')}
                        className="group flex items-center justify-end gap-4 text-white/40 hover:text-white transition-all py-4 px-6 -mr-6 cursor-pointer"
                    >
                        <span className="text-sm tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-medium">SERVICES</span>
                        <div className="w-4 h-4 rounded-full bg-white/40 group-hover:bg-[#5B8BA0] group-hover:scale-125 transition-all"></div>
                    </button>

                    <button
                        onClick={() => scrollToSection('contact')}
                        className="group flex items-center justify-end gap-4 text-white/40 hover:text-white transition-all py-4 px-6 -mr-6 cursor-pointer"
                    >
                        <span className="text-sm tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-medium">CONTACT</span>
                        <div className="w-4 h-4 rounded-full bg-white/40 group-hover:bg-[#5B8BA0] group-hover:scale-125 transition-all"></div>
                    </button>

                    <div className="w-px h-16 bg-white/20"></div>
                </div>
            </nav>

            {/* Hero Section with Video Background Carousel */}
            <div className="relative h-[55vh] flex items-center justify-center overflow-hidden">
                {/* Video Background Carousel */}
                <div className="absolute inset-0 z-0">
                    {/* Current Video */}
                    <video
                        autoPlay
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{
                            opacity: isTransitioning ? 0 : 1,
                            transition: 'opacity 1s ease-in-out',
                            transform: `translateY(${scrollY * 0.5}px)` // Parallax effect
                        }}
                        onEnded={handleVideoEnd}
                        key={`video-${currentVideoIndex}`}
                        src={heroVideos[currentVideoIndex]}
                    />
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-black/60 z-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 z-10"></div>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-8 py-12 sm:py-24 text-center">
                    <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-widest mb-6" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>
                        BANKO ARTS
                    </h1>
                    <p className="text-lg sm:text-2xl font-light mb-4" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.8)', color: '#ffffff' }}>
                        3D Artist & Visualization Specialist
                    </p>
                    <p className="text-white max-w-3xl mx-auto leading-relaxed mb-8 text-sm sm:text-base md:text-lg px-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.6)' }}>
                        Transforming imagination into reality through photorealistic architectural visualization and creative 3D artistry
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap mt-8">
                        <button
                            onClick={() => scrollToSection('services')}
                            className="px-8 py-4 bg-[#5B8BA0] hover:bg-[#4A7386] text-white font-bold tracking-wider transition-all"
                        >
                            VIEW SERVICES
                        </button>
                        <button
                            onClick={() => scrollToSection('contact')}
                            className="px-8 py-4 border-2 border-white/30 hover:border-white hover:bg-white/10 text-white font-bold tracking-wider transition-all"
                        >
                            GET IN TOUCH
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-8">

                {/* Stats Section */}
                <div className="py-12 mb-8 border-y border-white/20 mt-24">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
                        <div className="border-r border-white/20 last:border-r-0">
                            <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em', color: '#5B8BA0' }}>
                                <AnimatedCounter end={824} suffix="+" />
                            </h3>
                            <p className="text-white/60 text-lg">Projects</p>
                        </div>
                        <div className="border-r border-white/20 last:border-r-0">
                            <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em', color: '#5B8BA0' }}>
                                <AnimatedCounter end={10} />
                            </h3>
                            <p className="text-white/60 text-lg">Years</p>
                        </div>
                        <div className="border-r border-white/20 last:border-r-0">
                            <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em', color: '#5B8BA0' }}>
                                <AnimatedCounter end={1500} suffix="+" />
                            </h3>
                            <p className="text-white/60 text-lg">Renders</p>
                        </div>
                    </div>
                </div>

                {/* Instagram Feed Section - MOVED HERE FROM BELOW */}
                <FadeInSection>
                    <div className="py-8 md:py-20 mb-8 bg-neutral-900/20">
                        <div className="max-w-[1800px] mx-auto px-4 sm:px-8">
                            <div className="text-center mb-6 md:mb-16">
                                <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>
                                    RECENT WORKS
                                </h2>
                                <p className="text-white/60 text-sm md:text-lg mb-4 md:mb-8 px-4">
                                    Explore our latest architectural visualizations and animations
                                </p>

                                {/* Filter Buttons */}
                                <div className="flex justify-center gap-2 md:gap-3 flex-wrap px-2">
                                    <button
                                        onClick={() => {
                                            setInstagramFilter('renders');
                                            setCurrentInstagramIndex(0);
                                        }}
                                        className={`px-3 md:px-6 py-2 md:py-3 font-bold tracking-wider transition-all rounded-lg text-xs md:text-sm ${
                                            instagramFilter === 'renders'
                                                ? 'bg-[#5B8BA0] text-white'
                                                : 'bg-neutral-800 text-white/60 hover:bg-neutral-700'
                                        }`}
                                    >
                                        RENDERS
                                    </button>
                                    <button
                                        onClick={() => {
                                            setInstagramFilter('animations');
                                            setCurrentInstagramIndex(0);
                                        }}
                                        className={`px-3 md:px-6 py-2 md:py-3 font-bold tracking-wider transition-all rounded-lg text-xs md:text-sm ${
                                            instagramFilter === 'animations'
                                                ? 'bg-[#5B8BA0] text-white'
                                                : 'bg-neutral-800 text-white/60 hover:bg-neutral-700'
                                        }`}
                                    >
                                        ANIMATIONS
                                    </button>
                                    <button
                                        onClick={() => {
                                            setInstagramFilter('exterior');
                                            setCurrentInstagramIndex(0);
                                        }}
                                        className={`px-3 md:px-6 py-2 md:py-3 font-bold tracking-wider transition-all rounded-lg text-xs md:text-sm ${
                                            instagramFilter === 'exterior'
                                                ? 'bg-[#5B8BA0] text-white'
                                                : 'bg-neutral-800 text-white/60 hover:bg-neutral-700'
                                        }`}
                                    >
                                        EXTERIOR
                                    </button>
                                    <button
                                        onClick={() => {
                                            setInstagramFilter('kitchen');
                                            setCurrentInstagramIndex(0);
                                        }}
                                        className={`px-3 md:px-6 py-2 md:py-3 font-bold tracking-wider transition-all rounded-lg text-xs md:text-sm ${
                                            instagramFilter === 'kitchen'
                                                ? 'bg-[#5B8BA0] text-white'
                                                : 'bg-neutral-800 text-white/60 hover:bg-neutral-700'
                                        }`}
                                    >
                                        KITCHEN
                                    </button>
                                    <button
                                        onClick={() => {
                                            setInstagramFilter('bathroom');
                                            setCurrentInstagramIndex(0);
                                        }}
                                        className={`px-3 md:px-6 py-2 md:py-3 font-bold tracking-wider transition-all rounded-lg text-xs md:text-sm ${
                                            instagramFilter === 'bathroom'
                                                ? 'bg-[#5B8BA0] text-white'
                                                : 'bg-neutral-800 text-white/60 hover:bg-neutral-700'
                                        }`}
                                    >
                                        BATHROOM
                                    </button>
                                    <button
                                        onClick={() => {
                                            setInstagramFilter('bedroom');
                                            setCurrentInstagramIndex(0);
                                        }}
                                        className={`px-3 md:px-6 py-2 md:py-3 font-bold tracking-wider transition-all rounded-lg text-xs md:text-sm ${
                                            instagramFilter === 'bedroom'
                                                ? 'bg-[#5B8BA0] text-white'
                                                : 'bg-neutral-800 text-white/60 hover:bg-neutral-700'
                                        }`}
                                    >
                                        BEDROOM
                                    </button>
                                    <button
                                        onClick={() => {
                                            setInstagramFilter('livingroom');
                                            setCurrentInstagramIndex(0);
                                        }}
                                        className={`px-3 md:px-6 py-2 md:py-3 font-bold tracking-wider transition-all rounded-lg text-xs md:text-sm ${
                                            instagramFilter === 'livingroom'
                                                ? 'bg-[#5B8BA0] text-white'
                                                : 'bg-neutral-800 text-white/60 hover:bg-neutral-700'
                                        }`}
                                    >
                                        LIVING ROOM
                                    </button>
                                </div>
                            </div>

                            {/* Instagram Carousel Container */}
                            <div className="flex items-center gap-4 md:gap-8">
                                {/* Left Arrow - Outside the grid - HIDDEN ON MOBILE */}
                                <button
                                    onClick={prevInstagramSlide}
                                    className="hidden md:flex flex-shrink-0 w-16 h-16 bg-[#5B8BA0] hover:bg-[#4A7386] rounded-full items-center justify-center transition-all shadow-lg"
                                    aria-label="Previous posts"
                                >
                                    <ChevronLeft className="w-8 h-8 text-white" />
                                </button>

                                {/* Instagram Grid - 2 columns on mobile, 3 on desktop */}
                                <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
                                    {getCurrentInstagramPosts().map((project, idx) => (
                                        <TiltCard key={idx}>
                                            <div
                                                className="group relative aspect-square bg-neutral-900 overflow-hidden border border-white/10 hover:border-[#5B8BA0] transition-all cursor-pointer rounded-lg"
                                                onClick={() => {
                                                    setLightboxProject(project);
                                                    setLightboxIndex(0);
                                                }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 flex flex-col items-center justify-end p-4 pointer-events-none">
                                                    <p className="text-white font-bold text-lg mb-1">{project.title}</p>
                                                    <p className="text-white/60 text-sm">{project.category}</p>
                                                </div>
                                                {project.type === 'animation' ? (
                                                    <VideoThumbnail
                                                        thumbnail={project.thumbnail}
                                                        video={project.video}
                                                        alt={project.title}
                                                        className="w-full h-full"
                                                    />
                                                ) : (
                                                    <LazyImage
                                                        src={project.image}
                                                        alt={project.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                )}
                                            </div>
                                        </TiltCard>
                                    ))}
                                </div>

                                {/* Right Arrow - Outside the grid - HIDDEN ON MOBILE */}
                                <button
                                    onClick={nextInstagramSlide}
                                    className="hidden md:flex flex-shrink-0 w-16 h-16 bg-[#5B8BA0] hover:bg-[#4A7386] rounded-full items-center justify-center transition-all shadow-lg"
                                    aria-label="Next posts"
                                >
                                    <ChevronRight className="w-8 h-8 text-white" />
                                </button>
                            </div>
                        </div>
                    </div>
                </FadeInSection>

                {/* About Section */}
                <FadeInSection>
                    <div id="about" className="py-16 mb-8">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-8 tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>
                                ABOUT US
                            </h2>
                            <p className="text-xl text-white/70 mb-6 leading-relaxed max-w-5xl mx-auto">
                                At Banko Arts, we specialize in creating stunning 3D architectural visualizations that bring your vision to&nbsp;life.
                            </p>
                            <p className="text-lg text-white/60 leading-relaxed mb-8">
                                With over 10 years of experience and more than 824 completed projects, we've helped architects, developers, and designers transform their concepts into photorealistic renders. Our team combines technical expertise with artistic vision to deliver exceptional results that exceed expectations.
                            </p>
                            <div className="grid md:grid-cols-3 gap-8 mt-12">
                                <TiltCard>
                                    <div className="p-6 bg-neutral-900/50 border border-white/10 rounded-lg">
                                        <div className="text-[#5B8BA0] mb-4">
                                            <Building2 size={48} className="mx-auto" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>Expert Team</h3>
                                        <p className="text-white/60 text-sm">Professional 3D artists with years of industry experience</p>
                                    </div>
                                </TiltCard>
                                <TiltCard>
                                    <div className="p-6 bg-neutral-900/50 border border-white/10 rounded-lg">
                                        <div className="text-[#5B8BA0] mb-4">
                                            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>Fast Delivery</h3>
                                        <p className="text-white/60 text-sm">Quick turnaround times without compromising on quality</p>
                                    </div>
                                </TiltCard>
                                <TiltCard>
                                    <div className="p-6 bg-neutral-900/50 border border-white/10 rounded-lg">
                                        <div className="text-[#5B8BA0] mb-4">
                                            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>Quality Guaranteed</h3>
                                        <p className="text-white/60 text-sm">Photorealistic renders that bring your vision to reality</p>
                                    </div>
                                </TiltCard>
                            </div>
                        </div>
                    </div>
                </FadeInSection>

                {/* Professional Profile Cards */}
                <FadeInSection>
                    <div className="py-16 mb-8">
                        <div className="max-w-6xl mx-auto">
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Freelancer.com Card */}
                                <div className="group bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 border border-white/20 rounded-2xl p-8 hover:border-[#5B8BA0]/50 transition-all duration-300 hover:translate-y-[-2px]">
                                    {/* Freelancer.com Logo */}
                                    <div className="flex justify-center mb-4">
                                        <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                            <span className="text-blue-400 font-bold text-lg tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>
                                                FREELANCER.COM
                                            </span>
                                        </div>
                                    </div>

                                    {/* Profile Header */}
                                    <div className="flex flex-col items-center text-center mb-6">
                                        <div className="relative mb-4">
                                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#5B8BA0] to-[#4A7386] p-1">
                                                <img
                                                    src="/images/profile.png"
                                                    alt="Berk B."
                                                    className="w-full h-full rounded-full object-cover object-center"
                                                />
                                            </div>
                                            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-neutral-900 rounded-full"></div>
                                        </div>
                                        <h3 className="text-3xl font-bold mb-3 tracking-wider flex items-center gap-2 justify-center" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>
                                            Berk B.
                                            <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </h3>

                                        {/* Rating Stars */}
                                        <div className="flex items-center gap-3 mb-3 bg-neutral-800/80 px-4 py-2 rounded-lg border border-white/10">
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <span className="text-xl font-bold text-white" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>5.0</span>
                                            <span className="text-sm text-white/60">332</span>
                                        </div>

                                        {/* Badges */}
                                        <div className="flex gap-2 flex-wrap justify-center">
                                            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-semibold border border-purple-500/30 flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                                Available Now
                                            </span>
                                            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold border border-blue-500/30">
                                                Preferred Freelancer
                                            </span>
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    <a
                                        href="https://www.freelancer.com/u/brkbnkgll"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full px-6 py-3 bg-transparent border-2 border-white/30 hover:border-[#5B8BA0] text-white font-bold tracking-wider transition-all rounded-lg text-center"
                                    >
                                        View Freelancer Profile
                                    </a>
                                </div>

                                {/* Upwork Card */}
                                <div className="group bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 border border-white/20 rounded-2xl p-8 hover:border-[#5B8BA0]/50 transition-all duration-300 hover:translate-y-[-2px]">
                                    {/* Upwork Logo */}
                                    <div className="flex justify-center mb-4">
                                        <div className="px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
                                            <span className="text-green-400 font-bold text-lg tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>
                                                UPWORK
                                            </span>
                                        </div>
                                    </div>

                                    {/* Profile Header */}
                                    <div className="flex flex-col items-center text-center mb-6">
                                        <div className="relative mb-4">
                                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#5B8BA0] to-[#4A7386] p-1">
                                                <img
                                                    src="/images/profile.png"
                                                    alt="Berk B."
                                                    className="w-full h-full rounded-full object-cover object-center"
                                                />
                                            </div>
                                            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-neutral-900 rounded-full"></div>
                                        </div>
                                        <h3 className="text-3xl font-bold mb-3 tracking-wider flex items-center gap-2 justify-center" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>
                                            Berk B.
                                            <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </h3>

                                        {/* Rating Stars */}
                                        <div className="flex items-center gap-3 mb-3 bg-neutral-800/80 px-4 py-2 rounded-lg border border-white/10">
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <span className="text-xl font-bold text-white" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>5.0</span>
                                            <span className="text-sm text-white/60">84</span>
                                        </div>

                                        {/* Badges */}
                                        <div className="flex gap-2 flex-wrap justify-center">
                                            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-semibold border border-purple-500/30 flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                                Available Now
                                            </span>
                                            <span className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-xs font-semibold border border-pink-500/30">
                                                Top Rated Plus
                                            </span>
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    <a
                                        href="https://www.upwork.com/freelancers/berkbanko"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full px-6 py-3 bg-transparent border-2 border-white/30 hover:border-[#5B8BA0] text-white font-bold tracking-wider transition-all rounded-lg text-center"
                                    >
                                        View Upwork Profile
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeInSection>

                {/* Services & Skills Section */}
                <FadeInSection>
                    <div id="services" className="py-16 mb-8">
                        <div className="max-w-[1600px] mx-auto px-4 sm:px-8">
                            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-8 tracking-wider text-center" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>
                                SERVICES & EXPERTISE
                            </h2>
                            <p className="text-xl text-white/70 mb-12 leading-relaxed max-w-3xl mx-auto text-center">
                                Professional 3D visualization services powered by industry-leading tools and expertise
                            </p>

                            <div className="grid lg:grid-cols-[2.2fr_1fr_1fr] gap-8">
                                {/* Services Column */}
                                <div>
                                    <h3 className="text-3xl font-bold mb-8 tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>
                                        OUR SERVICES
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
                                <TiltCard>
                                    <div className="p-8 bg-neutral-900/50 border border-white/10 rounded-lg hover:border-[#5B8BA0] transition-all h-full flex flex-col">
                                        <div className="text-[#5B8BA0] mb-4">
                                            <Building2 size={56} className="mx-auto" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-3 tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>Exterior Visualization</h3>
                                        <p className="text-white/60 text-sm leading-relaxed flex-grow">Photorealistic exterior renders that bring architectural designs to life with stunning detail.</p>
                                    </div>
                                </TiltCard>

                                <TiltCard>
                                    <div className="p-8 bg-neutral-900/50 border border-white/10 rounded-lg hover:border-[#5B8BA0] transition-all h-full flex flex-col">
                                        <div className="text-[#5B8BA0] mb-4">
                                            <Sofa size={56} className="mx-auto" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-3 tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>Interior Visualization</h3>
                                        <p className="text-white/60 text-sm leading-relaxed flex-grow">Detailed interior visualizations showcasing materials, lighting, and spatial design with realism.</p>
                                    </div>
                                </TiltCard>

                                <TiltCard>
                                    <div className="p-8 bg-neutral-900/50 border border-white/10 rounded-lg hover:border-[#5B8BA0] transition-all h-full flex flex-col">
                                        <div className="text-[#5B8BA0] mb-4">
                                            <UtensilsCrossed size={56} className="mx-auto" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-3 tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>Kitchen Design</h3>
                                        <p className="text-white/60 text-sm leading-relaxed flex-grow">Modern kitchen visualizations with attention to every detail, from appliances to finishes.</p>
                                    </div>
                                </TiltCard>

                                <TiltCard>
                                    <div className="p-8 bg-neutral-900/50 border border-white/10 rounded-lg hover:border-[#5B8BA0] transition-all h-full flex flex-col">
                                        <div className="text-[#5B8BA0] mb-4">
                                            <ShowerHead size={56} className="mx-auto" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-3 tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>Bathroom Visualization</h3>
                                        <p className="text-white/60 text-sm leading-relaxed flex-grow">Luxurious bathroom renders showcasing premium materials and sophisticated lighting design.</p>
                                    </div>
                                </TiltCard>

                                <TiltCard>
                                    <div className="p-8 bg-neutral-900/50 border border-white/10 rounded-lg hover:border-[#5B8BA0] transition-all h-full flex flex-col">
                                        <div className="text-[#5B8BA0] mb-4">
                                            <Bed size={56} className="mx-auto" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-3 tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>Bedroom Visualization</h3>
                                        <p className="text-white/60 text-sm leading-relaxed flex-grow">Comfortable and elegant bedroom designs that capture the perfect ambiance and mood.</p>
                                    </div>
                                </TiltCard>

                                <TiltCard>
                                    <div className="p-8 bg-neutral-900/50 border border-white/10 rounded-lg hover:border-[#5B8BA0] transition-all h-full flex flex-col">
                                        <div className="text-[#5B8BA0] mb-4">
                                            <svg className="w-14 h-14 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold mb-3 tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>3D Animation</h3>
                                        <p className="text-white/60 text-sm leading-relaxed flex-grow">Dynamic walkthrough animations and cinematic presentations that showcase projects in motion.</p>
                                    </div>
                                </TiltCard>

                                <TiltCard>
                                    <div className="p-8 bg-neutral-900/50 border border-white/10 rounded-lg hover:border-[#5B8BA0] transition-all h-full flex flex-col">
                                        <div className="text-[#5B8BA0] mb-4">
                                            <svg className="w-14 h-14 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold mb-3 tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>Lighting Design</h3>
                                        <p className="text-white/60 text-sm leading-relaxed flex-grow">Professional lighting design and visualization to create the perfect atmosphere and mood.</p>
                                    </div>
                                </TiltCard>

                                <TiltCard>
                                    <div className="p-8 bg-neutral-900/50 border border-white/10 rounded-lg hover:border-[#5B8BA0] transition-all h-full flex flex-col">
                                        <div className="text-[#5B8BA0] mb-4">
                                            <svg className="w-14 h-14 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold mb-3 tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>Material & Texture</h3>
                                        <p className="text-white/60 text-sm leading-relaxed flex-grow">Realistic material representation and texture mapping for authentic visualization results.</p>
                                    </div>
                                </TiltCard>

                                <TiltCard>
                                    <div className="p-8 bg-neutral-900/50 border border-white/10 rounded-lg hover:border-[#5B8BA0] transition-all h-full flex flex-col">
                                        <div className="text-[#5B8BA0] mb-4">
                                            <svg className="w-14 h-14 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold mb-3 tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>Post Production</h3>
                                        <p className="text-white/60 text-sm leading-relaxed flex-grow">Professional image enhancement and post-processing for magazine-quality final renders.</p>
                                    </div>
                                </TiltCard>
                                    </div>
                                </div>

                                {/* Traditional Tools Column */}
                                <div>
                                    <h3 className="text-3xl font-bold mb-8 tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>
                                        TOOLS
                                    </h3>
                                    <div className="space-y-6">
                                        {/* 3ds Max */}
                                        <div className="bg-neutral-900/50 border border-white/10 rounded-lg p-6 hover:border-[#5B8BA0] transition-all">
                                            <div className="flex items-center gap-4 mb-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-[#5B8BA0] to-[#4A7386] rounded-lg flex items-center justify-center">
                                                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z"/>
                                                    </svg>
                                                </div>
                                                <h4 className="text-xl font-bold tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>3ds Max</h4>
                                            </div>
                                            <p className="text-white/60 text-sm">Industry-standard 3D modeling and rendering software</p>
                                        </div>

                                        {/* V-Ray */}
                                        <div className="bg-neutral-900/50 border border-white/10 rounded-lg p-6 hover:border-[#5B8BA0] transition-all">
                                            <div className="flex items-center gap-4 mb-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                                                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                                                    </svg>
                                                </div>
                                                <h4 className="text-xl font-bold tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>V-Ray</h4>
                                            </div>
                                            <p className="text-white/60 text-sm">Professional photorealistic rendering engine</p>
                                        </div>

                                        {/* Corona Renderer */}
                                        <div className="bg-neutral-900/50 border border-white/10 rounded-lg p-6 hover:border-[#5B8BA0] transition-all">
                                            <div className="flex items-center gap-4 mb-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
                                                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
                                                    </svg>
                                                </div>
                                                <h4 className="text-xl font-bold tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>Corona</h4>
                                            </div>
                                            <p className="text-white/60 text-sm">High-performance physically based renderer</p>
                                        </div>

                                        {/* Adobe Photoshop */}
                                        <div className="bg-neutral-900/50 border border-white/10 rounded-lg p-6 hover:border-[#5B8BA0] transition-all">
                                            <div className="flex items-center gap-4 mb-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                                                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9.5 11.5c0 .83-.67 1.5-1.5 1.5H7v2H5.5V9H8c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2v-2H13c.83 0 1.5.67 1.5 1.5zm4.5 2h-1.5v-2h-1v-1.5h1v-1h-1V10h1V8.5H16V11h1.5v1.5H16V14h2.5v1.5z"/>
                                                    </svg>
                                                </div>
                                                <h4 className="text-xl font-bold tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>Photoshop</h4>
                                            </div>
                                            <p className="text-white/60 text-sm">Professional post-production and image editing</p>
                                        </div>

                                        {/* AutoCAD */}
                                        <div className="bg-neutral-900/50 border border-white/10 rounded-lg p-6 hover:border-[#5B8BA0] transition-all">
                                            <div className="flex items-center gap-4 mb-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                                                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z"/>
                                                    </svg>
                                                </div>
                                                <h4 className="text-xl font-bold tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>AutoCAD</h4>
                                            </div>
                                            <p className="text-white/60 text-sm">Precision drafting and technical documentation</p>
                                        </div>

                                        {/* SketchUp */}
                                        <div className="bg-neutral-900/50 border border-white/10 rounded-lg p-6 hover:border-[#5B8BA0] transition-all">
                                            <div className="flex items-center gap-4 mb-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.12-.36.18-.57.18-.21 0-.41-.06-.57-.18l-7.9-4.44A.991.991 0 013 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.12.36-.18.57-.18.21 0 .41.06.57.18l7.9 4.44c.32.17.53.5.53.88v9z"/>
                                                    </svg>
                                                </div>
                                                <h4 className="text-xl font-bold tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>SketchUp</h4>
                                            </div>
                                            <p className="text-white/60 text-sm">Quick 3D modeling and conceptual design</p>
                                        </div>

                                    </div>
                                </div>

                                {/* AI Tools Column */}
                                <div>
                                    <h3 className="text-3xl font-bold mb-8 tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>
                                        AI TOOLS
                                    </h3>
                                    <div className="space-y-6">

                                        {/* Midjourney */}
                                        <div className="bg-neutral-900/50 border border-white/10 rounded-lg p-6 hover:border-[#5B8BA0] transition-all">
                                            <div className="flex items-center gap-4 mb-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm-2 18l-4-4 1.41-1.41L10 17.17l6.59-6.59L18 12l-8 8z"/>
                                                    </svg>
                                                </div>
                                                <h4 className="text-xl font-bold tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>Midjourney</h4>
                                            </div>
                                            <p className="text-white/60 text-sm">AI-powered image generation and concept art</p>
                                        </div>

                                        {/* Stable Diffusion */}
                                        <div className="bg-neutral-900/50 border border-white/10 rounded-lg p-6 hover:border-[#5B8BA0] transition-all">
                                            <div className="flex items-center gap-4 mb-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                                                    </svg>
                                                </div>
                                                <h4 className="text-xl font-bold tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>Stable Diffusion</h4>
                                            </div>
                                            <p className="text-white/60 text-sm">Open-source AI model for custom image generation</p>
                                        </div>

                                        {/* ComfyUI */}
                                        <div className="bg-neutral-900/50 border border-white/10 rounded-lg p-6 hover:border-[#5B8BA0] transition-all">
                                            <div className="flex items-center gap-4 mb-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15.01l1.41 1.41L11 14.84V19h2v-4.16l1.59 1.59L16 15.01 12.01 11z"/>
                                                    </svg>
                                                </div>
                                                <h4 className="text-xl font-bold tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>ComfyUI</h4>
                                            </div>
                                            <p className="text-white/60 text-sm">Advanced node-based workflow for AI image generation</p>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeInSection>

                {/* Testimonials Section */}
                <FadeInSection>
                    <div id="testimonials" className="py-16 mb-8 bg-neutral-900/30">
                        <div className="max-w-[1400px] mx-auto px-8">
                            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-16 tracking-wider text-center" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>
                                CLIENT TESTIMONIALS
                            </h2>

                            {/* Carousel Container */}
                            <div className="relative">
                                {/* Left Arrow */}
                                <button
                                    onClick={prevTestimonial}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-[#5B8BA0] hover:bg-[#4A7386] rounded-full flex items-center justify-center transition-all shadow-lg"
                                >
                                    <ChevronLeft className="w-6 h-6 text-white" />
                                </button>

                                {/* Right Arrow */}
                                <button
                                    onClick={nextTestimonial}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-[#5B8BA0] hover:bg-[#4A7386] rounded-full flex items-center justify-center transition-all shadow-lg"
                                >
                                    <ChevronRight className="w-6 h-6 text-white" />
                                </button>

                                {/* Testimonials Grid */}
                                <div className="grid md:grid-cols-3 gap-8">
                                    {getCurrentTestimonials().map((testimonial, idx) => (
                                        <div key={idx} className="p-8 bg-neutral-900 border border-white/10 rounded-lg">
                                            {/* Star rating */}
                                            <div className="flex items-center gap-2 mb-4">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            {/* Quote */}
                                            <p className="text-white/70 mb-6 italic leading-relaxed">
                                                "{testimonial.quote}"
                                            </p>
                                            {/* Author info */}
                                            <div className="border-t border-white/10 pt-4">
                                                <p className="font-semibold">{testimonial.author}</p>
                                                <p className="text-sm text-white/40">{testimonial.position}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeInSection>

                {/* Get In Touch Section with Contact Form */}
                <FadeInSection>
                    <div id="contact" className="py-12 mb-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-wider mb-4" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>
                                GET IN TOUCH
                            </h2>
                            <div className="flex justify-center gap-6 text-white/40 mt-8">
                                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                </a>
                                <a href="https://www.instagram.com/bankoarts" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                    <Instagram size={24} />
                                </a>
                                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                </a>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                                </a>
                            </div>
                        </div>
                        <ContactForm />
                    </div>
                </FadeInSection>

                {/* Footer */}
                <footer className="border-t border-white/10 py-16 mt-16">
                    <div className="max-w-[1400px] mx-auto">
                        <div className="grid md:grid-cols-4 gap-12 mb-12">
                            {/* Brand Column */}
                            <div className="md:col-span-1">
                                <h3 className="text-3xl font-bold tracking-widest mb-4" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>
                                    BANKO ARTS
                                </h3>
                                <p className="text-white/60 text-sm leading-relaxed">
                                    Professional 3D architectural visualization and rendering services.
                                </p>
                            </div>

                            {/* Quick Links Column */}
                            <div>
                                <h4 className="text-lg font-bold mb-4 tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>
                                    QUICK LINKS
                                </h4>
                                <ul className="space-y-3">
                                    <li>
                                        <button onClick={() => scrollToSection('services')} className="text-white/60 hover:text-white transition-colors text-sm">
                                            Services
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={() => scrollToSection('about')} className="text-white/60 hover:text-white transition-colors text-sm">
                                            About Us
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={() => scrollToSection('testimonials')} className="text-white/60 hover:text-white transition-colors text-sm">
                                            Testimonials
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={() => scrollToSection('contact')} className="text-white/60 hover:text-white transition-colors text-sm">
                                            Contact
                                        </button>
                                    </li>
                                </ul>
                            </div>

                            {/* Contact Column */}
                            <div>
                                <h4 className="text-lg font-bold mb-4 tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>
                                    CONTACT
                                </h4>
                                <ul className="space-y-3">
                                    <li>
                                        <a href="mailto:contact@bankoarts.com" className="text-white/60 hover:text-white transition-colors flex items-center gap-2 text-sm">
                                            <Mail size={16} />
                                            <span>contact@bankoarts.com</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* Social Media Column */}
                            <div>
                                <h4 className="text-lg font-bold mb-4 tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '700', letterSpacing: '0.05em' }}>
                                    FOLLOW US
                                </h4>
                                <div className="flex flex-col gap-3">
                                    <a
                                        href="https://www.instagram.com/bankoarts"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white/60 hover:text-white transition-colors flex items-center gap-2 text-sm"
                                    >
                                        <Instagram size={18} />
                                        <span>Instagram</span>
                                    </a>
                                    <a
                                        href="https://www.freelancer.com/u/brkbnkgll"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white/60 hover:text-white transition-colors flex items-center gap-2 text-sm"
                                    >
                                        <Briefcase size={18} />
                                        <span>Freelancer</span>
                                    </a>
                                    <a
                                        href="https://www.upwork.com/freelancers/berkbanko"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white/60 hover:text-white transition-colors flex items-center gap-2 text-sm"
                                    >
                                        <Briefcase size={18} />
                                        <span>Upwork</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Copyright Bar */}
                        <div className="border-t border-white/10 pt-8">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <p className="text-white/40 text-sm">
                                    © {new Date().getFullYear()} Banko Arts. All rights reserved.
                                </p>
                                <div className="flex gap-6 text-white/40 text-sm">
                                    <span>824+ Projects Completed</span>
                                    <span>•</span>
                                    <span>10 Years Experience</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            {lightboxProject && (
                <Lightbox
                    project={lightboxProject}
                    onClose={() => setLightboxProject(null)}
                    allProjects={architectureProjects}
                    currentIndex={lightboxIndex}
                    onNavigate={handleLightboxNavigate}
                />
            )}
        </div>
    );
}