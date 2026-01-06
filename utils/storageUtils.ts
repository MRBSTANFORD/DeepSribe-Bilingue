import { DocumentData } from '../types';

const STORAGE_KEY = 'scribe_ai_docs';

export const saveDocument = (doc: DocumentData): DocumentData[] => {
  const existing = getDocuments();
  // Check if update or new (by ID)
  const index = existing.findIndex(d => d.id === doc.id);
  let updated: DocumentData[];
  
  if (index >= 0) {
    updated = [...existing];
    updated[index] = doc;
  } else {
    updated = [doc, ...existing];
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const saveAllDocuments = (docs: DocumentData[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
};

export const getDocuments = (): DocumentData[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to load documents", e);
    return [];
  }
};

export const deleteDocument = (id: string): DocumentData[] => {
  const existing = getDocuments();
  // Ensure we compare as strings to avoid any number/string type mismatches
  const updated = existing.filter(d => String(d.id) !== String(id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};