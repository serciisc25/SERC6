import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import PageBanner from '../components/PageBanner';
import { useContent } from '../contexts/ContentContext';
import { ArrowRight, Search, SlidersHorizontal, CalendarDays, CalendarPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { NewsEvent } from '../types';
import RegistrationModal from '../components/RegistrationModal';

const listContainer = {
    hidden: { opacity: 1 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const listItem = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
};

interface NewsListItemProps {
    item: NewsEvent;
    onRegisterClick: (event: NewsEvent) => void;
}

const NewsListItem: React.FC<NewsListItemProps> = ({ item, onRegisterClick }) => {
    const isDeadlinePassed = item.registrationDeadline ? new Date() > new Date(item.registrationDeadline) : false;

    const handleRegisterClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onRegisterClick(item);
    };

    return (
        <motion.div
            variants={listItem}
            className="flex flex-col md:flex-row items-start gap-6 p-4 transition-shadow duration-300 border rounded-lg bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 hover:shadow-lg"
        >
            <Link to={`/news/${item.id}`} className="flex-shrink-0 w-full md:w-64">
                <img src={item.image} alt={item.title} className="object-cover w-full h-40 rounded-md" />
            </Link>
            <div className="flex flex-col flex-grow w-full">
                <span className={`inline-block self-start px-2 py-1 mb-2 text-xs font-semibold rounded-full text-white ${
                    item.type === 'Announcement' ? 'bg-blue-500' : 
                    item.type === 'Workshop' ? 'bg-green-500' : 'bg-yellow-500'
                }`}>{item.type}</span>
                <h3 className="mb-2 text-xl font-bold leading-tight text-brand-blue dark:text-white">
                    <Link to={`/news/${item.id}`} className="hover:underline">{item.title}</Link>
                </h3>
                <p className="flex items-center mb-2 text-sm text-slate-500 dark:text-gray-400">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    {item.date}
                </p>
                <p className="flex-grow mb-4 text-sm text-slate-600 dark:text-gray-300 line-clamp-2">{item.summary}</p>
                <div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
                     <Link to={`/news/${item.id}`} className="inline-flex items-center font-semibold text-brand-blue dark:text-brand-orange group">
                        Read More <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                    {item.registrationOpen && !isDeadlinePassed && (
                        <button 
                            onClick={handleRegisterClick}
                            className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white transition-colors rounded-md bg-brand-orange hover:bg-brand-orange/90"
                        >
                            <CalendarPlus className="w-4 h-4 mr-2" />
                            Register Now
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};


const NewsPage: React.FC = () => {
    const { content } = useContent();
    const allEvents = content?.newsAndEvents || [];

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('All');
    const [sortBy, setSortBy] = useState('newest');
    const [selectedEventForReg, setSelectedEventForReg] = useState<NewsEvent | null>(null);


    const eventTypes = ['All', 'Announcement', 'Workshop', 'Seminar'];

    const filteredAndGroupedEvents = useMemo(() => {
        let filtered = allEvents.filter(event => {
            const matchesSearch = searchTerm === '' || 
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.summary.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesType = selectedType === 'All' || event.type === selectedType;

            return matchesSearch && matchesType;
        });

        filtered.sort((a, b) => {
            // Sanitize date strings like "Nov 5-7, 2023" to "Nov 5, 2023" to make them parseable by new Date()
            const parseableDate = (dateStr: string) => new Date(dateStr.replace(/-\d+(,)/, '$1'));

            const dateA = parseableDate(a.date);
            const dateB = parseableDate(b.date);

            if (sortBy === 'newest') {
                return dateB.getTime() - dateA.getTime();
            } else {
                // FIX: Corrected a typo causing a sort error by using the parsed date object 'dateB' instead of the event object 'b'.
                return dateA.getTime() - dateB.getTime();
            }
        });

        const grouped = filtered.reduce((acc, event) => {
            const yearMatch = event.date.match(/\d{4}/);
            const year = yearMatch ? yearMatch[0] : 'Unknown';
            if (!acc[year]) {
                acc[year] = [];
            }
            acc[year].push(event);
            return acc;
        }, {} as Record<string, NewsEvent[]>);
        
        return grouped;

    }, [allEvents, searchTerm, selectedType, sortBy]);

    const years = Object.keys(filteredAndGroupedEvents).sort((a, b) => {
        if (sortBy === 'newest') {
            return Number(b) - Number(a); // Sort years descending
        }
        return Number(a) - Number(b); // Sort years ascending
    });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <PageBanner 
                title="News & Events" 
                subtitle="Latest Happenings at SERC"
            />
            <div className="container px-6 py-12 mx-auto">
                <Breadcrumbs items={[{ label: 'News & Events' }]} />

                {/* Filter Bar */}
                <div className="sticky top-[100px] lg:top-[150px] z-30 py-4 mb-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm -mx-6 px-6 border-b border-t border-slate-200 dark:border-slate-700">
                    <div className="container p-0 mx-auto">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input 
                                    type="text"
                                    placeholder="Search news..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full py-2 pl-10 pr-4 transition-colors border rounded-md shadow-sm border-slate-300 dark:bg-slate-800 dark:border-slate-600 focus:ring-brand-blue focus:border-brand-blue"
                                />
                            </div>

                            <div className="relative">
                                <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="w-full py-2 pl-10 pr-4 transition-colors border rounded-md shadow-sm appearance-none border-slate-300 dark:bg-slate-800 dark:border-slate-600 focus:ring-brand-blue focus:border-brand-blue"
                                >
                                    {eventTypes.map(type => <option key={type} value={type}>{type === 'All' ? 'Filter by Type' : type}</option>)}
                                </select>
                            </div>
                            
                            <div className="relative">
                                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full py-2 pl-10 pr-4 transition-colors border rounded-md shadow-sm appearance-none border-slate-300 dark:bg-slate-800 dark:border-slate-600 focus:ring-brand-blue focus:border-brand-blue"
                                >
                                    <option value="newest">Sort by: Newest</option>
                                    <option value="oldest">Sort by: Oldest</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-16">
                    {years.length > 0 ? (
                        years.map(year => (
                            <section key={year}>
                                <h2 className="pb-4 mb-8 text-3xl font-bold border-b-2 text-brand-blue dark:text-brand-orange border-brand-orange/50">{year}</h2>
                                <motion.div 
                                    className="space-y-8"
                                    variants={listContainer}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true, amount: 0.1 }}
                                >
                                    {filteredAndGroupedEvents[year].map(item => (
                                        <NewsListItem key={item.id} item={item} onRegisterClick={setSelectedEventForReg} />
                                    ))}
                                </motion.div>
                            </section>
                        ))
                    ) : (
                        <div className="py-16 text-center">
                            <h3 className="text-2xl font-semibold text-slate-700 dark:text-gray-300">No News Found</h3>
                            <p className="mt-2 text-slate-500">Try adjusting your search or filters to find what you're looking for.</p>
                        </div>
                    )}
                </div>
            </div>
            <AnimatePresence>
                {selectedEventForReg && (
                    <RegistrationModal 
                        event={selectedEventForReg} 
                        onClose={() => setSelectedEventForReg(null)} 
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default NewsPage;
