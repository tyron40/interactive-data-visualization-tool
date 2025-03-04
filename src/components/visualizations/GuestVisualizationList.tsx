import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, LayoutDashboard, Info } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Alert from '../ui/Alert';

const GuestVisualizationList: React.FC = () => {
  const navigate = useNavigate();

  // Sample visualizations for guest users
  const sampleVisualizations = [
    {
      id: 'sample-viz-1',
      name: 'Monthly Sales Trend',
      description: 'Line chart showing monthly sales performance over time',
      type: 'line',
      createdAt: new Date().toISOString()
    },
    {
      id: 'sample-viz-2',
      name: 'Product Category Distribution',
      description: 'Pie chart showing sales distribution across product categories',
      type: 'pie',
      createdAt: new Date().toISOString()
    },
    {
      id: 'sample-viz-3',
      name: 'Regional Performance Comparison',
      description: 'Bar chart comparing performance metrics across different regions',
      type: 'bar',
      createdAt: new Date().toISOString()
    },
    {
      id: 'sample-viz-4',
      name: 'Customer Age vs. Purchase Value',
      description: 'Scatter plot showing relationship between customer age and purchase value',
      type: 'scatter',
      createdAt: new Date().toISOString()
    }
  ];

  const getChartTypeIcon = (type: string) => {
    switch (type) {
      case 'bar':
        return (
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
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
        );
      case 'line':
        return (
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
            className="text-green-500"
          >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
        );
      case 'pie':
        return (
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
            className="text-yellow-500"
          >
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
            <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
          </svg>
        );
      case 'scatter':
        return (
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
            className="text-purple-500"
          >
            <circle cx="8" cy="8" r="2"></circle>
            <circle cx="16" cy="16" r="2"></circle>
            <circle cx="18" cy="9" r="2"></circle>
            <circle cx="10" cy="15" r="2"></circle>
            <circle cx="5" cy="19" r="2"></circle>
          </svg>
        );
      default:
        return (
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
            className="text-gray-500"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          </svg>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Sample Visualizations</h2>
        <Button
          onClick={() => navigate('/register')}
          leftIcon={<PlusCircle size={16} />}
        >
          Create Account
        </Button>
      </div>

      <Alert variant="info" title="Guest Mode">
        <p>
          You're viewing sample visualizations in guest mode. To create your own visualizations, 
          <button onClick={() => navigate('/register')} className="ml-1 font-medium text-blue-600 hover:text-blue-500">
            create an account
          </button>.
        </p>
      </Alert>

      <div className="w-full max-w-md">
        <Input
          placeholder="Search visualizations..."
          leftIcon={<Search size={16} />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleVisualizations.map((visualization) => (
          <Card
            key={visualization.id}
            title={visualization.name}
            subtitle={`Created ${new Date(visualization.createdAt).toLocaleDateString()}`}
            className="hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="mr-3">{getChartTypeIcon(visualization.type)}</div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {visualization.type.charAt(0).toUpperCase() + visualization.type.slice(1)} Chart
                </p>
                <p className="text-sm text-gray-500">
                  {visualization.description}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={() => navigate('/register')}
                leftIcon={<LayoutDashboard size={16} />}
                className="w-full"
              >
                Create Account to Use
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card title="Ready to create your own visualizations?">
        <div className="flex flex-col items-center text-center p-6">
          <div className="mb-4">
            <Info size={48} className="text-blue-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Create powerful visualizations with your own data
          </h3>
          <p className="text-gray-600 mb-6">
            Sign up to create custom visualizations, explore advanced chart types, and share insights with your team.
          </p>
          <div className="flex space-x-4">
            <Button
              onClick={() => navigate('/register')}
              className="px-6"
            >
              Create Account
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GuestVisualizationList;