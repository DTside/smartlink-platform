'use client';

import { useOutfitStore, LayerType } from '@/store/outfitStore';
import { clsx } from 'clsx';

export default function Mannequin() {
  const { layers } = useOutfitStore();

  // Порядок наслоения (чем больше число, тем ближе к зрителю)
  // Мы используем фиксированную высоту (h-[600px]), чтобы манекен был большим
  const zIndexes: Record<LayerType, number> = {
    base: 10,      // Футболка (внизу)
    bottom: 20,    // Штаны (поверх низа футболки)
    shoes: 25,     // Обувь
    mid: 30,       // Худи (поверх штанов)
    outer: 40,     // Куртка (сверху всего)
    accessory: 50  // Сумка/шапка
  };

  return (
    <div className="relative w-full h-[600px] border-x border-kyiv-grey bg-[#0f0f0f] overflow-hidden flex items-center justify-center">
      
      {/* 1. СЕТКА ФОНА (Декор) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* 2. СИЛУЭТ (БАЗА) */}
      {/* Это "тело" манекена. Пока ставим серый контур */}
      <div className="absolute w-64 h-full bg-kyiv-grey/20 blur-xl z-0 rounded-full opacity-50 animate-pulse"></div>
      <div className="absolute z-0 text-kyiv-grey/30 font-bold text-9xl rotate-90 select-none">HUMAN</div>

      {/* 3. СЛОИ ОДЕЖДЫ */}
      {(Object.keys(zIndexes) as LayerType[]).map((layerKey) => {
        const item = layers[layerKey];
        if (!item) return null;

        return (
          <div 
            key={layerKey}
            className="absolute transition-all duration-500 ease-out"
            style={{ 
              zIndex: zIndexes[layerKey],
              // Небольшой рандомный сдвиг для эффекта "небрежности" (Deconstructed)
              transform: `translateY(${layerKey === 'bottom' ? '100px' : '0'}) scale(${item.volume_index > 8 ? 1.1 : 1})`,
            }}
          >
            {/* Картинка вещи */}
            {/* mix-blend-difference или screen создаст эффект рентгена для заглушек */}
            <img 
              src={item.image_url} 
              alt={item.title}
              className="w-64 h-auto object-cover opacity-90 mix-blend-hard-light border-2 border-transparent hover:border-kyiv-accent"
            />
            
            {/* Лейбл прямо на манекене */}
            <div className="absolute -right-12 top-0 bg-black text-kyiv-accent text-[10px] px-1 font-mono border border-kyiv-accent">
              Z-{zIndexes[layerKey]}
            </div>
          </div>
        );
      })}

      {/* Сканер-линия (Анимация сканирования) */}
      <div className="absolute inset-x-0 h-1 bg-kyiv-accent/50 shadow-[0_0_20px_#ccff00] animate-[scan_3s_linear_infinite] opacity-50 pointer-events-none"></div>
    </div>
  );
}