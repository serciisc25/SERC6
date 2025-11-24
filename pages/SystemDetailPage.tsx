
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useContent } from '../contexts/ContentContext';
import Breadcrumbs from '../components/Breadcrumbs';
import { motion } from 'framer-motion';
import NotFoundPage from './NotFoundPage';
import { Server, Cpu, HardDrive, Code, Terminal, AlertTriangle, Layers, List } from 'lucide-react';

const SystemDetailPage: React.FC = () => {
    const { systemId } = useParams<{ systemId: string }>();
    const { content } = useContent();

    // Convert systemId from URL-friendly format to camelCase key
    const systemKey = systemId?.replace(/-(\w)/g, (_, c) => c.toUpperCase());
    
    const system = systemKey ? content?.systems[systemKey] : undefined;

    if (!content || !system) {
        return content === null ? null : <NotFoundPage />;
    }

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 180;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Hero Section */}
            <div className="relative py-24 text-white bg-center bg-cover md:py-32" style={{backgroundImage: `url(${system.image})`}}>
                <div className="absolute inset-0 bg-black bg-opacity-60"></div>
                <div className="container relative px-6 mx-auto text-center">
                    <h1 className="text-4xl font-bold leading-tight md:text-6xl font-poppins">{system.name}</h1>
                    <p className="mt-4 text-lg md:text-xl text-gray-300">Technical Specifications & Overview</p>
                </div>
            </div>

            <div className="container px-6 py-12 mx-auto md:py-16">
                <div className="max-w-7xl mx-auto">
                    <Breadcrumbs items={[{ label: 'Systems', path: `/systems/${systemId}` }, { label: system.name }]} />

                    <div className="grid grid-cols-1 gap-4 mt-12 lg:grid-cols-[150px_1fr_150px]">
                         {/* Table of Contents - Desktop/Mobile */}
                         <div className="lg:col-start-1">
                            <div className="sticky top-[180px] p-5 bg-white border rounded-lg shadow-sm border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                                <div className="flex items-left mb-1">
                                    <List className="w-5 h-5 mr-2 text-brand-blue dark:text-brand-orange"/>
                                    <h3 className="font-bold text-slate-800 dark:text-white">Table of Contents</h3>
                                </div>
                                <nav className="space-y-2 text-sm">
                                    <button onClick={() => scrollToSection('overview')} className="block text-left text-slate-600 hover:text-brand-blue dark:text-gray-400 dark:hover:text-brand-orange">1. Overview</button>
                                    {system.hardwareArchitecture && (
                                        <button onClick={() => scrollToSection('hardware')} className="block text-left text-slate-600 hover:text-brand-blue dark:text-gray-400 dark:hover:text-brand-orange">2. Hardware Architecture</button>
                                    )}
                                    <button onClick={() => scrollToSection('specs')} className="block text-left text-slate-600 hover:text-brand-blue dark:text-gray-400 dark:hover:text-brand-orange">{system.hardwareArchitecture ? '3' : '2'}. Specifications</button>
                                    <button onClick={() => scrollToSection('policy')} className="block text-left text-slate-600 hover:text-brand-blue dark:text-gray-400 dark:hover:text-brand-orange">{system.hardwareArchitecture ? '4' : '3'}. Usage Policy</button>
                                    {system.softwareOverview && (
                                        <button onClick={() => scrollToSection('software')} className="block text-left text-slate-600 hover:text-brand-blue dark:text-gray-400 dark:hover:text-brand-orange">{system.hardwareArchitecture ? '5' : '4'}. Software</button>
                                    )}
                                    {system.jobSubmissionGuide && (
                                        <button onClick={() => scrollToSection('guide')} className="block text-left text-slate-600 hover:text-brand-blue dark:text-gray-400 dark:hover:text-brand-orange">{system.hardwareArchitecture ? (system.softwareOverview ? '6' : '5') : (system.softwareOverview ? '5' : '4')}. Job Guide</button>
                                    )}
                                </nav>
                            </div>
                         </div>

                        <div className="lg:col-start-2 space-y-12 min-w-0">
                            {/* Overview Section */}
                            <motion.section
                                id="overview"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.6 }}
                                className="scroll-mt-[180px]"
                            >
                                <div className="flex items-center mb-24">
                                    <Server className="w-8 h-8 mr-3 text-brand-blue dark:text-brand-orange" />
                                    <h2 className="text-3xl font-bold text-brand-blue dark:text-brand-orange">Overview</h2>
                                </div>
                                <div className="text-lg leading-relaxed text-slate-700 dark:text-gray-300 space-y-4" >
                                    {system.overview.split('\n').map((paragraph, index) => (
                                        paragraph.trim() && <p key={index}>{paragraph}</p>
                                    ))}
                                </div>
                            </motion.section>

                             {/* Hardware Architecture Section */}
                            {system.hardwareArchitecture && (
                                <motion.section
                                    id="hardware"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.6 }}
                                    className="scroll-mt-[180px]"
                                >
                                    <div className="flex items-center mb-6">
                                        <Layers className="w-8 h-8 mr-3 text-brand-blue dark:text-brand-orange" />
                                        <h2 className="text-3xl font-bold text-brand-blue dark:text-brand-orange">{system.hardwareArchitecture.title}</h2>
                                    </div>
                                    <div className="grid gap-6 md:grid-cols-2">
                                        {system.hardwareArchitecture.nodes.map((node, index) => (
                                            <div key={index} className={`p-6 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 ${node.name === 'Interconnection' ? 'md:col-span-2' : ''}`}>
                                                <h3 className="mb-3 text-lg font-bold text-slate-800 dark:text-white">{node.name}</h3>
                                                <ul className="space-y-2 list-disc list-inside text-slate-700 dark:text-gray-300">
                                                    {node.specs.map((spec, i) => (
                                                        <li key={i} className="text-sm leading-relaxed">{spec}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </motion.section>
                            )}

                            {/* Specifications Section (Summary) */}
                            <motion.section
                                id="specs"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.6 }}
                                className="scroll-mt-[180px]"
                            >
                                <div className="flex items-center mb-6">
                                    <Cpu className="w-8 h-8 mr-3 text-brand-blue dark:text-brand-orange" />
                                    <h2 className="text-3xl font-bold text-brand-blue dark:text-brand-orange">System Highlights</h2>
                                </div>
                                <div className="overflow-hidden bg-white border border-slate-200 rounded-lg shadow-md dark:bg-slate-800 dark:border-slate-700">
                                    <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                                        {system.specifications.map((spec, index) => (
                                            <li key={index} className="px-6 py-4 grid grid-cols-3 gap-4">
                                                <dt className="text-sm font-medium text-slate-600 dark:text-gray-400 col-span-1">{spec.label}</dt>
                                                <dd className="text-sm text-slate-900 dark:text-white col-span-2">{spec.value}</dd>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.section>

                            {/* Usage Policy Section */}
                             <motion.section
                                id="policy"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.6 }}
                                className="scroll-mt-[180px]"
                            >
                                <div className="flex items-center mb-4">
                                    <HardDrive className="w-8 h-8 mr-3 text-brand-blue dark:text-brand-orange" />
                                    <h2 className="text-3xl font-bold text-brand-blue dark:text-brand-orange">Usage Policy</h2>
                                </div>
                                <div className="text-lg leading-relaxed text-slate-700 dark:text-gray-300 space-y-4">
                                     {system.usagePolicy.split('\n').map((paragraph, index) => (
                                        paragraph.trim() && <p key={index}>{paragraph}</p>
                                    ))}
                                </div>
                            </motion.section>

                            {/* Software Overview Section */}
                            {system.softwareOverview && (
                                <motion.section
                                    id="software"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.6 }}
                                    className="scroll-mt-[180px]"
                                >
                                    <div className="flex items-center mb-4">
                                        <Code className="w-8 h-8 mr-3 text-brand-blue dark:text-brand-orange" />
                                        <h2 className="text-3xl font-bold text-brand-blue dark:text-brand-orange">Software</h2>
                                    </div>
                                    <div className="p-6 rounded-lg bg-brand-light dark:bg-slate-800/50">
                                        <p className="mb-4 text-lg font-medium text-slate-800 dark:text-white">{system.softwareOverview.os}</p>
                                        <div className="flex flex-wrap gap-4">
                                            {system.softwareOverview.links.map(link => (
                                                <Link 
                                                    key={link.name} 
                                                    to={link.path} 
                                                    className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white transition-colors rounded-md bg-brand-blue hover:bg-brand-blue/90 dark:bg-brand-orange dark:text-brand-blue dark:hover:bg-brand-orange/90"
                                                >
                                                    {link.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </motion.section>
                            )}

                            {/* Job Submission Guide Section */}
                            {system.jobSubmissionGuide && (
                                 <motion.section
                                    id="guide"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.6 }}
                                    className="scroll-mt-[180px]"
                                >
                                    <div className="flex items-center mb-6">
                                        <Terminal className="w-8 h-8 mr-3 text-brand-blue dark:text-brand-orange" />
                                        <h2 className="text-3xl font-bold text-brand-blue dark:text-brand-orange">{system.jobSubmissionGuide.title}</h2>
                                    </div>
                                    <div className="space-y-8">
                                        {system.jobSubmissionGuide.sections.map((section, index) => (
                                            <div key={index} className={section.isNote ? "p-6 rounded-lg bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-500/30" : ""}>
                                                <h3 className={`flex items-center text-xl font-semibold mb-3 ${section.isNote ? "text-yellow-800 dark:text-yellow-200" : "text-slate-800 dark:text-gray-200"}`}>
                                                    {section.isNote && <AlertTriangle className="w-5 h-5 mr-2" />}
                                                    {section.title}
                                                </h3>
                                                <div className={`space-y-3 text-slate-700 dark:text-gray-300 ${section.isNote ? "text-yellow-700 dark:text-yellow-300" : ""}`}>
                                                    {section.content.map((text, i) => (
                                                        text.startsWith('ssh') ? (
                                                            <pre key={i} className="p-3 my-2 text-sm text-white rounded-md bg-slate-800 dark:bg-black overflow-x-auto"><code>{text}</code></pre>
                                                        ) : (
                                                            <p key={i} dangerouslySetInnerHTML={{ __html: text.replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 text-sm bg-slate-200 dark:bg-slate-700 rounded">$&</code>').replace(/`/g, '') }} />
                                                        )
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.section>
                            )}
                        </div>

                        {/* Right Spacer to force centering of content */}
                        <div className="hidden lg:block lg:col-start-3"></div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default SystemDetailPage;
