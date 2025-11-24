


import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFoundPage: React.FC = () => {
    return (
        <motion.div 
            className="flex flex-col items-center justify-center h-full py-20 text-center"
            {...{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -20 },
                transition: { duration: 0.5 }
            }}
        >
            <AlertTriangle className="w-24 h-24 text-brand-orange" />
            <h1 className="mt-6 text-6xl font-bold text-brand-blue dark:text-white">404</h1>
            <p className="mt-2 text-2xl font-medium text-slate-700 dark:text-gray-300">Page Not Found</p>
            <p className="mt-4 text-slate-500 dark:text-gray-400">Sorry, the page you are looking for does not exist.</p>
            <Link to="/" className="inline-block px-8 py-3 mt-8 font-semibold text-white transition-colors rounded-md bg-brand-blue hover:bg-brand-blue/90 dark:bg-brand-orange dark:text-brand-blue dark:hover:bg-brand-orange/90">
                Go back to Home
            </Link>
        </motion.div>
    );
};

export default NotFoundPage;