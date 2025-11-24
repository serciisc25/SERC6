import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import PageBanner from '../components/PageBanner';
import { useContent } from '../contexts/ContentContext';
import { motion, Variants } from 'framer-motion';
import { Code, Server, ExternalLink, Monitor, Wifi, Info, Image as ImageIcon, CheckCircle } from 'lucide-react';
import NotFoundPage from './NotFoundPage';
import type { SoftwareItem, DetailSection } from '../types';

const slugify = (str: string) => str.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

const sectionAnimation: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      staggerChildren: 0.2
    }
  }
};

const itemAnimation: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

// --- Helper Components for Detail View ---

const ImagePlaceholder: React.FC<{ caption: string }> = ({ caption }) => (
    <div className="flex flex-col items-center justify-center w-full p-8 my-6 border-2 border-dashed rounded-lg bg-slate-100 border-slate-300 dark:bg-slate-800 dark:border-slate-600">
        <ImageIcon className="w-12 h-12 mb-3 text-slate-400" />
        <span className="text-sm font-medium text-slate-500 dark:text-gray-400">{caption}</span>
        <span className="text-xs text-slate-400">(Image will be inserted here)</span>
    </div>
);

const ParsedText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
    // Split by markdown-style bold (**text**) or links ([text](url))
    const parts = text.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
    return (
        <span className={className}>
            {parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i} className="font-bold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
                }
                const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
                if (linkMatch) {
                    return <a key={i} href={linkMatch[2]} className="text-brand-blue dark:text-brand-orange hover:underline">{linkMatch[1]}</a>;
                }
                return part;
            })}
        </span>
    );
};

const renderIcon = (iconName?: string, className?: string) => {
    switch(iconName) {
        case 'Wifi': return <Wifi className={className} />;
        case 'Monitor': return <Monitor className={className} />;
        case 'Info': return <Info className={className} />;
        default: return null;
    }
}

// --- Generic Renderer for JSON Sections ---
const GenericSectionRenderer: React.FC<{ section: DetailSection }> = ({ section }) => {
    const containerClass = "p-8 bg-white border rounded-lg shadow-sm border-slate-200 dark:bg-slate-800 dark:border-slate-700 mb-8";
    
    switch (section.type) {
        case 'text':
            return (
                <div className={containerClass}>
                    {section.title && <h2 className="mb-4 text-2xl font-bold text-brand-blue dark:text-brand-orange">{section.title}</h2>}
                    <div className="space-y-4 text-slate-700 dark:text-gray-300">
                        {section.content && section.content.split('\n').map((line, i) => (
                           line.trim() ? <p key={i}><ParsedText text={line} /></p> : <br key={i} />
                        ))}
                        {section.list && (
                            <ul className="space-y-2 list-disc list-inside">
                                {section.list.map((item, i) => (
                                    <li key={i}><ParsedText text={item} /></li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            );

        case 'table':
            return (
                <div className={containerClass}>
                     {section.title && <h2 className="mb-6 text-2xl font-bold text-brand-blue dark:text-brand-orange">{section.title}</h2>}
                     <div className="overflow-hidden border rounded-lg border-slate-200 dark:border-slate-700">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                            <thead className="bg-slate-50 dark:bg-slate-900">
                                <tr>
                                    {section.headers?.map((h, i) => (
                                        <th key={i} className="px-6 py-3 text-xs font-bold tracking-wider text-left uppercase text-slate-500 dark:text-gray-400">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200 dark:bg-slate-800 dark:divide-slate-700">
                                {section.rows?.map((row, idx) => (
                                    <tr key={idx}>
                                        {row.map((cell, cellIdx) => (
                                            <td key={cellIdx} className="px-6 py-4 text-slate-700 dark:text-gray-300">
                                                <span className={`flex items-center ${cell.color ? `text-${cell.color}-600 dark:text-${cell.color}-400` : ''} ${cell.bold ? 'font-bold' : ''}`}>
                                                    {cell.icon && renderIcon(cell.icon, "w-4 h-4 mr-2")}
                                                    {cell.text}
                                                </span>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {section.note && (
                        <div className="p-4 mt-4 text-sm text-blue-800 border border-blue-200 rounded-md bg-blue-50 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-200">
                            <strong>Note:</strong> <ParsedText text={section.note} />
                        </div>
                    )}
                </div>
            );

        case 'steps':
            return (
                <div className={containerClass}>
                    {section.title && <h2 className="mb-6 text-2xl font-bold text-brand-blue dark:text-brand-orange">{section.title}</h2>}
                    {section.intro && <p className="mb-4 font-semibold text-slate-800 dark:text-gray-200"><ParsedText text={section.intro} /></p>}
                    
                    {section.buttons && (
                        <div className="flex flex-wrap gap-4 mb-8">
                            {section.buttons.map((btn, i) => (
                                <a key={i} href={btn.url} className={`flex items-center px-6 py-3 text-sm font-bold text-white transition-colors rounded-md shadow-sm ${
                                    btn.color === 'green' ? 'bg-green-600 hover:bg-green-700' : 
                                    btn.color === 'orange' ? 'bg-brand-orange hover:bg-brand-orange/90' : 
                                    'bg-brand-blue hover:bg-brand-blue/90'
                                }`}>
                                    <ExternalLink className="w-4 h-4 mr-2" /> {btn.label}
                                </a>
                            ))}
                        </div>
                    )}

                    {section.steps && (
                        <ol className="space-y-4 list-decimal list-inside text-slate-700 dark:text-gray-300">
                            {section.steps.map((step, i) => (
                                <li key={i} className="pl-2"><ParsedText text={step} /></li>
                            ))}
                        </ol>
                    )}

                    {section.images && section.images.map((img, i) => (
                        <ImagePlaceholder key={i} caption={img.caption} />
                    ))}

                    {section.note && (
                        <div className="p-4 mt-6 text-sm text-yellow-800 border border-yellow-200 rounded-md bg-yellow-50 dark:bg-yellow-900/30 dark:border-yellow-700 dark:text-yellow-200">
                            <strong>Important:</strong> <ParsedText text={section.note} />
                        </div>
                    )}
                </div>
            );

        case 'grid':
            return (
                <div className={containerClass}>
                    <div className="flex flex-col justify-between mb-6 md:flex-row md:items-center">
                        {section.title && <h2 className="text-2xl font-bold text-brand-blue dark:text-brand-orange">{section.title}</h2>}
                        {section.gridLink && (
                            <Link to={section.gridLink.url} className="mt-2 text-sm font-medium text-brand-orange hover:underline md:mt-0">
                                {section.gridLink.text} &rarr;
                            </Link>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                        {section.gridItems?.map((item, idx) => (
                            <div key={idx} className="flex items-center p-3 text-sm font-medium transition-colors border rounded-md text-slate-700 bg-slate-50 border-slate-200 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300 hover:border-brand-blue dark:hover:border-brand-orange">
                                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            );
            
        default:
            return null;
    }
}

const SoftwarePage: React.FC = () => {
    const { softwareId } = useParams<{ softwareId: string }>();
    const { content } = useContent();
    const softwareCategories = content?.software || [];

    // =========================================================================
    // Detail View Logic: Renders if softwareId is present in URL
    // =========================================================================
    if (softwareId) {
        let softwareItem: SoftwareItem | null = null;
        let categoryName: string | null = null;

        if (content?.software) {
            for (const category of content.software) {
                const foundItem = category.items.find(item => slugify(item.name) === softwareId);
                if (foundItem) {
                    softwareItem = foundItem;
                    categoryName = category.name;
                    break;
                }
            }
        }

        if (!content) return null;
        if (!softwareItem) return <NotFoundPage />;

        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                <PageBanner 
                    title={softwareItem.detailsPageTitle || softwareItem.name}
                    subtitle={categoryName || 'Software Details'}
                />
                <div className="container px-6 py-12 mx-auto md:py-16">
                    <div className="max-w-5xl mx-auto">
                        <Breadcrumbs items={[
                            { label: 'Software', path: '/software' },
                            { label: softwareItem.name }
                        ]} />

                        <motion.article
                            className="mt-12"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            {softwareItem.sections && softwareItem.sections.length > 0 ? (
                                // ------------------------------------------
                                // Case 1: RICH JSON CONTENT
                                // Renders dynamic sections defined in software.json
                                // ------------------------------------------
                                softwareItem.sections.map((section, index) => (
                                    <GenericSectionRenderer key={index} section={section} />
                                ))
                            ) : (
                                // ------------------------------------------
                                // Case 2: DEFAULT FALLBACK CONTENT
                                // Renders standard layout if no sections are defined
                                // ------------------------------------------
                                <>
                                    <div className="p-8 border rounded-lg bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                                        <div className="flex items-center mb-4">
                                            <Code className="w-8 h-8 mr-4 text-brand-blue dark:text-brand-orange" />
                                            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">{softwareItem.name}</h2>
                                        </div>
                                        {softwareItem.version && (
                                            <p className="mb-6 text-sm font-medium text-slate-500 dark:text-gray-400">
                                                Version: <span className="px-2 py-1 rounded-full bg-slate-200 dark:bg-slate-700">{softwareItem.version}</span>
                                            </p>
                                        )}
                                        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-gray-300">
                                            <p>{softwareItem.description}</p>
                                        </div>
                                    </div>

                                    <div className="p-6 mt-8 rounded-lg bg-brand-light dark:bg-slate-800/50">
                                        <h3 className="flex items-center text-xl font-semibold text-brand-blue dark:text-brand-orange">
                                            <Server className="w-5 h-5 mr-3" />
                                            Availability
                                        </h3>
                                        <p className="mt-2 text-slate-600 dark:text-gray-300">
                                            This software is available on most SERC HPC systems. To use it, you may need to load the appropriate module. For specific instructions, please refer to the user guides for the system you are using or contact the helpdesk.
                                        </p>
                                    </div>
                                </>
                            )}
                        </motion.article>
                    </div>
                </div>
            </motion.div>
        );
    }

    // =========================================================================
    // List View Logic: Renders if no softwareId
    // =========================================================================
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <PageBanner 
                title="Software" 
                subtitle="A Comprehensive Suite of Tools for Research"
                image="https://picsum.photos/1200/400?random=18" 
            />
            <div className="container px-6 py-12 mx-auto">
                <Breadcrumbs items={[{ label: 'Software' }]} />

                <div className="mt-8 space-y-16">
                    {softwareCategories.map((category) => (
                        <motion.section 
                            key={category.id}
                            id={category.id}
                            variants={sectionAnimation}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                        >
                            <div className="flex items-center mb-6">
                                <Code className="w-8 h-8 mr-3 text-brand-blue dark:text-brand-orange"/>
                                <h2 className="text-3xl font-bold text-brand-blue dark:text-brand-orange">{category.name}</h2>
                            </div>
                            <motion.div variants={itemAnimation} className="overflow-x-auto">
                                <div className="min-w-full overflow-hidden border border-slate-200 rounded-lg shadow-md dark:border-slate-700">
                                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                        <thead className="bg-slate-50 dark:bg-slate-800">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-xs font-bold tracking-wider text-left uppercase text-slate-600 dark:text-gray-300">Software</th>
                                                <th scope="col" className="px-6 py-3 text-xs font-bold tracking-wider text-left uppercase text-slate-600 dark:text-gray-300">Version</th>
                                                <th scope="col" className="px-6 py-3 text-xs font-bold tracking-wider text-left uppercase text-slate-600 dark:text-gray-300">Description</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-slate-200 dark:bg-slate-900 dark:divide-slate-700">
                                            {category.items.map((item) => (
                                                <tr key={item.name}>
                                                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-slate-900 dark:text-white">
                                                        <Link to={`/software/${slugify(item.name)}`} className="hover:text-brand-blue dark:hover:text-brand-orange hover:underline">
                                                            {item.name}
                                                        </Link>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-500 dark:text-gray-400">{item.version || 'N/A'}</td>
                                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-gray-300">{item.description}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        </motion.section>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default SoftwarePage;