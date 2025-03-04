import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, BarChart2 } from 'lucide-react';
import { useDatasetStore } from '../store/datasetStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import DataTable from '../components/data/DataTable';

const DatasetDetail: React.FC = () => {
  const { datasetId } = useParams<{ datasetId: string }>();
  const navigate = useNavigate();
  const { fetchDataset, currentDataset, deleteDataset, isLoading, error } = useDatasetStore();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (datasetId) {
      fetchDataset(datasetId);
    }
  }, [datasetId, fetchDataset]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this dataset? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        await deleteDataset(datasetId!);
        navigate('/datasets');
      } catch (error) {
        console.error('Error deleting dataset:', error);
        setIsDeleting(false);
      }
    }
  };

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

  if (!currentDataset) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
        Dataset not found
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
            leftIcon={<ArrowLeft size={16} />}
          >
            Back
          </Button>
          <h2 className="text-2xl font-bold text-gray-900">{currentDataset.name}</h2>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/datasets/${datasetId}/edit`)}
            leftIcon={<Edit size={16} />}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/datasets/${datasetId}/visualize`)}
            leftIcon={<BarChart2 size={16} />}
          >
            Visualize
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

      <Card title="Dataset Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Description</p>
            <p className="mt-1">{currentDataset.description || 'No description provided'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Details</p>
            <div className="mt-1 space-y-1">
              <p className="text-sm">
                <span className="font-medium">Rows:</span> {currentDataset.data.length}
              </p>
              <p className="text-sm">
                <span className="font-medium">Columns:</span> {currentDataset.columns.length}
              </p>
              <p className="text-sm">
                <span className="font-medium">Created:</span>{' '}
                {new Date(currentDataset.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm">
                <span className="font-medium">Last Updated:</span>{' '}
                {new Date(currentDataset.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Data Preview">
        <DataTable
          data={currentDataset.data}
          columns={currentDataset.columns}
          pageSize={10}
        />
      </Card>
    </div>
  );
};

export default DatasetDetail;