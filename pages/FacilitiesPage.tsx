


import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import PageBanner from '../components/PageBanner';
import { useContent } from '../contexts/ContentContext';
import { motion, Variants } from 'framer-motion';

const sectionVariant: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
};
const sectionVariantReverse: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
};


const FacilitiesPage: React.FC = () => {
    const { content } = useContent();
    const infrastructures = content?.infrastructures || [];

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
                title="Facilities" 
                subtitle="State-of-the-Art Research Infrastructure"
                image="https://picsum.photos/1200/400?random=14" 
            />
            <div className="container px-6 py-12 mx-auto">
                <Breadcrumbs items={[{ label: 'Facilities' }]} />

                <div className="mt-8 space-y-16">
                    {infrastructures.map((infra, index) => (
                        <motion.section 
                            key={infra.name} 
                            className={`flex flex-col items-center gap-8 md:flex-row ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                            {...{
                                variants: index % 2 !== 0 ? sectionVariantReverse : sectionVariant,
                                initial: "hidden",
                                whileInView: "visible",
                                viewport: { once: true, amount: 0.3 }
                            }}
                        >
                            <div className="md:w-1/2">
                                <img src={infra.image} alt={infra.name} className="object-cover w-full rounded-lg shadow-lg aspect-video"/>
                            </div>
                            <div className="md:w-1/2">
                                <h2 className="mb-4 text-3xl font-bold text-brand-blue dark:text-brand-orange">{infra.name}</h2>
                                <p className="leading-relaxed text-slate-700 dark:text-gray-300">{infra.description}</p>
                            </div>
                        </motion.section>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default FacilitiesPage;