import React, { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring, animate } from 'framer-motion';
import { useContent } from '../contexts/ContentContext';
import { Users, Cpu, Dna, FlaskConical } from 'lucide-react';

interface Stat {
    icon: React.ElementType;
    value: number;
    label: string;
}

const AnimatedCounter: React.FC<{ value: number }> = ({ value }) => {
    const count = useMotionValue(0);
    const rounded = useSpring(count, { stiffness: 100, damping: 30 });
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        if (inView) {
            const animation = animate(count, value, {
                duration: 2,
                ease: "easeOut",
            });
            return animation.stop;
        }
    }, [inView, value, count]);

    useEffect(() => {
        const unsubscribe = rounded.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Math.round(latest).toLocaleString();
            }
        });
        return () => unsubscribe();
    }, [rounded]);

    return <span ref={ref}>0</span>;
};

const StatsCounter: React.FC = () => {
    const { content } = useContent();
    const facultyCount = content?.people?.faculty.length || 0;
    const researchAreaCount = content?.researchAreas.length || 0;

    const stats: Stat[] = [
        { icon: Users, value: facultyCount, label: 'Faculty Members' },
        { icon: Cpu, value: 1, label: 'Petascale Supercomputer' },
        { icon: FlaskConical, value: 50, label: 'Ongoing Projects' }, // Hardcoded
        { icon: Dna, value: researchAreaCount, label: 'Research Areas' },
    ];

    return (
        <div className="py-16 bg-brand-light dark:bg-slate-800">
            <div className="container px-6 mx-auto">
                <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <stat.icon className="w-12 h-12 mb-2 text-brand-orange" />
                            <p className="text-4xl font-bold text-brand-blue dark:text-white font-poppins">
                                <AnimatedCounter value={stat.value} />+
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-600 dark:text-gray-300">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StatsCounter;
