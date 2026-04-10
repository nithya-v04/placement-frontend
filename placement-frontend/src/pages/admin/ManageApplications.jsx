import { useState, useEffect } from 'react';
import { ClipboardList, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
import { applicationService } from '../../services/applicationService';
import { APPLICATION_STATUSES, STATUS_COLORS } from '../../utils/constants';

export default function ManageApplications() {
  const [apps,    setApps]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [statusF, setStatusF] = useState('ALL');
  const [feedback, setFeedback] = useState({});

  const load = async () => {
    try { const r = await applicationService.getAll(); setApps(r.data); }
    catch { toast.error('Failed to load applications'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this application?')) return;
    try { await applicationService.deleteApplication(id); toast.success('Deleted'); load(); }
    catch { toast.error('Cannot delete'); }
  };

  const handleStatus = async (id, status) => {
    try {
      await applicationService.updateStatus(id, status, feedback[id] || '');
      toast.success('Status updated');
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
  };

  const filtered = apps.filter(a => {
    const q = search.toLowerCase();
    const matchSearch = !search
      || `${a.student?.firstName} ${a.student?.lastName} ${a.student?.rollNumber}`.toLowerCase().includes(q)
      || a.job?.title?.toLowerCase().includes(q)
      || a.job?.company?.name?.toLowerCase().includes(q);
    const matchStatus = statusF === 'ALL' || a.status === statusF;
    return matchSearch && matchStatus;
  });

  if (loading) return <Loader />;

  return (
    <div>
      <div className="page-header fade-up">
        <h1>Manage Applications</h1>
        <p>{apps.length} total applications</p>
      </div>

      {/* Summary badges */}
      <div className="fade-up fade-up-1" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {APPLICATION_STATUSES.map(s => {
          const cnt = apps.filter(a => a.status === s).length;
          if (!cnt) return null;
          return (
            <span key={s} className={`badge ${STATUS_COLORS[s] || 'badge-gray'}`} style={{ cursor: 'pointer' }}
              onClick={() => setStatusF(statusF === s ? 'ALL' : s)}>
              {s.replace('_',' ')} · {cnt}
            </span>
          );
        })}
      </div>

      {/* Filters */}
      <div className="card fade-up fade-up-2" style={{ marginBottom: 20, padding: '14px 18px', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 220px' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
          <input className="form-input" placeholder="Search student, job, company…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 32 }} />
        </div>
        <select className="form-input" value={statusF} onChange={e => setStatusF(e.target.value)} style={{ width: 'auto', minWidth: 160 }}>
          <option value="ALL">All Statuses</option>
          {APPLICATION_STATUSES.map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state fade-up"><ClipboardList size={40} /><h3>No applications found</h3></div>
      ) : (
        <div className="table-wrap fade-up">
          <table>
            <thead><tr>
              <th>Student</th><th>Job</th><th>Company</th><th>CGPA</th><th>Status</th><th>Applied</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(app => (
                <tr key={app.id}>
                  <td>
                    <p style={{ color: 'var(--text-1)', fontWeight: 500 }}>{app.student?.firstName} {app.student?.lastName}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{app.student?.rollNumber}</p>
                  </td>
                  <td>{app.job?.title}</td>
                  <td style={{ color: 'var(--accent)' }}>{app.job?.company?.name}</td>
                  <td>{app.student?.cgpa}</td>
                  <td><span className={`badge ${STATUS_COLORS[app.status] || 'badge-gray'}`}>{app.status?.replace('_',' ')}</span></td>
                  <td style={{ whiteSpace: 'nowrap' }}>{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-IN') : '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {!['SELECTED','REJECTED','WITHDRAWN'].includes(app.status) && (
                        <>
                          <button className="btn btn-success btn-sm" onClick={() => handleStatus(app.id, 'SELECTED')}>Select</button>
                          <button className="btn btn-danger btn-sm"  onClick={() => handleStatus(app.id, 'REJECTED')}>Reject</button>
                        </>
                      )}
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(app.id)}>
                        <Trash2 size={13} />
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
