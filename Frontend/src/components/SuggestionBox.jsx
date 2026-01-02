import React from "react";
import { Search, Package, Star } from "lucide-react";

const SuggestionBox = ({ suggestions, onSelect }) => {
  return (
    <div className="absolute z-50 w-full max-w-md left-1/2 -translate-x-1/2 top-full mt-2 bg-background border border-brand-primary/20 rounded-xl shadow-2xl max-h-96 overflow-hidden backdrop-blur-sm hover:shadow-brand-primary/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 border-b border-brand-primary/10 px-4 py-3 flex items-center gap-2">
        <Search className="w-4 h-4 text-brand-primary" />
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Search Results</p>
        {suggestions.length > 0 && (
          <span className="ml-auto text-xs font-medium text-brand-primary bg-brand-primary/10 px-2 py-1 rounded-full">
            {suggestions.length}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="overflow-y-auto max-h-80">
        {suggestions.length === 0 ? (
          <div className="p-6 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Package className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm font-medium">No products found</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Try a different search term</p>
          </div>
        ) : (
          <div className="py-2 px-2 space-y-1">
            {suggestions.map((suggestionProduct, index) => (
              <div
                key={index}
                className="p-3 hover:bg-gradient-to-r hover:from-brand-primary/10 hover:to-brand-secondary/10 cursor-pointer flex items-center gap-3 rounded-lg transition-all duration-200 group border border-transparent hover:border-brand-primary/20"
                onClick={() => onSelect(suggestionProduct)}
              >
                {/* Product Image */}
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden flex-shrink-0 border border-brand-primary/10 group-hover:border-brand-primary/30 transition-all">
                  {suggestionProduct.images && suggestionProduct.images[0] ? (
                    <img 
                      width="48" 
                      height="48"
                      src={suggestionProduct.images[0].url} 
                      alt={suggestionProduct.productName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <Package className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground group-hover:text-brand-primary transition-colors truncate">
                    {suggestionProduct.productName}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {suggestionProduct.price && (
                      <span className="text-xs font-bold text-brand-primary">
                        ₹{suggestionProduct.price?.toFixed(2)}
                      </span>
                    )}
                    {suggestionProduct.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-warning fill-warning" />
                        <span className="text-xs text-muted-foreground">{suggestionProduct.rating}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover Indicator */}
                <div className="text-brand-primary/0 group-hover:text-brand-primary transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {suggestions.length > 0 && (
        <div className="border-t border-brand-primary/10 bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 px-4 py-2 text-center">
          <p className="text-xs text-muted-foreground">Click to view product details</p>
        </div>
      )}
    </div>
  );
};

export default SuggestionBox;