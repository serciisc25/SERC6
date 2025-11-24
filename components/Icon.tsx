
import React from 'react';
import { Cpu, Dna, BrainCircuit, Network, BarChart, BookOpen, Users, Building, Mail, Info, List, Image } from 'lucide-react';

const iconMap = {
  Cpu,
  Dna,
  BrainCircuit,
  Network,
  BarChart,
  BookOpen,
  Users,
  Building,
  Mail,
  Info,
  List,
  Image,
};

type IconName = keyof typeof iconMap;

// FIX: Switched from using the `LucideProps` type to `React.ComponentProps<typeof Cpu>`.
// This provides a more reliable way to infer the props of a lucide icon, including `className`,
// which resolves the TypeScript error. `Omit` is used to prevent a conflict with the
// 'name' prop, which is redefined here as a required string for icon lookup.
interface IconProps extends Omit<React.ComponentProps<typeof Cpu>, 'name'> {
    name: string;
}

export const Icon: React.FC<IconProps> = ({ name, ...props }) => {
    const LucideIcon = iconMap[name as IconName];

    if (!LucideIcon) {
        return null; // Or return a default icon
    }

    return <LucideIcon {...props} />;
};