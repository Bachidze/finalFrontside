"use client";
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Header() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setIsDark(savedMode);
  }, []);

  return (
    <header className='bg-[#1E2139] '>
      <section className='flex justify-between'>
        <div>
          <Image src="/InvoicePurpleHeaderImg.svg" alt='firstHeaderImg' width={72} height={72} className='xl:w-20' />
        </div>
        <div className='flex justify-center items-center gap-4 pr-6 md:gap-6 xl:gap-10 xl:pr-8'>
          <div onClick={toggleDarkMode} className="cursor-pointer">
            {isDark ? (
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: .6, ease: "easeInOut" }}
              >
                <Image alt='MoonImg' src="/invoiceMoon.svg" width={20} height={20} className='md:w-[30px] md:h-[30px]' />
              </motion.div>
            ) : (
              <div className='w-[20px] h-[20px] bg-[#858BB2] rounded-[50%] md:w-[30px] md:h-[30px]'></div>
            )}
          </div>
          <div className='w-[1px] h-[100%] bg-[#494E6E] dark:bg-gray-600 md:w-[2px]'></div>
          <Image className='rounded-[50%] md:w-[40px] md:h-[40px]' src="/mainGithubPhoto.jpg" alt='firstHeaderImg' width={32} height={32}  />
        </div>
      </section>
    </header>
  );
}
