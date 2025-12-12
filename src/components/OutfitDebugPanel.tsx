'use client';

import { useState } from 'react';
import { useOutfitStore, LayerType } from '@/store/outfitStore';
import ShareModal from './ShareModal'; // Импортируем модалку

const LAYERS_ORDER: LayerType[] = ['base', 'mid', 'outer', 'bottom', 'shoes', 'accessory'];

export default function OutfitDebugPanel() {
  const { layers, totalPrice, unequipItem } = useOutfitStore();
  const [showShare, setShowShare] = useState(false);

  return (
    <>
      <div className="border border-kyiv-accent p-6 bg-black/90 font-mono relative">
        <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2 flex justify-between items-center">
          <span>OUTFIT STATUS</span>
          <div className="w-2 h-2 bg-kyiv-accent animate-pulse rounded-full"></div>
        </h3>
        
        <div className="space-y-4 mb-8">
          {LAYERS_ORDER.map((layer) => (
            <div key={layer} className="flex justify-between items-start text-sm group">
              <span className="text-gray-500 uppercase w-20 group-hover:text-white transition-colors">{layer}:</span>
              
              {layers[layer] ? (
                <div className="flex-1 text-right">
                  <div className="text-white truncate text-xs font-bold">{layers[layer]?.title}</div>
                  <button 
                    onClick={() => unequipItem(layer)}
                    className="text-kyiv-error text-[10px] hover:underline opacity-50 hover:opacity-100 uppercase"
                  >
                    [Eject]
                  </button>
                </div>
              ) : (
                <span className="text-gray-800 text-xs">-- EMPTY --</span>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-gray-700 pt-4 mb-4 flex justify-between text-lg font-bold text-kyiv-accent">
          <span>TOTAL:</span>
          <span>{totalPrice} UAH</span>
        </div>

        {/* Кнопка Share */}
        <button 
          onClick={() => setShowShare(true)}
          disabled={totalPrice === 0}
          className="w-full border border-gray-700 text-gray-400 text-xs py-2 hover:border-kyiv-accent hover:text-kyiv-accent transition-all uppercase disabled:opacity-30 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          <span>⏏</span> Generate Style Card
        </button>
      </div>

      {/* Рендер модалки, если state === true */}
      {showShare && <ShareModal onClose={() => setShowShare(false)} />}
    </>
  );
}