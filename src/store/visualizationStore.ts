import { create } from 'zustand';
import { Visualization, ChartType, ChartConfig } from '../types';
import { 
  createVisualization, 
  getVisualization, 
  getUserVisualizations, 
  getDatasetVisualizations,
  updateVisualization, 
  deleteVisualization 
} from '../firebase/firestore';
import { graphQLClient } from '../graphql/client';
import { GET_VISUALIZATION_TEMPLATES } from '../graphql/queries';
import { SHARE_VISUALIZATION } from '../graphql/mutations';

interface VisualizationState {
  visualizations: Visualization[];
  currentVisualization: Visualization | null;
  isLoading: boolean;
  error: string | null;
  
  fetchUserVisualizations: (userId: string) => Promise<void>;
  fetchDatasetVisualizations: (datasetId: string) => Promise<void>;
  fetchVisualization: (id: string) => Promise<Visualization | null>;
  createNewVisualization: (visualization: Omit<Visualization, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Visualization>;
  updateVisualization: (id: string, data: Partial<Visualization>) => Promise<void>;
  deleteVisualization: (id: string) => Promise<void>;
  setCurrentVisualization: (visualization: Visualization | null) => void;
  
  // Templates
  fetchVisualizationTemplates: (type?: ChartType) => Promise<any[]>;
  
  // Sharing
  shareVisualization: (id: string, email: string) => Promise<void>;
  
  clearError: () => void;
}

export const useVisualizationStore = create<VisualizationState>((set, get) => ({
  visualizations: [],
  currentVisualization: null,
  isLoading: false,
  error: null,
  
  fetchUserVisualizations: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      const visualizations = await getUserVisualizations(userId);
      set({ visualizations, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch visualizations', 
        isLoading: false 
      });
    }
  },
  
  fetchDatasetVisualizations: async (datasetId: string) => {
    try {
      set({ isLoading: true, error: null });
      const visualizations = await getDatasetVisualizations(datasetId);
      set({ visualizations, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch dataset visualizations', 
        isLoading: false 
      });
    }
  },
  
  fetchVisualization: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const visualization = await getVisualization(id);
      if (visualization) {
        set({ currentVisualization: visualization, isLoading: false });
      } else {
        set({ error: 'Visualization not found', isLoading: false });
      }
      return visualization;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch visualization', 
        isLoading: false 
      });
      return null;
    }
  },
  
  createNewVisualization: async (visualization: Omit<Visualization, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      set({ isLoading: true, error: null });
      const newVisualization = await createVisualization(visualization);
      set(state => ({ 
        visualizations: [...state.visualizations, newVisualization],
        currentVisualization: newVisualization,
        isLoading: false 
      }));
      return newVisualization;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create visualization', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  updateVisualization: async (id: string, data: Partial<Visualization>) => {
    try {
      set({ isLoading: true, error: null });
      await updateVisualization(id, data);
      
      set(state => ({
        visualizations: state.visualizations.map(v => v.id === id ? { ...v, ...data } : v),
        currentVisualization: state.currentVisualization?.id === id ? { ...state.currentVisualization, ...data } : state.currentVisualization,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update visualization', 
        isLoading: false 
      });
    }
  },
  
  deleteVisualization: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await deleteVisualization(id);
      
      set(state => ({
        visualizations: state.visualizations.filter(v => v.id !== id),
        currentVisualization: state.currentVisualization?.id === id ? null : state.currentVisualization,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete visualization', 
        isLoading: false 
      });
    }
  },
  
  setCurrentVisualization: (visualization: Visualization | null) => {
    set({ currentVisualization: visualization });
  },
  
  // Templates
  fetchVisualizationTemplates: async (type?: ChartType) => {
    try {
      set({ isLoading: true, error: null });
      const { visualizationTemplates } = await graphQLClient.request(GET_VISUALIZATION_TEMPLATES, { type });
      set({ isLoading: false });
      return visualizationTemplates;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch visualization templates', 
        isLoading: false 
      });
      return [];
    }
  },
  
  // Sharing
  shareVisualization: async (id: string, email: string) => {
    try {
      set({ isLoading: true, error: null });
      const { shareVisualization: result } = await graphQLClient.request(SHARE_VISUALIZATION, { id, email });
      
      set(state => ({
        visualizations: state.visualizations.map(v => v.id === id ? { ...v, sharedWith: result.sharedWith } : v),
        currentVisualization: state.currentVisualization?.id === id ? { ...state.currentVisualization, sharedWith: result.sharedWith } : state.currentVisualization,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to share visualization', 
        isLoading: false 
      });
    }
  },
  
  clearError: () => {
    set({ error: null });
  }
}));