// Простая база городов для демо
const CITIES = [
  "Київ", "Львів", "Одеса", "Дніпро", "Харків", 
  "Вінниця", "Запоріжжя", "Івано-Франківськ", "Луцьк"
];

// Генератор отделений (для любого города вернет 15-20 отделений)
export const searchCity = async (query: string) => {
  // Имитация задержки сети
  await new Promise(r => setTimeout(r, 300));
  
  return CITIES.filter(c => c.toLowerCase().includes(query.toLowerCase()));
};

export const getWarehouses = async (city: string) => {
  await new Promise(r => setTimeout(r, 300));
  
  // Генерируем фейковые отделения, чтобы выглядело реалистично
  return Array.from({ length: 15 }).map((_, i) => ({
    Ref: `wh-${i}`,
    Description: `Відділення №${i + 1}: вул. Незалежності, ${i * 4 + 1} (до 30 кг)`
  }));
};