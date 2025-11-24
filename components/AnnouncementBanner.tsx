import React from 'react';
import { Link } from 'react-router-dom';
import { Megaphone } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';

const NewsTicker: React.FC = () => {
    const { content } = useContent();
    const announcements = content?.newsAndEvents || [];

    if (announcements.length === 0) return null;

    return (
        <div
            className="py-2 bg-white border-y dark:bg-slate-900 dark:border-slate-700"
            role="status"
        >
            <div className="container px-6 mx-auto">
                <div className="flex items-center gap-4">
                    <div className="flex items-center flex-shrink-0 px-3 py-1 text-sm font-bold text-white rounded-md bg-brand-orange">
                        <Megaphone className="w-4 h-4 mr-2" />
                        LATEST NEWS
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden group">
                        <div className="flex whitespace-nowrap animate-scroll-x group-hover:[animation-play-state:paused]">
                            {/* Original content */}
                            <div className="flex items-center">
                                {announcements.map((announcement) => (
                                    <div key={announcement.id} className="flex-shrink-0 px-4 text-sm font-medium text-slate-800 dark:text-gray-300">
                                        <Link to={`/news/${announcement.id}`} className="hover:text-brand-blue dark:hover:text-brand-orange">
                                            {announcement.title}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                            {/* Duplicate content for seamless loop */}
                            <div className="flex items-center" aria-hidden="true">
                                {announcements.map((announcement) => (
                                    <div key={`${announcement.id}-dup`} className="flex-shrink-0 px-4 text-sm font-medium text-slate-800 dark:text-gray-300">
                                        <Link to={`/news/${announcement.id}`} className="hover:text-brand-blue dark:hover:text-brand-orange">
                                            {announcement.title}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsTicker;