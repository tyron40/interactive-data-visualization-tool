import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, LayoutDashboard } from 'lucide-react';
import { useVisualizationStore } from '../store/visualizationStore';
import { useDatasetStore } from '../store/datasetStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ChartRenderer from '../components/charts/ChartRenderer';

const VisualizationDetail: React.FC = () => {
  const { visualizationId } = useParams<{ visualizationId: string }>();
  const navigate = useNavigate();
  const { fetchVisualization, currentVisualization, deleteVisualization, isLoading: vizLoading, error: vizError } = useVisualizationStore();
  const { fetchDataset, currentDataset, isLoading: datasetLoading, error: datasetError } = useDatasetStore();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (visualizationId) {
      fetchVisualization(visualizationId);
    }
  }, [visualizationId, fetchVisualization]);

  useEffect(() => {
    if (currentVisualization?.datasetId) {
      fetchDataset(currentVisualization.datasetId);
    }
  }, [currentVisualization, fetchDataset]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this visualization? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        await deleteVisualization(visualizationId!);
        navigate('/visualizations');
      } catch (error) {
        console.error('Error deleting visualization:', error);
        setIsDeleting(false);
      }
    }
  };

  const handleAddToDashboard = () => {
    navigate(`/dashboards/new?visualizationId=${visualizationId}`);
  };

  const isLoading = vizLoading || datasetLoading;
  const error = vizError || datasetError;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!currentVisualization) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
        Visualization not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/visualizations')}
            leftIcon={<ArrowLeft size={16} />}
          >
            Back
          </Button>
          <h2 className="text-2xl font-bold text-gray-900">{currentVisualization.name}</h2>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/visualizations/${visualizationId}/edit`)}
            leftIcon={<Edit size={16} />}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={handleAddToDashboard}
            leftIcon={<LayoutDashboard size={16} />}
          >
            Add to Dashboard
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
            leftIcon={<Trash2 size={16} />}
          >
            Delete
          </Button>
        </div>
      </div>

      <Card title="Visualization Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Description</p>
            <p className="mt-1">{currentVisualization.description || 'No description provided'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Details</p>
            <div className="mt-1 space-y-1">
              <p className="text-sm">
                <span className="font-medium">Type:</span>{' '}
                {currentVisualization.type.charAt(0).toUpperCase() + currentVisualization.type.slice(1)}
              </p>
              <p className="text-sm">
                <span className="font-medium">Dataset:</span>{' '}
                {currentDataset?.name || 'Loading...'}
              </p>
              <p className="text-sm">
                <span className="font-medium">Created:</span>{' '}
                {new Date(currentVisualization.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm">
                <span className="font-medium">Last Updated:</span>{' '}
                {new Date(currentVisualization.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Visualization Preview">
        <div className="flex items-center justify-center p-4 h-[500px]">
          {currentDataset ? (
            <ChartRenderer
              type={currentVisualization.type}
              data={currentDataset.data}
              config={currentVisualization.config}
              width={800}
              height={450}
            />
          ) : (
            <div className="text-gray-500">Loading dataset...</div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default VisualizationDetail;