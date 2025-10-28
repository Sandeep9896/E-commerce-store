import { useState, useEffect } from "react";

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);

      // If no item exists, return initial value
      if (item === null) {
        return initialValue;
      }

      // Try to parse as JSON first
      try {
        return JSON.parse(item);
      } catch {
        // If parsing fails, return the raw string (for tokens, etc.)
        return item;
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      // Store as JSON if it's an object, otherwise store as string
      if (typeof value === "object" && value !== null) {
        localStorage.setItem(key, JSON.stringify(value));
      } else {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue];
};
