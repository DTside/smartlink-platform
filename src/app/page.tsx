import { supabase } from '@/lib/supabase';
import ProductGrid from '@/components/ProductGrid';
import OutfitDebugPanel from '@/components/OutfitDebugPanel';
import Mannequin from '@/components/Mannequin';
import CheckoutButton from '@/components/CheckoutButton';
import DropTimer from '@/components/DropTimer';
import LogoEasterEgg from '@/components/LogoEasterEgg';

// Чтобы страница не кэшировалась жестко и мы видели изменения в базе (optional)
export const revalidate = 0;

export default async function Home() {
  // Загружаем товары из Supabase
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true });

  return (
    <main className="min-h-screen bg-kyiv-black text-gray-100 overflow-hidden flex flex-col font-sans">
      
      {/* ХЕДЕР (Верхняя панель) */}
      <header className="p-6 border-b border-kyiv-grey flex justify-between items-center bg-black z-50 h-[80px]">
        {/* Пасхалка: Кликабельный логотип (Matrix Mode) */}
        <LogoEasterEgg />
        
        {/* Таймер обратного отсчета */}
        <DropTimer />
      </header>

      {/* РАБОЧАЯ ЗОНА (3 КОЛОНКИ) */}
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-80px)]">
        
        {/* КОЛОНКА 1: СКЛАД (Скроллится) */}
        <div className="w-[40%] overflow-y-auto p-6 border-r border-kyiv-grey scrollbar-hide bg-[#050505]">
          <h2 className="text-sm font-mono text-gray-400 mb-4 sticky top-0 bg-[#050505]/95 backdrop-blur-sm py-2 z-10 w-full border-b border-kyiv-grey/30">
            // INVENTORY_ACCESS
          </h2>
          
          {/* Сетка товаров с логикой "Locked" */}
          <ProductGrid products={products || []} />
        </div>

        {/* КОЛОНКА 2: МАНЕКЕН (Центр внимания) */}
        <div className="w-[40%] relative bg-[#020202] flex items-center justify-center border-r border-kyiv-grey">
           <div className="absolute top-4 left-4 text-xs font-mono text-kyiv-accent opacity-50">
             VIEWPORT: FRONT_Cam_01
           </div>
           
           {/* Визуализация слоев */}
           <Mannequin />
        </div>

        {/* КОЛОНКА 3: ДАННЫЕ (Панель справа) */}
        <div className="w-[20%] bg-black p-6 overflow-y-auto flex flex-col">
          {/* Список надетого и цена */}
          <OutfitDebugPanel />
          
          <div className="mt-auto pt-8">
            {/* Кнопка оформления заказа (открывает модалку) */}
            <CheckoutButton />
          </div>
        </div>

      </div>
    </main>
  );
}