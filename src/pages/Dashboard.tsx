import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart2, Database, LayoutDashboard, Plus, Clock, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useDatasetStore } from '../store/datasetStore';
import { useVisualizationStore } from '../store/visualizationStore';
import { useDashboardStore } from '../store/dashboardStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { datasets, fetchUserDatasets } = useDatasetStore();
  const { visualizations, fetchUserVisualizations } = useVisualizationStore();
  const { dashboards, fetchUserDashboards } = useDashboardStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        setIsLoading(true);
        await Promise.all([
          fetchUserDatasets(user.id),
          fetchUserVisualizations(user.id),
          fetchUserDashboards(user.id)
        ]);
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [user, fetchUserDatasets, fetchUserVisualizations, fetchUserDashboards]);

  const recentItems = [
    ...datasets.slice(0, 3).map(dataset => ({
      id: dataset.id,
      type: 'dataset',
      name: dataset.name,
      date: new Date(dataset.updatedAt),
      path: `/datasets/${dataset.id}`
    })),
    ...visualizations.slice(0, 3).map(viz => ({
      id: viz.id,
      type: 'visualization',
      name: viz.name,
      date: new Date(viz.updatedAt),
      path: `/visualizations/${viz.id}`
    })),
    ...dashboards.slice(0, 3).map(dashboard => ({
      id: dashboard.id,
      type: 'dashboard',
      name: dashboard.name,
      date: new Date(dashboard.updatedAt),
      path: `/dashboards/${dashboard.id}`
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);

  const getIcon = (type: string) => {
    switch (type) {
      case 'dataset':
        return <Database size={16} className="text-blue-500" />;
      case 'visualization':
        return <BarChart2 size={16} className="text-green-500" />;
      case 'dashboard':
        return <LayoutDashboard size={16} className="text-purple-500" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Welcome card */}
      <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold">Welcome back, {user?.name || 'User'}!</h2>
            <p className="mt-1 text-blue-100">
              Create, visualize, and share your data insights with ease.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Button
              onClick={() => navigate('/datasets/new')}
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              Import Data
            </Button>
            <Button
              onClick={() => navigate('/dashboards/new')}
              className="bg-blue-400 bg-opacity-30 text-white hover:bg-opacity-40"
            >
              Create Dashboard
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats cards */}
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Database size={20} />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Datasets</h3>
              <p className="text-2xl font-bold text-gray-900">{datasets.length}</p>
            </div>
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => navigate('/datasets')}
              className="w-full"
            >
              View All
            </Button>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <BarChart2 size={20} />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Visualizations</h3>
              <p className="text-2xl font-bold text-gray-900">{visualizations.length}</p>
            </div>
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => navigate('/visualizations')}
              className="w-full"
            >
              View All
            </Button>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <LayoutDashboard size={20} />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Dashboards</h3>
              <p className="text-2xl font-bold text-gray-900">{dashboards.length}</p>
            </div>
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboards')}
              className="w-full"
            >
              View All
            </Button>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent activity */}
        <Card title="Recent Activity">
          {recentItems.length > 0 ? (
            <div className="space-y-4">
              {recentItems.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                  onClick={() => navigate(item.path)}
                >
                  <div className="mr-3">{getIcon(item.type)}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </p>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock size={14} className="mr-1" />
                    {item.date.toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">No recent activity</p>
              <Button
                variant="outline"
                onClick={() => navigate('/datasets/new')}
                leftIcon={<Plus size={16} />}
                className="mt-4"
              >
                Import Your First Dataset
              </Button>
            </div>
          )}
        </Card>

        {/* Quick actions */}
        <Card title="Quick Actions">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              onClick={() => navigate('/datasets/new')}
              leftIcon={<Database size={16} />}
              className="h-16 flex items-center justify-center"
            >
              Import Dataset
            </Button>
            <Button
              onClick={() => navigate('/datasets')}
              leftIcon={<BarChart2 size={16} />}
              className="h-16 flex items-center justify-center"
            >
              Create Visualization
            </Button>
            <Button
              onClick={() => navigate('/dashboards/new')}
              leftIcon={<LayoutDashboard size={16} />}
              className="h-16 flex items-center justify-center"
            >
              Create Dashboard
            </Button>
            <Button
              onClick={() => navigate('/visualizations')}
              leftIcon={<TrendingUp size={16} />}
              className="h-16 flex items-center justify-center"
            >
              Explore Visualizations
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;