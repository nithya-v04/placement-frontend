import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
import JobCard from '../../components/JobCard';
import { jobService, studentService } from '../../services/jobService';
import { JOB_TYPES } from '../../utils/constants';

export default function JobList() {
  const [jobs,    setJobs]    = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  useEffect(() => {
    const load = async () => {
      try {
        const [jRes, pRes] = await Promise.all([
          jobService.getActive(),
          studentService.getMyProfile(),
        ]);
        setJobs(jRes.data);
        setProfile(pRes.data);
      } catch { toast.error('Failed to load jobs'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const filtered = jobs.filter(j => {
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase())
      || j.company?.name?.toLowerCase().includes(search.toLowerCase())
      || j.location?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'ALL' || j.jobType === typeFilter;
    return matchSearch && matchType;
  });

  if (loading) return <Loader />;

  return (
    <div>
      <div className="page-header fade-up">
        <h1>Browse Jobs</h1>
        <p>{jobs.length} active openings available for you</p>
      </div>

      {/* Filters */}
      <div className="card fade-up fade-up-1" style={{ marginBottom: 24, padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 240px' }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
            <input className="form-input" placeholder="Search jobs, companies, locations…"
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 36, marginBottom: 0 }} />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['ALL', ...JOB_TYPES].map(t => (
              <button key={t} className={`btn btn-sm ${typeFilter === t ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setTypeFilter(t)}>
                {t === 'ALL' ? 'All' : t.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><Briefcase size={40} /><h3>No jobs found</h3><p>Try adjusting your search or filters.</p></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {filtered.map((job, i) => (
            <JobCard key={job.id} job={job} className={`fade-up-${Math.min(i+1,5)}`}
              actions={[
                <Link key="v" to={`/student/jobs/${job.id}`} className="btn btn-primary btn-sm">
                  View & Apply
                </Link>,
              ]} />
          ))}
        </div>
      )}
    </div>
  );
}
