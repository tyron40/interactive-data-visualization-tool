import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Trash2, Edit, Share2, Copy } from 'lucide-react';
import { Dashboard } from '../../types';
import { useDashboardStore } from '../../store/dashboardStore';
import { useAuthStore } from '../../store/authStore';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';

const DashboardList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { dashboards, fetchUserDashboards, deleteDashboard, shareDashboard, isLoading, error } = useDashboardStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDashboards, setFilteredDashboards] = useState<Dashboard[]>([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [currentDashboardId, setCurrentDashboardId] = useState<string | null>(null);
  const [shareEmail, setShareEmail] = useState('');

  useEffect(() => {
    if (user) {
      fetchUserDashboards(user.id);
    }
  }, [user, fetchUserDashboards]);

  useEffect(() => {
    if (dashboards) {
      setFilteredDashboards(
        dashboards.filter((dashboard) =>
          dashboard.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [dashboards, searchTerm]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this dashboard?')) {
      await deleteDashboard(id);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/dashboards/${id}/edit`);
  };

  const handleView = (id: string) => {
    navigate(`/dashboards/${id}`);
  };

  const handleShare = (id: string) => {
    setCurrentDashboardId(id);
    setIsShareModalOpen(true);
  };

  const handleShareSubmit = async () => {
    if (currentDashboardId && shareEmail) {
      await shareDashboard(currentDashboardId, shareEmail);
      setIsShareModalOpen(false);
      setShareEmail('');
      setCurrentDashboardId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Your Dashboards</h2>
        <Button
          onClick={() => navigate('/dashboards/new')}
          leftIcon={<PlusCircle size={16} />}
        >
          New Dashboard
        </Button>
      </div>

      <div className="w-full max-w-md">
        <Input
          placeholder="Search dashboards..."
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
      ) : filteredDashboards.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500 mb-4">No dashboards found</p>
          <Button
            variant="primary"
            onClick={() => navigate('/dashboards/new')}
            leftIcon={<PlusCircle size={16} />}
          >
            Create your first dashboard
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDashboards.map((dashboard) => (
            <Card
              key={dashboard.id}
              title={dashboard.name}
              subtitle={`Created ${new Date(dashboard.createdAt).toLocaleDateString()}`}
              className="hover:shadow-lg transition-shadow"
              actions={
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(dashboard.id)}
                    className="text-gray-500 hover:text-gray-700"
                    title="Edit dashboard"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleShare(dashboard.id)}
                    className="text-gray-500 hover:text-blue-600"
                    title="Share dashboard"
                  >
                    <Share2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(dashboard.id)}
                    className="text-gray-500 hover:text-red-600"
                    title="Delete dashboard"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              }
            >
              <div className="mb-4">
                <p className="text-sm text-gray-500">
                  {dashboard.description || 'No description provided'}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {dashboard.visualizations.length} visualizations
                </p>
              </div>
              <div className="mt-4">
                <Button
                  variant="primary"
                  onClick={() => handleView(dashboard.id)}
                  className="w-full"
                >
                  View Dashboard
                </Button>
              </div>
            </Card>
          ))}
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

export default DashboardList;