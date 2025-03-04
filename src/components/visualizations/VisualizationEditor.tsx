import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Share2 } from 'lucide-react';
import { ChartType, ChartConfig, Dataset } from '../../types';
import { useDatasetStore } from '../../store/datasetStore';
import { useVisualizationStore } from '../../store/visualizationStore';
import { useAuthStore } from '../../store/authStore';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Card from '../ui/Card';
import ChartRenderer from '../charts/ChartRenderer';
import Modal from '../ui/Modal';

const chartTypes = [
  { value: 'bar', label: 'Bar Chart' },
  { value: 'line', label: 'Line Chart' },
  { value: 'pie', label: 'Pie Chart' },
  { value: 'scatter', label: 'Scatter Plot' },
  { value: 'area', label: 'Area Chart' },
  { value: 'donut', label: 'Donut Chart' },
];

const VisualizationEditor: React.FC = () => {
  const navigate = useNavigate();
  const { datasetId } = useParams<{ datasetId: string }>();
  const { user } = useAuthStore();
  const { fetchDataset, currentDataset } = useDatasetStore();
  const { createNewVisualization, isLoading, error } = useVisualizationStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [config, setConfig] = useState<ChartConfig>({
    dimensions: { x: '', y: '' },
    colors: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#6366f1', '#ec4899'],
    xAxis: { field: '', title: '', gridLines: false },
    yAxis: { field: '', title: '', gridLines: true },
    legend: { show: true, position: 'right' },
    tooltip: { show: true },
    animation: { enabled: true, duration: 500 },
  });
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState('');

  useEffect(() => {
    if (datasetId) {
      fetchDataset(datasetId);
    }
  }, [datasetId, fetchDataset]);

  useEffect(() => {
    if (currentDataset && currentDataset.columns.length > 0) {
      // Set default dimensions based on data types
      const numericColumns = currentDataset.columns.filter(
        (col) => currentDataset.dataTypes[col] === 'number'
      );
      const categoricalColumns = currentDataset.columns.filter(
        (col) => currentDataset.dataTypes[col] !== 'number'
      );

      const xField = categoricalColumns.length > 0 ? categoricalColumns[0] : currentDataset.columns[0];
      const yField = numericColumns.length > 0 ? numericColumns[0] : currentDataset.columns[1] || currentDataset.columns[0];

      setConfig({
        ...config,
        dimensions: { 
          x: xField, 
          y: yField 
        },
        xAxis: { 
          ...config.xAxis, 
          field: xField,
          title: xField 
        },
        yAxis: { 
          ...config.yAxis, 
          field: yField,
          title: yField 
        },
      });

      // Set default name
      if (!name) {
        setName(`${chartType.charAt(0).toUpperCase() + chartType.slice(1)} of ${currentDataset.name}`);
      }
    }
  }, [currentDataset, chartType]);

  const handleChartTypeChange = (value: string) => {
    setChartType(value as ChartType);
    
    // Update name when chart type changes
    if (currentDataset) {
      setName(`${value.charAt(0).toUpperCase() + value.slice(1)} of ${currentDataset.name}`);
    }
  };

  const handleDimensionChange = (dimension: string, value: string) => {
    setConfig({
      ...config,
      dimensions: {
        ...config.dimensions,
        [dimension]: value,
      },
    });

    // Update axis titles when dimensions change
    if (dimension === 'x') {
      setConfig((prev) => ({
        ...prev,
        xAxis: {
          ...prev.xAxis,
          field: value,
          title: value,
        },
      }));
    } else if (dimension === 'y') {
      setConfig((prev) => ({
        ...prev,
        yAxis: {
          ...prev.yAxis,
          field: value,
          title: value,
        },
      }));
    }
  };

  const handleSave = async () => {
    if (!user || !currentDataset || !datasetId) return;

    try {
      const visualization = await createNewVisualization({
        name,
        description,
        ownerId: user.id,
        datasetId,
        type: chartType,
        config,
        sharedWith: [],
      });

      navigate(`/visualizations/${visualization.id}`);
    } catch (err) {
      console.error('Error saving visualization:', err);
    }
  };

  if (!currentDataset) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/datasets')}
            leftIcon={ <ArrowLeft size={16} />}
          >
            Back
          </Button>
          <h2 className="text-2xl font-bold text-gray-900">Create Visualization</h2>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsShareModalOpen(true)}
            leftIcon={<Share2 size={16} />}
          >
            Share
          </Button>
          <Button
            onClick={handleSave}
            isLoading={isLoading}
            leftIcon={<Save size={16} />}
          >
            Save Visualization
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card title="Visualization Settings">
            <div className="space-y-4">
              <Input
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter visualization name"
              />
              
              <Input
                label="Description (Optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
              />
              
              <Select
                label="Chart Type"
                options={chartTypes}
                value={chartType}
                onChange={handleChartTypeChange}
              />
              
              <Select
                label="X-Axis / Category"
                options={currentDataset.columns.map((col) => ({
                  value: col,
                  label: col,
                }))}
                value={config.dimensions?.x || ''}
                onChange={(value) => handleDimensionChange('x', value)}
              />
              
              <Select
                label="Y-Axis / Value"
                options={currentDataset.columns.map((col) => ({
                  value: col,
                  label: col,
                }))}
                value={config.dimensions?.y || ''}
                onChange={(value) => handleDimensionChange('y', value)}
              />
              
              {(chartType === 'scatter' || chartType === 'bubble') && (
                <Select
                  label="Size (Optional)"
                  options={[
                    { value: '', label: 'None' },
                    ...currentDataset.columns
                      .filter((col) => currentDataset.dataTypes[col] === 'number')
                      .map((col) => ({
                        value: col,
                        label: col,
                      })),
                  ]}
                  value={config.dimensions?.size || ''}
                  onChange={(value) => handleDimensionChange('size', value)}
                />
              )}
              
              <Select
                label="Color (Optional)"
                options={[
                  { value: '', label: 'None' },
                  ...currentDataset.columns.map((col) => ({
                    value: col,
                    label: col,
                  })),
                ]}
                value={config.dimensions?.color || ''}
                onChange={(value) => handleDimensionChange('color', value)}
              />
              
              {chartType === 'line' && (
                <Select
                  label="Group By (Optional)"
                  options={[
                    { value: '', label: 'None' },
                    ...currentDataset.columns.map((col) => ({
                      value: col,
                      label: col,
                    })),
                  ]}
                  value={config.dimensions?.group || ''}
                  onChange={(value) => handleDimensionChange('group', value)}
                />
              )}
            </div>
          </Card>
          
          <Card title="Chart Options">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Show Legend
                </label>
                <input
                  type="checkbox"
                  checked={config.legend?.show}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      legend: { ...config.legend, show: e.target.checked },
                    })
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Show Tooltip
                </label>
                <input
                  type="checkbox"
                  checked={config.tooltip?.show}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      tooltip: { ...config.tooltip, show: e.target.checked },
                    })
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Show Grid Lines
                </label>
                <input
                  type="checkbox"
                  checked={config.yAxis?.gridLines}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      yAxis: { ...config.yAxis, gridLines: e.target.checked },
                    })
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              <Input
                label="Chart Title (Optional)"
                value={config.title || ''}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    title: e.target.value,
                  })
                }
                placeholder="Enter chart title"
              />
              
              <Input
                label="X-Axis Title"
                value={config.xAxis?.title || ''}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    xAxis: { ...config.xAxis, title: e.target.value },
                  })
                }
                placeholder="Enter x-axis title"
              />
              
              <Input
                label="Y-Axis Title"
                value={config.yAxis?.title || ''}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    yAxis: { ...config.yAxis, title: e.target.value },
                  })
                }
                placeholder="Enter y-axis title"
              />
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card title="Preview" className="h-full">
            <div className="flex items-center justify-center p-4 h-[500px]">
              <ChartRenderer
                type={chartType}
                data={currentDataset.data}
                config={config}
                width={600}
                height={400}
              />
            </div>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Share Visualization"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Share this visualization with others by email. They will be able to view and comment on it.
          </p>
          
          <Input
            label="Email Address"
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
            placeholder="Enter email address"
          />
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsShareModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsShareModalOpen(false)}>
              Share
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default VisualizationEditor;