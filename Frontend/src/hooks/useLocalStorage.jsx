import { useState, useEffect } from "react";

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() =>
    JSON.parse(localStorage.getItem(key)) || initialValue
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};
