import React from 'react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Sistem Pencatatan Perjalanan Dinas</h1>
              <p className="text-blue-200 text-xs md:text-sm">Aplikasi Rekam Pelaksanaan Kegiatan Perjalanan Dinas</p>
            </div>
          </div>
        </div>
        <nav className="mt-4 flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('input')}
            className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-all ${
              activeTab === 'input'
                ? 'bg-white text-blue-800 shadow-md'
                : 'bg-blue-700/50 text-blue-100 hover:bg-blue-700'
            }`}
          >
            <span className="mr-2">📝</span> Input Data
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-all ${
              activeTab === 'data'
                ? 'bg-white text-blue-800 shadow-md'
                : 'bg-blue-700/50 text-blue-100 hover:bg-blue-700'
            }`}
          >
            <span className="mr-2">📊</span> Data Perjalanan
          </button>
          <button
            onClick={() => setActiveTab('rekap')}
            className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-all ${
              activeTab === 'rekap'
                ? 'bg-white text-blue-800 shadow-md'
                : 'bg-blue-700/50 text-blue-100 hover:bg-blue-700'
            }`}
          >
            <span className="mr-2">📋</span> Rekapitulasi
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
