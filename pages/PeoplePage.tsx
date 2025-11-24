


import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import PageBanner from '../components/PageBanner';
import { useContent } from '../contexts/ContentContext';
import { Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Person, PeopleContent } from '../types';

const gridContainer = {
    hidden: { opacity: 1 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const gridItem = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
};

const PersonCard: React.FC<{ person: Person }> = ({ person }) => (
    <motion.div 
        {...{
            variants: gridItem,
            whileHover: { y: -5, scale: 1.03 }
        }}
        className="flex flex-col items-center p-6 text-center transition-shadow duration-300 border rounded-lg bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 hover:shadow-lg"
    >
        <img src={person.image} alt={person.name} className="object-cover w-32 h-32 mb-4 rounded-full" />
        <h3 className="text-lg font-bold">{person.name}</h3>
        <p className="text-sm font-medium text-brand-blue dark:text-brand-orange">{person.title}</p>
        {person.researchInterests && person.researchInterests.length > 0 && (
            <p className="mt-2 text-xs text-slate-600 dark:text-gray-400">{person.researchInterests.join(', ')}</p>
        )}
        <a href={`mailto:${person.email}`} className="flex items-center mt-3 text-sm text-slate-500 transition-colors dark:text-gray-300 hover:text-brand-blue dark:hover:text-brand-orange">
            <Mail size={14} className="mr-1" /> {person.email}
        </a>
    </motion.div>
);

const PeopleSection: React.FC<{ title: string; people: Person[] }> = ({ title, people }) => (
    <section className="mt-8 first:mt-0">
        <h2 className="mb-8 text-3xl font-bold text-center text-brand-blue dark:text-brand-orange">{title}</h2>
        <motion.div 
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            {...{
                variants: gridContainer,
                initial: "hidden",
                whileInView: "show",
                viewport: { once: true, amount: 0.1 }
            }}
        >
            {people.map((person) => (
                <PersonCard key={person.name} person={person} />
            ))}
        </motion.div>
    </section>
);


const PeoplePage: React.FC = () => {
    const { content } = useContent();
    const peopleData = content?.people;
    
    const categoryTitles: { [key in keyof PeopleContent]: string } = {
        faculty: 'Faculty',
        scientificStaff: 'Scientific Staff',
        technicalStaff: 'Technical Staff',
        administrativeStaff: 'Administrative Staff',
    };
    
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
                title="People" 
                subtitle="Our Team of Researchers and Innovators"
                image="https://picsum.photos/1200/400?random=13" 
            />
            <div className="container px-6 py-12 mx-auto">
                <Breadcrumbs items={[{ label: 'People' }]} />

                <div className="mt-8 space-y-16">
                    {peopleData && (Object.keys(peopleData) as Array<keyof PeopleContent>).map(key => 
                        (peopleData[key] && peopleData[key].length > 0) ? (
                            <PeopleSection 
                                key={key} 
                                title={categoryTitles[key]} 
                                people={peopleData[key]} 
                            />
                        ) : null
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default PeoplePage;