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
      className="w-full relative pointer-events-none select-none z-10 -mt-2 sm:-mt-4 lg:-mt-6 -mb-6 sm:-mb-10 lg:-mb-14"
    >
      <img
        src="/images/group-3.svg"
        alt="Ornamen Rangkaian Bunga Alami Taman San Jaya"
        className="w-full h-auto block"
      />
    </motion.div>
  );
}
