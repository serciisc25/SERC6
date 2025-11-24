
import React, { useState, useContext, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useContent } from '../contexts/ContentContext';
import type { NavLinkData } from '../types';
import { Menu, X, ChevronDown, ChevronRight, Sun, Moon, Search } from 'lucide-react';
import { ThemeContext } from '../App';
import { motion, AnimatePresence } from 'framer-motion';

// Recursive component for Desktop Menu Items
const DesktopMenuItem: React.FC<{ link: NavLinkData; isSubItem?: boolean; onClick?: () => void }> = ({ link, isSubItem = false, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    const hasSubLinks = link.subLinks && link.subLinks.length > 0;

    return (
        <div 
            className={`relative h-full ${isSubItem ? 'w-full' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {isSubItem ? (
                <NavLink
                    to={link.path}
                    className="flex items-center justify-between w-full px-4 py-2 text-sm text-slate-700 capitalize transition-colors duration-200 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    onClick={onClick}
                >
                    {link.name}
                    {hasSubLinks && <ChevronRight className="w-4 h-4 ml-1" />}
                </NavLink>
            ) : (
                <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                        `flex items-center h-full px-4 text-sm font-medium transition-colors duration-200 ${
                            isActive ? 'text-white bg-black/20' : 'text-gray-200 hover:bg-black/10'
                        }`
                    }
                    onClick={onClick}
                >
                    {link.name}
                    {hasSubLinks && <ChevronDown className="w-4 h-4 ml-1" />}
                </NavLink>
            )}

            <AnimatePresence>
            {hasSubLinks && isHovered && (
                <motion.div 
                    {...{
                        initial: { opacity: 0, y: isSubItem ? 0 : 10, x: isSubItem ? -10 : 0 },
                        animate: { opacity: 1, y: 0, x: 0 },
                        exit: { opacity: 0, y: isSubItem ? 0 : 10, x: isSubItem ? -10 : 0 },
                        transition: { duration: 0.2 }
                    }}
                    className={`absolute z-20 w-56 py-2 bg-white rounded-md shadow-xl dark:bg-slate-800 border border-slate-100 dark:border-slate-700 ${
                        isSubItem ? 'left-full top-0 mt-0' : 'left-0 mt-0'
                    }`}
                >
                    {link.subLinks?.map((subLink) => (
                        <DesktopMenuItem 
                            key={subLink.name} 
                            link={subLink} 
                            isSubItem={true}
                            onClick={onClick}
                        />
                    ))}
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
};


const MobileNavLink: React.FC<{ link: NavLinkData; onClick: () => void; level?: number }> = ({ link, onClick, level = 0 }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasSubLinks = link.subLinks && link.subLinks.length > 0;

    const handleToggle = (e: React.MouseEvent) => {
        if (hasSubLinks) {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(!isOpen);
        } else {
            onClick();
        }
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between">
                <Link
                    to={link.path}
                    onClick={handleToggle}
                    className={`flex items-center justify-between w-full py-2 text-slate-700 rounded-md dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-700 ${
                        level > 0 ? 'pl-' + (4 + level * 2) : 'px-4'
                    }`}
                    style={{ paddingLeft: level > 0 ? `${1 + level}rem` : '1rem' }}
                >
                    <span>{link.name}</span>
                    {hasSubLinks && <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
                </Link>
            </div>
            <AnimatePresence>
            {hasSubLinks && isOpen && (
                <motion.div 
                    {...{
                        initial: { height: 0, opacity: 0 },
                        animate: { height: 'auto', opacity: 1 },
                        exit: { height: 0, opacity: 0 },
                        transition: { duration: 0.3 }
                    }}
                    className="overflow-hidden"
                >
                    {link.subLinks?.map((subLink) => (
                        <MobileNavLink 
                            key={subLink.name} 
                            link={subLink} 
                            onClick={onClick} 
                            level={level + 1}
                        />
                    ))}
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
};

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    return (
        <button
            onClick={toggleTheme}
            className="p-2 text-slate-600 rounded-full dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none"
        >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
    );
};

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { content } = useContent();
    const navLinks = content?.navLinks || [];
    const [isScrolled, setIsScrolled] = useState(false);
    
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header 
            className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-lg' : ''}`}
        >
             <div className="bg-white dark:bg-slate-900">
                <div className="container flex items-center justify-between px-6 py-3 mx-auto">
                    <Link to="/" className="flex items-center space-x-3">
                        {/* You can replace this src with your own logo file path */}
                       <img src="/serclogo.png" alt="SERC Logo" className="h-16" />

                        <div>
                            <h1 className="text-base font-bold leading-tight text-gray-800 md:text-xl dark:text-white">Supercomputer Education and Research Centre</h1>
                            <p className="text-xs text-slate-600 md:text-sm dark:text-gray-300">Indian Institute of Science</p>
                        </div>
                    </Link>

                    <div className="flex items-center space-x-2 md:space-x-4">
                        <ThemeToggle />

                        <div className="items-center hidden space-x-4 md:flex">
                             <button className="p-2 text-slate-600 rounded-full dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-slate-700">
                                <Search size={18}/>
                            </button>
                            <img src="https://www.iisc.ac.in/wp-content/uploads/2020/08/IISc_Master_Seal_Black_Transparent.png" alt="IISc Logo" className="h-16"/>
                        </div>
                        
                        <div className="flex lg:hidden">
                            <button onClick={() => setIsOpen(!isOpen)} type="button" className="text-slate-500 dark:text-gray-200 hover:text-slate-600 dark:hover:text-gray-400 focus:outline-none" aria-label="toggle menu">
                                {!isOpen ? <Menu className="w-6 h-6" /> : <X className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="items-center justify-center hidden w-full h-12 lg:flex bg-brand-blue">
                {navLinks.map((link) => (
                    <DesktopMenuItem key={link.name} link={link} />
                ))}
            </nav>

            {/* Mobile Navigation */}
            <AnimatePresence>
            {isOpen && (
                <motion.div 
                    {...{
                        initial: { opacity: 0, y: -20 },
                        animate: { opacity: 1, y: 0 },
                        exit: { opacity: 0, y: -20 }
                    }}
                    className="absolute w-full shadow-lg lg:hidden bg-white dark:bg-slate-900/95 max-h-[80vh] overflow-y-auto"
                >
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <MobileNavLink key={link.name} link={link} onClick={() => setIsOpen(false)} />
                        ))}
                    </div>
                </motion.div>
            )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
