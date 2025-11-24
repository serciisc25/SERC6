import React, { useState, Fragment, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageBanner from '../components/PageBanner';
import { useContent } from '../contexts/ContentContext';
import type { NewsEvent, HeroSlide, NavLinkData, AboutContent, AllContentKey, ManagedImage } from '../types';
import { Trash2, Download, PlusCircle, Edit, ChevronsUpDown, SlidersHorizontal, BarChart, Navigation, Info, Newspaper, Save, RotateCcw, AlertTriangle, Image, UploadCloud, Copy } from 'lucide-react';

// Reusable Form components
const Input = (props: React.ComponentProps<'input'>) => (
    <input {...props} className="w-full px-3 py-2 mt-1 border border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600 focus:ring-brand-blue focus:border-brand-blue" />
);

const Textarea = (props: React.ComponentProps<'textarea'>) => (
    <textarea {...props} className="w-full px-3 py-2 mt-1 border border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600 focus:ring-brand-blue focus:border-brand-blue" />
);

const Label = (props: React.ComponentProps<'label'>) => (
    <label {...props} className="block text-sm font-medium text-slate-700 dark:text-gray-300" />
);


// #region Image Management
const IMAGE_STORAGE_KEY = 'serc-image-library';

const getImagesFromStorage = (): ManagedImage[] => {
    try {
        const storedImages = localStorage.getItem(IMAGE_STORAGE_KEY);
        return storedImages ? JSON.parse(storedImages) : [];
    } catch (e) {
        console.error("Failed to parse images from localStorage", e);
        return [];
    }
};

const saveImagesToStorage = (images: ManagedImage[]) => {
    localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(images));
};


const ImagePickerModal: React.FC<{isOpen: boolean, onClose: () => void, onSelect: (src: string) => void}> = ({ isOpen, onClose, onSelect }) => {
    const [images, setImages] = useState<ManagedImage[]>([]);

    useEffect(() => {
        if(isOpen) {
            setImages(getImagesFromStorage());
        }
    }, [isOpen]);
    
    if(!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
            <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-xl dark:bg-slate-800 max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-semibold">Select an Image</h3>
                <div className="flex-grow mt-4 -mx-2 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4 p-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {images.length > 0 ? images.map(img => (
                            <div key={img.id} className="cursor-pointer group" onClick={() => {onSelect(img.src); onClose();}}>
                                <img src={img.src} alt={img.name} className="object-cover w-full rounded-md aspect-square ring-2 ring-transparent group-hover:ring-brand-blue" />
                                <p className="mt-1 text-xs text-center truncate text-slate-600 dark:text-gray-400">{img.name}</p>
                            </div>
                        )) : <p className="col-span-full text-center text-slate-500">No images in library. Upload images in the 'Image Library' tab.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ManageImages: React.FC = () => {
    const [images, setImages] = useState<ManagedImage[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setImages(getImagesFromStorage());
    }, []);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        // FIX: Explicitly cast Array.from result to File[] to avoid 'unknown' type errors on 'file'
        for (const file of Array.from(files) as File[]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newImage: ManagedImage = {
                    id: `${file.name}-${Date.now()}`,
                    name: file.name,
                    src: reader.result as string
                };
                setImages(prev => {
                    const updated = [newImage, ...prev];
                    saveImagesToStorage(updated);
                    return updated;
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this image?")) {
            setImages(prev => {
                const updated = prev.filter(img => img.id !== id);
                saveImagesToStorage(updated);
                return updated;
            });
        }
    };

    const handleCopy = (src: string) => {
        navigator.clipboard.writeText(src).then(() => {
            alert("Image URL (Base64) copied to clipboard!");
        });
    };

    return (
         <div>
            <h2 className="mb-6 text-2xl font-bold text-brand-blue dark:text-brand-orange">Image Library</h2>
             <div className="p-4 mb-6 border border-dashed rounded-lg dark:border-slate-600">
                <input type="file" multiple accept="image/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                 <button onClick={() => fileInputRef.current?.click()} className="w-full flex flex-col items-center justify-center py-6 text-center bg-slate-50 dark:bg-slate-700/50 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">
                    <UploadCloud className="w-10 h-10 mb-2 text-brand-blue dark:text-brand-orange"/>
                    <span className="font-semibold">Click to upload images</span>
                    <span className="text-xs text-slate-500">PNG, JPG, GIF, WebP</span>
                </button>
            </div>
             <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {images.map(img => (
                    <div key={img.id} className="relative overflow-hidden border rounded-lg group dark:border-slate-700">
                        <img src={img.src} alt={img.name} className="object-cover w-full aspect-square"/>
                        <div className="absolute bottom-0 left-0 right-0 p-2 text-white bg-gradient-to-t from-black/80 to-transparent">
                            <p className="text-xs font-semibold truncate">{img.name}</p>
                            <div className="flex justify-end mt-1 space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleCopy(img.src)} className="p-1.5 bg-black/50 rounded-full hover:bg-black/70"><Copy size={12}/></button>
                                <button onClick={() => handleDelete(img.id)} className="p-1.5 bg-black/50 rounded-full hover:bg-black/70"><Trash2 size={12}/></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
             {images.length === 0 && <p className="py-12 text-center text-slate-500">Your image library is empty. Upload some images to get started.</p>}
        </div>
    );
};

// #endregion


// #region Manager Components

/**
 * ManageHero Component: Handles CRUD for Hero Carousel slides.
 */
const ManageHero: React.FC = () => {
    const { content, updateContentSection } = useContent();
    const [slides, setSlides] = useState<HeroSlide[]>(content?.heroSlides || []);
    const [editingSlide, setEditingSlide] = useState<HeroSlide | Partial<HeroSlide>>({});
    const [isEditing, setIsEditing] = useState(false);
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    const handleSave = () => {
        let updatedSlides;
        if (isEditing) {
            updatedSlides = slides.map(s => s.title === (editingSlide as HeroSlide).title ? editingSlide as HeroSlide : s);
        } else {
            updatedSlides = [...slides, editingSlide as HeroSlide];
        }
        setSlides(updatedSlides);
        updateContentSection('heroSlides', updatedSlides);
        setEditingSlide({});
        setIsEditing(false);
    };

    const handleDelete = (title: string) => {
        const updatedSlides = slides.filter(s => s.title !== title);
        setSlides(updatedSlides);
        updateContentSection('heroSlides', updatedSlides);
    };
    
    return (
        <div>
            <h2 className="mb-6 text-2xl font-bold text-brand-blue dark:text-brand-orange">Manage Hero Slides</h2>
            <div className="p-6 mb-6 space-y-4 border rounded-lg dark:border-slate-700">
                 <h3 className="text-lg font-semibold">{isEditing ? 'Edit Slide' : 'Add New Slide'}</h3>
                 <img src={editingSlide.image} className={`w-32 h-20 object-cover rounded-md bg-slate-200 dark:bg-slate-700 ${!editingSlide.image && 'hidden'}`} alt="Preview"/>
                 <div className="flex gap-2">
                    <Input placeholder="Image URL" value={editingSlide.image || ''} onChange={e => setEditingSlide({...editingSlide, image: e.target.value })}/>
                    <button onClick={() => setIsPickerOpen(true)} className="px-3 py-2 text-sm font-semibold transition-colors rounded-md bg-slate-200 dark:bg-slate-600 hover:bg-slate-300">Library</button>
                 </div>
                 <Input placeholder="Title" value={editingSlide.title || ''} onChange={e => setEditingSlide({...editingSlide, title: e.target.value })}/>
                 <Textarea placeholder="Subtitle" value={editingSlide.subtitle || ''} onChange={e => setEditingSlide({...editingSlide, subtitle: e.target.value })}/>
                 <button onClick={handleSave} className="px-4 py-2 font-semibold text-white transition-colors rounded-md bg-brand-blue hover:bg-brand-blue/90">{isEditing ? 'Update Slide' : 'Add Slide'}</button>
                 { (isEditing || Object.keys(editingSlide).length > 0) && <button onClick={() => {setEditingSlide({}); setIsEditing(false);}} className="ml-2 px-4 py-2 font-semibold transition-colors rounded-md bg-slate-200 dark:bg-slate-600 hover:bg-slate-300">Cancel</button> }
            </div>
            <div className="space-y-4">
                {slides.map(slide => (
                    <div key={slide.title} className="flex items-center justify-between p-3 bg-slate-100 rounded-md dark:bg-slate-800">
                        <div className="flex items-center">
                            <img src={slide.image} className="w-16 h-10 mr-4 object-cover rounded-md" alt={slide.title}/>
                            <div>
                                <p className="font-semibold">{slide.title}</p>
                                <p className="text-sm text-slate-500">{slide.subtitle}</p>
                            </div>
                        </div>
                        <div className="space-x-2">
                           <button onClick={() => {setEditingSlide(slide); setIsEditing(true);}} className="p-2 text-blue-600 rounded-full hover:bg-blue-100 dark:hover:bg-slate-700"><Edit size={16}/></button>
                           <button onClick={() => handleDelete(slide.title)} className="p-2 text-red-600 rounded-full hover:bg-red-100 dark:hover:bg-slate-700"><Trash2 size={16}/></button>
                        </div>
                    </div>
                ))}
            </div>
            <ImagePickerModal isOpen={isPickerOpen} onClose={() => setIsPickerOpen(false)} onSelect={src => setEditingSlide(prev => ({...prev, image: src}))} />
        </div>
    );
};

/**
 * ManageNav Component: Handles CRUD for Navigation links.
 */
const ManageNav: React.FC = () => {
    const { content, updateContentSection } = useContent();
    const [navLinks, setNavLinks] = useState<NavLinkData[]>(content?.navLinks || []);

    const updateLink = (path: string, newLinkData: Partial<NavLinkData>, parentPath?: string) => {
        const update = (links: NavLinkData[]): NavLinkData[] => {
            return links.map(link => {
                if (link.path === path) return { ...link, ...newLinkData };
                if (link.subLinks) return { ...link, subLinks: update(link.subLinks) };
                return link;
            });
        };
        const updatedNavLinks = update(navLinks);
        setNavLinks(updatedNavLinks);
        updateContentSection('navLinks', updatedNavLinks);
    };
    
    // Simplified: for this demo, we'll just edit name and path
    const handleEdit = (link: NavLinkData) => {
        const newName = prompt("Enter new link name:", link.name);
        const newPath = prompt("Enter new link path:", link.path);
        if (newName && newPath) {
            updateLink(link.path, { name: newName, path: newPath });
        }
    };
    
    return (
        <div>
            <h2 className="mb-6 text-2xl font-bold text-brand-blue dark:text-brand-orange">Manage Navigation</h2>
            <div className="p-4 space-y-2 border rounded-lg dark:border-slate-700">
                {navLinks.map(link => (
                    <div key={link.path}>
                        <div className="flex items-center justify-between p-2 bg-slate-100 rounded-md dark:bg-slate-800">
                            <p className="font-semibold">{link.name} ({link.path})</p>
                            <button onClick={() => handleEdit(link)} className="p-2 text-blue-600 rounded-full hover:bg-blue-100 dark:hover:bg-slate-700"><Edit size={16}/></button>
                        </div>
                        {link.subLinks && (
                            <div className="pl-6 mt-2 space-y-2 border-l-2 dark:border-slate-700">
                                {link.subLinks.map(sub => (
                                    <div key={sub.path} className="flex items-center justify-between p-2 text-sm bg-slate-50 rounded-md dark:bg-slate-700/50">
                                         <p>{sub.name} ({sub.path})</p>
                                         <button onClick={() => handleEdit(sub)} className="p-2 text-blue-600 rounded-full hover:bg-blue-100 dark:hover:bg-slate-700"><Edit size={16}/></button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

/**
 * ManageAbout Component: Handles editing of About page content.
 */
const ManageAbout: React.FC = () => {
    const { content, updateContentSection } = useContent();
    const [about, setAbout] = useState<AboutContent>(content?.about || { short: '', directorMessage: '', overview: ''});
    
    const handleSave = () => {
        updateContentSection('about', about);
        alert("About page content updated!");
    };
    
    return (
        <div>
            <h2 className="mb-6 text-2xl font-bold text-brand-blue dark:text-brand-orange">Manage About Page</h2>
            <div className="space-y-4">
                <div><Label>Director's Message</Label><Textarea rows={5} value={about.directorMessage} onChange={e => setAbout({...about, directorMessage: e.target.value})}/></div>
                <div><Label>Overview</Label><Textarea rows={8} value={about.overview} onChange={e => setAbout({...about, overview: e.target.value})}/></div>
                <button onClick={handleSave} className="px-4 py-2 font-semibold text-white transition-colors rounded-md bg-brand-blue hover:bg-brand-blue/90">Save Changes</button>
            </div>
        </div>
    );
};

/**
 * ManageNews Component: The original News/Events manager, refactored.
 */
const ManageNews: React.FC = () => {
    const { content, updateContentSection } = useContent();
    const allEvents = content?.newsAndEvents || [];
    
    const [event, setEvent] = useState<Omit<NewsEvent, 'image' | 'id'>>({
        title: '', date: '', type: 'Announcement', summary: '', fullContent: '',
    });
    const [imageUrl, setImageUrl] = useState('');
    const [eventsToDelete, setEventsToDelete] = useState<Set<string>>(new Set());
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        // FIX: The `name` variable was undefined. Changed to `e.target.name` to correctly reference the form element's name attribute.
        setEvent(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const id = `${event.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}-${new Date(event.date).toISOString().split('T')[0]}`;
        const newEvent: NewsEvent = { ...event, id, image: imageUrl, fullContent: event.fullContent || event.summary };
        
        if (allEvents.some(e => e.id === newEvent.id)) {
             alert("An event with this ID already exists. Please use a different title or date.");
             return;
        }
        
        const updatedEvents = [newEvent, ...allEvents];
        updateContentSection('newsAndEvents', updatedEvents);
        
        setEvent({ title: '', date: '', type: 'Announcement', summary: '', fullContent: '' });
        setImageUrl('');
        alert('Event added!');
    };
    
    const handleToggleDelete = (id: string) => {
        setEventsToDelete(prev => {
            const newSet = new Set(prev);
            newSet.has(id) ? newSet.delete(id) : newSet.add(id);
            return newSet;
        });
    };
    
    const handleDeleteSelected = () => {
        if (eventsToDelete.size === 0) return;
        if (window.confirm(`Delete ${eventsToDelete.size} event(s)?`)) {
            const updatedEvents = allEvents.filter(event => !eventsToDelete.has(event.id));
            updateContentSection('newsAndEvents', updatedEvents);
            setEventsToDelete(new Set());
            alert('Selected events removed!');
        }
    };

    return (
        <div>
            <h2 className="mb-6 text-2xl font-bold text-brand-blue dark:text-brand-orange">Manage News & Events</h2>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Add Form */}
                <div className="p-6 space-y-4 border rounded-lg dark:border-slate-700">
                    <h3 className="text-lg font-semibold">Add New Event</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input type="text" name="title" value={event.title} onChange={e => setEvent({...event, title: e.target.value})} placeholder="Title" required/>
                        <Input type="date" name="date" value={event.date} onChange={e => setEvent({...event, date: e.target.value})} required />
                         <select name="type" value={event.type} onChange={e => setEvent({...event, type: e.target.value as NewsEvent['type']})} className="w-full px-3 py-2 mt-1 border border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600 focus:ring-brand-blue focus:border-brand-blue">
                            <option>Announcement</option><option>Workshop</option><option>Seminar</option>
                        </select>
                        <div className="flex gap-2">
                            <Input type="text" placeholder="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} required />
                            <button type="button" onClick={() => setIsPickerOpen(true)} className="px-3 py-2 text-sm font-semibold transition-colors rounded-md bg-slate-200 dark:bg-slate-600 hover:bg-slate-300">Library</button>
                        </div>
                        <Textarea name="summary" placeholder="Summary" value={event.summary} onChange={e => setEvent({...event, summary: e.target.value})} rows={2} required/>
                        <Textarea name="fullContent" placeholder="Full Content" value={event.fullContent} onChange={e => setEvent({...event, fullContent: e.target.value})} rows={4} />
                        <button type="submit" className="w-full px-4 py-2 font-semibold text-white transition-colors rounded-md bg-brand-blue hover:bg-brand-blue/90">Add Event</button>
                    </form>
                </div>
                {/* Delete List */}
                <div className="p-6 space-y-4 border rounded-lg dark:border-slate-700">
                    <h3 className="text-lg font-semibold">Delete Existing Events</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                        {allEvents.map(item => (
                            <label key={item.id} htmlFor={`del-${item.id}`} className="flex items-center p-2 bg-slate-100 rounded-md dark:bg-slate-800 cursor-pointer">
                                <input type="checkbox" id={`del-${item.id}`} checked={eventsToDelete.has(item.id)} onChange={() => handleToggleDelete(item.id)} className="w-4 h-4 mr-3 rounded text-brand-blue focus:ring-brand-blue" />
                                <span className="text-sm">{item.title}</span>
                            </label>
                        ))}
                    </div>
                    <button onClick={handleDeleteSelected} disabled={eventsToDelete.size === 0} className="w-full flex items-center justify-center px-4 py-2 mt-4 font-semibold text-white transition-colors rounded-md bg-red-600 hover:bg-red-700 disabled:bg-slate-400 disabled:cursor-not-allowed">
                        <Trash2 size={16} className="mr-2"/> Delete ({eventsToDelete.size}) Selected
                    </button>
                </div>
            </div>
            <ImagePickerModal isOpen={isPickerOpen} onClose={() => setIsPickerOpen(false)} onSelect={setImageUrl} />
        </div>
    );
};

/**
 * PublishChanges Component: Shows modified files and allows downloading.
 */
const PublishChanges: React.FC = () => {
    const { content, modifiedSections, getOriginalContent, updateContentSection, resetAllChanges } = useContent();

    const handleDownload = (section: AllContentKey) => {
        if (!content || !content[section]) return;
        const jsonString = JSON.stringify(content[section], null, 4);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${section}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };
    
    const handleRevert = async (section: AllContentKey) => {
        if (window.confirm(`Are you sure you want to revert changes for ${section}?`)) {
            const originalData = await getOriginalContent(section);
            // This is a bit tricky, after revert, we need to update localStorage and state
            // Easiest is to just reload after removing from customContent in localStorage
            const customContent = JSON.parse(localStorage.getItem('customContent') || '{}');
            delete customContent[section];
            localStorage.setItem('customContent', JSON.stringify(customContent));
            window.location.reload();
        }
    };
    
    return (
        <div>
            <h2 className="mb-6 text-2xl font-bold text-brand-blue dark:text-brand-orange">Publish Changes</h2>
            <div className="p-4 mb-6 space-y-3 text-sm text-yellow-800 bg-yellow-100 rounded-lg dark:bg-yellow-900/50 dark:text-yellow-200">
                <p><strong>Important:</strong> Your changes are currently saved only in this browser.</p>
                <p>To make them permanent for all users, download the updated data files below and replace the original files in your project's <code className="font-mono text-xs">public/data/</code> folder.</p>
            </div>
            
            {modifiedSections.length > 0 ? (
                <div className="space-y-3">
                    {modifiedSections.map(section => (
                        <div key={section} className="flex items-center justify-between p-3 bg-slate-100 rounded-md dark:bg-slate-800">
                            <p className="font-semibold text-slate-700 dark:text-gray-200">
                                <code className="font-mono">{section}.json</code> (modified)
                            </p>
                            <div className="space-x-2">
                                <button onClick={() => handleRevert(section)} className="inline-flex items-center px-3 py-1 text-xs font-semibold text-yellow-700 transition-colors bg-yellow-200 rounded-md hover:bg-yellow-300"><RotateCcw size={14} className="mr-1"/> Revert</button>
                                <button onClick={() => handleDownload(section)} className="inline-flex items-center px-3 py-1 text-xs font-semibold text-white transition-colors bg-green-600 rounded-md hover:bg-green-700"><Download size={14} className="mr-1"/> Download</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-slate-500">No changes made yet. Edit content in other tabs to see modified files here.</p>
            )}

            <div className="mt-8 border-t dark:border-slate-700 pt-6">
                 <button onClick={resetAllChanges} className="w-full flex items-center justify-center px-4 py-2 font-semibold text-white transition-colors rounded-md bg-red-600 hover:bg-red-700">
                     <AlertTriangle className="inline w-5 h-5 mr-2"/>
                     Discard All Local Changes & Reset
                 </button>
            </div>
        </div>
    );
};

// #endregion

const AdminPage: React.FC = () => {
    const TABS = [
        { id: 'news', label: 'News & Events', icon: Newspaper },
        { id: 'hero', label: 'Hero Slides', icon: SlidersHorizontal },
        { id: 'images', label: 'Image Library', icon: Image },
        { id: 'nav', label: 'Navigation', icon: Navigation },
        { id: 'about', label: 'About Page', icon: Info },
        { id: 'publish', label: 'Publish', icon: Save },
    ];
    const [activeTab, setActiveTab] = useState(TABS[0].id);

    const renderContent = () => {
        switch (activeTab) {
            case 'news': return <ManageNews />;
            case 'hero': return <ManageHero />;
            case 'nav': return <ManageNav />;
            case 'about': return <ManageAbout />;
            case 'images': return <ManageImages />;
            case 'publish': return <PublishChanges />;
            default: return null;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
            <PageBanner 
                title="Admin Portal" 
                subtitle="Manage Website Content"
            />
            <div className="container px-6 py-12 mx-auto">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="md:w-1/4 lg:w-1/5">
                        <nav className="space-y-2">
                            {TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                        activeTab === tab.id
                                            ? 'bg-brand-blue text-white'
                                            : 'text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    <tab.icon size={18} className="mr-3"/>
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 p-8 bg-white rounded-lg shadow-lg dark:bg-slate-800">
                        {renderContent()}
                    </main>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminPage;