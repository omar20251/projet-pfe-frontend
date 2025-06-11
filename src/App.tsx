import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import JobOffers from './pages/jobs/JobOffers';
import JobDetails from './pages/jobs/JobDetails';
import CandidateProfile from './pages/candidates/CandidateProfile';
import RecruiterDashboard from './pages/recruiters/RecruiterDashboard';
import RecruiterProfile from './pages/recruiters/RecruiterProfile';
import CandidateList from './pages/recruiters/CandidateList';
import TestManagement from './pages/tests/TestManagement';
import TakeTest from './pages/tests/TakeTest';
import ProtectedRoute from './components/auth/ProtectedRoute';
import TestResults from './pages/tests/TestResults';
import NotFound from './pages/NotFound';
import PostJobForm from './pages/recruiters/PostJobForm';
import FeedbackPage from './pages/Feedback/FeedbackPage';


function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="jobs" element={<JobOffers />} />
          <Route path="jobs/:id" element={<JobDetails />} />
          
          {/* Candidate routes */}
          <Route path="profile" element={
            <ProtectedRoute roles={['candidate']}>
              <CandidateProfile />
            </ProtectedRoute>
          } />
          <Route path="tests" element={
          
              <TakeTest />
        
          } />
          <Route path="results/:id" element={
            <ProtectedRoute roles={['candidate', 'recruiter']}>
              <TestResults />
            </ProtectedRoute>
          } />
          <Route path="feedback" element={<FeedbackPage />} />
          
          {/* Recruiter routes */}
          <Route path="recruiter" element={
            <ProtectedRoute roles={['recruiter']}>
              <RecruiterDashboard />
            </ProtectedRoute>
          } />
          <Route path="recruiter/profile" element={
            <ProtectedRoute roles={['recruiter']}>
              <RecruiterProfile />
            </ProtectedRoute>
          } />
          <Route path="recruiter/candidates" element={
            <ProtectedRoute roles={['recruiter']}>
              <CandidateList />
            </ProtectedRoute>
          } />

          <Route path="recruiter/post-job" element={
            <ProtectedRoute roles={['recruiter']}>
              <PostJobForm />
            </ProtectedRoute>
          } />

          <Route path="recruiter/tests" element={
            <ProtectedRoute roles={['recruiter']}>
              <TestManagement />
            </ProtectedRoute>
          } />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
    

  );
}

export default App;