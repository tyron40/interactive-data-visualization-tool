import { create } from 'zustand';
import { Dashboard, DashboardVisualization } from '../types';
import { 
  createDashboard, 
  getDashboard, 
  getUserDashboards, 
  updateDashboard, 
  deleteDashboard 
} from '../firebase/firestore';
import { graphQLClient } from '../graphql/client';
import { SHARE_DASHBOARD } from '../graphql/mutations';

interface DashboardState {
  dashboards: Dashboard[];
  currentDashboard: Dashboard | null;
  isLoading: boolean;
  error: string | null;
  
  fetchUserDashboards: (userId: string) => Promise<void>;
  fetchDashboard: (id: string) => Promise<Dashboard | null>;
  createNewDashboard: (dashboard: Omit<Dashboard, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Dashboard>;
  updateDashboard: (id: string, data: Partial<Dashboard>) => Promise<void>;
  deleteDashboard: (id: string) => Promise<void>;
  setCurrentDashboard: (dashboard: Dashboard | null) => void;
  
  // Dashboard visualizations
  addVisualizationToDashboard: (dashboardId: string, visualizationId: string, position: { x: number, y: number, w: number, h: number }) => Promise<void>;
  updateVisualizationPosition: (dashboardId: string, visualizationId: string, position: { x: number, y: number, w: number, h: number }) => Promise<void>;
  removeVisualizationFromDashboard: (dashboardId: string, visualizationId: string) => Promise<void>;
  
  // Sharing
  shareDashboard: (id: string, email: string) => Promise<void>;
  
  clearError: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  dashboards: [],
  currentDashboard: null,
  isLoading: false,
  error: null,
  
  fetchUserDashboards: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      const dashboards = await getUserDashboards(userId);
      set({ dashboards, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch dashboards', 
        isLoading: false 
      });
    }
  },
  
  fetchDashboard: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const dashboard = await getDashboard(id);
      if (dashboard) {
        set({ currentDashboard: dashboard, isLoading: false });
      } else {
        set({ error: 'Dashboard not found', isLoading: false });
      }
      return dashboard;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch dashboard', 
        isLoading: false 
      });
      return null;
    }
  },
  
  createNewDashboard: async (dashboard: Omit<Dashboard, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      set({ isLoading: true, error: null });
      const newDashboard = await createDashboard(dashboard);
      set(state => ({ 
        dashboards: [...state.dashboards, newDashboard],
        currentDashboard: newDashboard,
        isLoading: false 
      }));
      return newDashboard;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create dashboard', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  updateDashboard: async (id: string, data: Partial<Dashboard>) => {
    try {
      set({ isLoading: true, error: null });
      await updateDashboard(id, data);
      
      set(state => ({
        dashboards: state.dashboards.map(d => d.id === id ? { ...d, ...data } : d),
        currentDashboard: state.currentDashboard?.id === id ? { ...state.currentDashboard, ...data } : state.currentDashboard,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update dashboard', 
        isLoading: false 
      });
    }
  },
  
  deleteDashboard: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await deleteDashboard(id);
      
      set(state => ({
        dashboards: state.dashboards.filter(d => d.id !== id),
        currentDashboard: state.currentDashboard?.id === id ? null : state.currentDashboard,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete dashboard', 
        isLoading: false 
      });
    }
  },
  
  setCurrentDashboard: (dashboard: Dashboard | null) => {
    set({ currentDashboard: dashboard });
  },
  
  // Dashboard visualizations
  addVisualizationToDashboard: async (dashboardId: string, visualizationId: string, position: { x: number, y: number, w: number, h: number }) => {
    try {
      set({ isLoading: true, error: null });
      
      const dashboard = await getDashboard(dashboardId);
      if (!dashboard) {
        throw new Error('Dashboard not found');
      }
      
      const newVisualization: DashboardVisualization = {
        id: `${dashboardId}-${visualizationId}-${Date.now()}`,
        visualizationId,
        ...position
      };
      
      const updatedVisualizations = [...dashboard.visualizations, newVisualization];
      
      await updateDashboard(dashboardId, { visualizations: updatedVisualizations });
      
      set(state => ({
        dashboards: state.dashboards.map(d => d.id === dashboardId ? { ...d, visualizations: updatedVisualizations } : d),
        currentDashboard: state.currentDashboard?.id === dashboardId ? { ...state.currentDashboard, visualizations: updatedVisualizations } : state.currentDashboard,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add visualization to dashboard', 
        isLoading: false 
      });
    }
  },
  
  updateVisualizationPosition: async (dashboardId: string, visualizationId: string, position: { x: number, y: number, w: number, h: number }) => {
    try {
      set({ isLoading: true, error: null });
      
      const dashboard = await getDashboard(dashboardId);
      if (!dashboard) {
        throw new Error('Dashboard not found');
      }
      
      const updatedVisualizations = dashboard.visualizations.map(v => 
        v.visualizationId === visualizationId ? { ...v, ...position } : v
      );
      
      await updateDashboard(dashboardId, { visualizations: updatedVisualizations });
      
      set(state => ({
        dashboards: state.dashboards.map(d => d.id === dashboardId ? { ...d, visualizations: updatedVisualizations } : d),
        currentDashboard: state.currentDashboard?.id === dashboardId ? { ...state.currentDashboard, visualizations: updatedVisualizations } : state.currentDashboard,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update visualization position', 
        isLoading: false 
      });
    }
  },
  
  removeVisualizationFromDashboard: async (dashboardId: string, visualizationId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const dashboard = await getDashboard(dashboardId);
      if (!dashboard) {
        throw new Error('Dashboard not found');
      }
      
      const updatedVisualizations = dashboard.visualizations.filter(v => v.visualizationId !== visualizationId);
      
      await updateDashboard(dashboardId, { visualizations: updatedVisualizations });
      
      set(state => ({
        dashboards: state.dashboards.map(d => d.id === dashboardId ? { ...d, visualizations: updatedVisualizations } : d),
        currentDashboard: state.currentDashboard?.id === dashboardId ? { ...state.currentDashboard, visualizations: updatedVisualizations } : state.currentDashboard,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to remove visualization from dashboard', 
        isLoading: false 
      });
    }
  },
  
  // Sharing
  shareDashboard: async (id: string, email: string) => {
    try {
      set({ isLoading: true, error: null });
      const { shareDashboard: result } = await graphQLClient.request(SHARE_DASHBOARD, { id, email });
      
      set(state => ({
        dashboards: state.dashboards.map(d => d.id === id ? { ...d, sharedWith: result.sharedWith } : d),
        currentDashboard: state.currentDashboard?.id === id ? { ...state.currentDashboard, sharedWith: result.sharedWith } : state.currentDashboard,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to share dashboard', 
        isLoading: false 
      });
    }
  },
  
  clearError: () => {
    set({ error: null });
  }
}));