import React, { useState, useEffect } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Briefcase, Send, Loader, CheckCircle } from 'lucide-react';
import type { NewsEvent } from '../types';

interface RegistrationModalProps {
  event: NewsEvent;
  onClose: () => void;
}

const backdrop: Variants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modal: Variants = {
  hidden: { y: "50px", opacity: 0 },
  visible: { 
    y: "0", 
    opacity: 1, 
    transition: { type: "spring", stiffness: 300, damping: 30 }
  },
  exit: { y: "50px", opacity: 0 }
};

const RegistrationModal: React.FC<RegistrationModalProps> = ({ event, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        affiliation: 'Student'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate API call
        setTimeout(() => {
            const registrations = JSON.parse(localStorage.getItem('serc-event-registrations') || '{}');
            registrations[event.id] = formData.email;
            localStorage.setItem('serc-event-registrations', JSON.stringify(registrations));
            
            setIsSubmitting(false);
            setIsSuccess(true);
            
            // Close modal after a short delay
            setTimeout(() => {
                onClose();
            }, 2000);
        }, 1000);
    };

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black bg-opacity-60"
            variants={backdrop}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
        >
            <motion.div
                className="relative w-full max-w-lg bg-white rounded-lg shadow-xl dark:bg-slate-800"
                variants={modal}
                exit="exit"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-brand-blue dark:text-brand-orange">Register for Event</h2>
                            <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">{event.title}</p>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="p-1 text-slate-500 rounded-full hover:bg-slate-200 dark:text-gray-400 dark:hover:bg-slate-700"
                            aria-label="Close"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                    {isSuccess ? (
                        <motion.div 
                            key="success"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-16 text-center"
                        >
                            <CheckCircle className="w-16 h-16 mb-4 text-green-500" />
                            <h3 className="text-xl font-semibold">Registration Successful!</h3>
                            <p className="mt-2 text-slate-600 dark:text-gray-400">A confirmation has been sent to your email.</p>
                        </motion.div>
                    ) : (
                        <motion.form key="form" onSubmit={handleSubmit} className="mt-6 space-y-4">
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="w-full py-2 pl-10 pr-4 transition-colors border rounded-md shadow-sm border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-brand-blue focus:border-brand-blue" />
                            </div>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required className="w-full py-2 pl-10 pr-4 transition-colors border rounded-md shadow-sm border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-brand-blue focus:border-brand-blue" />
                            </div>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <select name="affiliation" value={formData.affiliation} onChange={handleChange} className="w-full py-2 pl-10 pr-4 transition-colors border rounded-md shadow-sm appearance-none border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-brand-blue focus:border-brand-blue">
                                    <option>Student</option>
                                    <option>Faculty</option>
                                    <option>Staff</option>
                                    <option>External / Industry</option>
                                </select>
                            </div>
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center px-4 py-2.5 font-semibold text-white transition-colors rounded-md bg-brand-blue hover:bg-brand-blue/90 dark:bg-brand-orange dark:text-brand-blue dark:hover:bg-brand-orange/90 disabled:bg-slate-400 dark:disabled:bg-slate-600"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader className="w-5 h-5 mr-2 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5 mr-2" />
                                        Register
                                    </>
                                )}
                            </button>
                        </motion.form>
                    )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default RegistrationModal;