import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import { Provider } from 'react-redux';
import { store } from './store';
import MainLayout from "./layouts/MainLayout";

// Lazy load pages
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Documents = lazy(() => import("./pages/Documents"));
const AddDocument = lazy(() => import("./pages/AddDocument"));
const AddReminder = lazy(() => import("./pages/AddReminder"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected routes */}
            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/add-document" element={<AddDocument />} />
              <Route path="/add-reminder/:documentId" element={<AddReminder />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </Provider>
  );
}

export default App;
