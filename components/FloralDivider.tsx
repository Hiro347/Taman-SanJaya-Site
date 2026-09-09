'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function FloralDivider() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '150px 0px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full relative pointer-events-none select-none z-10 -mt-2 sm:-mt-4 lg:-mt-6 -mb-10 sm:-mb-16 lg:-mb-24"
    >
      <picture>
        <source srcSet="/images/group-3.webp" type="image/webp" />
        <img
          src="/images/group-3.png"
          alt="Ornamen Rangkaian Bunga Alami Taman San Jaya"
          className="w-full h-auto block"
          loading="lazy"
        />
      </picture>
    </motion.div>
  );
}
