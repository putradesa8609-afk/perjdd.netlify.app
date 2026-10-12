import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import DataTable from './components/DataTable';
import Rekap from './components/Rekap';
import HelpModal from './components/HelpModal';
import { PerjalananDinas } from './types';

const STORAGE_KEY = 'perjalanan_dinas_data';

function App() {
  const [activeTab, setActiveTab] = useState('input');
  const [data, setData] = useState<PerjalananDinas[]>([]);
  const [editData, setEditData] = useState<PerjalananDinas | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      try {
        setData(JSON.parse(storedData));
      } catch (e) {
        console.error('Error loading data:', e);
      }
    }

    // Tampilkan panduan otomatis saat pertama kali dibuka
    const hasSeenHelp = localStorage.getItem('has_seen_help');
    if (!hasSeenHelp) {
      setIsHelpOpen(true);
      localStorage.setItem('has_seen_help', 'true');
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // Show notification
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle form submit
  const handleSubmit = (formData: PerjalananDinas) => {
    if (editData) {
      // Update existing data
      setData(prev => prev.map(item => item.id === formData.id ? formData : item));
      setEditData(null);
      showNotification('Data berhasil diperbarui!', 'success');
    } else {
      // Add new data
      setData(prev => [...prev, formData]);
      showNotification('Data berhasil disimpan!', 'success');
    }
  };

  // Handle edit
  const handleEdit = (item: PerjalananDinas) => {
    setEditData(item);
    setActiveTab('input');
  };

  // Handle delete
  const handleDelete = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
    showNotification('Data berhasil dihapus!', 'success');
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditData(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} onHelpClick={() => setIsHelpOpen(true)} />
      
      {/* Help Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium animate-pulse ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {notification.message}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {activeTab === 'input' && (
          <div className="space-y-6">
            <InputForm
              onSubmit={handleSubmit}
              editData={editData}
              onCancelEdit={handleCancelEdit}
            />
            {data.length > 0 && (
              <DataTable
                data={data}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
        )}
        {activeTab === 'data' && (
          <DataTable
            data={data}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        {activeTab === 'rekap' && (
          <Rekap data={data} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-center py-4 mt-8">
        <p className="text-sm">
          © 2024 Sistem Pencatatan Perjalanan Dinas | Data tersimpan secara lokal di browser
        </p>
      </footer>
    </div>
  );
}

export default App;
