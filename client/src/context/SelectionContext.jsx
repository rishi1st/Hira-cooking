import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

const SelectionContext = createContext(null);

export const SelectionProvider = ({ children }) => {
  // Map keyed by food _id so toggling/removing is O(1) and order-stable.
  const [selectedFoods, setSelectedFoods] = useState([]);

  const isSelected = useCallback(
    (id) => selectedFoods.some((f) => f._id === id),
    [selectedFoods]
  );

  const toggleFood = useCallback((food) => {
    setSelectedFoods((prev) => {
      const exists = prev.some((f) => f._id === food._id);
      if (exists) return prev.filter((f) => f._id !== food._id);
      return [...prev, food];
    });
  }, []);

  const removeFood = useCallback((id) => {
    setSelectedFoods((prev) => prev.filter((f) => f._id !== id));
  }, []);

  const clearSelection = useCallback(() => setSelectedFoods([]), []);

  const value = useMemo(
    () => ({
      selectedFoods,
      selectedCount: selectedFoods.length,
      isSelected,
      toggleFood,
      removeFood,
      clearSelection,
    }),
    [selectedFoods, isSelected, toggleFood, removeFood, clearSelection]
  );

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
};

export const useSelection = () => {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error("useSelection must be used within SelectionProvider");
  return ctx;
};
