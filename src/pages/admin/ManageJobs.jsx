import { useState, useEffect } from 'react';
import { Briefcase, Trash2, Search, ToggleLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
import { jobService } from '../../services/jobService';
import { STATUS_COLORS } from '../../utils/constants';

export default function ManageJobs() {
  const [jobs,    setJobs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [statusF, setStatusF] = useState('ALL');

  const load = async () => {
    try { const r = await jobService.getAll(); setJobs(r.data); }
    catch { toast.error('Failed to load jobs'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this job?')) return;
    try { await jobService.deleteJob(id); toast.success('Job deleted'); load(); }
    catch { toast.error('Cannot delete job'); }
  };

  const handleStatus = async (id, current) => {
    const next = current === 'OPEN' ? 'CLOSED' : 'OPEN';
    try { await jobService.updateStatus(id, next); toast.success(`Job ${next.toLowerCase()}`); load(); }
    catch { toast.error('Failed to update status'); }
  };

  const filtered = jobs.filter(j => {
    const q = search.toLowerCase();
    const matchSearch = !search || j.title.toLowerCase().includes(q) || j.company?.name?.toLowerCase().includes(q) || j.location?.toLowerCase().includes(q);
    const matchStatus = statusF === 'ALL' || j.status === statusF;
    return matchSearch && matchStatus;
  });

  if (loading) return <Loader />;

  const fmt = (n) => n ? `₹${(n/100000).toFixed(1)}L` : '—';

  return (
    <div>
      <div className="page-header fade-up">
        <h1>Manage Jobs</h1>
        <p>{jobs.length} total job{jobs.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Filters */}
      <div className="card fade-up fade-up-1" style={{ marginBottom: 20, padding: '14px 18px', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 220px' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
          <input className="form-input" placeholder="Search jobs, companies…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 32 }} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['ALL', 'OPEN', 'CLOSED', 'DRAFT'].map(s => (
            <button key={s} className={`btn btn-sm ${statusF === s ? 'btn-primary' : 'btn-outline'}`} onClick={() => setStatusF(s)}>
              {s === 'ALL' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state fade-up"><Briefcase size={40} /><h3>No jobs found</h3></div>
      ) : (
        <div className="table-wrap fade-up">
          <table>
            <thead><tr>
              <th>Title</th><th>Company</th><th>Type</th><th>Salary</th><th>Min CGPA</th><th>Deadline</th><th>Status</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(job => (
                <tr key={job.id}>
                  <td style={{ color: 'var(--text-1)', fontWeight: 500 }}>{job.title}</td>
                  <td style={{ color: 'var(--accent)' }}>{job.company?.name || '—'}</td>
                  <td><span className={`badge ${STATUS_COLORS[job.jobType] || 'badge-gray'}`}>{job.jobType?.replace('_',' ')}</span></td>
                  <td style={{ whiteSpace: 'nowrap' }}>{fmt(job.salaryMin)} – {fmt(job.salaryMax)}</td>
                  <td>{job.cgpaCutoff ?? '—'}</td>
                  <td>{job.deadline ? new Date(job.deadline).toLocaleDateString('en-IN') : '—'}</td>
                  <td><span className={`badge ${STATUS_COLORS[job.status]}`}>{job.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-outline btn-sm" title={job.status === 'OPEN' ? 'Close' : 'Open'}
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
