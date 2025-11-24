import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useContent } from '../contexts/ContentContext';
import Breadcrumbs from '../components/Breadcrumbs';
import { motion, AnimatePresence } from 'framer-motion';
import NotFoundPage from './NotFoundPage';
import { Calendar, Tag, Facebook, Twitter, Linkedin, CalendarPlus, CheckCircle, XCircle } from 'lucide-react';
import RegistrationModal from '../components/RegistrationModal';

const NewsDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { content } = useContent();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    
    const event = content?.newsAndEvents.find(e => e.id === id);

    useEffect(() => {
        if (event) {
            const registrations = JSON.parse(localStorage.getItem('serc-event-registrations') || '{}');
            if (registrations[event.id]) {
                setIsRegistered(true);
            }
        }
    }, [event]);

    if (!content || !event) {
        // If content is loading or event is not found, show a loader or not found page
        return content === null ? null : <NotFoundPage />;
    }

    const recentNews = content.newsAndEvents
        .filter(e => e.id !== id)
        .slice(0, 3);
    
    const shareUrl = window.location.href;
    const shareTitle = encodeURIComponent(event.title);
    const shareSummary = encodeURIComponent(event.summary);

    const socialLinks = [
        { name: 'Facebook', icon: Facebook, url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}` },
        { name: 'Twitter', icon: Twitter, url: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}` },
        { name: 'LinkedIn', icon: Linkedin, url: `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}&summary=${shareSummary}` },
    ];
    
    const isDeadlinePassed = event.registrationDeadline ? new Date() > new Date(event.registrationDeadline) : false;
    
    const handleModalClose = () => {
        setIsModalOpen(false);
        // Assume registration was successful and update UI
        const registrations = JSON.parse(localStorage.getItem('serc-event-registrations') || '{}');
        if (registrations[event.id]) {
            setIsRegistered(true);
        }
    }


    const RegistrationStatus = () => {
        if (!event.registrationOpen) return null;

        return (
             <div className="p-6 mb-8 bg-slate-100 rounded-lg dark:bg-slate-800">
                <h3 className="mb-4 text-xl font-bold text-brand-blue dark:text-brand-orange">Registration</h3>
                {event.registrationDeadline && (
                    <p className="mb-4 text-sm text-slate-600 dark:text-gray-400">
                        Deadline: {new Date(event.registrationDeadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                )}

                {isRegistered ? (
                    <button disabled className="w-full flex items-center justify-center px-4 py-2 font-semibold text-white transition-colors rounded-md bg-green-600 cursor-not-allowed">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        You are Registered
                    </button>
                ) : isDeadlinePassed ? (
                    <button disabled className="w-full flex items-center justify-center px-4 py-2 font-semibold text-white transition-colors rounded-md bg-red-600 cursor-not-allowed">
                        <XCircle className="w-5 h-5 mr-2" />
                        Registration Closed
                    </button>
                ) : (
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="w-full flex items-center justify-center px-4 py-2 font-semibold text-white transition-colors rounded-md bg-brand-orange hover:bg-brand-orange/90"
                    >
                        <CalendarPlus className="w-5 h-5 mr-2" />
                        Register Now
                    </button>
                )}
            </div>
        );
    }


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Hero Section */}
            <div className="relative py-24 text-white bg-center bg-cover md:py-32" style={{backgroundImage: `url(${event.image})`}}>
                <div className="absolute inset-0 bg-black bg-opacity-60"></div>
                <div className="container relative px-6 mx-auto text-center">
                    <span className={`inline-block px-3 py-1 mb-4 text-sm font-semibold tracking-wider uppercase bg-brand-orange text-white rounded-full`}>
                        {event.type}
                    </span>
                    <h1 className="text-3xl font-bold leading-tight md:text-5xl font-poppins">{event.title}</h1>
                    <p className="flex items-center justify-center mt-4 text-lg text-gray-300">
                        <Calendar className="w-5 h-5 mr-2" />
                        {event.date}
                    </p>
                </div>
            </div>

            <div className="container px-6 py-12 mx-auto md:py-16">
                <div className="max-w-6xl mx-auto">
                    <Breadcrumbs items={[{ label: 'News & Events', path: '/news' }, { label: event.title }]} />
                    
                    <div className="grid grid-cols-1 gap-12 mt-8 lg:grid-cols-12">
                        {/* Main Content */}
                        <article className="lg:col-span-8">
                            <div className="prose lg:prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-gray-300">
                                {(event.fullContent || event.summary).split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>
                        </article>

                        {/* Sidebar */}
                        <aside className="lg:col-span-4">
                            <div className="sticky top-40">
                                <RegistrationStatus />
                                <div className="p-6 mb-8 bg-slate-100 rounded-lg dark:bg-slate-800">
                                    <h3 className="mb-4 text-xl font-bold text-brand-blue dark:text-brand-orange">Share this article</h3>
                                    <div className="flex space-x-4">
                                        {socialLinks.map(social => (
                                            <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="p-3 text-slate-600 transition-colors bg-slate-200 rounded-full dark:bg-slate-700 dark:text-gray-300 hover:text-white hover:bg-brand-blue dark:hover:bg-brand-orange dark:hover:text-white">
                                                <social.icon className="w-5 h-5" />
                                            </a>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-6 bg-slate-100 rounded-lg dark:bg-slate-800">
                                    <h3 className="mb-4 text-xl font-bold text-brand-blue dark:text-brand-orange">Recent News</h3>
                                    <ul className="space-y-4">
                                        {recentNews.map(item => (
                                            <li key={item.id}>
                                                <Link to={`/news/${item.id}`} className="block transition-transform hover:translate-x-1">
                                                    <p className="font-semibold text-slate-800 dark:text-gray-200 hover:text-brand-blue dark:hover:text-brand-orange">{item.title}</p>
                                                    <p className="text-sm text-slate-500 dark:text-gray-400">{item.date}</p>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {isModalOpen && <RegistrationModal event={event} onClose={handleModalClose} />}
            </AnimatePresence>
        </motion.div>
    );
};

export default NewsDetailPage;