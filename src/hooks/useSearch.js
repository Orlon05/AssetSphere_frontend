import { useState, useRef, useEffect } from "react";

const useSearch = (initialSearch = "") => {
  const [searchValue, setSearchValue] = useState(initialSearch);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchButtonClicked, setIsSearchButtonClicked] = useState(false);
  const searchInputRef = useRef(null);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    searchInputRef.current?.focus();
  };

  const handleSearchButtonClick = () => {
    setIsSearchButtonClicked(true);
  };

  const clearSearch = () => {
     setSearchValue("");
     setIsSearchButtonClicked(true);
   }

  return {
    searchValue,
    handleSearchChange,
    handleSearchButtonClick,
    isSearching,
    setIsSearching,
    isSearchButtonClicked,
    setIsSearchButtonClicked,
    searchInputRef,
    clearSearch
  };
};

export default useSearch;