import { MapPin, Clock, DollarSign, GraduationCap, Calendar } from 'lucide-react';
import { STATUS_COLORS } from '../utils/constants';
import { useNavigate } from 'react-router-dom';

export default function JobCard({ job, actions, className = '' }) {
  const navigate = useNavigate();

  const fmt = (n) => n ? `₹${(n/100000).toFixed(1)}L` : '—';
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : '—';

  return (
    <div className={`card fade-up ${className}`} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
            <span className={`badge ${STATUS_COLORS[job.jobType] || 'badge-gray'}`}>{job.jobType?.replace('_', ' ')}</span>
            <span className={`badge ${STATUS_COLORS[job.status] || 'badge-gray'}`}>{job.status}</span>
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--text-1)', marginBottom: 4, cursor: 'pointer' }}
              onClick={() => navigate(`/student/jobs/${job.id}`)}>
            {job.title}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600 }}>
            {job.company?.name || 'Company'}
          </p>
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: 10, flexShrink: 0,
          background: 'var(--accent-glow)',
          border: '1px solid rgba(108,99,255,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--accent)',
        }}>
          {job.company?.name?.[0]?.toUpperCase() || '?'}
        </div>
      </div>

      {/* Meta */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[
          { icon: MapPin,        val: job.location || '—' },
          { icon: DollarSign,    val: `${fmt(job.salaryMin)} – ${fmt(job.salaryMax)}` },
          { icon: GraduationCap, val: `CGPA ≥ ${job.cgpaCutoff ?? '—'}` },
          { icon: Calendar,      val: fmtDate(job.deadline) },
        ].map(({ icon: Icon, val }, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon size={13} color="var(--text-3)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{val}</span>
          </div>
        ))}
      </div>

      {/* Description */}
      {job.description && (
        <p style={{ fontSize: '0.825rem', color: 'var(--text-2)', lineHeight: 1.6,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {job.description}
        </p>
      )}

      {/* Actions */}
      {actions && <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>{actions}</div>}
    </div>
  );
}
