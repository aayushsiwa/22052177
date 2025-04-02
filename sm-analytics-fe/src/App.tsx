import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Feed from './pages/Feed';
import TopUsers from './pages/TopUsers';
import TrendingPosts from './pages/TrendingPosts';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/top-users" element={<TopUsers />} />
            <Route path="/trending-posts" element={<TrendingPosts />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="bg-white shadow-inner py-4 mt-8">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            <p>© 2025 Social Media Analytics. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;