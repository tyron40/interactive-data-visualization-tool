import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Share2 } from 'lucide-react';
import { useDashboardStore } from '../store/dashboardStore';
import { useVisualizationStore } from '../store/visualizationStore';
import { useDatasetStore } from '../store/datasetStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import ChartRenderer from '../components/charts/ChartRenderer';
import { Visualization, Dataset } from '../types';

const DashboardDetail: React.FC = () => {
  const { dashboardId } = useParams<{ dashboardId: string }>();
  const navigate = useNavigate();
  const { fetchDashboard, currentDashboard, deleteDashboard, shareDashboard, isLoading: dashboardLoading, error: dashboardError } = useDashboardStore();
  const { fetchVisualization } = useVisualizationStore();
  const { fetchDataset } = useDatasetStore();
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [visualizations, setVisualizations] = useState<Record<string, Visualization>>({});
  const [datasets, setDatasets] = useState<Record<string, Dataset>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (dashboardId) {
      fetchDashboard(dashboardId);
    }
  }, [dashboardId, fetchDashboard]);

  useEffect(() => {
    const loadVisualizationsAndData = async () => {
      if (currentDashboard) {
        setIsLoading(true);
        
        // Fetch all visualizations in the dashboard
        const visualizationPromises = currentDashboard.visualizations.map(viz => 
          fetchVisualization(viz.visualizationId)
        );
        
        const visualizationResults = await Promise.all(visualizationPromises);
        
        const visualizationsMap: Record<string, Visualization> = {};
        const datasetIds = new Set<string>();
        
        visualizationResults.forEach(viz => {
          if (viz) {
            visualizationsMap[viz.id] = viz;
            datasetIds.add(viz.datasetId);
          }
        });
        
        setVisualizations(visualizationsMap);
        
        // Fetch all datasets used by the visualizations
        const datasetPromises = Array.from(datasetIds).map(id => 
          fetchDataset(id)
        );
        
        const datasetResults = await Promise.all(datasetPromises);
        
        const datasetsMap: Record<string, Dataset> = {};
        
        datasetResults.forEach(dataset => {
          if (dataset) {
            datasetsMap[dataset.id] = dataset;
          }
        });
        
        setDatasets(datasetsMap);
        setIsLoading(false);
      }
    };
    
    loadVisualizationsAndData();
  }, [currentDashboard, fetchVisualization, fetchDataset]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this dashboard? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        await deleteDashboard(dashboardId!);
        navigate('/dashboards');
      } catch (error) {
        console.error('Error deleting dashboard:', error);
        setIsDeleting(false);
      }
    }
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const handleShareSubmit = async () => {
    if (dashboardId && shareEmail) {
      await shareDashboard(dashboardId, shareEmail);
      setIsShareModalOpen(false);
      setShareEmail('');
    }
  };

  if (dashboardLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {dashboardError}
      </div>
    );
  }

  if (!currentDashboard) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
        Dashboard not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboards')}
            leftIcon={<ArrowLeft size={16} />}
          >
            Back
          </Button>
          <h2 className="text-2xl font-bold text-gray-900">{currentDashboard.name}</h2>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleShare}
            leftIcon={<Share2 size={16} />}
          >
            Share
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/dashboards/${dashboardId}/edit`)}
            leftIcon={<Edit size={16} />}
          >
            Edit
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

      {currentDashboard.description && (
        <Card>
          <p className="text-gray-700">{currentDashboard.description}</p>
        </Card>
      )}

      {currentDashboard.visualizations.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center justify-center p-8">
            <p className="text-gray-500 mb-4">This dashboard has no visualizations yet</p>
            <Button
              onClick={() => navigate(`/dashboards/${dashboardId}/edit`)}
              leftIcon={<Edit size={16} />}
            >
              Edit Dashboard
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentDashboard.visualizations.map((vizItem) => {
            const visualization = visualizations[vizItem.visualizationId];
            if (!visualization) return null;
            
            const dataset = datasets[visualization.datasetId];
            
            return (
              <Card
                key={vizItem.id}
                title={visualization.name}
                className="h-80"
              >
                <div className="h-full flex items-center justify-center">
                  {dataset ? (
                    <ChartRenderer
                      type={visualization.type}
                      data={dataset.data}
                      config={visualization.config}
                      width={300}
                      height={200}
                    />
                  ) : (
                    <div className="text-gray-500">Loading data...</div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Share Dashboard"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Share this dashboard with others by email. They will be able to view and comment on it.
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
            <Button onClick={handleShareSubmit}>
              Share
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardDetail;