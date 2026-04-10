import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

// Public
import Home     from '../pages/Home';
import Login    from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Student
import StudentDashboard from '../pages/student/StudentDashboard';
import JobList          from '../pages/student/JobList';
import ApplyJob         from '../pages/student/ApplyJob';
import MyApplications   from '../pages/student/MyApplications';

// Company
import CompanyDashboard from '../pages/company/CompanyDashboard';
import PostJob          from '../pages/company/PostJob';
import CompanyJobs      from '../pages/company/CompanyJobs';
import JobApplications  from '../pages/company/JobApplications';

// Admin
import AdminDashboard      from '../pages/admin/AdminDashboard';
import ManageUsers         from '../pages/admin/ManageUsers';
import ManageJobs          from '../pages/admin/ManageJobs';
import ManageApplications  from '../pages/admin/ManageApplications';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"         element={<Home />} />
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student */}
      <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
        <Route path="/student"                element={<StudentDashboard />} />
        <Route path="/student/jobs"           element={<JobList />} />
        <Route path="/student/jobs/:id"       element={<ApplyJob />} />
        <Route path="/student/applications"   element={<MyApplications />} />
      </Route>

      {/* Company */}
      <Route element={<ProtectedRoute allowedRoles={['COMPANY']} />}>
        <Route path="/company"              element={<CompanyDashboard />} />
        <Route path="/company/post-job"     element={<PostJob />} />
        <Route path="/company/jobs"         element={<CompanyJobs />} />
        <Route path="/company/applications" element={<JobApplications />} />
      </Route>

      {/* Admin */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route path="/admin"                element={<AdminDashboard />} />
        <Route path="/admin/users"          element={<ManageUsers />} />
        <Route path="/admin/jobs"           element={<ManageJobs />} />
        <Route path="/admin/applications"   element={<ManageApplications />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
