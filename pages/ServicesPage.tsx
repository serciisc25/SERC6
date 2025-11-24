import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import PageBanner from '../components/PageBanner';
import { useContent } from '../contexts/ContentContext';
import { motion, Variants } from 'framer-motion';
import { Server, Users, Award, HelpCircle } from 'lucide-react';

const listContainer: Variants = {
    hidden: { opacity: 1 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.2 }
    }
};

const listItem: Variants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
};

const iconMap: { [key: string]: React.ElementType } = {
    'hpc-access': Server,
    'consultancy': Users,
    'training': Award,
    'helpdesk': HelpCircle
};

const ServicesPage: React.FC = () => {
    const { content } = useContent();
    const services = content?.services || [];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <PageBanner 
                title="Services" 
                subtitle="Supporting Research and Innovation through Expert Services"
                image="https://picsum.photos/1200/400?random=19" 
            />
            <div className="container px-6 py-12 mx-auto">
                <Breadcrumbs items={[{ label: 'Services' }]} />

                <motion.div 
                    className="mt-12 space-y-12"
                    variants={listContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {services.map((service) => {
                        const Icon = iconMap[service.id];
                        return (
                            <motion.section 
                                key={service.id} 
                                id={service.id}
                                variants={listItem}
                                className="p-8 border-l-4 rounded-r-lg bg-slate-50 dark:bg-slate-800 border-brand-orange"
                            >
                                <div className="flex items-center mb-4">
                                    {Icon && <Icon className="w-8 h-8 mr-4 text-brand-blue dark:text-brand-orange" />}
                                    <h2 className="text-3xl font-bold text-brand-blue dark:text-brand-orange">{service.name}</h2>
                                </div>
                                <div className="text-lg leading-relaxed text-slate-700 dark:text-gray-300">
                                    {service.description.split('\n').map((line, index) => (
                                        <p key={index} className={index > 0 ? 'mt-4' : ''}>{line}</p>
                                    ))}
                                </div>
                            </motion.section>
                        );
                    })}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default ServicesPage;