import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, Database } from 'lucide-react';
import { useDatasetStore } from '../../store/datasetStore';
import { useAuthStore } from '../../store/authStore';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import Tabs from '../ui/Tabs';
import Alert from '../ui/Alert';

const DataImport: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { importFromCSV, importFromJSON, isLoading, error, clearError } = useDatasetStore();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [nameError, setNameError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setFileError('');
      
      // Auto-fill name from filename if empty
      if (!name) {
        const fileName = acceptedFiles[0].name.split('.')[0];
        setName(fileName);
      }
    }
  }, [name]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
    },
    maxFiles: 1,
  });
  
  const validateForm = () => {
    let isValid = true;
    
    if (!name.trim()) {
      setNameError('Dataset name is required');
      isValid = false;
    } else {
      setNameError('');
    }
    
    if (!file) {
      setFileError('Please upload a file');
      isValid = false;
    } else {
      setFileError('');
    }
    
    return isValid;
  };
  
  const handleImport = async () => {
    if (!validateForm() || !user || !file) return;
    
    try {
      clearError();
      
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (fileExtension === 'csv') {
        await importFromCSV(file, name, description, user.id);
      } else if (fileExtension === 'json') {
        await importFromJSON(file, name, description, user.id);
      } else {
        setFileError('Unsupported file format');
        return;
      }
      
      setImportSuccess(true);
      setTimeout(() => {
        navigate('/datasets');
      }, 2000);
    } catch (err) {
      console.error('Import error:', err);
    }
  };
  
  const handleExternalImport = () => {
    // This would be implemented to connect to external data sources
    navigate('/datasets/external');
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Import Dataset</h2>
      
      {importSuccess && (
        <Alert variant="success" title="Success!" className="mb-4">
          Dataset imported successfully. Redirecting to datasets...
        </Alert>
      )}
      
      {error && (
        <Alert variant="error" title="Error" onClose={clearError} className="mb-4">
          {error}
        </Alert>
      )}
      
      <Tabs
        tabs={[
          {
            id: 'file',
            label: 'File Upload',
            icon: <FileText size={16} />,
            content: (
              <Card className="mt-4">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Input
                      label="Dataset Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter a name for your dataset"
                      error={nameError}
                      required
                    />
                    
                    <Input
                      label="Description (Optional)"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter a description for your dataset"
                    />
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        File Upload
                      </label>
                      <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                          isDragActive
                            ? 'border-blue-400 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        } ${fileError ? 'border-red-300' : ''}`}
                      >
                        <input {...getInputProps()} />
                        <Upload
                          className={`mx-auto h-12 w-12 ${
                            isDragActive ? 'text-blue-500' : 'text-gray-400'
                          }`}
                        />
                        <p className="mt-2 text-sm text-gray-600">
                          {isDragActive
                            ? 'Drop the file here...'
                            : 'Drag & drop a CSV or JSON file here, or click to select'}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Supported formats: CSV, JSON
                        </p>
                        {file && (
                          <p className="mt-2 text-sm font-medium text-blue-600">
                            Selected: {file.name}
                          </p>
                        )}
                      </div>
                      {fileError && <p className="text-sm text-red-600">{fileError}</p>}
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleImport}
                    isLoading={isLoading}
                    disabled={isLoading}
                    className="w-full"
                  >
                    Import Dataset
                  </Button>
                </div>
              </Card>
            ),
          },
          {
            id: 'external',
            label: 'External Sources',
            icon: <Database size={16} />,
            content: (
              <Card className="mt-4">
                <div className="space-y-6">
                  <p className="text-gray-600">
                    Connect to external data sources like databases, APIs, or cloud storage.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      onClick={handleExternalImport}
                      className="h-24 flex flex-col items-center justify-center"
                    >
                      <Database size={24} className="mb-2" />
                      <span>Database Connection</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={handleExternalImport}
                      className="h-24 flex flex-col items-center justify-center"
                    >
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
                        className="mb-2"
                      >
                        <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                      </svg>
                      <span>API Connection</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={handleExternalImport}
                      className="h-24 flex flex-col items-center justify-center"
                    >
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
                        className="mb-2"
                      >
                        <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" />
                        <polyline points="14 2 14 8 20 8" />
                        <path d="M2 15h10" />
                        <path d="m9 18 3-3-3-3" />
                      </svg>
                      <span>Google Sheets</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={handleExternalImport}
                      className="h-24 flex flex-col items-center justify-center"
                    >
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
                        className="mb-2"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" x2="12" y1="15" y2="3" />
                      </svg>
                      <span>Cloud Storage</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
};

export default DataImport;