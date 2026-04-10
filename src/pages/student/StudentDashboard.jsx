import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, CheckCircle, Clock, ArrowRight, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
import JobCard from '../../components/JobCard';
import { jobService, studentService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { useAuth } from '../../context/AuthContext';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [profile,  setProfile]  = useState(null);
  const [jobs,     setJobs]     = useState([]);
  const [apps,     setApps]     = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, jRes, aRes] = await Promise.all([
          studentService.getMyProfile(),
          jobService.getActive(),
          applicationService.getMyApplications(),
        ]);
        setProfile(pRes.data);
        setJobs(jRes.data.slice(0, 3));
        setApps(aRes.data);
      } catch { toast.error('Failed to load dashboard'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <Loader />;

  const applied    = apps.length;
  const shortlisted = apps.filter(a => ['SHORTLISTED','INTERVIEW_SCHEDULED'].includes(a.status)).length;
  const selected   = apps.filter(a => a.status === 'SELECTED').length;

  return (
    <div>
      {/* Welcome */}
      <div className="page-header fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1>Hello, {profile?.firstName || user?.email?.split('@')[0]} 👋</h1>
          <p>{profile?.department} · CGPA {profile?.cgpa} · Class of {profile?.yearOfGraduation}</p>
          {profile?.skills && (
                  <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {profile.skills.split(',').map((skill, i) => (
                      <span
                        key={i}
                        className="badge badge-blue"
                        style={{ fontSize: '0.75rem' }}
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}
        </div>
        <Link to="/student/jobs" className="btn btn-primary">
          Browse Jobs <ArrowRight size={15} />
        </Link>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        {[
          { label: 'Jobs Applied',  value: applied,     icon: FileText,    color: 'var(--accent)' },
          { label: 'Shortlisted',   value: shortlisted, icon: TrendingUp,  color: 'var(--accent-2)' },
          { label: 'Selected',      value: selected,    icon: CheckCircle, color: 'var(--accent-3)' },
          { label: 'Active Jobs',   value: jobs.length, icon: Briefcase,   color: '#ffc837' },
        ].map(({ label, value, icon: Icon, color }, i) => (
          <div key={label} className={`stat-card fade-up fade-up-${i+1}`}>
            <p className="stat-label">{label}</p>
            <p className="stat-value" style={{ color }}>{value}</p>
            <Icon size={20} className="stat-icon" style={{ color }} />
          </div>
        ))}
      </div>

      {/* Placement status */}
      {profile && (
        <div className="card fade-up" style={{ marginBottom: 28, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, flexShrink: 0,
            background: profile.isPlaced ? 'rgba(67,233,123,0.15)' : 'rgba(255,200,55,0.1)',
            border: `1px solid ${profile.isPlaced ? 'rgba(67,233,123,0.3)' : 'rgba(255,200,55,0.3)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {profile.isPlaced ? <CheckCircle size={22} color="var(--accent-3)" /> : <Clock size={22} color="#ffc837" />}
          </div>
          <div>
            <p style={{ fontWeight: 600, fontFamily: 'var(--font-display)', fontSize: '0.95rem' }}>
              {profile.isPlaced ? '🎉 Placement Status: Placed' : 'Placement Status: Seeking opportunities'}
            </p>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-2)', marginTop: 2 }}>
              {profile.isPlaced ? 'Congratulations! You have been placed.' : 'Keep applying — your next opportunity is right here.'}
            </p>
          </div>
        </div>
      )}

      {/* Latest Jobs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>Latest Openings</h2>
        <Link to="/student/jobs" style={{ fontSize: '0.825rem', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4 }}>
          View all <ArrowRight size={13} />
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="empty-state"><Briefcase size={40} /><h3>No active jobs yet</h3></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {jobs.map(job => (
            <JobCard key={job.id} job={job} actions={[
              <Link key="apply" to={`/student/jobs/${job.id}`} className="btn btn-primary btn-sm">Apply Now</Link>
            ]} />
          ))}
        </div>
      )}
    </div>
  );
}
