'use client';

import { useOutfitStore, Product, LayerType } from '@/store/outfitStore';
import { clsx } from 'clsx';

interface Props {
  products: any[]; 
}

export default function ProductGrid({ products }: Props) {
  const { equipItem, layers } = useOutfitStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
      {products.map((rawItem) => {
        const item = rawItem as Product & { is_dropped: boolean }; // Уточняем тип
        const isEquipped = layers[item.layer as LayerType]?.id === item.id;
        
        // Проверка: Доступен ли товар?
        const isLocked = item.is_dropped === false;

        return (
          <div 
            key={item.id} 
            onClick={() => !isLocked && equipItem(item)} // Если закрыт - клик не работает
            className={clsx(
              "border bg-[#121212] p-4 relative group transition-all duration-200",
              // Стили для активного/неактивного состояния
              isLocked ? "opacity-50 cursor-not-allowed border-red-900/30 grayscale" : "cursor-pointer border-kyiv-grey hover:border-white",
              isEquipped && !isLocked ? "!border-kyiv-accent shadow-[0_0_15px_rgba(204,255,0,0.3)]" : ""
            )}
          >
            {/* ЛЕЙБЛ СТАТУСА */}
            <div className={clsx(
              "absolute top-2 right-2 text-xs font-bold px-2 py-1 uppercase z-10",
              isLocked ? "bg-red-600 text-black" : (isEquipped ? "bg-kyiv-accent text-black" : "bg-gray-600 text-white")
            )}>
              {isLocked ? 'LOCKED' : (isEquipped ? 'ON' : item.layer)}
            </div>

            {/* ОВЕРЛЕЙ ЗАМКА (если закрыто) */}
            {isLocked && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                <div className="text-4xl">🔒</div>
              </div>
            )}
            
            {/* Картинка */}
            <div className="aspect-[3/4] relative mb-4 overflow-hidden bg-kyiv-grey/20">
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img 
                 src={item.image_url} 
                 alt={item.title}
                 className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity"
               />
            </div>
            
            <h2 className="text-xl font-bold mb-1">{item.title}</h2>
            <div className="flex justify-between items-center font-mono">
              <span className={isLocked ? "text-gray-600 line-through" : "text-kyiv-accent"}>
                {isLocked ? 'SOON' : `${item.price} UAH`}
              </span>
              <span className="text-xs text-gray-500">Vol: {item.volume_index}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}