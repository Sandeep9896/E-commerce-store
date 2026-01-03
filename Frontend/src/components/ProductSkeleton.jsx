import React from "react";

const ProductSkeleton = () => {
  return (
    <div className="group relative bg-background rounded-2xl border border-border/50 shadow-sm flex flex-col overflow-hidden animate-pulse">
      {/* Image Container Skeleton */}
      <div className="relative overflow-hidden bg-muted">
        <div className="w-full h-[180px] sm:h-[220px] bg-gradient-to-br from-muted via-muted-foreground/10 to-muted" />
        
        {/* Rating Badge Skeleton */}
        <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
          <div className="w-4 h-4 bg-muted rounded-full" />
          <div className="w-8 h-4 bg-muted rounded" />
        </div>
      </div>

      {/* Product Info Skeleton */}
      <div className="p-4 flex flex-col flex-grow space-y-3">
        {/* Product Name Skeleton */}
        <div className="space-y-2">
          <div className="h-5 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>

        {/* Price Section Skeleton */}
        <div className="mt-auto space-y-2">
          <div className="flex items-baseline gap-2">
            <div className="h-6 bg-muted rounded w-20" />
            <div className="h-4 bg-muted rounded w-16" />
          </div>
          
          {/* In Stock Skeleton */}
          <div className="flex items-center">
            <div className="w-3 h-3 bg-muted rounded-full mr-1" />
            <div className="h-3 bg-muted rounded w-16" />
          </div>
        </div>
      </div>

      {/* Shimmer Effect Overlay */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
    </div>
  );
};

export default ProductSkeleton;
