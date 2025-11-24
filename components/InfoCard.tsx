
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Icon } from './Icon';

interface InfoCardProps {
    title: string;
    icon?: string;
    children: React.ReactNode;
    footerLink?: {
        text: string;
        path: string;
    };
}

const InfoCard: React.FC<InfoCardProps> = ({ title, icon, children, footerLink }) => {
    return (
        <div className="flex flex-col overflow-hidden bg-white border rounded-lg shadow-md dark:bg-slate-800 dark:border-slate-700">
            <div className="flex items-center px-4 py-3 bg-brand-blue">
                {icon && <Icon name={icon} className="w-5 h-5 mr-3 text-white" />}
                <h3 className="text-lg font-bold text-white">{title}</h3>
            </div>
            <div className="flex-grow p-6">
                {children}
            </div>
            {footerLink && (
                <div className="px-6 py-4 mt-auto text-right border-t border-slate-200 dark:border-slate-700">
                    <Link to={footerLink.path} className="inline-flex items-center text-sm font-semibold text-brand-blue dark:text-brand-orange hover:underline">
                        {footerLink.text} <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>
            )}
        </div>
    );
};

export default InfoCard;
