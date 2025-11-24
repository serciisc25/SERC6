

export interface NavLinkData {
  name: string;
  path: string;
  subLinks?: NavLinkData[];
}

export interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
}

export interface ResearchArea {
  name: string;
  description: string;
  icon: string; // Icon name as string
}

export interface NewsEvent {
  id: string;
  title: string;
  date: string;
  type: 'Announcement' | 'Workshop' | 'Seminar';
  summary: string;
  image: string;
  fullContent?: string;
  registrationOpen?: boolean;
  registrationDeadline?: string;
}

export interface Infrastructure {
  name: string;
  image: string;
  description: string;
}

export interface Person {
    name: string;
    title: string;
    image: string;
    researchInterests?: string[];
    email: string;
}

export interface PeopleContent {
    faculty: Person[];
    scientificStaff: Person[];
    technicalStaff: Person[];
    administrativeStaff: Person[];
}

export interface Course {
    code: string;
    title: string;
    instructor: string;
    description: string;
}

export interface AboutContent {
    short: string;
    directorMessage: string;
    overview: string;
}

export interface ContactInfo {
    address: string;
    phone: string;
    email: string;
    mapUrl: string;
}

export interface SystemSpec {
    label: string;
    value: string;
}

export interface JobSubmissionGuide {
    title: string;
    sections: {
        title: string;
        content: string[];
        isNote?: boolean;
    }[];
}

export interface HardwareNode {
    name: string;
    specs: string[];
}

export interface HardwareArchitecture {
    title: string;
    nodes: HardwareNode[];
}

export interface SystemDetail {
    name:string;
    image: string;
    overview: string;
    specifications: SystemSpec[];
    usagePolicy: string;
    hardwareArchitecture?: HardwareArchitecture;
    softwareOverview?: {
        os: string;
        links: { name: string; path: string; }[];
    }
    jobSubmissionGuide?: JobSubmissionGuide;
}

// --- Software Detail Types ---

export interface DetailSectionButton {
    label: string;
    url: string;
    color?: 'blue' | 'orange' | 'green';
}

export interface TableCell {
    text: string;
    icon?: string;
    color?: string;
    bold?: boolean;
}

export interface DetailSection {
    type: 'text' | 'table' | 'steps' | 'grid' | 'images';
    title?: string;
    content?: string; // For text
    list?: string[]; // For simple lists in text
    headers?: string[]; // For table
    rows?: TableCell[][]; // For table
    note?: string; // General note
    intro?: string; // Intro text for steps
    buttons?: DetailSectionButton[]; // For steps
    steps?: string[]; // For steps ordered list
    gridItems?: string[]; // For versions grid
    gridLink?: { text: string; url: string };
    images?: { caption: string }[]; // For image placeholders
}

export interface SoftwareItem {
    name: string;
    version?: string;
    description: string;
    detailsPageTitle?: string;
    sections?: DetailSection[];
}

export interface SoftwareCategory {
    id: string;
    name: string;
    items: SoftwareItem[];
}

export interface Service {
    id: string;
    name: string;
    description: string;
}

export interface ManagedImage {
  id: string;
  name: string;
  src: string;
}

export interface AllContent {
    navLinks: NavLinkData[];
    heroSlides: HeroSlide[];
    about: AboutContent;
    researchAreas: ResearchArea[];
    newsAndEvents: NewsEvent[];
    infrastructures: Infrastructure[];
    people: PeopleContent;
    courses: Course[];
    contact: ContactInfo;
    systems: { [key: string]: SystemDetail };
    software: SoftwareCategory[];
    services: Service[];
}

export type AllContentKey = keyof AllContent;
