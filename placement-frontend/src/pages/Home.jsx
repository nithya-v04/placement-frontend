import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Users, Building2, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  const dashLink = user
    ? user.role === 'ADMIN' ? '/admin' : user.role === 'COMPANY' ? '/company' : '/student'
    : null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hero */}
      <section style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '120px 24px 80px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 400,
          background: 'radial-gradient(ellipse, rgba(108,99,255,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="fade-up" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 14px', borderRadius: 20,
          border: '1px solid rgba(108,99,255,0.3)',
          background: 'rgba(108,99,255,0.08)',
          fontSize: '0.8rem', color: 'var(--accent)',
          marginBottom: 28, fontWeight: 500,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-3)' }} />
          Campus Placement Portal
        </div>

        <h1 className="fade-up fade-up-1" style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.4rem, 7vw, 5rem)',
          fontWeight: 800, lineHeight: 1.05,
          letterSpacing: '-0.03em',
          maxWidth: 800, marginBottom: 24,
        }}>
          Your Career{' '}
          <span style={{
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Starts Here</span>
        </h1>

        <p className="fade-up fade-up-2" style={{
          fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--text-2)',
          maxWidth: 560, lineHeight: 1.7, marginBottom: 40,
        }}>
          Connect students with their dream companies. Post jobs, track applications,
          and manage placements — all in one elegant platform.
        </p>

        <div className="fade-up fade-up-3" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          {dashLink ? (
            <Link to={dashLink} className="btn btn-primary btn-lg">
              Go to Dashboard <ArrowRight size={18} />
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary btn-lg">
                Sign In <ArrowRight size={18} />
              </Link>
              <Link to="/register" className="btn btn-outline btn-lg">
                Create Account
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 40px', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {[
            { icon: Users,     color: 'var(--accent)',   title: 'Students',  text: 'Browse jobs, apply with a cover letter, track status in real time.' },
            { icon: Building2, color: 'var(--accent-2)', title: 'Companies', text: 'Post openings, set eligibility, review and shortlist candidates.' },
            { icon: Briefcase, color: 'var(--accent-3)', title: 'Admins',    text: 'Full visibility across placements, users, jobs, and analytics.' },
          ].map(({ icon: Icon, color, title, text }) => (
            <div key={title} className="card fade-up" style={{ textAlign: 'center', padding: '32px 24px' }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: `${color}22`, border: `1px solid ${color}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <Icon size={24} color={color} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', marginBottom: 10 }}>{title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.65 }}>{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
