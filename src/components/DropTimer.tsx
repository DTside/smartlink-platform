'use client';

import { useState, useEffect } from 'react';

export default function DropTimer() {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0, ms: 0 });

  useEffect(() => {
    // Ставим фейковую дату дропа: сегодня в 23:59:59
    const dropDate = new Date();
    dropDate.setHours(23, 59, 59, 999);

    const interval = setInterval(() => {
      const now = new Date();
      const diff = dropDate.getTime() - now.getTime();

      if (diff <= 0) {
        clearInterval(interval);
      } else {
        setTimeLeft({
          h: Math.floor((diff / (1000 * 60 * 60)) % 24),
          m: Math.floor((diff / 1000 / 60) % 60),
          s: Math.floor((diff / 1000) % 60),
          ms: Math.floor((diff % 1000) / 10),
        });
      }
    }, 50); // Обновляем часто для миллисекунд

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-end font-mono leading-none">
      <div className="text-[10px] text-gray-500 uppercase mb-1">Next Drop In:</div>
      <div className="flex items-baseline gap-1 text-kyiv-accent font-bold text-xl tracking-widest">
        <span>{String(timeLeft.h).padStart(2, '0')}</span>:
        <span>{String(timeLeft.m).padStart(2, '0')}</span>:
        <span>{String(timeLeft.s).padStart(2, '0')}</span>
        <span className="text-xs text-gray-500">.{String(timeLeft.ms).padStart(2, '0')}</span>
      </div>
    </div>
  );
}