import { create } from 'zustand';
import { Dataset } from '../types';
import { 
  createDataset, 
  getDataset, 
  getUserDatasets, 
  updateDataset, 
  deleteDataset 
} from '../firebase/firestore';
import { graphQLClient } from '../graphql/client';
import { GET_EXTERNAL_DATASETS, GET_EXTERNAL_DATASET, SEARCH_EXTERNAL_DATASETS } from '../graphql/queries';
import { IMPORT_EXTERNAL_DATASET } from '../graphql/mutations';
import Papa from 'papaparse';

interface DatasetState {
  datasets: Dataset[];
  currentDataset: Dataset | null;
  isLoading: boolean;
  error: string | null;
  
  fetchUserDatasets: (userId: string) => Promise<void>;
  fetchDataset: (id: string) => Promise<Dataset | null>;
  createNewDataset: (dataset: Omit<Dataset, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Dataset>;
  updateDataset: (id: string, data: Partial<Dataset>) => Promise<void>;
  deleteDataset: (id: string) => Promise<void>;
  setCurrentDataset: (dataset: Dataset | null) => void;
  
  // External data sources
  fetchExternalDatasets: (limit?: number, offset?: number) => Promise<any[]>;
  fetchExternalDataset: (id: string) => Promise<any>;
  searchExternalDatasets: (query: string, limit?: number) => Promise<any[]>;
  importExternalDataset: (id: string, name?: string, description?: string) => Promise<Dataset>;
  
  // File import
  importFromCSV: (file: File, name: string, description?: string, ownerId: string) => Promise<Dataset>;
  importFromJSON: (file: File, name: string, description?: string, ownerId: string) => Promise<Dataset>;
  
  clearError: () => void;
}

export const useDatasetStore = create<DatasetState>((set, get) => ({
  datasets: [],
  currentDataset: null,
  isLoading: false,
  error: null,
  
  fetchUserDatasets: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      const datasets = await getUserDatasets(userId);
      set({ datasets, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch datasets', 
        isLoading: false 
      });
    }
  },
  
  fetchDataset: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const dataset = await getDataset(id);
      if (dataset) {
        set({ currentDataset: dataset, isLoading: false });
      } else {
        set({ error: 'Dataset not found', isLoading: false });
      }
      return dataset;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch dataset', 
        isLoading: false 
      });
      return null;
    }
  },
  
  createNewDataset: async (dataset: Omit<Dataset, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      set({ isLoading: true, error: null });
      const newDataset = await createDataset(dataset);
      set(state => ({ 
        datasets: [...state.datasets, newDataset],
        currentDataset: newDataset,
        isLoading: false 
      }));
      return newDataset;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create dataset', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  updateDataset: async (id: string, data: Partial<Dataset>) => {
    try {
      set({ isLoading: true, error: null });
      await updateDataset(id, data);
      
      set(state => ({
        datasets: state.datasets.map(d => d.id === id ? { ...d, ...data } : d),
        currentDataset: state.currentDataset?.id === id ? { ...state.currentDataset, ...data } : state.currentDataset,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update dataset', 
        isLoading: false 
      });
    }
  },
  
  deleteDataset: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await deleteDataset(id);
      
      set(state => ({
        datasets: state.datasets.filter(d => d.id !== id),
        currentDataset: state.currentDataset?.id === id ? null : state.currentDataset,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete dataset', 
        isLoading: false 
      });
    }
  },
  
  setCurrentDataset: (dataset: Dataset | null) => {
    set({ currentDataset: dataset });
  },
  
  // External data sources
  fetchExternalDatasets: async (limit = 10, offset = 0) => {
    try {
      set({ isLoading: true, error: null });
      const { datasets } = await graphQLClient.request(GET_EXTERNAL_DATASETS, { limit, offset });
      set({ isLoading: false });
      return datasets;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch external datasets', 
        isLoading: false 
      });
      return [];
    }
  },
  
  fetchExternalDataset: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const { dataset } = await graphQLClient.request(GET_EXTERNAL_DATASET, { id });
      set({ isLoading: false });
      return dataset;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch external dataset', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  searchExternalDatasets: async (query: string, limit = 10) => {
    try {
      set({ isLoading: true, error: null });
      const { searchDatasets } = await graphQLClient.request(SEARCH_EXTERNAL_DATASETS, { query, limit });
      set({ isLoading: false });
      return searchDatasets;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to search external datasets', 
        isLoading: false 
      });
      return [];
    }
  },
  
  importExternalDataset: async (id: string, name?: string, description?: string) => {
    try {
      set({ isLoading: true, error: null });
      const { importExternalDataset: externalDataset } = await graphQLClient.request(
        IMPORT_EXTERNAL_DATASET, 
        { id, name, description }
      );
      
      // Convert the external dataset to our internal format
      const { id: externalId, ...rest } = externalDataset;
      
      // Get the current user ID from the auth store
      const userId = get().currentDataset?.ownerId || '';
      
      // Create a new dataset in our system
      const newDataset = await createDataset({
        ...rest,
        ownerId: userId,
        sharedWith: []
      });
      
      set(state => ({ 
        datasets: [...state.datasets, newDataset],
        currentDataset: newDataset,
        isLoading: false 
      }));
      
      return newDataset;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to import external dataset', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  // File import
  importFromCSV: async (file: File, name: string, description = '', ownerId: string) => {
    return new Promise<Dataset>((resolve, reject) => {
      set({ isLoading: true, error: null });
      
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: async (results) => {
          try {
            if (results.errors && results.errors.length > 0) {
              throw new Error(`CSV parsing error: ${results.errors[0].message}`);
            }
            
            const data = results.data;
            const columns = results.meta.fields || [];
            
            // Determine data types for each column
            const dataTypes: Record<string, string> = {};
            if (data.length > 0) {
              const firstRow = data[0];
              for (const column of columns) {
                const value = firstRow[column];
                if (typeof value === 'number') {
                  dataTypes[column] = 'number';
                } else if (typeof value === 'boolean') {
                  dataTypes[column] = 'boolean';
                } else if (value instanceof Date) {
                  dataTypes[column] = 'date';
                } else {
                  dataTypes[column] = 'string';
                }
              }
            }
            
            const newDataset = await get().createNewDataset({
              name,
              description,
              ownerId,
              data,
              columns,
              dataTypes,
              sharedWith: []
            });
            
            set({ isLoading: false });
            resolve(newDataset);
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to import CSV', 
              isLoading: false 
            });
            reject(error);
          }
        },
        error: (error) => {
          set({ 
            error: error.message, 
            isLoading: false 
          });
          reject(error);
        }
      });
    });
  },
  
  importFromJSON: async (file: File, name: string, description = '', ownerId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const text = await file.text();
      const jsonData = JSON.parse(text);
      
      let data: any[] = [];
      let columns: string[] = [];
      
      // Handle different JSON formats
      if (Array.isArray(jsonData)) {
        data = jsonData;
        if (data.length > 0) {
          columns = Object.keys(data[0]);
        }
      } else if (typeof jsonData === 'object' && jsonData !== null) {
        // Try to find an array property in the JSON
        for (const key in jsonData) {
          if (Array.isArray(jsonData[key])) {
            data = jsonData[key];
            if (data.length > 0) {
              columns = Object.keys(data[0]);
            }
            break;
          }
        }
        
        // If no array found, convert the object to an array
        if (data.length === 0) {
          data = [jsonData];
          columns = Object.keys(jsonData);
        }
      }
      
      // Determine data types for each column
      const dataTypes: Record<string, string> = {};
      if (data.length > 0) {
        const firstRow = data[0];
        for (const column of columns) {
          const value = firstRow[column];
          if (typeof value === 'number') {
            dataTypes[column] = 'number';
          } else if (typeof value === 'boolean') {
            dataTypes[column] = 'boolean';
          } else if (value instanceof Date) {
            dataTypes[column] = 'date';
          } else {
            dataTypes[column] = 'string';
          }
        }
      }
      
      const newDataset = await get().createNewDataset({
        name,
        description,
        ownerId,
        data,
        columns,
        dataTypes,
        sharedWith: []
      });
      
      set({ isLoading: false });
      return newDataset;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to import JSON', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  clearError: () => {
    set({ error: null });
  }
}));