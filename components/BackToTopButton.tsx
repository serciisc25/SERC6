


import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const BackToTopButton: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <button
            type="button"
            onClick={scrollToTop}
            className={`fixed bottom-5 right-5 p-3 rounded-full bg-brand-orange text-white shadow-lg transition-opacity duration-300 hover:bg-brand-orange/80 ${
                isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            aria-label="Go to top"
        >
            <ArrowUp className="w-6 h-6" />
        </button>
    );
};

export default BackToTopButton;