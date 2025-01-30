import { useState } from "react";

const useSelection = (initialSelected = new Set()) => {
  const [selectedItems, setSelectedItems] = useState(initialSelected);
  const [selectAll, setSelectAll] = useState(false);

  const toggleSelectAll = (items, idKey = 'id') => {
    setSelectAll(!selectAll);
    if (selectAll) {
        setSelectedItems(new Set());
    } else {
        setSelectedItems(new Set(items.map((item) => item[idKey])));
    }
  };

  const toggleSelectItem = (itemId) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(itemId)) {
        newSelectedItems.delete(itemId);
    } else {
        newSelectedItems.add(itemId);
    }
    setSelectedItems(newSelectedItems);
  };

  const clearSelected = () => {
     setSelectedItems(new Set());
     setSelectAll(false)
  }

  return {
    selectedItems,
    selectAll,
    toggleSelectAll,
    toggleSelectItem,
    clearSelected
  };
};

export default useSelection;