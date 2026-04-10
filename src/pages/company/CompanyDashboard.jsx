import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ClipboardList, Users, PlusSquare, ArrowRight, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
import { jobService, companyService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { STATUS_COLORS } from '../../utils/constants';

export default function CompanyDashboard() {
  const [profile, setProfile] = useState(null);
  const [jobs,    setJobs]    = useState([]);
  const [apps,    setApps]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      companyService.getMyProfile(),
      jobService.getMyJobs(),
      applicationService.getForMyCompany(),
    ]).then(([p, j, a]) => {
      setProfile(p.data);
      setJobs(j.data);
      setApps(a.data);
    }).catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const openJobs    = jobs.filter(j => j.status === 'OPEN').length;
  const totalApps   = apps.length;
  const shortlisted = apps.filter(a => ['SHORTLISTED','INTERVIEW_SCHEDULED'].includes(a.status)).length;
  const selected    = apps.filter(a => a.status === 'SELECTED').length;

  return (
    <div>
      <div className="page-header fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1>{profile?.name || 'Company Dashboard'}</h1>
          <p>{profile?.industry} · {profile?.location}</p>
        </div>
        <Link to="/company/post-job" className="btn btn-primary">
          <PlusSquare size={15} /> Post a Job
        </Link>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        {[
          { label: 'Open Jobs',    value: openJobs,    icon: Briefcase,    color: 'var(--accent)' },
          { label: 'Applications', value: totalApps,   icon: ClipboardList, color: 'var(--accent-2)' },
          { label: 'Shortlisted',  value: shortlisted, icon: TrendingUp,   color: '#ffc837' },
          { label: 'Selected',     value: selected,    icon: Users,        color: 'var(--accent-3)' },
        ].map(({ label, value, icon: Icon, color }, i) => (
          <div key={label} className={`stat-card fade-up fade-up-${i+1}`}>
            <p className="stat-label">{label}</p>
            <p className="stat-value" style={{ color }}>{value}</p>
            <Icon size={20} className="stat-icon" style={{ color }} />
          </div>
        ))}
      </div>

      {/* Recent jobs */}
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: 16 }}>Your Job Postings</h2>
      {jobs.length === 0 ? (
        <div className="empty-state">
          <Briefcase size={40} />
          <h3>No jobs posted yet</h3>
          <Link to="/company/post-job" className="btn btn-primary" style={{ marginTop: 12 }}>Post First Job</Link>
        </div>
      ) : (
        <div className="table-wrap fade-up">
          <table>
            <thead><tr>
              <th>Title</th><th>Type</th><th>Status</th><th>Deadline</th><th>Applications</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {jobs.slice(0, 6).map(job => {
                const cnt = apps.filter(a => a.job?.id === job.id).length;
                return (
                  <tr key={job.id}>
                    <td style={{ color: 'var(--text-1)', fontWeight: 500 }}>{job.title}</td>
                    <td><span className={`badge ${STATUS_COLORS[job.jobType] || 'badge-gray'}`}>{job.jobType?.replace('_',' ')}</span></td>
                    <td><span className={`badge ${STATUS_COLORS[job.status]}`}>{job.status}</span></td>
                    <td>{job.deadline ? new Date(job.deadline).toLocaleDateString('en-IN') : '—'}</td>
                    <td style={{ color: 'var(--accent)', fontWeight: 600 }}>{cnt}</td>
                    <td>
                      <Link to={`/company/applications?jobId=${job.id}`} className="btn btn-outline btn-sm">
                        View <ArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
