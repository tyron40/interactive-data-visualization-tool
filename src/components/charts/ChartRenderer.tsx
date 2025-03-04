import React from 'react';
import { ChartType, ChartConfig } from '../../types';
import BarChart from './BarChart';
import LineChart from './LineChart';
import PieChart from './PieChart';
import ScatterPlot from './ScatterPlot';

interface ChartRendererProps {
  type: ChartType;
  data: any[];
  config: ChartConfig;
  width?: number;
  height?: number;
  className?: string;
}

const ChartRenderer: React.FC<ChartRendererProps> = ({
  type,
  data,
  config,
  width,
  height,
  className,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">No data available to display</p>
      </div>
    );
  }

  switch (type) {
    case 'bar':
      return (
        <BarChart
          data={data}
          config={config}
          width={width}
          height={height}
          className={className}
        />
      );
    case 'line':
      return (
        <LineChart
          data={data}
          config={config}
          width={width}
          height={height}
          className={className}
        />
      );
    case 'pie':
    case 'donut':
      return (
        <PieChart
          data={data}
          config={config}
          width={width}
          height={height}
          className={className}
        />
      );
    case 'scatter':
      return (
        <ScatterPlot
          data={data}
          config={config}
          width={width}
          height={height}
          className={className}
        />
      );
    default:
      return (
        <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">Chart type not supported</p>
        </div>
      );
  }
};

export default ChartRenderer;