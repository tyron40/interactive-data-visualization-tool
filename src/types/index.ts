export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
}

export interface Dataset {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  ownerId: string;
  data: any[];
  columns: string[];
  dataTypes: Record<string, string>;
  sharedWith: string[];
}

export interface Visualization {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  ownerId: string;
  datasetId: string;
  type: ChartType;
  config: ChartConfig;
  sharedWith: string[];
}

export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  ownerId: string;
  visualizations: DashboardVisualization[];
  sharedWith: string[];
}

export interface DashboardVisualization {
  id: string;
  visualizationId: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export type ChartType = 
  | 'bar' 
  | 'line' 
  | 'pie' 
  | 'scatter' 
  | 'area' 
  | 'donut'
  | 'heatmap'
  | 'treemap';

export interface ChartConfig {
  title?: string;
  xAxis?: AxisConfig;
  yAxis?: AxisConfig;
  colors?: string[];
  legend?: LegendConfig;
  tooltip?: TooltipConfig;
  animation?: AnimationConfig;
  dimensions?: {
    x: string;
    y?: string;
    size?: string;
    color?: string;
    group?: string;
  };
}

export interface AxisConfig {
  title?: string;
  field: string;
  gridLines?: boolean;
  min?: number;
  max?: number;
  format?: string;
}

export interface LegendConfig {
  show: boolean;
  position: 'top' | 'right' | 'bottom' | 'left';
}

export interface TooltipConfig {
  show: boolean;
  format?: string;
}

export interface AnimationConfig {
  enabled: boolean;
  duration: number;
}