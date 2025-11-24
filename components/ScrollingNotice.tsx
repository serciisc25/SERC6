import React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../contexts/ContentContext';
import type { NewsEvent } from '../types';
import { ArrowRight } from 'lucide-react';

interface ScrollingNoticeProps {
    title: string;
    type: NewsEvent['type'];
    icon: React.ElementType;
}

const NoticeItem: React.FC<{ event: NewsEvent }> = ({ event }) => (
    <li className="py-3 border-b border-slate-200 dark:border-slate-700 last:border-b-0">
         <Link to={`/news/${event.id}`} className="block text-sm transition-colors group">
            <p className="font-semibold truncate text-slate-800 dark:text-gray-200 group-hover:text-brand-blue dark:group-hover:text-brand-orange">{event.title}</p>
            <p className="mt-1 text-xs text-slate-500">{event.date}</p>
         </Link>
     </li>
);

const ScrollingNotice: React.FC<ScrollingNoticeProps> = ({ title, type, icon: Icon }) => {
    const { content } = useContent();
    const events = content?.newsAndEvents.filter(e => e.type === type) || [];

    if (events.length === 0) {
        return (
            <div className="flex flex-col h-full overflow-hidden bg-white border rounded-lg shadow-md dark:bg-slate-800 dark:border-slate-700">
                <div className="flex items-center px-4 py-3 bg-brand-blue">
                    <Icon className="w-5 h-5 mr-3 text-white" />
                    <h3 className="text-lg font-bold text-white">{title}</h3>
                </div>
                <div className="flex items-center justify-center flex-grow h-64 p-6">
                    <p className="text-slate-500">No new {title.toLowerCase()}.</p>
                </div>
            </div>
        );
    }

    // Adjusted threshold for smaller height
    const shouldAnimate = events.length > 5; 

    return (
        <div className="flex flex-col h-full overflow-hidden bg-white border rounded-lg shadow-md dark:bg-slate-800 dark:border-slate-700">
            <div className="flex items-center px-4 py-3 bg-brand-blue">
                <Icon className="w-5 h-5 mr-3 text-white" />
                <h3 className="text-lg font-bold text-white">{title}</h3>
            </div>
            <div className="relative flex-grow h-64 overflow-hidden group px-6 pt-4 pb-4">
                <div className={shouldAnimate ? 'animate-scroll-y group-hover:[animation-play-state:paused]' : ''}>
                    <ul>
                        {events.map((event, index) => <NoticeItem key={`${event.id}-${index}`} event={event} />)}
                    </ul>
                    {shouldAnimate && (
                        <ul aria-hidden="true">
                            {events.map((event, index) => <NoticeItem key={`${event.id}-dup-${index}`} event={event} />)}
                        </ul>
                    )}
                </div>
                 {/* Fade out effect at the bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-slate-800 to-transparent pointer-events-none"></div>
            </div>
            <div className="px-6 py-3 mt-auto text-right border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <Link to="/news" className="inline-flex items-center text-xs font-semibold text-brand-blue dark:text-brand-orange hover:underline uppercase tracking-wide">
                    View All <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
            </div>
        </div>
    );
};

export default ScrollingNotice;