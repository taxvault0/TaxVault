import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import pages (we'll create these next)
const Register = () => <div>Register Page</div>;
const ForgotPassword = () => <div>Forgot Password Page</div>;
const Dashboard = () => <div>Dashboard Page</div>;
const Receipts = () => <div>Receipts Page</div>;
const Mileage = () => <div>Mileage Page</div>;
const Documents = () => <div>Documents Page</div>;
const Profile = () => <div>Profile Page</div>;
const Settings = () => <div>Settings Page</div>;
const CAReviews = () => <div>CA Reviews Page</div>;
const CAReports = () => <div>CA Reports Page</div>;

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/receipts" element={<Receipts />} />
          <Route path="/mileage" element={<Mileage />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/ca/reviews" element={<CAReviews />} />
          <Route path="/ca/reports" element={<CAReports />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;