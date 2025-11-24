import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import { useContent } from '../contexts/ContentContext';
import PageBanner from '../components/PageBanner';
import { motion, Variants } from 'framer-motion';
import { Icon } from '../components/Icon';

const gridContainer = {
    hidden: { opacity: 1 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

const gridItem = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
};

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

const ResearchPage: React.FC = () => {
    const { content } = useContent();
    const researchAreas = content?.researchAreas || [];

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
                title="Research" 
                subtitle="Exploring the Frontiers of Science and Technology" 
                image="https://picsum.photos/1200/400?random=11" 
            />
            <div className="container px-6 py-12 mx-auto">
                <Breadcrumbs items={[{ label: 'Research' }]} />

                <section id="areas" className="mt-8">
                    <h2 className="mb-6 text-3xl font-bold text-brand-blue dark:text-brand-orange">Research Areas</h2>
                    <motion.div 
                        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                        {...{
                            variants: gridContainer,
                            initial: "hidden",
                            animate: "show"
                        }}
                    >
                        {researchAreas.map((area) => (
                            <motion.div 
                                key={area.name} 
                                {...{
                                    variants: gridItem,
                                    whileHover: { y: -5, boxShadow: "0 8px 16px rgba(0,0,0,0.1)"}
                                }}
                                className="p-6 border rounded-lg bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="p-3 mr-4 rounded-full bg-brand-orange/10 text-brand-orange">
                                        <Icon name={area.icon} className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-semibold">{area.name}</h3>
                                </div>
                                <p className="text-slate-600 dark:text-gray-400">{area.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                <motion.section 
                    id="publications" 
                    className="mt-16"
                    {...{
                        variants: sectionAnimation,
                        initial: "hidden",
                        whileInView: "visible",
                        viewport: { once: true, amount: 0.2 }
                    }}
                >
                    <h2 className="mb-6 text-3xl font-bold text-brand-blue dark:text-brand-orange">Recent Publications</h2>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="p-4 border-l-4 rounded-r-lg bg-slate-50 dark:bg-slate-800 border-brand-orange">
                                <p className="font-semibold text-slate-800 dark:text-gray-200">Scalable Algorithms for Genomic Data Analysis. <span className="text-sm font-normal text-slate-500 dark:text-gray-400"> - Nature Communications, 2023</span></p>
                                <p className="text-sm text-slate-600 dark:text-gray-300">Authors: A. Kumar, B. Singh, C. Patel</p>
                            </div>
                        ))}
                    </div>
                </motion.section>
                
                <motion.section 
                    id="groups" 
                    className="mt-16"
                    {...{
                        variants: sectionAnimation,
                        initial: "hidden",
                        whileInView: "visible",
                        viewport: { once: true, amount: 0.2 }
                    }}
                >
                    <h2 className="mb-6 text-3xl font-bold text-brand-blue dark:text-brand-orange">Research Groups</h2>
                     <p className="text-slate-700 dark:text-gray-300">
                        Our faculty lead vibrant research groups comprising PhD students, postdoctoral fellows, and project staff, who collectively work on challenging problems at the intersection of computer science and various application domains.
                     </p>
                </motion.section>
            </div>
        </motion.div>
    );
};

export default ResearchPage;