'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface RecycleBinItem {
  id: string;
  name: string;
  originalPath: string;
  size: number;
  deletedAt: string;
  type: 'file' | 'directory' | 'desktopApp';
  content?: string;
  appData?: {
    processName: string;
    originalPosition: { x: number; y: number };
  };
}

interface RecycleBinContextType {
  items: RecycleBinItem[];
  addItem: (item: Omit<RecycleBinItem, 'id' | 'deletedAt'>) => void;
  addItemWithContent: (item: Omit<RecycleBinItem, 'id' | 'deletedAt'>, content: string) => void;
  removeItem: (id: string) => void;
  restoreItem: (id: string) => RecycleBinItem | null;
  emptyBin: () => void;
  getItemCount: () => number;
  getDeletedItem: (id: string) => RecycleBinItem | undefined;
}

const RecycleBinContext = createContext<RecycleBinContextType | null>(null);

export function useRecycleBin() {
  const context = useContext(RecycleBinContext);
  if (!context) {
    throw new Error('useRecycleBin must be used within a RecycleBinProvider');
  }
  return context;
}

export function RecycleBinProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<RecycleBinItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('recycleBin');
    if (saved) {
      try {
        const parsedItems = JSON.parse(saved);
        // Also try to load content from separate storage
        const contentStorage = localStorage.getItem('recycleBinContents');
        if (contentStorage) {
          const contents = JSON.parse(contentStorage);
          // Merge contents with items
          parsedItems.forEach((item: RecycleBinItem) => {
            if (contents[item.id]) {
              item.content = contents[item.id];
            }
          });
        }
        setItems(parsedItems);
      } catch (e) {
        console.error('Failed to load recycle bin:', e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('recycleBin', JSON.stringify(items));
    // Also save contents separately for files
    const contents: Record<string, string> = {};
    items.forEach(item => {
      if (item.type === 'file' && item.content) {
        contents[item.id] = item.content;
      }
    });
    if (Object.keys(contents).length > 0) {
      localStorage.setItem('recycleBinContents', JSON.stringify(contents));
    } else {
      localStorage.removeItem('recycleBinContents');
    }
  }, [items]);

  const addItem = useCallback((item: Omit<RecycleBinItem, 'id' | 'deletedAt'>) => {
    const newItem: RecycleBinItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      deletedAt: new Date().toISOString(),
    };
    setItems(prev => [...prev, newItem]);
  }, []);

  const addItemWithContent = useCallback((item: Omit<RecycleBinItem, 'id' | 'deletedAt'>, content: string) => {
    const newItem: RecycleBinItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      deletedAt: new Date().toISOString(),
      content,
    };
    setItems(prev => [...prev, newItem]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => {
      const newItems = prev.filter(item => item.id !== id);
      // Clean up content from localStorage
      const contentKey = `recycleBin_${id}`;
      localStorage.removeItem(contentKey);
      return newItems;
    });
  }, []);

  const restoreItem = useCallback((id: string): RecycleBinItem | null => {
    let restoredItem: RecycleBinItem | null = null;
    setItems(prev => {
      const item = prev.find(i => i.id === id);
      if (item) {
        restoredItem = { ...item };
      }
      return prev.filter(i => i.id !== id);
    });
    return restoredItem;
  }, []);

  const emptyBin = useCallback(() => {
    setItems([]);
    // Clear all stored contents
    localStorage.removeItem('recycleBinContents');
  }, []);

  const getItemCount = useCallback(() => {
    return items.length;
  }, [items]);

  const getDeletedItem = useCallback((id: string) => {
    return items.find(item => item.id === id);
  }, [items]);

  return (
    <RecycleBinContext.Provider value={{
      items,
      addItem,
      addItemWithContent,
      removeItem,
      restoreItem,
      emptyBin,
      getItemCount,
      getDeletedItem,
    }}>
      {children}
    </RecycleBinContext.Provider>
  );
}
