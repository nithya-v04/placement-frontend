import { useState, useEffect } from 'react';
import { Users, Briefcase, ClipboardList, CheckCircle, Building2, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
import { studentService, jobService, companyService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { STATUS_COLORS } from '../../utils/constants';

export default function AdminDashboard() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      studentService.getStats(),
      jobService.getAll(),
      applicationService.getAll(),
      companyService.getAll(),
    ]).then(([stats, jobs, apps, companies]) => {
      setData({
        stats: stats.data,
        jobs:  jobs.data,
        apps:  apps.data,
        companies: companies.data,
      });
    }).catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  const { stats, jobs, apps, companies } = data;

  const recentApps = [...apps].sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)).slice(0, 8);

  return (
    <div>
      <div className="page-header fade-up">
        <h1>Admin Dashboard</h1>
        <p>Full system overview across all entities</p>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        {[
          { label: 'Total Students',  value: stats.total,     icon: Users,       color: 'var(--accent)' },
          { label: 'Placed Students', value: stats.placed,    icon: CheckCircle, color: 'var(--accent-3)' },
          { label: 'Unplaced',        value: stats.unplaced,  icon: TrendingUp,  color: 'var(--accent-2)' },
          { label: 'Total Jobs',      value: jobs.length,     icon: Briefcase,   color: '#ffc837' },
          { label: 'Companies',       value: companies.length, icon: Building2,  color: '#38b6ff' },
          { label: 'Applications',    value: apps.length,     icon: ClipboardList, color: '#a09df8' },
        ].map(({ label, value, icon: Icon, color }, i) => (
          <div key={label} className={`stat-card fade-up fade-up-${Math.min(i+1,5)}`}>
            <p className="stat-label">{label}</p>
            <p className="stat-value" style={{ color }}>{value}</p>
            <Icon size={20} className="stat-icon" style={{ color }} />
          </div>
        ))}
      </div>

      {/* Placement rate */}
      <div className="card fade-up" style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem' }}>Placement Rate</h2>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-3)' }}>
            {stats.total > 0 ? Math.round((stats.placed / stats.total) * 100) : 0}%
          </span>
        </div>
        <div style={{ height: 8, background: 'var(--bg)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 4,
            width: `${stats.total > 0 ? (stats.placed / stats.total) * 100 : 0}%`,
            background: 'linear-gradient(90deg, var(--accent), var(--accent-3))',
            transition: 'width 1s ease',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>{stats.placed} placed</span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>{stats.unplaced} seeking</span>
        </div>
      </div>

      {/* Recent Applications */}
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: 16 }} className="fade-up">
        Recent Applications
      </h2>
      <div className="table-wrap fade-up">
        <table>
          <thead><tr>
            <th>Student</th><th>Job</th><th>Company</th><th>Status</th><th>Applied</th>
          </tr></thead>
          <tbody>
            {recentApps.map(app => (
              <tr key={app.id}>
                <td style={{ color: 'var(--text-1)', fontWeight: 500 }}>
                  {app.student?.firstName} {app.student?.lastName}
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-3)' }}>{app.student?.rollNumber}</span>
                </td>
                <td>{app.job?.title}</td>
                <td style={{ color: 'var(--accent)' }}>{app.job?.company?.name}</td>
                <td><span className={`badge ${STATUS_COLORS[app.status] || 'badge-gray'}`}>{app.status?.replace('_',' ')}</span></td>
                <td style={{ whiteSpace: 'nowrap' }}>{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-IN') : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
