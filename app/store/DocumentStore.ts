import { StateCreator } from "zustand";
import { RootStore, Document } from "./types";

// TypeScript interface for this store slice
export interface DocumentStore {
  documents: Document[];
  selectedDocument: Document | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string | null;
  
  // Actions
  setDocuments: (documents: Document[]) => void;
  addDocument: (document: Document) => void;
  updateDocument: (documentId: string, updates: Partial<Document>) => void;
  deleteDocument: (documentId: string) => void;
  selectDocument: (document: Document | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  
  // Document organization actions
  addTag: (documentId: string, tag: string) => void;
  removeTag: (documentId: string, tag: string) => void;
  moveDocument: (documentId: string, newTripId: string | null) => void;
  
  // Computed values
  getDocumentsForTrip: (tripId: string | null) => Document[];
  getDocumentsByCategory: (category: string) => Document[];
  getFilteredDocuments: () => Document[];
  getDocumentById: (documentId: string) => Document | undefined;
  getDocumentStats: () => {
    total: number;
    byCategory: Record<string, number>;
    byTrip: Record<string, number>;
  };
}

// Selectors for derived values
export const documentsSelector = (state: RootStore) => state.documents;
export const selectedDocumentSelector = (state: RootStore) => state.selectedDocument;
export const searchQuerySelector = (state: RootStore) => state.searchQuery;
export const selectedCategorySelector = (state: RootStore) => state.selectedCategory;

// create our store slice with default data and actions
export const createDocumentSlice: StateCreator<RootStore, [], [], DocumentStore> = (set, get) => ({
  documents: [],
  selectedDocument: null,
  isLoading: false,
  error: null,
  searchQuery: "",
  selectedCategory: null,
  
  setDocuments: (documents) => set({ documents, error: null }),
  
  addDocument: (document) => set((state) => ({ 
    documents: [...state.documents, document],
    error: null 
  })),
  
  updateDocument: (documentId, updates) => set((state) => ({
    documents: state.documents.map(doc => 
      doc.id === documentId 
        ? { ...doc, ...updates }
        : doc
    ),
    selectedDocument: state.selectedDocument?.id === documentId 
      ? { ...state.selectedDocument, ...updates }
      : state.selectedDocument,
    error: null
  })),
  
  deleteDocument: (documentId) => set((state) => ({
    documents: state.documents.filter(doc => doc.id !== documentId),
    selectedDocument: state.selectedDocument?.id === documentId ? null : state.selectedDocument,
    error: null
  })),
  
  selectDocument: (document) => set({ selectedDocument: document, error: null }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  
  addTag: (documentId, tag) => set((state) => ({
    documents: state.documents.map(doc => 
      doc.id === documentId 
        ? { ...doc, tags: [...doc.tags, tag] }
        : doc
    ),
    selectedDocument: state.selectedDocument?.id === documentId 
      ? { ...state.selectedDocument, tags: [...state.selectedDocument.tags, tag] }
      : state.selectedDocument,
    error: null
  })),
  
  removeTag: (documentId, tag) => set((state) => ({
    documents: state.documents.map(doc => 
      doc.id === documentId 
        ? { ...doc, tags: doc.tags.filter(t => t !== tag) }
        : doc
    ),
    selectedDocument: state.selectedDocument?.id === documentId 
      ? { ...state.selectedDocument, tags: state.selectedDocument.tags.filter(t => t !== tag) }
      : state.selectedDocument,
    error: null
  })),
  
  moveDocument: (documentId, newTripId) => set((state) => ({
    documents: state.documents.map(doc => 
      doc.id === documentId 
        ? { ...doc, tripId: newTripId }
        : doc
    ),
    selectedDocument: state.selectedDocument?.id === documentId 
      ? { ...state.selectedDocument, tripId: newTripId }
      : state.selectedDocument,
    error: null
  })),
  
  // Computed values
  getDocumentsForTrip: (tripId) => get().documents.filter(doc => doc.tripId === tripId),
  
  getDocumentsByCategory: (category) => get().documents.filter(doc => doc.type === category),
  
  getFilteredDocuments: () => {
    const state = get();
    let filtered = state.documents;
    
    // Filter by category
    if (state.selectedCategory) {
      filtered = filtered.filter(doc => doc.type === state.selectedCategory);
    }
    
    // Filter by search query
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(query) ||
        doc.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return filtered.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  },
  
  getDocumentById: (documentId) => get().documents.find(doc => doc.id === documentId),
  
  getDocumentStats: () => {
    const state = get();
    const stats = {
      total: state.documents.length,
      byCategory: {} as Record<string, number>,
      byTrip: {} as Record<string, number>
    };
    
    state.documents.forEach(doc => {
      // Count by category
      stats.byCategory[doc.type] = (stats.byCategory[doc.type] || 0) + 1;
      
      // Count by trip
      const tripKey = doc.tripId || 'unassigned';
      stats.byTrip[tripKey] = (stats.byTrip[tripKey] || 0) + 1;
    });
    
    return stats;
  },
});

// a selector can be used to grab the full DocumentStore
export const documentStoreSelector = (state: RootStore) => ({
  documents: state.documents,
  selectedDocument: state.selectedDocument,
  isLoading: state.isLoading,
  error: state.error,
  searchQuery: state.searchQuery,
  selectedCategory: state.selectedCategory,
  setDocuments: state.setDocuments,
  addDocument: state.addDocument,
  updateDocument: state.updateDocument,
  deleteDocument: state.deleteDocument,
  selectDocument: state.selectDocument,
  setLoading: state.setLoading,
  setError: state.setError,
  setSearchQuery: state.setSearchQuery,
  setSelectedCategory: state.setSelectedCategory,
  addTag: state.addTag,
  removeTag: state.removeTag,
  moveDocument: state.moveDocument,
  getDocumentsForTrip: state.getDocumentsForTrip,
  getDocumentsByCategory: state.getDocumentsByCategory,
  getFilteredDocuments: state.getFilteredDocuments,
  getDocumentById: state.getDocumentById,
  getDocumentStats: state.getDocumentStats,
});
