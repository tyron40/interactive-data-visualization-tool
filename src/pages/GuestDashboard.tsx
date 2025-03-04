import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart2, Database, LayoutDashboard, Plus, TrendingUp, Info } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ChartRenderer from '../components/charts/ChartRenderer';

const GuestDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Sample data for guest users
  const sampleData = [
    { category: 'Category A', value: 65, group: 'Group 1' },
    { category: 'Category B', value: 85, group: 'Group 1' },
    { category: 'Category C', value: 45, group: 'Group 1' },
    { category: 'Category D', value: 75, group: 'Group 1' },
    { category: 'Category A', value: 55, group: 'Group 2' },
    { category: 'Category B', value: 70, group: 'Group 2' },
    { category: 'Category C', value: 35, group: 'Group 2' },
    { category: 'Category D', value: 60, group: 'Group 2' },
  ];

  const salesData = [
    { month: 'Jan', sales: 1200, profit: 200 },
    { month: 'Feb', sales: 1800, profit: 400 },
    { month: 'Mar', sales: 1600, profit: 300 },
    { month: 'Apr', sales: 2200, profit: 500 },
    { month: 'May', sales: 2400, profit: 600 },
    { month: 'Jun', sales: 2000, profit: 450 },
  ];

  const productData = [
    { product: 'Product A', sales: 35 },
    { product: 'Product B', sales: 25 },
    { product: 'Product C', sales: 20 },
    { product: 'Product D', sales: 15 },
    { product: 'Product E', sales: 5 },
  ];

  const regionData = [
    { region: 'North', value: 45, category: 'Category 1' },
    { region: 'South', value: 35, category: 'Category 1' },
    { region: 'East', value: 55, category: 'Category 1' },
    { region: 'West', value: 40, category: 'Category 1' },
    { region: 'North', value: 35, category: 'Category 2' },
    { region: 'South', value: 45, category: 'Category 2' },
    { region: 'East', value: 30, category: 'Category 2' },
    { region: 'West', value: 50, category: 'Category 2' },
  ];

  const barChartConfig = {
    title: 'Sample Bar Chart',
    dimensions: { x: 'category', y: 'value', color: 'group' },
    colors: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'],
    xAxis: { title: 'Categories', gridLines: false },
    yAxis: { title: 'Values', gridLines: true },
    legend: { show: true, position: 'right' },
    tooltip: { show: true },
  };

  const lineChartConfig = {
    title: 'Monthly Sales Performance',
    dimensions: { x: 'month', y: 'sales' },
    colors: ['#3b82f6'],
    xAxis: { title: 'Month', gridLines: false },
    yAxis: { title: 'Sales ($)', gridLines: true },
    legend: { show: false },
    tooltip: { show: true },
  };

  const pieChartConfig = {
    title: 'Product Sales Distribution',
    dimensions: { x: 'product', y: 'sales' },
    colors: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#6366f1'],
    legend: { show: true, position: 'right' },
    tooltip: { show: true },
  };

  const scatterChartConfig = {
    title: 'Regional Performance',
    dimensions: { x: 'region', y: 'value', color: 'category' },
    colors: ['#3b82f6', '#ef4444'],
    xAxis: { title: 'Region', gridLines: false },
    yAxis: { title: 'Value', gridLines: true },
    legend: { show: true, position: 'right' },
    tooltip: { show: true },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Guest Dashboard</h1>
      </div>

      {/* Welcome card */}
      <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold">Welcome, Guest User!</h2>
            <p className="mt-1 text-blue-100">
              Explore our interactive data visualization tool with sample data.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Button
              onClick={() => navigate('/register')}
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              Create Account
            </Button>
          </div>
        </div>
      </Card>

      <Card title="Guest Mode Information" className="bg-yellow-50 border-yellow-200">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <Info size={20} className="text-yellow-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              You're currently using the application in guest mode. In this mode, you can:
            </p>
            <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside space-y-1">
              <li>View sample visualizations and dashboards</li>
              <li>Explore the interface and features</li>
              <li>See how data can be visualized in different ways</li>
            </ul>
            <p className="mt-2 text-sm text-yellow-700">
              To create your own visualizations, import data, and save dashboards, please 
              <button onClick={() => navigate('/register')} className="ml-1 font-medium text-blue-600 hover:text-blue-500">
                create an account
              </button>.
            </p>
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
              <h3 className="text-lg font-medium text-gray-900">Sample Datasets</h3>
              <p className="text-2xl font-bold text-gray-900">4</p>
            </div>
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => navigate('/datasets')}
              className="w-full"
            >
              View Samples
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
              <p className="text-2xl font-bold text-gray-900">4</p>
            </div>
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => navigate('/visualizations')}
              className="w-full"
            >
              View Samples
            </Button>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <LayoutDashboard size={20} />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Sample Dashboard</h3>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => navigate('/register')}
              className="w-full"
            >
              Create Account
            </Button>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Bar Chart Sample">
          <div className="h-80 flex items-center justify-center">
            <ChartRenderer
              type="bar"
              data={sampleData}
              config={barChartConfig}
              width={500}
              height={300}
            />
          </div>
        </Card>

        <Card title="Line Chart Sample">
          <div className="h-80 flex items-center justify-center">
            <ChartRenderer
              type="line"
              data={salesData}
              config={lineChartConfig}
              width={500}
              height={300}
            />
          </div>
        </Card>

        <Card title="Pie Chart Sample">
          <div className="h-80 flex items-center justify-center">
            <ChartRenderer
              type="pie"
              data={productData}
              config={pieChartConfig}
              width={500}
              height={300}
            />
          </div>
        </Card>

        <Card title="Scatter Plot Sample">
          <div className="h-80 flex items-center justify-center">
            <ChartRenderer
              type="scatter"
              data={regionData}
              config={scatterChartConfig}
              width={500}
              height={300}
            />
          </div>
        </Card>
      </div>

      <Card title="Quick Actions">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            onClick={() => navigate('/register')}
            leftIcon={<Database size={16} />}
            className="h-16 flex items-center justify-center"
          >
            Create Your Own Datasets
          </Button>
          <Button
            onClick={() => navigate('/register')}
            leftIcon={<BarChart2 size={16} />}
            className="h-16 flex items-center justify-center"
          >
            Build Custom Visualizations
          </Button>
          <Button
            onClick={() => navigate('/register')}
            leftIcon={<LayoutDashboard size={16} />}
            className="h-16 flex items-center justify-center"
          >
            Create Personal Dashboards
          </Button>
          <Button
            onClick={() => navigate('/register')}
            leftIcon={<TrendingUp size={16} />}
            className="h-16 flex items-center justify-center"
          >
            Unlock All Features
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default GuestDashboard;