import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Bell, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ROLE_HOME = { ADMIN: '/admin', STUDENT: '/student', COMPANY: '/company' };

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const home = user ? ROLE_HOME[user.role] : '/';

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      height: 'var(--nav-h)',
      background: 'rgba(10,10,15,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      padding: '0 24px',
      justifyContent: 'space-between',
    }}>
      {/* Brand */}
      <Link to={home} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <span style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 16px var(--accent-glow)',
          fontSize: '1rem', fontWeight: 800, color: '#fff',
          fontFamily: 'var(--font-display)',
        }}>P</span>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700, fontSize: '1.1rem',
          background: 'linear-gradient(90deg, #f0f0ff, #a09df8)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>PlaceWise</span>
      </Link>

      {/* Right */}
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 12px', borderRadius: 8,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'var(--accent)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '0.75rem', color: '#fff', fontWeight: 700,
            }}>
              {user.email?.[0]?.toUpperCase()}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-2)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.email}
            </span>
            <span className={`badge ${user.role === 'ADMIN' ? 'badge-red' : user.role === 'COMPANY' ? 'badge-blue' : 'badge-green'}`} style={{ fontSize: '0.65rem' }}>
              {user.role}
            </span>
          </div>

          <button
            onClick={handleLogout}
            style={{
              background: 'transparent', border: '1px solid var(--border)',
              color: 'var(--text-2)', borderRadius: 8, padding: '7px 12px',
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-2)'; e.currentTarget.style.color = 'var(--accent-2)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)'; }}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}
