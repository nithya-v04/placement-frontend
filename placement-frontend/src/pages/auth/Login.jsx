import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const navigate  = useNavigate();
  const { login } = useAuth();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);

  const ROLE_HOME = { ADMIN: '/admin', STUDENT: '/student', COMPANY: '/company' };

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    try {
      const res = await authService.login(form);
      login(res.data);
      toast.success('Welcome back!');
      navigate(ROLE_HOME[res.data.role] || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      padding: '80px 24px 40px', position: 'relative'
    }}>
      {/* bg glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: -1
      }} />

      <div style={{ width: '100%', maxWidth: 420,marginTop:20, position: 'relative' }}>
        {/* Logo */}
        <div className="fade-up" style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'var(--accent)', margin: '0 auto 12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 30px var(--accent-glow)',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: '#fff',
          }}>P</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: 6 }}>
            Welcome back
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: '0.9rem' }}>Sign in to your PlaceWise account</p>
        </div>

        {/* Card */}
        <div className="card fade-up fade-up-1" style={{ padding: '32px' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" name="email"
                placeholder="you@example.com" value={form.email} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input className="form-input" type={showPw ? 'text' : 'password'}
                  name="password" placeholder="••••••••"
                  value={form.password} onChange={handleChange}
                  style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center',
                  }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', marginTop: 8, padding: '13px' }}>
              {loading ? <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                : <><LogIn size={16} /> Sign In</>}
            </button>
          </form>

          {/* Divider */}
        </div>

        <p className="fade-up fade-up-2" style={{ textAlign: 'center', marginTop: 20, fontSize: '0.875rem', color: 'var(--text-2)' }}>
          No account?{' '}
          <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>Register here</Link>
        </p>
      </div>
    </div>
  );
}
