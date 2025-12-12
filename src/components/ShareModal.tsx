'use client';

import { useRef, useState } from 'react';
import { useOutfitStore, LayerType } from '@/store/outfitStore';
import html2canvas from 'html2canvas';

export default function ShareModal({ onClose }: { onClose: () => void }) {
  const { layers, totalPrice } = useOutfitStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Функция скачивания картинки
  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    
    try {
      // Ждем, пока прогрузятся картинки (если они есть)
      await new Promise(r => setTimeout(r, 500));

      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#000000', // Черный фон
        scale: 2, // Высокое качество (Retina)
        useCORS: true // Разрешить грузить внешние картинки
      });

      const link = document.createElement('a');
      link.download = `OFF-GRID-OUTFIT-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error("Ошибка генерации:", err);
      alert("Не удалось создать бирку. Попробуй еще раз.");
    } finally {
      setIsGenerating(false);
    }
  };

  const dateStr = new Date().toLocaleDateString('uk-UA').replace(/\./g, '/');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="max-w-md w-full flex flex-col items-center">
        
        <h3 className="text-kyiv-accent font-bold mb-4 uppercase tracking-widest text-sm">
          // GENERATE_STYLE_CARD
        </h3>

        {/* --- САМА КАРТОЧКА (То, что будем скринить) --- */}
        <div 
          ref={cardRef} 
          className="bg-[#0a0a0a] border border-white p-6 w-full relative overflow-hidden"
          style={{ fontFamily: 'monospace' }}
        >
          {/* Декор фона */}
          <div className="absolute top-0 right-0 p-2 opacity-50">
             <div className="border border-white w-12 h-12 rounded-full flex items-center justify-center text-[8px] animate-spin-slow">
               OFF-GRID
             </div>
          </div>

          {/* Хедер карточки */}
          <div className="border-b-2 border-kyiv-accent pb-4 mb-6">
            <h2 className="text-3xl font-black text-white leading-none uppercase italic">
              OFF-GRID <br/><span className="text-kyiv-accent">KYIV</span>
            </h2>
            <div className="text-[10px] text-gray-400 mt-2 flex justify-between">
              <span>DATE: {dateStr}</span>
              <span>ID: {Math.floor(Math.random() * 999999)}</span>
            </div>
          </div>

          {/* Список вещей */}
          <div className="space-y-3 mb-8">
            {(Object.keys(layers) as LayerType[]).map((layer) => {
              const item = layers[layer];
              if (!item) return null;
              return (
                <div key={layer} className="flex justify-between items-end border-b border-dashed border-gray-800 pb-1">
                  <div>
                    <span className="text-[8px] text-gray-500 uppercase block">{layer}</span>
                    <span className="text-xs text-white font-bold uppercase">{item.title}</span>
                  </div>
                  <span className="text-xs text-kyiv-accent">{item.price} ₴</span>
                </div>
              );
            })}
          </div>

          {/* Футер карточки */}
          <div className="bg-white text-black p-3 flex justify-between items-center">
             <div>
               <div className="text-[8px] uppercase font-bold">Total Loadout Value</div>
               <div className="text-xl font-black">{totalPrice} UAH</div>
             </div>
             {/* Фейковый QR */}
             <div className="w-10 h-10 bg-black grid grid-cols-4 gap-0.5 p-0.5">
                {Array.from({length: 16}).map((_, i) => (
                  <div key={i} className={`bg-white ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`}></div>
                ))}
             </div>
          </div>
        </div>
        {/* ----------------------------------------------- */}

        {/* Кнопки управления */}
        <div className="flex gap-4 w-full mt-8">
          <button 
            onClick={onClose} 
            className="flex-1 py-3 text-xs border border-gray-600 text-gray-400 hover:text-white hover:border-white transition-colors uppercase"
          >
            Cancel
          </button>
          <button 
            onClick={handleDownload} 
            disabled={isGenerating}
            className="flex-[2] py-3 text-xs bg-kyiv-accent text-black font-bold hover:bg-white transition-colors uppercase flex justify-center items-center gap-2"
          >
            {isGenerating ? 'Rendering...' : 'Download Image_'}
            {!isGenerating && <span>⬇</span>}
          </button>
        </div>

      </div>
    </div>
  );
}