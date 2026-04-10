import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusSquare, Briefcase, Pencil, Trash2, ToggleLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
import { jobService } from '../../services/jobService';
import { STATUS_COLORS, JOB_STATUSES } from '../../utils/constants';

export default function CompanyJobs() {
  const [jobs,    setJobs]    = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try { const r = await jobService.getMyJobs(); setJobs(r.data); }
    catch { toast.error('Failed to load jobs'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this job posting?')) return;
    try { await jobService.deleteJob(id); toast.success('Job deleted'); load(); }
    catch { toast.error('Cannot delete job'); }
  };

  const handleStatus = async (id, current) => {
    const next = current === 'OPEN' ? 'CLOSED' : 'OPEN';
    try { await jobService.updateStatus(id, next); toast.success(`Job ${next.toLowerCase()}`); load(); }
    catch { toast.error('Status update failed'); }
  };

  if (loading) return <Loader />;

  const fmt = (n) => n ? `₹${(n/100000).toFixed(1)}L` : '—';

  return (
    <div>
      <div className="page-header fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div><h1>My Job Postings</h1><p>{jobs.length} job{jobs.length !== 1 ? 's' : ''} posted</p></div>
        <Link to="/company/post-job" className="btn btn-primary"><PlusSquare size={15} /> Post New Job</Link>
      </div>

      {jobs.length === 0 ? (
        <div className="empty-state fade-up"><Briefcase size={40} /><h3>No jobs posted yet</h3>
          <Link to="/company/post-job" className="btn btn-primary" style={{ marginTop: 12 }}>Post First Job</Link>
        </div>
      ) : (
        <div className="table-wrap fade-up">
          <table>
            <thead><tr>
              <th>Title</th><th>Type</th><th>Salary Range</th><th>Min CGPA</th><th>Deadline</th><th>Status</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id}>
                  <td style={{ color: 'var(--text-1)', fontWeight: 500 }}>{job.title}</td>
                  <td><span className={`badge ${STATUS_COLORS[job.jobType] || 'badge-gray'}`}>{job.jobType?.replace('_',' ')}</span></td>
                  <td style={{ whiteSpace: 'nowrap' }}>{fmt(job.salaryMin)} – {fmt(job.salaryMax)}</td>
                  <td>{job.cgpaCutoff ?? '—'}</td>
                  <td>{job.deadline ? new Date(job.deadline).toLocaleDateString('en-IN') : '—'}</td>
                  <td><span className={`badge ${STATUS_COLORS[job.status]}`}>{job.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link to={`/company/applications?jobId=${job.id}`} className="btn btn-outline btn-sm">Applications</Link>
                      <button className="btn btn-outline btn-sm" title={job.status === 'OPEN' ? 'Close job' : 'Reopen job'}
                        onClick={() => handleStatus(job.id, job.status)}>
                        <ToggleLeft size={14} />
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(job.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
