


import React, { useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { X } from 'lucide-react';
import type { NewsEvent } from '../types';

interface NewsModalProps {
  event: NewsEvent;
  onClose: () => void;
}

const backdrop: Variants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modal: Variants = {
  hidden: { y: "-50%", opacity: 0, scale: 0.9 },
  visible: { 
    y: "0", 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  },
};

const NewsModal: React.FC<NewsModalProps> = ({ event, onClose }) => {
    useEffect(() => {
        // Disable body scroll when modal is open
        document.body.style.overflow = 'hidden';

        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            // Re-enable body scroll when modal is closed
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
            variants={backdrop}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
        >
            <motion.div
                className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-lg shadow-xl dark:bg-slate-800 flex flex-col"
                variants={modal}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
                <img src={event.image} alt={event.title} className="object-cover w-full rounded-t-lg h-64" />
                <div className="p-8 overflow-y-auto">
                    <span className={`inline-block px-2 py-1 mb-3 text-xs font-semibold rounded-full ${
                        event.type === 'Announcement' ? 'bg-blue-100 text-blue-800' : 
                        event.type === 'Workshop' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>{event.type}</span>
                    <h2 className="mb-2 text-3xl font-bold text-brand-blue dark:text-brand-orange">{event.title}</h2>
                    <p className="mb-6 text-sm text-slate-500 dark:text-gray-400">{event.date}</p>
                    <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-gray-300">
                        <p>{event.fullContent || event.summary}</p>
                    </div>
                </div>
                 <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 p-2 text-slate-600 bg-white rounded-full dark:text-gray-300 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
                    aria-label="Close"
                >
                    <X className="w-6 h-6" />
                </button>
            </motion.div>
        </motion.div>
    );
};

export default NewsModal;