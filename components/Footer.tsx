import React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../contexts/ContentContext';
import { Facebook, Twitter, Linkedin, Youtube, Mail, Phone, MapPin, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
    const { content } = useContent();
    const { contact: contactInfo, navLinks = [] } = content || {};

    if (!contactInfo) return null;

    const aboutLinks = navLinks.find(l => l.name === 'About')?.subLinks || [];

    return (
        <motion.footer 
            className="bg-brand-dark-blue text-white"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8 }}
        >
            <div className="container px-6 py-12 mx-auto">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    <div className="md:col-span-2 lg:col-span-1">
                        <div className="flex items-center space-x-3">
                           <BrainCircuit className="flex-shrink-0 w-10 h-10 text-brand-orange" strokeWidth={1.5}/>
                            <div>
                                <h1 className="text-base font-bold leading-tight text-white">SERC</h1>
                                <p className="text-xs text-gray-300">Indian Institute of Science</p>
                            </div>
                        </div>
                        <div className="mt-4 space-y-3 text-sm text-gray-300">
                           <p className="flex items-start"><MapPin size={16} className="mr-2 mt-1 flex-shrink-0"/>{contactInfo.address}</p>
                           <p className="flex items-center"><Phone size={16} className="mr-2"/>{contactInfo.phone}</p>
                           <p className="flex items-center"><Mail size={16} className="mr-2"/>{contactInfo.email}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-brand-orange">About</h3>
                        <ul className="mt-4 space-y-2">
                            {aboutLinks.map(link => (
                                <li key={link.name}>
                                    <Link to={link.path} className="text-sm text-gray-300 transition-colors hover:text-brand-orange">{link.name}</Link>
                                </li>
                            ))}
                             <li>
                                <Link to="/facilities" className="text-sm text-gray-300 transition-colors hover:text-brand-orange">Facilities</Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-brand-orange">Quick Links</h3>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#" className="text-sm text-gray-300 transition-colors hover:text-brand-orange">Webmail</a></li>
                            <li><a href="#" className="text-sm text-gray-300 transition-colors hover:text-brand-orange">Internal Portal</a></li>
                            <li><Link to="/news" className="text-sm text-gray-300 transition-colors hover:text-brand-orange">News & Events</Link></li>
                             <li><Link to="/people" className="text-sm text-gray-300 transition-colors hover:text-brand-orange">People</Link></li>
                            <li><Link to="/admin" className="text-sm text-gray-300 transition-colors hover:text-brand-orange">Admin Portal</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-2 lg:col-span-1">
                        <h3 className="text-lg font-bold text-brand-orange mb-4">Locate Us</h3>
                        <div className="w-full h-64 overflow-hidden rounded-lg shadow-lg bg-gray-800 border border-gray-700">
                            <iframe 
                                src={contactInfo.mapUrl}
                                title="SERC Location"
                                className="w-full h-full"
                                style={{ border: 0 }} 
                                allowFullScreen={false}
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade">
                            </iframe>
                        </div>
                    </div>

                </div>

                <hr className="my-8 border-gray-700" />

                <div className="items-center justify-between text-center sm:flex sm:text-left">
                    <p className="text-sm text-gray-400">
                        &copy; {new Date().getFullYear()} SERC, Indian Institute of Science. All Rights Reserved.
                    </p>
                    <div className="flex justify-center mt-4 space-x-4 sm:mt-0">
                        <a href="#" className="text-gray-300 transition-colors hover:text-brand-orange"><Facebook size={20} /></a>
                        <a href="#" className="text-gray-300 transition-colors hover:text-brand-orange"><Twitter size={20} /></a>
                        <a href="#" className="text-gray-300 transition-colors hover:text-brand-orange"><Linkedin size={20} /></a>
                        <a href="#" className="text-gray-300 transition-colors hover:text-brand-orange"><Youtube size={20} /></a>
                    </div>
                </div>
            </div>
        </motion.footer>
    );
};

export default Footer;