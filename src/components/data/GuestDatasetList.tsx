import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, BarChart2, Info } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Alert from '../ui/Alert';

const GuestDatasetList: React.FC = () => {
  const navigate = useNavigate();

  // Sample datasets for guest users
  const sampleDatasets = [
    {
      id: 'sample-1',
      name: 'Sales Performance',
      description: 'Monthly sales data across different product categories',
      rowCount: 120,
      columnCount: 8,
      createdAt: new Date().toISOString()
    },
    {
      id: 'sample-2',
      name: 'Customer Demographics',
      description: 'Customer data including age, location, and purchase history',
      rowCount: 500,
      columnCount: 12,
      createdAt: new Date().toISOString()
    },
    {
      id: 'sample-3',
      name: 'Website Analytics',
      description: 'Website traffic, conversion rates, and user engagement metrics',
      rowCount: 365,
      columnCount: 15,
      createdAt: new Date().toISOString()
    },
    {
      id: 'sample-4',
      name: 'Product Inventory',
      description: 'Current inventory levels, restock dates, and product categories',
      rowCount: 200,
      columnCount: 10,
      createdAt: new Date().toISOString()
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Sample Datasets</h2>
        <Button
          onClick={() => navigate('/register')}
          leftIcon={<PlusCircle size={16} />}
        >
          Create Account
        </Button>
      </div>

      <Alert variant="info" title="Guest Mode">
        <p>
          You're viewing sample datasets in guest mode. To import your own datasets, 
          <button onClick={() => navigate('/register')} className="ml-1 font-medium text-blue-600 hover:text-blue-500">
            create an account
          </button>.
        </p>
      </Alert>

      <div className="w-full max-w-md">
        <Input
          placeholder="Search datasets..."
          leftIcon={<Search size={16} />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleDatasets.map((dataset) => (
          <Card
            key={dataset.id}
            title={dataset.name}
            subtitle={`${dataset.rowCount} rows • ${dataset.columnCount} columns`}
            className="hover:shadow-lg transition-shadow"
          >
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                {dataset.description}
              </p>
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={() => navigate('/register')}
                leftIcon={<BarChart2 size={16} />}
                className="w-full"
              >
                Create Account to Visualize
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card title="Ready to create your own datasets?">
        <div className="flex flex-col items-center text-center p-6">
          <div className="mb-4">
            <Info size={48} className="text-blue-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Unlock the full potential of our data visualization tool
          </h3>
          <p className="text-gray-600 mb-6">
            Create an account to import your own datasets, create custom visualizations, and build interactive dashboards.
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

export default GuestDatasetList;