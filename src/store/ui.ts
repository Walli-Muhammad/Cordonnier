import { create } from 'zustand';

interface UIState {
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSearchOpen: false,
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  selectedCategory: null,
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));

