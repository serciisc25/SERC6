


import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import PageBanner from '../components/PageBanner';
import { useContent } from '../contexts/ContentContext';
import { Mail, MapPin, Phone } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3,
            type: "spring",
        }
    }
};

const itemVariantsLeft: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 }
};

const itemVariantsRight: Variants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 }
};

const ContactPage: React.FC = () => {
    const { content } = useContent();
    const contactInfo = content?.contact;

    return (
        <motion.div
            {...{
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 },
                transition: { duration: 0.5 }
            }}
        >
            <PageBanner 
                title="Contact Us" 
                subtitle="Get in Touch with SERC"
                image="https://picsum.photos/1200/400?random=16" 
            />
            <div className="container px-6 py-12 mx-auto">
                <Breadcrumbs items={[{ label: 'Contact' }]} />

                {contactInfo && (
                    <motion.div 
                        className="grid grid-cols-1 gap-12 mt-10 md:grid-cols-2"
                        {...{
                            variants: containerVariants,
                            initial: "hidden",
                            whileInView: "visible",
                            viewport: { once: true, amount: 0.2 }
                        }}
                    >
                        <motion.div {...{ variants: itemVariantsLeft }}>
                            <h2 className="text-2xl font-semibold text-brand-blue dark:text-brand-orange">Contact Information</h2>
                            <div className="mt-6 space-y-6 text-slate-700 dark:text-gray-300">
                                <div className="flex items-start">
                                    <MapPin className="w-6 h-6 mt-1 mr-4 text-brand-blue dark:text-brand-orange" />
                                    <div>
                                        <h3 className="font-semibold">Address</h3>
                                        <p>{contactInfo.address}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Phone className="w-6 h-6 mt-1 mr-4 text-brand-blue dark:text-brand-orange" />
                                    <div>
                                        <h3 className="font-semibold">Phone</h3>
                                        <p>{contactInfo.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Mail className="w-6 h-6 mt-1 mr-4 text-brand-blue dark:text-brand-orange" />
                                    <div>
                                        <h3 className="font-semibold">Email</h3>
                                        <p>{contactInfo.email}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div {...{ variants: itemVariantsRight }}>
                            <h2 className="text-2xl font-semibold text-brand-blue dark:text-brand-orange">Location</h2>
                            <div className="mt-6 overflow-hidden rounded-lg shadow-lg">
                                <iframe 
                                    src={contactInfo.mapUrl}
                                    width="100%" 
                                    height="450" 
                                    style={{ border: 0 }} 
                                    allowFullScreen={true}
                                    loading="lazy" 
                                    referrerPolicy="no-referrer-when-downgrade">
                                </iframe>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default ContactPage;