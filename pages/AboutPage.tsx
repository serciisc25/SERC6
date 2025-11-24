


import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import { useContent } from '../contexts/ContentContext';
import { motion, Variants } from 'framer-motion';
import PageBanner from '../components/PageBanner';

const sectionAnimation: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  }
};

const AboutPage: React.FC = () => {
    const { content } = useContent();
    const aboutContent = content?.about;

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
                title="About SERC" 
                subtitle="A Hub of High-Performance Computing and Research"
                image="https://picsum.photos/1200/400?random=10" 
            />
            
            <div className="container px-6 py-12 mx-auto">
                <Breadcrumbs items={[{ label: 'About' }]} />

                {aboutContent && (
                    <div className="mt-8 space-y-16">
                        <motion.section 
                            id="overview"
                            {...{
                                variants: sectionAnimation,
                                initial: "hidden",
                                whileInView: "visible",
                                viewport: { once: true, amount: 0.2 }
                            }}
                        >
                            <h2 className="mb-4 text-3xl font-bold text-brand-blue dark:text-brand-orange">Overview</h2>
                            <p className="text-lg leading-relaxed text-slate-700 dark:text-gray-300">{aboutContent.overview}</p>
                        </motion.section>

                        <motion.section 
                            id="message" 
                            className="p-8 bg-slate-50 rounded-lg dark:bg-slate-800"
                            {...{
                                variants: sectionAnimation,
                                initial: "hidden",
                                whileInView: "visible",
                                viewport: { once: true, amount: 0.2 }
                            }}
                        >
                            <h2 className="mb-4 text-3xl font-bold text-center text-brand-blue dark:text-brand-orange">Director’s Message</h2>
                            <div className="flex flex-col items-center md:flex-row md:space-x-8">
                                <img src="https://picsum.photos/250/250?random=15" alt="Director" className="flex-shrink-0 w-48 h-48 mb-6 rounded-full md:mb-0"/>
                                <p className="italic leading-relaxed text-slate-700 dark:text-gray-300">"{aboutContent.directorMessage}"</p>
                            </div>
                        </motion.section>

                        <motion.section 
                            id="structure"
                            {...{
                                variants: sectionAnimation,
                                initial: "hidden",
                                whileInView: "visible",
                                viewport: { once: true, amount: 0.2 }
                            }}
                        >
                            <h2 className="mb-4 text-3xl font-bold text-brand-blue dark:text-brand-orange">Organizational Structure</h2>
                            <p className="text-slate-700 dark:text-gray-300">
                                The Supercomputer Education and Research Centre (SERC) operates under the aegis of the Indian Institute of Science (IISc), Bangalore. It is headed by a Chairman and is guided by a council of faculty members representing various disciplines. The center's operations are managed by a dedicated team of scientific, technical, and administrative staff.
                            </p>
                            <div className="mt-6">
                                <img src="https://picsum.photos/1200/600?random=16" alt="Organizational Chart" className="w-full rounded-lg shadow-md" />
                            </div>
                        </motion.section>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default AboutPage;