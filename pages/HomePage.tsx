
import React, { useEffect, useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../contexts/ContentContext';
import { ChevronLeft, ChevronRight, ArrowRight, Megaphone, Briefcase, Mic, Calendar } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import NewsTicker from '../components/AnnouncementBanner';
import StatsCounter from '../components/StatsCounter';
import ScrollingNotice from '../components/ScrollingNotice';
import type { Infrastructure } from '../types';

const HeroSection: React.FC = () => {
    const [currentSlide, setCurrentSlide] = React.useState(0);
    const { content } = useContent();
    const heroSlides = content?.heroSlides || [];
    const heroRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });
    
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    const nextSlide = useCallback(() => {
        if (heroSlides.length === 0) return;
        setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, [heroSlides.length]);

    const prevSlide = () => {
        if (heroSlides.length === 0) return;
        setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
    };

    useEffect(() => {
        const slideInterval = setInterval(nextSlide, 5000);
        return () => clearInterval(slideInterval);
    }, [nextSlide]);
    
    if (heroSlides.length === 0) {
        return <section className="relative w-full h-[60vh] bg-gray-200 dark:bg-slate-800"></section>;
    }

    return (
        <section ref={heroRef} className="relative w-full h-[65vh] overflow-hidden">
            {heroSlides.map((slide, index) => (
                 <motion.div 
                    key={index} 
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                    style={{ y }}
                >
                    <img src={slide.image} alt={slide.title} className="object-cover w-full h-full" />
                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                </motion.div>
            ))}
            {/* Adjusted padding to center content visually lower */}
            <div className="absolute inset-0 flex items-center pt-[100px] lg:pt-[100px]">
                <div className="container px-6 mx-auto">
                    <motion.div 
                        key={currentSlide}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="w-full max-w-xl p-8 text-white rounded-md bg-black/60 backdrop-blur-sm"
                    >
                        <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl font-poppins">
                            {heroSlides[currentSlide].title}
                        </h1>
                        <p className="mt-4 text-lg md:text-xl">
                            {heroSlides[currentSlide].subtitle}
                        </p>
                         <Link to="/about" className="inline-flex items-center px-6 py-2 mt-6 font-semibold transition-colors rounded-md bg-brand-orange hover:bg-brand-orange/90 text-white">
                            Learn More <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </motion.div>
                </div>
            </div>
            {/* Adjusted arrow positions */}
            <button onClick={prevSlide} className="absolute top-[calc(50%+60px)] lg:top-[calc(50%+65px)] left-4 transform -translate-y-1/2 p-2 bg-black/30 rounded-full hover:bg-black/50 transition-colors z-10">
                <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button onClick={nextSlide} className="absolute top-[calc(50%+60px)] lg:top-[calc(50%+65px)] right-4 transform -translate-y-1/2 p-2 bg-black/30 rounded-full hover:bg-black/50 transition-colors z-10">
                <ChevronRight className="w-6 h-6 text-white" />
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {heroSlides.map((_, index) => (
                    <button key={index} onClick={() => setCurrentSlide(index)} className={`w-3 h-3 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-white/50'}`}></button>
                ))}
            </div>
        </section>
    );
};

const Section: React.FC<{ title: string; children: React.ReactNode, className?: string }> = ({ title, children, className }) => (
    <motion.section 
        className={`py-12 md:py-16 ${className}`}
        {...{
            initial: { opacity: 0, y: 50 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, amount: 0.2 },
            transition: { type: "spring", stiffness: 100, damping: 20 }
        }}
    >
        <div className="container px-6 mx-auto">
            <h2 className="mb-8 text-3xl font-bold text-center md:text-4xl text-brand-blue dark:text-brand-orange font-poppins">{title}</h2>
            {children}
        </div>
    </motion.section>
);

const gridContainer = {
    hidden: { opacity: 1 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const gridItem = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
};

const ExploreCarousel: React.FC<{ items: Infrastructure[] }> = ({ items }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);

    const scroll = useCallback((direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            // Scroll by roughly one item width (taking into account different breakpoints)
            const scrollAmount = current.clientWidth / (window.innerWidth < 768 ? 1 : (window.innerWidth < 1024 ? 2 : 3));
            
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                // Check if we are near the end of the scroll container
                const maxScrollLeft = current.scrollWidth - current.clientWidth;
                if (current.scrollLeft >= maxScrollLeft - 10) {
                    // Reset to start
                    current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
            }
        }
    }, []);

    // Automatic movement every 3 seconds
    useEffect(() => {
        if (!isPaused) {
            const interval = setInterval(() => {
                scroll('right');
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [isPaused, scroll]);

    return (
        <div 
            className="relative group px-4 md:px-12"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <button 
                onClick={() => scroll('left')} 
                className="absolute left-0 z-10 p-3 transform -translate-y-1/2 bg-white rounded-full shadow-lg top-1/2 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30 text-slate-700 dark:text-white"
                aria-label="Scroll left"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            
            {/* Scroll Container */}
            <div 
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6 pt-2" 
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {items.map((item) => (
                    <motion.div 
                        key={item.name}
                        className="flex-none w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-center"
                    >
                         <div className="flex flex-col h-full overflow-hidden transition-all duration-500 bg-white border border-slate-100 rounded-2xl hover:shadow-md hover:-translate-y-1 dark:bg-slate-800 dark:border-slate-700 group/card">
                            <div className="relative h-64 overflow-hidden">
                                 <img src={item.image} alt={item.name} className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover/card:scale-105"/>
                                 <div className="absolute inset-0 transition-colors bg-gradient-to-t from-black/60 to-transparent"></div>
                                 <div className="absolute bottom-4 left-4 right-4">
                                     <h3 className="text-xl font-bold text-white drop-shadow-md">{item.name}</h3>
                                 </div>
                            </div>
                            <div className="flex flex-col flex-grow p-6">
                                <p className="flex-grow mb-6 text-sm leading-relaxed text-slate-600 dark:text-gray-300 line-clamp-3">
                                    {item.description}
                                </p>
                                <Link to="/facilities" className="inline-flex items-center px-4 py-2 text-sm font-bold text-white transition-colors rounded-lg bg-brand-blue hover:bg-brand-blue/90 dark:bg-brand-orange dark:text-brand-dark-blue dark:hover:bg-brand-orange/90 mt-auto w-fit">
                                    Explore Facility <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <button 
                onClick={() => scroll('right')} 
                className="absolute right-0 z-10 p-3 transform -translate-y-1/2 bg-white rounded-full shadow-lg top-1/2 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity text-slate-700 dark:text-white"
                aria-label="Scroll right"
            >
                <ChevronRight className="w-6 h-6" />
            </button>
        </div>
    );
};

const HomePage: React.FC = () => {
    const { content } = useContent();
    const { infrastructures, newsAndEvents } = content || {};

    return (
        <motion.div
            className="-mt-[100px] lg:-mt-[150px]"
            {...{
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 },
                transition: { duration: 0.5 }
            }}
        >
            <HeroSection />
            <NewsTicker />

            <div className="py-12 bg-white dark:bg-slate-800/50">
                <div className="container px-6 mx-auto">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <ScrollingNotice title="Announcements" type="Announcement" icon={Megaphone} />
                        <ScrollingNotice title="Workshops" type="Workshop" icon={Briefcase} />
                        <ScrollingNotice title="Seminars" type="Seminar" icon={Mic} />
                    </div>
                </div>
            </div>

            {/* MOVED UP: Explore SERC (Carousel) */}
            {infrastructures && (
                <Section title="Explore SERC" className="bg-brand-light dark:bg-slate-900">
                    <motion.div
                        variants={gridContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.1 }}
                        // transition={{ duration: 0.5 }}
                    >
                        <ExploreCarousel items={infrastructures} />
                    </motion.div>
                </Section>
            )}

            {/* MOVED DOWN: Research Highlights (Grid of 4) */}
            {newsAndEvents && (
                <Section title="Research Highlights" className="bg-white dark:bg-slate-800/50">
                    <motion.div
                        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" // Changed to 4 columns
                        variants={gridContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.1 }}
                    >
                        {newsAndEvents.slice(0, 4).map((item) => ( // Slicing 4 items
                             <motion.div 
                                key={item.id} 
                                variants={gridItem} 
                                className="flex flex-col h-full overflow-hidden transition-all duration-500 bg-white border border-slate-100 rounded-2xl hover:shadow-md hover:-translate-y-1 dark:bg-slate-800 dark:border-slate-700 group"
                             >
                                <div className="relative overflow-hidden h-40"> {/* Slightly reduced height for 4-col layout */}
                                    <img src={item.image} alt={item.title} className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"/>
                                    <div className="absolute top-3 left-3">
                                        <span className={`px-2 py-1 text-[10px] font-bold text-white uppercase rounded-full backdrop-blur-sm ${
                                            item.type === 'Announcement' ? 'bg-blue-600/90' : 
                                            item.type === 'Workshop' ? 'bg-green-600/90' : 'bg-orange-500/90'
                                        }`}>
                                            {item.type}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col flex-grow p-5">
                                    <div className="flex items-center mb-2 text-xs text-slate-500 dark:text-gray-400">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {item.date}
                                    </div>
                                    <h3 className="mb-2 text-lg font-bold leading-tight text-slate-800 dark:text-white line-clamp-2">
                                        <Link to={`/news/${item.id}`} className="hover:text-brand-blue dark:hover:text-brand-orange transition-colors">
                                            {item.title}
                                        </Link>
                                    </h3>
                                    <p className="flex-grow mb-4 text-xs text-slate-600 dark:text-gray-300 line-clamp-3">
                                        {item.summary}
                                    </p>
                                     <Link to={`/news/${item.id}`} className="inline-flex items-center text-xs font-bold text-brand-blue dark:text-brand-orange hover:underline group mt-auto uppercase tracking-wide">
                                        Read More <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </Section>
            )}

            <StatsCounter />

        </motion.div>
    );
};

export default HomePage;
