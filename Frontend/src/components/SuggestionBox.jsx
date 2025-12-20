import React from "react";
const SuggestionBox = ({ suggestions, onSelect }) => {
  return (
    <div className="absolute z-10 w-[300px] left-1/2 -translate-x-1/2 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
      {suggestions.length === 0 ? (
        <div className="p-2 text-gray-500">No suggestions found</div>
      ) : (
        suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
            onClick={() => onSelect(suggestion.productName)}
            
          >
            <img width="30" src={suggestion.images[0].url} alt={suggestion.productName} />
            {suggestion.productName}
          </div>
        ))
      )}
    </div>
  );
}
export default SuggestionBox;