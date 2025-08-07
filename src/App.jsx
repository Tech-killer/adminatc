import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AdminHero from './components/AdminHero';
import AdminScroller from './components/AdminScroller';
import AdminPhoto from './components/AdminPhoto';
import AdminGallery from './components/AdminGallery';
import AdminFeature from './components/AdminFeature';
import Admincommunity from './components/Admincommunity';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 ml-64">
          <div className="p-6">
            <Routes>
              {/* Default redirect to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Dashboard */}
              <Route path="/" element={<Dashboard />} />
              
              {/* Admin Components */}
              <Route path="/admin/hero" element={<AdminHero />} />
              <Route path="/admin/scroller" element={<AdminScroller />} />
              <Route path="/admin/photo" element={<AdminPhoto />} />
              <Route path="/admin/gallery" element={<AdminGallery />} />
              <Route path="/admin/feature" element={<AdminFeature />} />
              <Route path="/admin/community" element={<Admincommunity />} />
              
              {/* 404 Page */}
              <Route path="*" element={<div className="text-center py-10"><h1 className="text-2xl font-bold text-gray-600">Page Not Found</h1></div>} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;