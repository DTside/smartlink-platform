'use client';

import { useState, useEffect } from 'react';

export default function LogoEasterEgg() {
  const [clicks, setClicks] = useState(0);
  const [matrixMode, setMatrixMode] = useState(false);

  useEffect(() => {
    if (matrixMode) {
      document.documentElement.style.filter = 'invert(1) hue-rotate(180deg)';
    } else {
      document.documentElement.style.filter = 'none';
    }
  }, [matrixMode]);

  const handleClick = () => {
    setClicks(prev => prev + 1);
    if (clicks + 1 === 5) {
      setMatrixMode(prev => !prev);
      setClicks(0);
    }
  };

  return (
    <h1 
      onClick={handleClick}
      className="text-3xl font-bold text-kyiv-accent uppercase tracking-tighter cursor-help select-none active:scale-95 transition-transform"
    >
      OFF-GRID <span className="text-white">KYIV</span>
    </h1>
  );
}