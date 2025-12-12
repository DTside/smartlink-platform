'use client';

import { useState } from 'react';
import CheckoutModal from './CheckoutModal';

export default function CheckoutButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full mt-8 bg-kyiv-accent text-black font-bold py-4 hover:bg-white transition-colors uppercase tracking-widest text-sm relative overflow-hidden group"
      >
        <span className="relative z-10">Checkout Process</span>
        {/* Эффект блика при наведении */}
        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-300 skew-x-12"></div>
      </button>

      {isOpen && <CheckoutModal onClose={() => setIsOpen(false)} />}
    </>
  );
}