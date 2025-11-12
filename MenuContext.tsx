import React, { createContext, useContext, useState } from 'react';

export type Meal = { name: string; image?: any; price?: number; description?: string };
export type MenuShape = {
Starters: Meal[];
Platters: Meal[];
'Main Course': Meal[];
 Desserts: Meal[];
};

const initialMenu: MenuShape = {
 Starters: [
 { name: 'Garlic Bread', image: require('./assets/garlicbread.jpg'), price: 35 },
{ name: 'Soup', image: require('./assets/soup.jpg'), price: 45 },
 { name: 'oysters', image: require('./assets/oysters.jpg'), price: 120 },
 { name: 'Salad', image: require('./assets/salad.jpg'), price: 55 },
],
 Platters: [
 { name: 'Cheese Platter', image: require('./assets/cheese.webp'), price: 220 },
{ name: 'Seafood Platter', image: require('./assets/seafood.webp'), price: 340 },
{ name: 'Meat Platter', image: require('./assets/meat.jpg'), price: 280 },
{ name: 'Veggie Platter', image: require('./assets/veggie.jpg'), price: 190 },
 ],
 'Main Course': [
 { name: 'Steak and Chips', image: require('./assets/steak.jpg'), price: 260 },
 { name: 'Grilled Chicken', image: require('./assets/chicken.jpg'), price: 180 },
 { name: 'Pasta', image: require('./assets/pasta.jpg'), price: 150 },
  { name: 'Fish and Rice', image: require('./assets/fish.jpg'), price: 200 },
 ],
 Desserts: [
  { name: 'Pancakes', image: require('./assets/Pancakes.jpg'), price: 90 },
 { name: 'Ice Cream', image: require('./assets/IceCream.jpg'), price: 60 },
  { name: 'Fruit Tart', image: require('./assets/tart.jpg'), price: 85 },
 { name: 'Pudding', image: require('./assets/pudding.jpg'), price: 70 },
 ],
};

type MenuContextType = {
 menu: MenuShape;
 addMealsBulk: (bulk: Partial<MenuShape>) => void;
 addMeal: (category: keyof MenuShape, meal: Meal) => void;
  //  Setter function to allow full menu replacement (for ChefAdd config)
  setMenu: React.Dispatch<React.SetStateAction<MenuShape>>;
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
const [menu, setMenu] = useState<MenuShape>(initialMenu);

 const addMealsBulk = (bulk: Partial<MenuShape>) => {
 setMenu(prev => {
   const copy = { ...prev } as MenuShape;
 (Object.keys(bulk) as Array<keyof MenuShape>).forEach(k => {
 const items = bulk[k] || [];
 copy[k] = [...copy[k], ...items!];
 });
 return copy;
 });
 };

 const addMeal = (category: keyof MenuShape, meal: Meal) => {
 setMenu(prev => ({ ...prev, [category]: [...prev[category], meal] }));
 };

 
 return <MenuContext.Provider value={{ menu, addMealsBulk, addMeal, setMenu }}>{children}</MenuContext.Provider>;
};

export const useMenu = () => {
 const ctx = useContext(MenuContext);
 if (!ctx) throw new Error('useMenu must be used within MenuProvider');
 return ctx;
};