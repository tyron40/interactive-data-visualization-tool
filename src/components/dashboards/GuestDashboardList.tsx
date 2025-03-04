import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Info } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Alert from '../ui/Alert';

const GuestDashboardList: React.FC = () => {
  const navigate = useNavigate();

  // Sample dashboard for guest users
  const sampleDashboard = {
    id: 'sample-dashboard',
    name: 'Sales Performance Dashboard',
    description: 'Overview of key sales metrics and performance indicators',
    visualizationCount: 4,
    createdAt: new Date().toISOString()
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Sample Dashboards</h2>
        <Button
          onClick={() => navigate('/register')}
          leftIcon={<PlusCircle size={16} />}
        >
          Create Account
        </Button>
      </div>

      <Alert variant="info" title="Guest Mode">
        <p>
          You're viewing sample dashboards in guest mode. To create your own dashboards, 
          <button onClick={() => navigate('/register')} className="ml-1 font-medium text-blue-600 hover:text-blue-500">
            create an account
          </button>.
        </p>
      </Alert>

      <div className="w-full max-w-md">
        <Input
          placeholder="Search dashboards..."
          leftIcon={<Search size={16} />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          key={sampleDashboard.id}
          title={sampleDashboard.name}
          subtitle={`Created ${new Date(sampleDashboard.createdAt).toLocaleDateString()}`}
          className="hover:shadow-lg transition-shadow"
        >
          <div className="mb-4">
            <p className="text-sm text-gray-500">
              {sampleDashboard.description}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {sampleDashboard.visualizationCount} visualizations
            </p>
          </div>
          <div className="mt-4">
            <Button
              variant="primary"
              onClick={() => navigate('/')}
              className="w-full"
            >
              View Sample Dashboard
            </Button>
          </div>
        </Card>
      </div>

      <Card title="Ready to create your own dashboards?">
        <div className="flex flex-col items-center text-center p-6">
          <div className="mb-4">
            <Info size={48} className="text-blue-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Build interactive dashboards with your data
          </h3>
          <p className="text-gray-600 mb-6">
            Create an account to build custom dashboards, combine multiple visualizations, and share insights with your team.
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

export default GuestDashboardList;