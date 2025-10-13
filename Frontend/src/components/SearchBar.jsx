import React, { useState } from "react";
import { Search, X } from "lucide-react";

const SearchBar = ({ onSearch ,className }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  const handleClear = () => {
    setQuery("");
    if (onSearch) onSearch("");
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`relative w-full sm:w-[400px] mx-auto flex items-center ${className}`}
    >
      {/* Search Icon */}
      <Search className="absolute left-3 text-muted-foreground" size={18} />

      {/* Input */}
      <input
        type="text"
        placeholder="Search for products, brands, or categories..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-10 pr-10 py-2 rounded-full border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all"
      />

      {/* Clear Button */}
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 text-muted-foreground hover:text-primary transition"
        >
          <X size={18} />
        </button>
      )}
    </form>
  );
};

export default SearchBar;
