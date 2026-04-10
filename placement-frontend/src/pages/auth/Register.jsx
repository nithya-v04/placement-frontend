import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { DEPARTMENTS } from '../../utils/constants';

const ROLE_HOME = { ADMIN: '/admin', STUDENT: '/student', COMPANY: '/company' };

export default function Register() {
  const navigate  = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPw,  setShowPw]  = useState(false);
  const [form, setForm] = useState({
    email: '', password: '', role: 'STUDENT',
    // student
    firstName: '', lastName: '', rollNumber: '', department: '', cgpa: '', yearOfGraduation: '', phone: '', skills: '',
    // company
    companyName: '', industry: '', website: '', contactPerson: '', location: '',
  });

  const set = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Email & password required'); return; }
    setLoading(true);
    try {
      const payload = {
        email: form.email, password: form.password, role: form.role,
        ...(form.role === 'STUDENT' ? {
          firstName: form.firstName, lastName: form.lastName,
          rollNumber: form.rollNumber, department: form.department,
          cgpa: parseFloat(form.cgpa) || 0, yearOfGraduation: parseInt(form.yearOfGraduation) || null,
          phone: form.phone, skills: form.skills,
        } : form.role === 'COMPANY' ? {
          companyName: form.companyName, industry: form.industry,
          website: form.website, contactPerson: form.contactPerson, location: form.location,
        } : {}),
      };
      const res = await authService.register(payload);
      login(res.data);
      toast.success('Account created!');
      navigate(ROLE_HOME[res.data.role] || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputProps = (name, placeholder, type = 'text') => ({
    className: 'form-input', type, name, placeholder, value: form[name], onChange: set,
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '80px 24px 40px' }}>
      <div style={{ width: '100%', maxWidth: 560 }}>
        {/* Header */}
        <div className="fade-up" style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, background: 'var(--accent)',
            margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 30px var(--accent-glow)',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: '#fff',
          }}>P</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: 6 }}>Create account</h1>
          <p style={{ color: 'var(--text-2)', fontSize: '0.9rem' }}>Join PlaceWise today</p>
        </div>

        <div className="card fade-up fade-up-1" style={{ padding: '32px' }}>
          <form onSubmit={handleSubmit}>
            {/* Role selector */}
            <div className="form-group">
              <label className="form-label">I am a…</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['STUDENT', 'COMPANY', 'ADMIN'].map(r => (
                  <button key={r} type="button" onClick={() => setForm(p => ({ ...p, role: r }))}
                    className={`btn btn-sm ${form.role === r ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: 1, justifyContent: 'center' }}>
                    {r.charAt(0) + r.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Common */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input {...inputProps('email', 'you@example.com', 'email')} />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input className="form-input" type={showPw ? 'text' : 'password'}
                    name="password" placeholder="Min. 6 chars" value={form.password} onChange={set}
                    style={{ paddingRight: 44 }} />
                  <button type="button" onClick={() => setShowPw(p => !p)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', display: 'flex' }}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Student fields */}
            {form.role === 'STUDENT' && (
              <>
                <div className="form-grid-2">
                  <div className="form-group"><label className="form-label">First Name</label><input {...inputProps('firstName', 'Alice')} /></div>
                  <div className="form-group"><label className="form-label">Last Name</label><input {...inputProps('lastName', 'Johnson')} /></div>
                  <div className="form-group"><label className="form-label">Roll Number</label><input {...inputProps('rollNumber', 'CS2024001')} /></div>
                  <div className="form-group"><label className="form-label">Phone</label><input {...inputProps('phone', '9876543210', 'tel')} /></div>
                  <div className="form-group"><label className="form-label">CGPA</label><input {...inputProps('cgpa', '8.5', 'number')} step="0.01" min="0" max="10" /></div>
                  <div className="form-group"><label className="form-label">Graduation Year</label><input {...inputProps('yearOfGraduation', '2025', 'number')} /></div>
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select className="form-input" name="department" value={form.department} onChange={set}>
                    <option value="">Select department</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Skills (comma-separated)</label>
                  <input {...inputProps('skills', 'Java, React, MySQL')} />
                </div>
              </>
            )}

            {/* Company fields */}
            {form.role === 'COMPANY' && (
              <>
                <div className="form-grid-2">
                  <div className="form-group"><label className="form-label">Company Name</label><input {...inputProps('companyName', 'Acme Corp')} /></div>
                  <div className="form-group"><label className="form-label">Industry</label><input {...inputProps('industry', 'Technology')} /></div>
                  <div className="form-group"><label className="form-label">Contact Person</label><input {...inputProps('contactPerson', 'John Doe')} /></div>
                  <div className="form-group"><label className="form-label">Location</label><input {...inputProps('location', 'Bangalore, India')} /></div>
                </div>
                <div className="form-group"><label className="form-label">Website</label><input {...inputProps('website', 'https://company.com', 'url')} /></div>
              </>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', marginTop: 8, padding: '13px' }}>
              {loading
                ? <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                : <><UserPlus size={16} /> Create Account</>}
            </button>
          </form>
        </div>

        <p className="fade-up fade-up-2" style={{ textAlign: 'center', marginTop: 20, fontSize: '0.875rem', color: 'var(--text-2)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
