import React from 'react';
import { motion } from 'framer-motion';

interface PageBannerProps {
  title: string;
  subtitle: string;
  image?: string; // Image is now optional
}

const PageBanner: React.FC<PageBannerProps> = ({ title, subtitle }) => {
  return (
    <motion.div
      className="relative py-20 text-white md:py-24 bg-brand-dark-blue"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      <div className="container relative px-6 mx-auto text-center">
        <h1 className="text-4xl font-bold leading-tight md:text-5xl font-poppins">{title}</h1>
        <p className="mt-4 text-lg md:text-xl text-gray-200">{subtitle}</p>
      </div>
    </motion.div>
  );
};

export default PageBanner;
