import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Save, ArrowLeft, Share2, Plus, Search } from 'lucide-react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Dashboard, Visualization, DashboardVisualization } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { useDashboardStore } from '../../store/dashboardStore';
import { useVisualizationStore } from '../../store/visualizationStore';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import Modal from '../ui/Modal';
import ChartRenderer from '../charts/ChartRenderer';

const ResponsiveGridLayout = WidthProvider(Responsive);

const DashboardEditor: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { dashboardId } = useParams<{ dashboardId: string }>();
  const { user } = useAuthStore();
  const { 
    currentDashboard, 
    fetchDashboard, 
    createNewDashboard, 
    updateDashboard, 
    isLoading: dashboardLoading 
  } = useDashboardStore();
  const { 
    visualizations, 
    fetchUserVisualizations, 
    fetchVisualization,
    isLoading: visualizationsLoading 
  } = useVisualizationStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [layout, setLayout] = useState<any[]>([]);
  const [dashboardVisualizations, setDashboardVisualizations] = useState<Record<string, Visualization>>({});
  const [isAddVisualizationModalOpen, setIsAddVisualizationModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState('');

  // Check if we're coming from a visualization page with a visualization ID
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const visualizationId = params.get('visualizationId');
    
    if (visualizationId && !dashboardId) {
      // We're creating a new dashboard with a visualization
      fetchVisualization(visualizationId).then((visualization) => {
        if (visualization) {
          setDashboardVisualizations({
            [visualizationId]: visualization,
          });
          
          setLayout([
            {
              i: visualizationId,
              x: 0,
              y: 0,
              w: 6,
              h: 4,
            },
          ]);
          
          setName(`Dashboard with ${visualization.name}`);
        }
      });
    }
  }, [location.search, dashboardId, fetchVisualization]);

  // Fetch dashboard if editing
  useEffect(() => {
    if (dashboardId) {
      fetchDashboard(dashboardId).then((dashboard) => {
        if (dashboard) {
          setName(dashboard.name);
          setDescription(dashboard.description || '');
          
          // Fetch all visualizations in the dashboard
          const visualizationPromises = dashboard.visualizations.map((viz) => 
            fetchVisualization(viz.visualizationId)
          );
          
          Promise.all(visualizationPromises).then((results) => {
            const visualizationsMap: Record<string, Visualization> = {};
            results.forEach((viz) => {
              if (viz) {
                visualizationsMap[viz.id] = viz;
              }
            });
            
            setDashboardVisualizations(visualizationsMap);
            
            // Create layout from dashboard visualizations
            const newLayout = dashboard.visualizations.map((viz) => ({
              i: viz.visualizationId,
              x: viz.x,
              y: viz.y,
              w: viz.w,
              h: viz.h,
            }));
            
            setLayout(newLayout);
          });
        }
      });
    }
  }, [dashboardId, fetchDashboard, fetchVisualization]);

  // Fetch user visualizations for the add visualization modal
  useEffect(() => {
    if (user) {
      fetchUserVisualizations(user.id);
    }
  }, [user, fetchUserVisualizations]);

  const handleLayoutChange = (newLayout: any[]) => {
    setLayout(newLayout);
  };

  const handleAddVisualization = (visualization: Visualization) => {
    // Add visualization to dashboard
    setDashboardVisualizations({
      ...dashboardVisualizations,
      [visualization.id]: visualization,
    });
    
    // Add to layout
    const newLayoutItem = {
      i: visualization.id,
      x: 0,
      y: 0, // Will be placed at the bottom
      w: 6,
      h: 4,
    };
    
    setLayout([...layout, newLayoutItem]);
    setIsAddVisualizationModalOpen(false);
  };

  const handleRemoveVisualization = (id: string) => {
    if (window.confirm('Are you sure you want to remove this visualization from the dashboard?')) {
      // Remove from dashboardVisualizations
      const newDashboardVisualizations = { ...dashboardVisualizations };
      delete newDashboardVisualizations[id];
      setDashboardVisualizations(newDashboardVisualizations);
      
      // Remove from layout
      setLayout(layout.filter((item) => item.i !== id));
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    // Convert layout to dashboard visualizations
    const dashboardVisualizationsArray: DashboardVisualization[] = layout.map((item) => ({
      id: `${dashboardId || 'new'}-${item.i}-${Date.now()}`,
      visualizationId: item.i,
      x: item.x,
      y: item.y,
      w: item.w,
      h: item.h,
    }));
    
    if (dashboardId) {
      // Update existing dashboard
      await updateDashboard(dashboardId, {
        name,
        description,
        visualizations: dashboardVisualizationsArray,
      });
      
      navigate(`/dashboards/${dashboardId}`);
    } else {
      // Create new dashboard
      const newDashboard = await createNewDashboard({
        name,
        description,
        ownerId: user.id,
        visualizations: dashboardVisualizationsArray,
        sharedWith: [],
      });
      
      navigate(`/dashboards/${newDashboard.id}`);
    }
  };

  const isLoading = dashboardLoading || visualizationsLoading;

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
          <h2 className="text-2xl font-bold text-gray-900">
            {dashboardId ? 'Edit Dashboard' : 'Create Dashboard'}
          </h2>
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
            Save Dashboard
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card title="Dashboard Settings">
            <div className="space-y-4">
              <Input
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter dashboard name"
              />
              
              <Input
                label="Description (Optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
              />
              
              <Button
                onClick={() => setIsAddVisualizationModalOpen(true)}
                leftIcon={<Plus size={16} />}
                className="w-full"
              >
                Add Visualization
              </Button>
            </div>
          </Card>
          
          <Card title="Layout Tips">
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Drag visualizations to rearrange them</p>
              <p>• Resize visualizations using the handle in the bottom-right corner</p>
              <p>• Click the X to remove a visualization</p>
              <p>• Changes are not saved until you click "Save Dashboard"</p>
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-3">
          <Card title="Dashboard Layout" className="h-full">
            {layout.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 h-64">
                <p className="text-gray-500 mb-4">No visualizations added yet</p>
                <Button
                  onClick={() => setIsAddVisualizationModalOpen(true)}
                  leftIcon={<Plus size={16} />}
                >
                  Add Visualization
                </Button>
              </div>
            ) : (
              <div className="p-4">
                <ResponsiveGridLayout
                  className="layout"
                  layouts={{ lg: layout }}
                  breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                  cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                  rowHeight={100}
                  onLayoutChange={handleLayoutChange}
                  isDraggable
                  isResizable
                >
                  {layout.map((item) => {
                    const visualization = dashboardVisualizations[item.i];
                    if (!visualization) return null;
                    
                    return (
                      <div key={item.i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-2 border-b border-gray-200 flex justify-between items-center">
                          <h3 className="text-sm font-medium truncate">{visualization.name}</h3>
                          <button
                            onClick={() => handleRemoveVisualization(item.i)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            ×
                          </button>
                        </div>
                        <div className="p-2 h-[calc(100%-40px)] flex items-center justify-center">
                          <ChartRenderer
                            type={visualization.type}
                            data={[]} // We would need to fetch the dataset data here
                            config={visualization.config}
                            width={item.w * 100 - 20}
                            height={item.h * 100 - 60}
                          />
                        </div>
                      </div>
                    );
                  })}
                </ResponsiveGridLayout>
              </div>
            )}
          </Card>
        </div>
      </div>

      <Modal
        isOpen={isAddVisualizationModalOpen}
        onClose={() => setIsAddVisualizationModalOpen(false)}
        title="Add Visualization"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            placeholder="Search visualizations..."
            leftIcon={<Search size={16} />}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {visualizations.map((visualization) => (
              <Card
                key={visualization.id}
                title={visualization.name}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleAddVisualization(visualization)}
              >
                <div className="flex items-center">
                  <div className="mr-3">
                    {/* Chart type icon would go here */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-blue-500"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {visualization.type.charAt(0).toUpperCase() + visualization.type.slice(1)} Chart
                    </p>
                    <p className="text-xs text-gray-500">
                      Created {new Date(visualization.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Modal>

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
            <Button onClick={() => setIsShareModalOpen(false)}>
              Share
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardEditor;