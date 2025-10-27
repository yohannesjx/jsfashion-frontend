import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// 🧱 Define the shape of a single cart item
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  [key: string]: any;
}

// 🧩 Define the store interface
interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  total: number;
  totalItems: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  setIsCartOpen: (open: boolean) => void;
  updateQuantity: (id: string, quantity: number) => void;
}

// 🪄 Utility to calculate totals
const calculateTotals = (items: CartItem[]) => {
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  return { total, totalItems };
};

// 🏪 Zustand store with persistence
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      total: 0,
      totalItems: 0,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          let newItems: CartItem[];

          if (existing) {
            newItems = state.items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            );
          } else {
            newItems = [...state.items, item];
          }

          const { total, totalItems } = calculateTotals(newItems);
          return { items: newItems, total, totalItems };
        }),

      updateQuantity: (id, quantity) =>
        set((state) => {
          const newItems = state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          );
          const { total, totalItems } = calculateTotals(newItems);
          return { items: newItems, total, totalItems };
        }),

      removeItem: (id) =>
        set((state) => {
          const newItems = state.items.filter((i) => i.id !== id);
          const { total, totalItems } = calculateTotals(newItems);
          return { items: newItems, total, totalItems };
        }),

      clearCart: () => set({ items: [], total: 0, totalItems: 0 }),

      setIsCartOpen: (open) => set(() => ({ isCartOpen: open })),
    }),
    {
      name: "jsfashion-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// 🧮 Selector for total item count
export const useCartTotalItems = () =>
  useCartStore((state) => state.totalItems);