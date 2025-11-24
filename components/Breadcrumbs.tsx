
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';

interface BreadcrumbItem {
    label: string;
    path?: string;
}

interface BreadcrumbsProps {
    items?: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
    const location = useLocation();
    const { content } = useContent();
    const systems = content?.systems || {};

    let breadcrumbItems = items;

    // Auto-generate if not provided
    if (!breadcrumbItems) {
        const pathnames = location.pathname.split('/').filter((x) => x);
        breadcrumbItems = pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            
            // Try to get a friendly name from system data if it matches a key
            const systemKey = value.replace(/-(\w)/g, (_, c) => c.toUpperCase());
            let label = systems[systemKey]?.name || value.replace(/-/g, ' ');
            
            // Capitalize first letter of each word
            label = label.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));

            return {
                label: label,
                path: to,
            };
        });
    }

    return (
        <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3 flex-wrap">
                <li className="inline-flex items-center">
                    <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-700 hover:text-brand-blue dark:text-gray-400 dark:hover:text-white">
                        <Home className="w-4 h-4 mr-2.5" />
                        Home
                    </Link>
                </li>
                {breadcrumbItems.map((item, index) => {
                    const isLast = index === breadcrumbItems!.length - 1;
                    return (
                        <li key={index}>
                            <div className="flex items-center">
                                <ChevronRight className="w-6 h-6 text-slate-400 flex-shrink-0" />
                                {item.path && !isLast ? (
                                    <Link to={item.path} className="ml-1 text-sm font-medium text-slate-700 hover:text-brand-blue md:ml-2 dark:text-gray-400 dark:hover:text-white">
                                        {item.label}
                                    </Link>
                                ) : (
                                    <span className="ml-1 text-sm font-medium text-slate-500 md:ml-2 dark:text-gray-400">{item.label}</span>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
