
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { AllContent, AllContentKey } from '../types';

interface ContentContextType {
    content: AllContent | null;
    loading: boolean;
    error: string | null;
    updateContentSection: <K extends AllContentKey>(section: K, data: AllContent[K]) => void;
    getOriginalContent: (section: AllContentKey) => Promise<any>;
    modifiedSections: AllContentKey[];
    resetAllChanges: () => void;
}

const ContentContext = createContext<ContentContextType>({
    content: null,
    loading: true,
    error: null,
    updateContentSection: () => console.warn('updateContentSection function not yet initialized'),
    getOriginalContent: () => Promise.reject('getOriginalContent function not yet initialized'),
    modifiedSections: [],
    resetAllChanges: () => console.warn('resetAllChanges function not yet initialized'),
});

export const useContent = () => useContext(ContentContext);

interface ContentProviderProps {
    children: ReactNode;
}

const fetchContent = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    return response.json();
}

const FILE_MAP: Record<AllContentKey, string> = {
    navLinks: './data/navLinks.json',
    heroSlides: './data/heroSlides.json',
    about: './data/about.json',
    researchAreas: './data/researchAreas.json',
    newsAndEvents: './data/newsAndEvents.json',
    infrastructures: './data/infrastructures.json',
    people: './data/people.json',
    courses: './data/courses.json',
    contact: './data/contact.json',
    systems: './data/systems.json',
    software: './data/software.json',
    services: './data/services.json',
};

export const ContentProvider: React.FC<ContentProviderProps> = ({ children }) => {
    const [content, setContent] = useState<AllContent | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [modifiedSections, setModifiedSections] = useState<AllContentKey[]>([]);

    useEffect(() => {
        const loadAllContent = async () => {
            try {
                const contentKeys = Object.keys(FILE_MAP) as AllContentKey[];
                const promises = contentKeys.map(key => fetchContent(FILE_MAP[key]));
                const results = await Promise.all(promises);
                
                const initialContent = contentKeys.reduce((acc, key, index) => {
                    acc[key] = results[index];
                    return acc;
                }, {} as AllContent);

                const customContentJSON = localStorage.getItem('customContent');
                const customContent = customContentJSON ? JSON.parse(customContentJSON) : {};

                setContent({ ...initialContent, ...customContent });
                setModifiedSections(Object.keys(customContent) as AllContentKey[]);

            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        loadAllContent();
    }, []);
    
    const updateContentSection = <K extends AllContentKey>(section: K, data: AllContent[K]) => {
        if (content) {
            // Update live content state
            const updatedContent = { ...content, [section]: data };
            setContent(updatedContent);

            // Update localStorage for persistence
            const customContentJSON = localStorage.getItem('customContent');
            const customContent = customContentJSON ? JSON.parse(customContentJSON) : {};
            customContent[section] = data;
            localStorage.setItem('customContent', JSON.stringify(customContent));
            
            // Update modified sections list
            if (!modifiedSections.includes(section)) {
                setModifiedSections([...modifiedSections, section]);
            }
        }
    };

    const getOriginalContent = async (section: AllContentKey): Promise<any> => {
        return fetchContent(FILE_MAP[section]);
    };

    const resetAllChanges = () => {
        if (window.confirm("Are you sure you want to discard all local changes? This will reload the page and revert to the original content.")) {
            localStorage.removeItem('customContent');
            window.location.reload();
        }
    };

    return (
        <ContentContext.Provider value={{ content, loading, error, updateContentSection, getOriginalContent, modifiedSections, resetAllChanges }}>
            {children}
        </ContentContext.Provider>
    );
};
