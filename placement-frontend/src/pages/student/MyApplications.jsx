import { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
import ApplicationCard from '../../components/ApplicationCard';
import { applicationService } from '../../services/applicationService';
import { APPLICATION_STATUSES, STATUS_COLORS } from '../../utils/constants';

export default function MyApplications() {
  const [apps,    setApps]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('ALL');

  const load = async () => {
    try {
      const res = await applicationService.getMyApplications();
      setApps(res.data);
    } catch { toast.error('Failed to load applications'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleWithdraw = async (id) => {
    if (!confirm('Withdraw this application?')) return;
    try {
      await applicationService.withdraw(id);
      toast.success('Application withdrawn');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot withdraw');
    }
  };

  const filtered = filter === 'ALL' ? apps : apps.filter(a => a.status === filter);

  if (loading) return <Loader />;

  return (
    <div>
      <div className="page-header fade-up">
        <h1>My Applications</h1>
        <p>{apps.length} application{apps.length !== 1 ? 's' : ''} submitted</p>
      </div>

      {/* Status filter */}
      <div className="fade-up fade-up-1" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
        <button className={`btn btn-sm ${filter === 'ALL' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('ALL')}>
          All ({apps.length})
        </button>
        {APPLICATION_STATUSES.map(s => {
          const count = apps.filter(a => a.status === s).length;
          if (!count) return null;
          return (
            <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter(s)}>
              {s.replace('_',' ')} ({count})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <FileText size={40} />
          <h3>No applications {filter !== 'ALL' ? `with status "${filter.replace('_',' ')}"` : 'yet'}</h3>
          <p>Start applying to jobs from the Browse Jobs section.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 16 }}>
          {filtered.map((app, i) => (
            <ApplicationCard key={app.id} application={app}
              actions={
                !['SELECTED','REJECTED','WITHDRAWN'].includes(app.status)
                  ? [<button key="w" className="btn btn-danger btn-sm" onClick={() => handleWithdraw(app.id)}>Withdraw</button>]
                  : []
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
