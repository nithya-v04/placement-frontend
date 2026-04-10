import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, DollarSign, GraduationCap, Calendar, ArrowLeft, Send, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { STATUS_COLORS } from '../../utils/constants';

export default function ApplyJob() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const [job,     setJob]     = useState(null);
  const [cover,   setCover]   = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied,  setApplied]  = useState(false);

  useEffect(() => {
    jobService.getById(id)
      .then(r => setJob(r.data))
      .catch(() => toast.error('Job not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    try {
      await applicationService.apply(id, {
  coverLetter: cover,
  resumeUrl: resumeUrl,
  githubUrl: githubUrl,
  linkedinUrl: linkedinUrl
});
      toast.success('Application submitted!');
      setApplied(true);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Could not apply');
    } finally {
      setApplying(false);
    }
  };

  const fmt = (n) => n ? `₹${(n/100000).toFixed(1)}L` : '—';
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' }) : '—';

  if (loading) return <Loader />;
  if (!job) return <div className="empty-state"><h3>Job not found</h3><Link to="/student/jobs" className="btn btn-outline" style={{marginTop:12}}>Back to Jobs</Link></div>;

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <Link to="/student/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-2)', fontSize: '0.875rem', marginBottom: 24 }}>
        <ArrowLeft size={15} /> Back to Jobs
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
        {/* Left */}
        <div>
          {/* Header card */}
          <div className="card fade-up" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
              <div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                  <span className={`badge ${STATUS_COLORS[job.jobType] || 'badge-gray'}`}>{job.jobType?.replace('_',' ')}</span>
                  <span className={`badge ${STATUS_COLORS[job.status]}`}>{job.status}</span>
                </div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: 6 }}>{job.title}</h1>
                <p style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '1rem' }}>{job.company?.name}</p>
              </div>
              <div style={{
                width: 56, height: 56, borderRadius: 12, flexShrink: 0,
                background: 'var(--accent-glow)', border: '1px solid rgba(108,99,255,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--accent)',
              }}>
                {job.company?.name?.[0]?.toUpperCase()}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { icon: MapPin,        label: 'Location',    val: job.location || '—' },
                { icon: DollarSign,    label: 'Salary',      val: `${fmt(job.salaryMin)} – ${fmt(job.salaryMax)}` },
                { icon: GraduationCap, label: 'Min CGPA',    val: job.cgpaCutoff ?? '—' },
                { icon: Calendar,      label: 'Deadline',    val: fmtDate(job.deadline) },
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={14} color="var(--accent)" />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-1)', fontWeight: 500 }}>{val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="card fade-up fade-up-1" style={{ marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: 12 }}>About the Role</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-2)', lineHeight: 1.7 }}>{job.description || '—'}</p>
          </div>

          {/* Requirements */}
          <div className="card fade-up fade-up-2">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: 12 }}>Requirements</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-2)', lineHeight: 1.7 }}>{job.requirements || '—'}</p>
          </div>
        </div>

        {/* Right – Apply panel */}
        <div className="card fade-up fade-up-1" style={{ position: 'sticky', top: 'calc(var(--nav-h) + 24px)' }}>
          {applied ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(67,233,123,0.15)', border: '1px solid rgba(67,233,123,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <Send size={22} color="var(--accent-3)" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>Applied!</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-2)', marginBottom: 16 }}>Your application has been submitted. Good luck!</p>
              <Link to="/student/applications" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>View My Applications</Link>
            </div>
          ) : (
            <>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: 16 }}>Apply for this Job</h2>
              <div className="form-group">
  <label className="form-label">
    Cover Letter <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>(optional)</span>
  </label>

  <textarea
    className="form-input"
    rows={5}
    placeholder="Tell the recruiter why you're a great fit…"
    value={cover}
    onChange={e => setCover(e.target.value)}
    style={{ minHeight: 120 }}
  />
</div>

<div className="form-group">
  <label className="form-label">Resume URL</label>
  <input
    className="form-input"
    placeholder="https://drive.google.com/your-resume"
    value={resumeUrl}
    onChange={e => setResumeUrl(e.target.value)}
  />
</div>

<div className="form-group">
  <label className="form-label">GitHub Profile</label>
  <input
    className="form-input"
    placeholder="https://github.com/username"
    value={githubUrl}
    onChange={e => setGithubUrl(e.target.value)}
  />
</div>

<div className="form-group">
  <label className="form-label">LinkedIn Profile</label>
  <input
    className="form-input"
    placeholder="https://linkedin.com/in/username"
    value={linkedinUrl}
    onChange={e => setLinkedinUrl(e.target.value)}
  />
</div>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px' }}
                onClick={handleApply} disabled={applying}>
                {applying
                  ? <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  : <><Send size={15} /> Submit Application</>}
              </button>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', textAlign: 'center', marginTop: 12 }}>
                Make sure your profile is up-to-date before applying.
              </p>
            </>
          )}
        </div>
      </div>

      <style>{`@media(max-width:700px){.apply-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
