import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';
import { Dataset, Visualization, Dashboard, User } from '../types';

// Datasets
export const createDataset = async (dataset: Omit<Dataset, 'id' | 'createdAt' | 'updatedAt'>): Promise<Dataset> => {
  try {
    const now = Date.now();
    const docRef = await addDoc(collection(db, 'datasets'), {
      ...dataset,
      createdAt: now,
      updatedAt: now
    });
    
    return {
      ...dataset,
      id: docRef.id,
      createdAt: now,
      updatedAt: now
    };
  } catch (error) {
    console.error('Error creating dataset:', error);
    throw error;
  }
};

export const getDataset = async (id: string): Promise<Dataset | null> => {
  try {
    const docRef = doc(db, 'datasets', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Dataset;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting dataset:', error);
    throw error;
  }
};

export const getUserDatasets = async (userId: string): Promise<Dataset[]> => {
  try {
    const q = query(collection(db, 'datasets'), where('ownerId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Dataset));
  } catch (error) {
    console.error('Error getting user datasets:', error);
    throw error;
  }
};

export const updateDataset = async (id: string, data: Partial<Dataset>): Promise<void> => {
  try {
    const docRef = doc(db, 'datasets', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Date.now()
    });
  } catch (error) {
    console.error('Error updating dataset:', error);
    throw error;
  }
};

export const deleteDataset = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'datasets', id));
  } catch (error) {
    console.error('Error deleting dataset:', error);
    throw error;
  }
};

// Visualizations
export const createVisualization = async (visualization: Omit<Visualization, 'id' | 'createdAt' | 'updatedAt'>): Promise<Visualization> => {
  try {
    const now = Date.now();
    const docRef = await addDoc(collection(db, 'visualizations'), {
      ...visualization,
      createdAt: now,
      updatedAt: now
    });
    
    return {
      ...visualization,
      id: docRef.id,
      createdAt: now,
      updatedAt: now
    };
  } catch (error) {
    console.error('Error creating visualization:', error);
    throw error;
  }
};

export const getVisualization = async (id: string): Promise<Visualization | null> => {
  try {
    const docRef = doc(db, 'visualizations', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Visualization;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting visualization:', error);
    throw error;
  }
};

export const getUserVisualizations = async (userId: string): Promise<Visualization[]> => {
  try {
    const q = query(collection(db, 'visualizations'), where('ownerId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Visualization));
  } catch (error) {
    console.error('Error getting user visualizations:', error);
    throw error;
  }
};

export const getDatasetVisualizations = async (datasetId: string): Promise<Visualization[]> => {
  try {
    const q = query(collection(db, 'visualizations'), where('datasetId', '==', datasetId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Visualization));
  } catch (error) {
    console.error('Error getting dataset visualizations:', error);
    throw error;
  }
};

export const updateVisualization = async (id: string, data: Partial<Visualization>): Promise<void> => {
  try {
    const docRef = doc(db, 'visualizations', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Date.now()
    });
  } catch (error) {
    console.error('Error updating visualization:', error);
    throw error;
  }
};

export const deleteVisualization = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'visualizations', id));
  } catch (error) {
    console.error('Error deleting visualization:', error);
    throw error;
  }
};

// Dashboards
export const createDashboard = async (dashboard: Omit<Dashboard, 'id' | 'createdAt' | 'updatedAt'>): Promise<Dashboard> => {
  try {
    const now = Date.now();
    const docRef = await addDoc(collection(db, 'dashboards'), {
      ...dashboard,
      createdAt: now,
      updatedAt: now
    });
    
    return {
      ...dashboard,
      id: docRef.id,
      createdAt: now,
      updatedAt: now
    };
  } catch (error) {
    console.error('Error creating dashboard:', error);
    throw error;
  }
};

export const getDashboard = async (id: string): Promise<Dashboard | null> => {
  try {
    const docRef = doc(db, 'dashboards', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Dashboard;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting dashboard:', error);
    throw error;
  }
};

export const getUserDashboards = async (userId: string): Promise<Dashboard[]> => {
  try {
    const q = query(collection(db, 'dashboards'), where('ownerId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Dashboard));
  } catch (error) {
    console.error('Error getting user dashboards:', error);
    throw error;
  }
};

export const updateDashboard = async (id: string, data: Partial<Dashboard>): Promise<void> => {
  try {
    const docRef = doc(db, 'dashboards', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Date.now()
    });
  } catch (error) {
    console.error('Error updating dashboard:', error);
    throw error;
  }
};

export const deleteDashboard = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'dashboards', id));
  } catch (error) {
    console.error('Error deleting dashboard:', error);
    throw error;
  }
};