import React from 'react';
import { Link } from 'react-router-dom';

const DemoNav = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-xl p-4 border border-gray-200">
      <h3 className="font-bold text-sm mb-2 text-primary-600">📱 Demo Navigation</h3>
      <div className="space-y-2">
        <div className="text-xs font-semibold text-gray-500">USER PAGES</div>
        <div className="grid grid-cols-2 gap-2">
          <Link to="/dashboard" className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-primary-100">Dashboard</Link>
          <Link to="/receipts" className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-primary-100">Receipts</Link>
          <Link to="/mileage" className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-primary-100">Mileage</Link>
          <Link to="/documents" className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-primary-100">Documents</Link>
        </div>
        
        <div className="text-xs font-semibold text-gray-500 mt-2">CA PAGES</div>
        <div className="grid grid-cols-2 gap-2">
          <Link to="/ca/dashboard" className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-primary-100">CA Dashboard</Link>
          <Link to="/ca/clients" className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-primary-100">Clients</Link>
          <Link to="/ca/clients/1" className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-primary-100">Client Detail</Link>
          <Link to="/ca/reviews" className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-primary-100">Reviews</Link>
        </div>
        
        <div className="text-xs font-semibold text-gray-500 mt-2">AUTH PAGES</div>
        <div className="grid grid-cols-2 gap-2">
          <Link to="/login" className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-primary-100">Login</Link>
          <Link to="/register" className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-primary-100">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default DemoNav;







