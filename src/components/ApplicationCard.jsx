import { Calendar, Building2, Briefcase } from 'lucide-react';
import { STATUS_COLORS } from '../utils/constants';

export default function ApplicationCard({ application, actions }) {
  const { job, status, appliedAt, coverLetter, feedback } = application;

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : '—';

  return (
    <div className="card fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--text-1)', marginBottom: 4 }}>
            {job?.title || 'Job'}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Building2 size={12} color="var(--accent)" />
            <span style={{ fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 600 }}>
              {job?.company?.name || '—'}
            </span>
          </div>
        </div>
        <span className={`badge ${STATUS_COLORS[status] || 'badge-gray'}`}>
          {status?.replace('_', ' ')}
        </span>
      </div>

      {/* Meta */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Calendar size={13} color="var(--text-3)" />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>Applied: {fmtDate(appliedAt)}</span>
        </div>
        {job?.jobType && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Briefcase size={13} color="var(--text-3)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>{job.jobType.replace('_', ' ')}</span>
          </div>
        )}
      </div>

      {/* Cover letter */}
      {coverLetter && (
        <div style={{ background: 'var(--bg)', borderRadius: 6, padding: '10px 14px', border: '1px solid var(--border-lite)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cover Letter</p>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.55,
            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {coverLetter}
          </p>
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <div style={{ background: 'rgba(108,99,255,0.08)', borderRadius: 6, padding: '10px 14px', border: '1px solid rgba(108,99,255,0.2)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--accent)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Recruiter Feedback</p>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.55 }}>{feedback}</p>
        </div>
      )}

      {actions && <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>{actions}</div>}
    </div>
  );
}
