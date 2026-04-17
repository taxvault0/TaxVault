import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';
import PrivateRoute from './PrivateRoute';

// Layout
import AppShell from '../../components/layout/AppShell';

// Chat
import ChatButton from '../../features/chat/components/ChatButton';
import ChatDrawer from '../../features/chat/components/ChatDrawer';
import CAMessages from '../../features/chat/pages/CAMessages';
import CAConversation from '../../features/chat/pages/CAConversation';
import UserMessages from '../../features/chat/pages/UserMessages';
import UserConversation from '../../features/chat/pages/UserConversation';

// Life Events
import LifeEventsHub from '../../features/life-events/pages/LifeEventsHub';
import MaritalStatusUpdate from '../../features/life-events/pages/MaritalStatusUpdate';
import SeparationDivorce from '../../features/life-events/pages/SeparationDivorce';
import AddDependent from '../../features/life-events/pages/AddDependent';
import ChangeAddress from '../../features/life-events/pages/ChangeAddress';
import LegacyContact from '../../features/life-events/pages/LegacyContact';

// Auth
import Login from '../../features/auth/pages/Login';
import LoginUser from '../../features/auth/pages/LoginUser';
import LoginCA from '../../features/auth/pages/LoginCA';
import Register from '../../features/auth/pages/register/Register';
import RegisterCA from '../../features/auth/pages/registerCA/RegisterCA';
import RoleSelect from '../../features/auth/pages/RoleSelect';
import ForgotPassword from '../../features/auth/pages/ForgotPassword';

// User
import Dashboard from '../../features/dashboard/pages/Dashboard';
import Receipts from '../../features/documents/pages/Receipts';
import ReceiptDetail from '../../features/documents/pages/ReceiptDetail';
import Mileage from '../../features/mileage/pages/Mileage';
import MileageTracker from '../../features/mileage/pages/MileageTracker';
import TripDetail from '../../features/mileage/pages/TripDetail';
import Documents from '../../features/documents/pages/Documents';
import Profile from '../../features/profile/pages/Profile';
import Settings from '../../features/profile/pages/Settings';
import AccountDocuments from '../../features/documents/pages/AccountDocuments';
import TaxChecklist from '../../features/tax/pages/TaxChecklist';
import FindCA from '../../features/directory/pages/FindCA';

// Consultations
import Consultations from '../../features/consultations/pages/Consultations';
import ConsultationRequest from '../../features/consultations/pages/ConsultationRequest';
import ConsultationDetail from '../../features/consultations/pages/ConsultationDetail';
import CAAvailability from '../../features/consultations/pages/CAAvailability';
import CAPricing from '../../features/ca/pages/CAPricing';

// Gig / Tax
import GSTDashboard from '../../features/dashboard/pages/GSTDashboard';
import BusinessUseCalculator from '../../features/tax/pages/BusinessUseCalculator';
import T2125Form from '../../features/tax/pages/T2125Form';
import GigDocumentsHub from '../../features/gig/pages/GigDocumentsHub';
import GigDocumentCategory from '../../features/gig/pages/GigDocumentCategory';

// Business
import BusinessOwnerDashboard from '../../features/dashboard/pages/BusinessOwnerDashboard';
import BusinessInfo from '../../features/business/pages/BusinessInfo';
import BusinessIncome from '../../features/business/pages/BusinessIncome';
import BusinessExpenses from '../../features/business/pages/BusinessExpenses';
import BusinessPayroll from '../../features/business/pages/BusinessPayroll';
import BusinessStructure from '../../features/business/pages/BusinessStructure';
import BusinessInventory from '../../features/business/pages/BusinessInventory';
import BusinessGSTRecords from '../../features/business/pages/BusinessGSTRecords';

// CA
import CADashboard from '../../features/dashboard/pages/CADashboard';
import Clients from '../../features/clients/pages/Clients';
import ClientDetail from '../../features/clients/pages/ClientDetail';
import ClientDocuments from '../../features/clients/pages/ClientDocuments';
import ClientTaxSummary from '../../features/clients/pages/ClientTaxSummary';
import ClientSearch from '../../features/clients/pages/ClientSearch';
import CAAnalyticsDashboard from '../../features/dashboard/pages/CAAnalyticsDashboard';
import CARequestDashboard from '../../features/dashboard/pages/CARequestDashboard';
import CARequestDetail from '../../features/ca/pages/CARequestDetail';
import CACalendar from '../../features/ca/pages/CACalendar';
import CAEarnings from '../../features/ca/pages/CAEarnings';
import CAReviews from '../../features/ca/pages/CAReviews';
import ClientFilingSummary from '../../features/ca/pages/ClientFilingSummary';
import CAOfficeHoursSettings from '../../features/profile/pages/CAOfficeHoursSettings';

const PublicRoutes = () => (
  <Routes>
    <Route path="/" element={<RoleSelect />} />
    {/* <Route path="/login" element={<Login />} /> */}
    <Route path="/login/user" element={<Login />} />
    <Route path="/login/ca" element={<LoginCA />} />
    <Route path="/register/user" element={<Register />} />
    <Route path="/register/ca" element={<RegisterCA />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/receipts/:id" element={<ReceiptDetail />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const ProtectedRoutes = ({ user, chatOpen, setChatOpen }) => {
  const location = useLocation();

  const isMessagePage =
    location.pathname.startsWith('/messages') ||
    location.pathname.startsWith('/ca/messages');

  const renderWithShell = (element, options = {}) => (
    <AppShell
      showRightPanel={options.showRightPanel || false}
      rightPanel={options.rightPanel || null}
      contentClassName={options.contentClassName || ''}
      containerClassName={options.containerClassName || ''}
    >
      {element}
    </AppShell>
  );

  return (
    <>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={['user', 'business_owner']}>
              {renderWithShell(<Dashboard />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/receipts"
          element={
            <PrivateRoute allowedRoles={['user', 'business_owner']}>
              {renderWithShell(<Receipts />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/receipts/:id"
          element={
            <PrivateRoute allowedRoles={['user', 'business_owner']}>
              {renderWithShell(<ReceiptDetail />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/accounts"
          element={
            <PrivateRoute allowedRoles={['user', 'business_owner']}>
              {renderWithShell(<AccountDocuments />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/tax-checklist"
          element={
            <PrivateRoute allowedRoles={['user', 'business_owner']}>
              {renderWithShell(<TaxChecklist />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/find-ca"
          element={
            <PrivateRoute allowedRoles={['user', 'business_owner']}>
              {renderWithShell(<FindCA />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/mileage"
          element={
            <PrivateRoute allowedRoles={['user', 'business_owner']}>
              {renderWithShell(<Mileage />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/mileage/track"
          element={
            <PrivateRoute allowedRoles={['user', 'business_owner']}>
              {renderWithShell(<MileageTracker />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/mileage/:id"
          element={
            <PrivateRoute allowedRoles={['user', 'business_owner']}>
              {renderWithShell(<TripDetail />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/documents"
          element={
            <PrivateRoute allowedRoles={['user', 'business_owner']}>
              {renderWithShell(<Documents />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/gig/documents"
          element={
            <PrivateRoute allowedRoles={['user', 'business_owner']}>
              {renderWithShell(<GigDocumentsHub />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/gig/documents/:categoryId"
          element={
            <PrivateRoute allowedRoles={['user', 'business_owner']}>
              {renderWithShell(<GigDocumentCategory />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <PrivateRoute allowedRoles={['user', 'business_owner']}>
              {renderWithShell(<UserMessages />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/messages/:caId"
          element={
            <PrivateRoute allowedRoles={['user', 'business_owner']}>
              {renderWithShell(<UserConversation />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute allowedRoles={['user', 'business_owner', 'ca']}>
              {renderWithShell(<Profile />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute allowedRoles={['user', 'business_owner', 'ca']}>
              {renderWithShell(<Settings />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/life-events"
          element={
            <PrivateRoute allowedRoles={['user', 'business_owner', 'ca']}>
              {renderWithShell(<LifeEventsHub />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/life-events/marriage"
          element={
            <PrivateRoute allowedRoles={['user', 'business_owner', 'ca']}>
              {renderWithShell(<MaritalStatusUpdate />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/life-events/separation"
          element={
            <PrivateRoute allowedRoles={['user', 'business_owner', 'ca']}>
              {renderWithShell(<SeparationDivorce />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/life-events/add-dependent"
          element={
            <PrivateRoute allowedRoles={['user', 'business_owner', 'ca']}>
              {renderWithShell(<AddDependent />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/life-events/change-address"
          element={
            <PrivateRoute allowedRoles={['user', 'business_owner', 'ca']}>
              {renderWithShell(<ChangeAddress />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/life-events/legacy-contact"
          element={
            <PrivateRoute allowedRoles={['user', 'business_owner', 'ca']}>
              {renderWithShell(<LegacyContact />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/gst-dashboard"
          element={
            <PrivateRoute allowedRoles={['user', 'business_owner']}>
              {renderWithShell(<GSTDashboard />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/business-use-calculator"
          element={
            <PrivateRoute allowedRoles={['user', 'business_owner']}>
              {renderWithShell(<BusinessUseCalculator />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/t2125-form"
          element={
            <PrivateRoute allowedRoles={['user', 'business_owner']}>
              {renderWithShell(<T2125Form />)}
            </PrivateRoute>
          }
        />

        {/* Business routes */}
        <Route
          path="/business/dashboard"
          element={
            <PrivateRoute allowedRoles={['user', 'business_owner']}>
              {renderWithShell(<BusinessOwnerDashboard />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/business/business-info"
          element={
            <PrivateRoute allowedRoles={['user', 'business_owner']}>
              {renderWithShell(<BusinessInfo />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/business/income"
          element={
            <PrivateRoute allowedRoles={['user', 'business_owner']}>
              {renderWithShell(<BusinessIncome />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/business/expenses"
          element={
            <PrivateRoute allowedRoles={['user', 'business_owner']}>
              {renderWithShell(<BusinessExpenses />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/business/payroll"
          element={
            <PrivateRoute allowedRoles={['user', 'business_owner']}>
              {renderWithShell(<BusinessPayroll />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/business/structure"
          element={
            <PrivateRoute allowedRoles={['user', 'business_owner']}>
              {renderWithShell(<BusinessStructure />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/business/inventory"
          element={
            <PrivateRoute allowedRoles={['user', 'business_owner']}>
              {renderWithShell(<BusinessInventory />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/business/gst-records"
          element={
            <PrivateRoute allowedRoles={['user', 'business_owner']}>
              {renderWithShell(<BusinessGSTRecords />)}
            </PrivateRoute>
          }
        />

        {/* Consultations */}
        <Route
          path="/consultations"
          element={
            <PrivateRoute allowedRoles={['user', 'business_owner']}>
              {renderWithShell(<Consultations />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/consultations/request/:caId"
          element={
            <PrivateRoute allowedRoles={['user', 'business_owner']}>
              {renderWithShell(<ConsultationRequest />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/consultations/:id"
          element={
            <PrivateRoute allowedRoles={['user', 'business_owner']}>
              {renderWithShell(<ConsultationDetail />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/ca-availability/:caId"
          element={
            <PrivateRoute allowedRoles={['user', 'business_owner']}>
              {renderWithShell(<CAAvailability />)}
            </PrivateRoute>
          }
        />

        {/* CA routes */}
        <Route
          path="/ca/dashboard"
          element={
            <PrivateRoute allowedRoles={['ca']}>
              {renderWithShell(<CADashboard />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/ca/clients"
          element={
            <PrivateRoute allowedRoles={['ca']}>
              {renderWithShell(<Clients />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/ca/clients/:id"
          element={
            <PrivateRoute allowedRoles={['ca']}>
              {renderWithShell(<ClientDetail />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/ca/clients/:id/documents"
          element={
            <PrivateRoute allowedRoles={['ca']}>
              {renderWithShell(<ClientDocuments />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/ca/clients/:id/tax-summary"
          element={
            <PrivateRoute allowedRoles={['ca']}>
              {renderWithShell(<ClientTaxSummary />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/ca/clients/:id/filing-summary"
          element={
            <PrivateRoute allowedRoles={['ca']}>
              {renderWithShell(<ClientFilingSummary />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/ca/search"
          element={
            <PrivateRoute allowedRoles={['ca']}>
              {renderWithShell(<ClientSearch />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/ca/analytics"
          element={
            <PrivateRoute allowedRoles={['ca']}>
              {renderWithShell(<CAAnalyticsDashboard />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/ca/requests"
          element={
            <PrivateRoute allowedRoles={['ca']}>
              {renderWithShell(<CARequestDashboard />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/ca/reviews"
          element={
            <PrivateRoute allowedRoles={['ca']}>
              {renderWithShell(<CAReviews />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/ca/requests/:id"
          element={
            <PrivateRoute allowedRoles={['ca']}>
              {renderWithShell(<CARequestDetail />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/ca/calendar"
          element={
            <PrivateRoute allowedRoles={['ca']}>
              {renderWithShell(<CACalendar />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/ca/earnings"
          element={
            <PrivateRoute allowedRoles={['ca']}>
              {renderWithShell(<CAEarnings />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/ca/pricing"
          element={
            <PrivateRoute allowedRoles={['ca']}>
              {renderWithShell(<CAPricing />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/ca/profile/office-hours"
          element={
            <PrivateRoute allowedRoles={['ca']}>
              {renderWithShell(<CAOfficeHoursSettings />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/ca/messages"
          element={
            <PrivateRoute allowedRoles={['ca']}>
              {renderWithShell(<CAMessages />)}
            </PrivateRoute>
          }
        />
        <Route
          path="/ca/messages/:clientId"
          element={
            <PrivateRoute allowedRoles={['ca']}>
              {renderWithShell(<CAConversation />)}
            </PrivateRoute>
          }
        />

        <Route
          path="/"
          element={
            <Navigate
              to={user?.role === 'ca' ? '/ca/dashboard' : '/dashboard'}
              replace
            />
          }
        />
        <Route
          path="*"
          element={
            <Navigate
              to={user?.role === 'ca' ? '/ca/dashboard' : '/dashboard'}
              replace
            />
          }
        />
      </Routes>

      {chatOpen && !isMessagePage && (
        <ChatDrawer isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      )}
    </>
  );
};

const AppRoutes = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <PublicRoutes />;
  }

  return (
    <>
      <ProtectedRoutes user={user} chatOpen={chatOpen} setChatOpen={setChatOpen} />
      <ChatButton />
    </>
  );
};

export default AppRoutes;