import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  setIsCartOpen: (open: boolean) => void;
  updateQuantity: (id: string, quantity: number) => void; // ✅ added
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      total: 0, // ✅ initialize total to 0

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          let newItems;
          if (existing) {
            newItems = state.items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            );
          } else {
            newItems = [...state.items, item];
          }

          const newTotal = newItems.reduce(
            (sum, i) => sum + i.price * i.quantity,
            0
          );

          return { items: newItems, total: newTotal };
        }),
      // ✅ (store/cart.ts)
updateQuantity: (id, quantity) =>
  set((state) => {
    const newItems = state.items.map((i) =>
      i.id === id ? { ...i, quantity } : i
    );
    const newTotal = newItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );
    return { items: newItems, total: newTotal };
  }),

      removeItem: (id) =>
        set((state) => {
          const newItems = state.items.filter((i) => i.id !== id);
          const newTotal = newItems.reduce(
            (sum, i) => sum + i.price * i.quantity,
            0
          );
          return { items: newItems, total: newTotal };
        }),

      clearCart: () => set({ items: [], total: 0 }),

      setIsCartOpen: (open) => set(() => ({ isCartOpen: open })),
    }),
    {
      name: "jsfashion-cart",
      getStorage: () => localStorage,
    }
  )
);

export const useCartTotalItems = () =>
  useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );