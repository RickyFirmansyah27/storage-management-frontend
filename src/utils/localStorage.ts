
// Type definitions
export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Item {
  id: string;
  name: string;
  categoryId: string;
  quantity: number;
  unit: string;
  minStock?: number;
}

export interface StockMovement {
  id: string;
  itemId: string;
  type: 'in' | 'out';
  quantity: number;
  date: string;
  notes: string;
}

// Categories
export const getAllCategories = (): Category[] => {
  const categories = localStorage.getItem('categories');
  return categories ? JSON.parse(categories) : [];
};

export const saveCategory = (category: Category): void => {
  const categories = getAllCategories();
  const existingIndex = categories.findIndex(c => c.id === category.id);
  
  if (existingIndex >= 0) {
    categories[existingIndex] = category;
  } else {
    categories.push(category);
  }
  
  localStorage.setItem('categories', JSON.stringify(categories));
};

export const deleteCategory = (id: string): void => {
  let categories = getAllCategories();
  categories = categories.filter(category => category.id !== id);
  localStorage.setItem('categories', JSON.stringify(categories));
};

// Items
export const getAllItems = (): Item[] => {
  const items = localStorage.getItem('items');
  return items ? JSON.parse(items) : [];
};

export const saveItem = (item: Item): void => {
  const items = getAllItems();
  const existingIndex = items.findIndex(i => i.id === item.id);
  
  if (existingIndex >= 0) {
    items[existingIndex] = item;
  } else {
    items.push(item);
  }
  
  localStorage.setItem('items', JSON.stringify(items));
};

export const deleteItem = (id: string): void => {
  let items = getAllItems();
  items = items.filter(item => item.id !== id);
  localStorage.setItem('items', JSON.stringify(items));
};

export const updateItemStock = (id: string, newQuantity: number): void => {
  const items = getAllItems();
  const item = items.find(i => i.id === id);
  
  if (item) {
    item.quantity = newQuantity;
    localStorage.setItem('items', JSON.stringify(items));
  }
};

// Stock Movements
export const getAllStockMovements = (): StockMovement[] => {
  const movements = localStorage.getItem('stockMovements');
  return movements ? JSON.parse(movements) : [];
};

export const saveStockMovement = (movement: StockMovement): void => {
  const movements = getAllStockMovements();
  movements.push(movement);
  localStorage.setItem('stockMovements', JSON.stringify(movements));
};
