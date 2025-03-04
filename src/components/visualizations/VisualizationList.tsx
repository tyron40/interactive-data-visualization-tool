import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Trash2, Edit, Share2, LayoutDashboard } from 'lucide-react';
import { Visualization } from '../../types';
import { useVisualizationStore } from '../../store/visualizationStore';
import { useAuthStore } from '../../store/authStore';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';

const VisualizationList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { visualizations, fetchUserVisualizations, deleteVisualization, shareVisualization, isLoading, error } = useVisualizationStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredVisualizations, setFilteredVisualizations] = useState<Visualization[]>([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [currentVisualizationId, setCurrentVisualizationId] = useState<string | null>(null);
  const [shareEmail, setShareEmail] = useState('');

  useEffect(() => {
    if (user) {
      fetchUserVisualizations(user.id);
    }
  }, [user, fetchUserVisualizations]);

  useEffect(() => {
    if (visualizations) {
      setFilteredVisualizations(
        visualizations.filter((viz) =>
          viz.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [visualizations, searchTerm]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this visualization?')) {
      await deleteVisualization(id);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/visualizations/${id}/edit`);
  };

  const handleAddToDashboard = (id: string) => {
    navigate(`/dashboards/new?visualizationId=${id}`);
  };

  const handleShare = (id: string) => {
    setCurrentVisualizationId(id);
    setIsShareModalOpen(true);
  };

  const handleShareSubmit = async () => {
    if (currentVisualizationId && shareEmail) {
      await shareVisualization(currentVisualizationId, shareEmail);
      setIsShareModalOpen(false);
      setShareEmail('');
      setCurrentVisualizationId(null);
    }
  };

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
      case 'donut':
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
        <h2 className="text-2xl font-bold text-gray-900">Your Visualizations</h2>
        <Button
          onClick={() => navigate('/datasets')}
          leftIcon={<PlusCircle size={16} />}
        >
          New Visualization
        </Button>
      </div>

      <div className="w-full max-w-md">
        <Input
          placeholder="Search visualizations..."
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
      ) : filteredVisualizations.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500 mb-4">No visualizations found</p>
          <Button
            variant="primary"
            onClick={() => navigate('/datasets')}
            leftIcon={<PlusCircle size={16} />}
          >
            Create your first visualization
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVisualizations.map((visualization) => (
            <Card
              key={visualization.id}
              title={visualization.name}
              subtitle={`Created ${new Date(visualization.createdAt).toLocaleDateString()}`}
              className="hover:shadow-lg transition-shadow"
              actions={
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(visualization.id)}
                    className="text-gray-500 hover:text-gray-700"
                    title="Edit visualization"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleShare(visualization.id)}
                    className="text-gray-500 hover:text-blue-600"
                    title="Share visualization"
                  >
                    <Share2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(visualization.id)}
                    className="text-gray-500 hover:text-red-600"
                    title="Delete visualization"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              }
            >
              <div className="flex items-center mb-4">
                <div className="mr-3">{getChartTypeIcon(visualization.type)}</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {visualization.type.charAt(0).toUpperCase() + visualization.type.slice(1)} Chart
                  </p>
                  <p className="text-sm text-gray-500">
                    {visualization.description || 'No description provided'}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => handleAddToDashboard(visualization.id)}
                  leftIcon={<LayoutDashboard size={16} />}
                  className="w-full"
                >
                  Add to Dashboard
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Share Visualization"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Share this visualization with others by email. They will be able to view and comment on it.
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

export default VisualizationList;