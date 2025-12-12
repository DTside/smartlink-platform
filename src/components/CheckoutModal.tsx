'use client';

import { useState } from 'react';
import { useOutfitStore } from '@/store/outfitStore';
import { searchCity, getWarehouses } from '@/lib/novaPoshta';
import { supabase } from '@/lib/supabase';

export default function CheckoutModal({ onClose }: { onClose: () => void }) {
  const { layers, totalPrice } = useOutfitStore();
  
  // Состояние формы
  const [step, setStep] = useState(1); // 1 = Контакты, 2 = Доставка, 3 = Успех
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    warehouse: '',
    isDonation: false // Поле для доната
  });

  // Для поиска НП
  const [cities, setCities] = useState<string[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);

  // Логика поиска города
  const handleCitySearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData({ ...formData, city: val });
    if (val.length > 1) {
      const res = await searchCity(val);
      setCities(res);
    }
  };

  // Выбор города -> Грузим отделения
  const selectCity = async (city: string) => {
    setLoading(true);
    setFormData({ ...formData, city, warehouse: '' }); // сброс отделения
    setCities([]); // закрыть список
    const whs = await getWarehouses(city);
    setWarehouses(whs);
    setLoading(false);
  };

  // Финальная отправка заказа
  const handleSubmit = async () => {
    setLoading(true);
    console.log("Отправка заказа...");

    // Собираем список ID товаров
    const items = Object.values(layers)
      .filter(item => item !== null)
      .map(item => ({ 
        id: item!.id, 
        title: item!.title,
        price: item!.price 
      }));

    try {
      const { error } = await supabase.from('orders').insert({
        customer_name: formData.name,
        customer_phone: formData.phone,
        city: formData.city,
        warehouse: formData.warehouse,
        total_price: totalPrice,
        items: items,
        // status: formData.isDonation ? 'donation_pending' : 'new' // Можно добавить если расширишь базу
      });
  
      if (error) {
        console.error("Ошибка Supabase:", error);
        alert('Ошибка при создании заказа: ' + error.message);
      } else {
        setStep(3); // Переход к накладной
      }
    } catch (err) {
      console.error("Критическая ошибка:", err);
      alert("Что-то пошло не так. Чекни консоль.");
    }
    
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-[#0a0a0a] border border-kyiv-accent shadow-[0_0_50px_rgba(204,255,0,0.1)] p-8 relative max-h-[90vh] overflow-y-auto">
        
        {/* Кнопка закрытия */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white z-50">✕</button>

        {step !== 3 && (
          <h2 className="text-2xl font-bold text-kyiv-accent mb-6 uppercase tracking-widest border-b border-gray-800 pb-2">
            Secure Checkout_
          </h2>
        )}

        {/* ШАГ 1: Контакты */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">CODENAME (ПІБ)</label>
              <input 
                className="w-full bg-[#111] border border-gray-700 p-3 text-white focus:border-kyiv-accent focus:outline-none"
                placeholder="Ivanenko Ivan"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">UPLINK (Телефон)</label>
              <input 
                className="w-full bg-[#111] border border-gray-700 p-3 text-white focus:border-kyiv-accent focus:outline-none"
                placeholder="+380..."
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <button 
              onClick={() => setStep(2)}
              disabled={!formData.name || !formData.phone}
              className="w-full bg-kyiv-accent text-black font-bold py-3 mt-4 hover:bg-white disabled:opacity-50 transition-colors"
            >
            </button>
          </div>
        )}

        {/* ШАГ 2: Логистика (Нова Пошта) */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
             {/* Поиск города */}
            <div className="relative">
              <label className="block text-xs text-gray-500 mb-1">TARGET CITY</label>
              <input 
                className="w-full bg-[#111] border border-gray-700 p-3 text-white focus:border-kyiv-accent focus:outline-none"
                placeholder="Введи місто (напр. Київ)"
                value={formData.city}
                onChange={handleCitySearch}
              />
              {/* Выпадающий список городов */}
              {cities.length > 0 && (
                <div className="absolute z-10 w-full bg-[#1a1a1a] border border-gray-700 mt-1 max-h-40 overflow-y-auto shadow-xl">
                  {cities.map(c => (
                    <div key={c} onClick={() => selectCity(c)} className="p-2 hover:bg-kyiv-accent hover:text-black cursor-pointer text-sm">
                      {c}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Выбор отделения */}
            {loading ? <div className="text-kyiv-accent text-xs animate-pulse font-mono">SCANNING DATABASE...</div> : (
              formData.city && warehouses.length > 0 && (
                <div>
                   <label className="block text-xs text-gray-500 mb-1">DROP POINT (Відділення)</label>
                   <select 
                     className="w-full bg-[#111] border border-gray-700 p-3 text-white focus:border-kyiv-accent text-sm"
                     onChange={e => setFormData({...formData, warehouse: e.target.value})}
                     value={formData.warehouse}
                   >
                     <option value="">Обери відділення...</option>
                     {warehouses.map(w => (
                       <option key={w.Ref} value={w.Description}>{w.Description}</option>
                     ))}
                   </select>
                </div>
              )
            )}

            {/* Donation Checkbox (Появляется, когда выбран город) */}
            {formData.city && (
              <div 
                onClick={() => setFormData({...formData, isDonation: !formData.isDonation})}
                className={`p-3 border border-dashed cursor-pointer transition-colors flex items-center gap-3 mt-4 ${formData.isDonation ? 'border-kyiv-accent bg-kyiv-accent/10' : 'border-gray-700 hover:border-gray-500'}`}
              >
                <div className={`w-5 h-5 border flex items-center justify-center flex-shrink-0 ${formData.isDonation ? 'bg-kyiv-accent border-kyiv-accent text-black' : 'border-gray-600'}`}>
                  {formData.isDonation && '✓'}
                </div>
                <div className="text-xs">
                  <span className="text-white font-bold block mb-1">DONATION SPLIT</span>
                  <p className="text-gray-400 text-[10px] leading-tight">
                    Перерахувати 10% ({Math.floor(totalPrice * 0.1)} ₴) у фонд "Повернись Живим".
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button onClick={() => setStep(1)} className="flex-1 border border-gray-600 text-gray-400 hover:text-white transition-colors">BACK</button>
              <button 
                onClick={handleSubmit}
                disabled={!formData.warehouse || loading}
                className="flex-[2] bg-kyiv-accent text-black font-bold py-3 hover:bg-white disabled:opacity-50 transition-colors"
              >
                {loading ? 'PROCESSING...' : `CONFIRM (${totalPrice} ₴)`}
              </button>
            </div>
          </div>
        )}

        {/* ШАГ 3: Успех (Транспортная накладная) */}
        {step === 3 && (
          <div className="animate-in zoom-in duration-300 font-mono">
            {/* Заголовок терминала */}
            <div className="border-b border-kyiv-accent/30 pb-4 mb-6 flex justify-between items-end">
               <h3 className="text-lg text-kyiv-accent font-bold uppercase tracking-widest leading-none">
                 Waybill Generated_
               </h3>
               <span className="text-xs text-gray-500 leading-none">STATUS: CONFIRMED</span>
            </div>

            {/* Контейнер "Накладной" */}
            <div className="bg-[#111] p-6 border border-gray-700 relative overflow-hidden group">
               
               {/* Декоративный "шум" на фоне */}
               <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

               {/* Верхняя часть: Штрих-код и Трек-номер */}
               <div className="flex justify-between items-start mb-8 pb-6 border-b border-dashed border-gray-800">
                 {/* CSS-штрихкод (имитация) */}
                 <div className="h-14 w-2/3 overflow-hidden relative opacity-80">
                    <div className="w-[120%] h-full absolute inset-0" 
                         style={{backgroundImage: 'repeating-linear-gradient(90deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 3px, currentColor 3px, currentColor 4px, transparent 4px, transparent 8px)'}}>
                    </div>
                 </div>
                 <div className="text-right relative z-10">
                   <div className="text-gray-500 text-[10px] mb-1 uppercase">Tracking No.</div>
                   <div className="text-kyiv-accent text-lg font-bold tracking-wider">
                     NP-{Math.floor(Math.random() * 100000000)}
                   </div>
                 </div>
               </div>

               {/* Сетка данных */}
               <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-sm relative z-10">
                 <div className="col-span-2">
                   <div className="text-gray-500 text-[10px] mb-1 uppercase">Destination Point (NP)</div>
                   <div className="text-white uppercase text-xs leading-relaxed break-words pr-10">
                     <span className="text-kyiv-accent mr-2">[{formData.city}]</span> 
                     {formData.warehouse}
                   </div>
                 </div>
                 
                 <div>
                   <div className="text-gray-500 text-[10px] mb-1 uppercase">Recipient Info</div>
                   <div className="text-white uppercase text-xs font-bold">{formData.name}</div>
                   <div className="text-gray-400 text-xs tracking-wider">{formData.phone}</div>
                 </div>

                 <div>
                    <div className="text-gray-500 text-[10px] mb-1 uppercase">Logistics Data</div>
                    <div className="text-gray-300 text-xs flex justify-between">
                      <span>Weight:</span> <span>~2.5 kg</span>
                    </div>
                    <div className="text-gray-300 text-xs flex justify-between">
                      <span>Est. Delivery:</span> <span>24-48h</span>
                    </div>
                 </div>

                 <div className="col-span-2 border-t border-gray-800 pt-4 flex justify-between items-center">
                   <div className="text-gray-500 text-[10px] uppercase">Total Value</div>
                   <div className="text-kyiv-accent text-lg font-bold">{totalPrice} UAH</div>
                 </div>
               </div>

               {/* Штамп "ОПЛАЧЕНО" */}
               <div className="absolute top-1/2 right-4 border-2 border-kyiv-accent text-kyiv-accent px-4 py-2 text-sm font-bold uppercase -rotate-12 opacity-30 mix-blend-overlay pointer-events-none group-hover:opacity-50 transition-opacity">
                 DISPATCH READY
               </div>
            </div>

            <p className="text-gray-600 text-xs mt-6 text-center">
              Дані передано логістичному партнеру. Очікуйте SMS-сповіщення.
            </p>

            <button onClick={onClose} className="w-full mt-6 bg-white text-black font-bold py-4 hover:bg-kyiv-accent transition-colors uppercase tracking-widest text-xs">
              ACKNOWLEDGE & CLOSE TERMINAL
            </button>
          </div>
        )}

      </div>
    </div>
  );
}