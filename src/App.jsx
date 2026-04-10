import { useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import Navbar   from './components/Navbar';
import Sidebar  from './components/Sidebar';
import AppRoutes from './routes/AppRoutes';

const AUTH_PAGES = ['/login', '/register', '/'];
const DASHBOARD_PREFIXES = ['/student', '/company', '/admin'];

export default function App() {
  const { user } = useAuth();
  const { pathname } = useLocation();

  const isAuthPage  = AUTH_PAGES.includes(pathname);
  const isDashboard = DASHBOARD_PREFIXES.some(p => pathname.startsWith(p)) && user;

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-1)',
            border: '1px solid var(--border)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
          },
          success: { iconTheme: { primary: 'var(--accent-3)', secondary: 'var(--bg-card)' } },
          error:   { iconTheme: { primary: 'var(--accent-2)', secondary: 'var(--bg-card)' } },
        }}
      />

      {/* Always show navbar */}
      <Navbar />

      {isDashboard ? (
        <div className="with-sidebar">
          <Sidebar />
          <main className="main-content">
            <AppRoutes />
          </main>
        </div>
      ) : (
        <AppRoutes />
      )}
    </>
  );
}
