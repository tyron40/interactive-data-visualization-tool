import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Trash2, Edit, BarChart2 } from 'lucide-react';
import { Dataset } from '../../types';
import { useDatasetStore } from '../../store/datasetStore';
import { useAuthStore } from '../../store/authStore';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

const DatasetList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { datasets, fetchUserDatasets, deleteDataset, isLoading, error } = useDatasetStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDatasets, setFilteredDatasets] = useState<Dataset[]>([]);

  useEffect(() => {
    if (user) {
      fetchUserDatasets(user.id);
    }
  }, [user, fetchUserDatasets]);

  useEffect(() => {
    if (datasets) {
      setFilteredDatasets(
        datasets.filter((dataset) =>
          dataset.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [datasets, searchTerm]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this dataset?')) {
      await deleteDataset(id);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/datasets/${id}/edit`);
  };

  const handleCreateVisualization = (id: string) => {
    navigate(`/datasets/${id}/visualize`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Your Datasets</h2>
        <Button
          onClick={() => navigate('/datasets/new')}
          leftIcon={<PlusCircle size={16} />}
        >
          New Dataset
        </Button>
      </div>

      <div className="w-full max-w-md">
        <Input
          placeholder="Search datasets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search size={16} />}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredDatasets.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500 mb-4">No datasets found</p>
          <Button
            variant="primary"
            onClick={() => navigate('/datasets/new')}
            leftIcon={<PlusCircle size={16} />}
          >
            Create your first dataset
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDatasets.map((dataset) => (
            <Card
              key={dataset.id}
              title={dataset.name}
              subtitle={`${dataset.data.length} rows • ${dataset.columns.length} columns`}
              className="hover:shadow-lg transition-shadow"
              actions={
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(dataset.id)}
                    className="text-gray-500 hover:text-gray-700"
                    title="Edit dataset"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(dataset.id)}
                    className="text-gray-500 hover:text-red-600"
                    title="Delete dataset"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              }
            >
              <div className="mb-4">
                <p className="text-sm text-gray-500">
                  {dataset.description || 'No description provided'}
                </p>
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => handleCreateVisualization(dataset.id)}
                  leftIcon={<BarChart2 size={16} />}
                  className="w-full"
                >
                  Visualize
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DatasetList;