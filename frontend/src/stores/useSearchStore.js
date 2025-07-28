import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useSearchStore = create((set) => ({
  searchResults: [],
  searchQuery: "",
  loading: false,
  showDropdown: false,

  setSearchQuery: (query) => set({ searchQuery: query }),

  setShowDropdown: (show) => set({ showDropdown: show }),

  searchProducts: async (query) => {
    if (!query.trim()) {
      set({ searchResults: [], showDropdown: false });
      return;
    }

    set({ loading: true });
    try {
      const response = await axios.get(
        `/products/search?q=${encodeURIComponent(query)}`
      );
      set({
        searchResults: response.data.products || [],
        loading: false,
        showDropdown: true,
      });
    } catch (error) {
      set({
        searchResults: [],
        loading: false,
        showDropdown: false,
      });
      console.error("Search error:", error);
      if (error.response?.status !== 404) {
        toast.error("Failed to search products");
      }
    }
  },

  clearSearch: () =>
    set({
      searchQuery: "",
      searchResults: [],
      showDropdown: false,
    }),
}));
