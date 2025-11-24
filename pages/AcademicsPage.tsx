import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import PageBanner from '../components/PageBanner';
import { useContent } from '../contexts/ContentContext';
import { motion, Variants } from 'framer-motion';

const listContainer = {
    hidden: { opacity: 1 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.2 }
    }
};

const listItem = {
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


const AcademicsPage: React.FC = () => {
    const { content } = useContent();
    const courses = content?.courses || [];

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
                title="Academics" 
                subtitle="Nurturing the Next Generation of Innovators"
                image="https://picsum.photos/1200/400?random=12" 
            />
            <div className="container px-6 py-12 mx-auto">
                <Breadcrumbs items={[{ label: 'Academics' }]} />

                <motion.section 
                    id="programs" 
                    className="mt-8"
                    {...{
                        variants: sectionAnimation,
                        initial: "hidden",
                        whileInView: "visible",
                        viewport: { once: true, amount: 0.2 }
                    }}
                >
                    <h2 className="mb-6 text-3xl font-bold text-brand-blue dark:text-brand-orange">PhD & M.Tech Programs</h2>
                    <p className="text-lg leading-relaxed text-slate-700 dark:text-gray-300">
                        SERC offers rigorous graduate programs leading to M.Tech (Research) and Ph.D. degrees. Our programs are designed to provide students with a deep understanding of core principles in high-performance computing and data sciences, and to train them in the use of advanced tools and techniques. Students work closely with faculty mentors on cutting-edge research projects, contributing to the advancement of knowledge in their chosen fields.
                    </p>
                </motion.section>

                <section id="courses" className="mt-16">
                    <h2 className="mb-6 text-3xl font-bold text-brand-blue dark:text-brand-orange">Featured Courses</h2>
                    <motion.div 
                        className="space-y-6"
                        {...{
                            variants: listContainer,
                            initial: "hidden",
                            whileInView: "show",
                            viewport: { once: true, amount: 0.1 }
                        }}
                    >
                        {courses.map((course) => (
                            <motion.div 
                                key={course.code} 
                                {...{ variants: listItem }}
                                className="p-6 transition-shadow duration-300 border rounded-lg bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 hover:shadow-md"
                            >
                                <div className="flex flex-col justify-between md:flex-row">
                                    <h3 className="text-xl font-bold text-brand-blue dark:text-brand-orange">{course.code}: {course.title}</h3>
                                    <p className="mt-1 font-medium text-slate-600 md:mt-0 dark:text-gray-400">Instructor: {course.instructor}</p>
                                </div>
                                <p className="mt-3 text-slate-700 dark:text-gray-300">{course.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>
            </div>
        </motion.div>
    );
};

export default AcademicsPage;