import { useState, useEffect } from 'react';

const useSearch = (unfilteredServers, fetchSearch) => {
  const [searchValue, setSearchValue] = useState("");
  const [isSearchButtonClicked, setIsSearchButtonClicked] = useState(false);
    useEffect(() => {
    if (isSearchButtonClicked) {
       if (searchValue.trim() === "") {
          fetchSearch("", 1, 10);
        } else {
          fetchSearch(searchValue,1,10);

        }
      setIsSearchButtonClicked(false);
    }
    }, [isSearchButtonClicked, searchValue, unfilteredServers, fetchSearch]);



  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchButtonClick = () => {
    setIsSearchButtonClicked(true); // Activa la busqueda
  };

    const filteredServers = (servers) => {
        return servers.filter((server) =>
        server.name.toLowerCase().includes(searchValue.toLowerCase())
        );
    }
  return {
    searchValue,
    handleSearchChange,
    handleSearchButtonClick,
    filteredServers,
  };
};

export default useSearch;