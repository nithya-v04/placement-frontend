import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
import { applicationService } from '../../services/applicationService';
import { jobService } from '../../services/jobService';
import { APPLICATION_STATUSES, STATUS_COLORS } from '../../utils/constants';

const NEXT_STATUSES = ['UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'SELECTED', 'REJECTED'];

export default function JobApplications() {

  const [params] = useSearchParams();
  const jobId = params.get('jobId');

  const [apps, setApps] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selJob, setSelJob] = useState(jobId || 'ALL');
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({});

  const load = async () => {
    try {
      const [aRes, jRes] = await Promise.all([
        applicationService.getForMyCompany(),
        jobService.getMyJobs(),
      ]);

      setApps(aRes.data);
      setJobs(jRes.data);

    } catch {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatus = async (appId, status) => {
    try {
      await applicationService.updateStatus(appId, status, feedback[appId] || '');
      toast.success(`Status updated to ${status.replace('_', ' ')}`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const filtered =
    selJob === 'ALL'
      ? apps
      : apps.filter((a) => String(a.job?.id) === String(selJob));

  if (loading) return <Loader />;

  return (
    <div>

      <div className="page-header fade-up">
        <h1>Applications</h1>
        <p>{filtered.length} application{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Job filter */}
      <div
        className="fade-up fade-up-1"
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          marginBottom: 24,
          alignItems: 'center'
        }}
      >
        <span style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>
          Filter by job:
        </span>

        <button
          className={`btn btn-sm ${selJob === 'ALL' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setSelJob('ALL')}
        >
          All Jobs
        </button>

        {jobs.map((j) => (
          <button
            key={j.id}
            className={`btn btn-sm ${String(selJob) === String(j.id) ? 'btn-primary' : 'btn-outline'
              }`}
            onClick={() => setSelJob(String(j.id))}
          >
            {j.title}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state fade-up">
          <ClipboardList size={40} />
          <h3>No applications yet</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map((app, i) => (
            <div
              key={app.id}
              className={`card fade-up fade-up-${Math.min(i + 1, 5)}`}
              style={{ padding: '20px 24px' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 16,
                  flexWrap: 'wrap'
                }}
              >

                {/* Candidate info */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      marginBottom: 8
                    }}
                  >

                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: '50%',
                        background: 'var(--accent-glow)',
                        border: '1px solid rgba(108,99,255,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        color: 'var(--accent)',
                        fontSize: '0.95rem'
                      }}
                    >
                      {app.student?.firstName?.[0]?.toUpperCase() || '?'}
                    </div>

                    <div>
                      <p
                        style={{
                          fontWeight: 600,
                          color: 'var(--text-1)',
                          fontSize: '0.95rem'
                        }}
                      >
                        {app.student?.firstName} {app.student?.lastName}
                      </p>

                      <p
                        style={{
                          fontSize: '0.78rem',
                          color: 'var(--text-3)'
                        }}
                      >
                        {app.student?.rollNumber} · {app.student?.department}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>

                    <span style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>
                      CGPA: <strong>{app.student?.cgpa}</strong>
                    </span>

                    <span style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>
                      Skills: <strong>{app.student?.skills}</strong>
                    </span>

                    <span style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>
                      Job: <strong>{app.job?.title}</strong>
                    </span>

                    <span style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>
                      Applied:{' '}
                      {app.appliedAt
                        ? new Date(app.appliedAt).toLocaleDateString('en-IN')
                        : '—'}
                    </span>

                    <span
                      className={`badge ${STATUS_COLORS[app.status] || 'badge-gray'}`}
                    >
                      {app.status?.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Cover letter */}
                  {app.coverLetter && (
                    <p
                      style={{
                        fontSize: '0.82rem',
                        color: 'var(--text-2)',
                        marginTop: 10,
                        lineHeight: 1.55,
                        background: 'var(--bg)',
                        borderRadius: 6,
                        padding: '8px 12px',
                        border: '1px solid var(--border-lite)'
                      }}
                    >
                      {app.coverLetter}
                    </p>
                  )}

                  {/* Resume / GitHub / LinkedIn */}
                  <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>

                    {app.resumeUrl && (
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm"
                      >
                        Resume
                      </a>
                    )}

                    {app.githubUrl && (
                      <a
                        href={app.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm"
                      >
                        GitHub
                      </a>
                    )}

                    {app.linkedinUrl && (
                      <a
                        href={app.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm"
                      >
                        LinkedIn
                      </a>
                    )}

                  </div>

                </div>

                {/* Status actions */}
                {!['SELECTED', 'REJECTED', 'WITHDRAWN'].includes(app.status) && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      minWidth: 220
                    }}
                  >
                    <input
                      className="form-input"
                      placeholder="Feedback (optional)"
                      value={feedback[app.id] || ''}
                      style={{ fontSize: '0.8rem', padding: '8px 12px' }}
                      onChange={(e) =>
                        setFeedback((p) => ({
                          ...p,
                          [app.id]: e.target.value
                        }))
                      }
                    />

                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {NEXT_STATUSES.map((s) => (
                        <button
                          key={s}
                          className={`btn btn-sm ${s === 'SELECTED'
                              ? 'btn-success'
                              : s === 'REJECTED'
                                ? 'btn-danger'
                                : 'btn-outline'
                            }`}
                          onClick={() => handleStatus(app.id, s)}
                          style={{
                            flex: '1 1 auto',
                            justifyContent: 'center',
                            fontSize: '0.72rem'
                          }}
                        >
                          {s.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}