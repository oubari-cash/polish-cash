"use client";

import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [stored, setStored] = useState<T>(initialValue);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) setStored(JSON.parse(item));
    } catch {
      // Ignore parse errors
    }
  }, [key]);

  // Persist to localStorage on change
  const setValue = (value: T | ((prev: T) => T)) => {
    setStored(prev => {
      const next = value instanceof Function ? value(prev) : value;
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // Ignore quota errors
      }
      return next;
    });
  };

  return [stored, setValue];
}
