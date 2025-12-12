import { create } from 'zustand';

export type Product = {
  id: number;
  title: string;
  price: number;
  // Указываем точно, какие строки мы ждем
  layer: 'base' | 'mid' | 'outer' | 'bottom' | 'shoes' | 'accessory';
  volume_index: number;
  image_url: string;
};

// Тип для слоев
export type LayerType = Product['layer'];

interface OutfitState {
  // Используем Record, чтобы сказать TS: "тут ключи - это наши типы слоев"
  layers: Record<LayerType, Product | null>;
  totalPrice: number;
  
  equipItem: (item: Product) => void;
  unequipItem: (layer: LayerType) => void;
}

export const useOutfitStore = create<OutfitState>((set, get) => ({
  layers: {
    base: null,
    mid: null,
    outer: null,
    bottom: null,
    shoes: null,
    accessory: null, // <-- ДОБАВИЛИ ЭТО (из-за этого была ошибка)
  },
  totalPrice: 0,

  equipItem: (item) => {
    const currentLayers = get().layers;
    
    // Логика конфликтов
    if (item.layer === 'outer' && currentLayers.mid) {
      if (currentLayers.mid.volume_index > item.volume_index) {
        alert(`❌ ОШИБКА: "${item.title}" не налезет на "${currentLayers.mid.title}"!`);
        return;
      }
    }

    set((state) => {
      const newLayers = { ...state.layers, [item.layer]: item };
      
      const newPrice = Object.values(newLayers)
        .filter((i): i is Product => i !== null)
        .reduce((sum, i) => sum + i.price, 0);

      return { 
        layers: newLayers,
        totalPrice: newPrice
      };
    });
  },

  unequipItem: (layer) => set((state) => ({
    layers: { ...state.layers, [layer]: null }
  })),
}));