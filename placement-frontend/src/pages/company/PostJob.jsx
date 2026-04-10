import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { jobService } from '../../services/jobService';
import { JOB_TYPES, DEPARTMENTS } from '../../utils/constants';

const INIT = {
  title: '', description: '', requirements: '', jobType: 'FULL_TIME',
  location: '', salaryMin: '', salaryMax: '', cgpaCutoff: '', deadline: '',
};

export default function PostJob() {
  const navigate = useNavigate();
  const [form,    setForm]    = useState(INIT);
  const [loading, setLoading] = useState(false);

  const set = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.jobType) { toast.error('Title and type are required'); return; }
    setLoading(true);
    try {
      await jobService.createJob({
        ...form,
        salaryMin:   form.salaryMin   ? Number(form.salaryMin)  : null,
        salaryMax:   form.salaryMax   ? Number(form.salaryMax)  : null,
        cgpaCutoff:  form.cgpaCutoff  ? Number(form.cgpaCutoff) : 0,
        deadline:    form.deadline    || null,
      });
      toast.success('Job posted successfully!');
      navigate('/company/jobs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  const inp = (name, placeholder, type = 'text') => ({
    className: 'form-input', type, name, placeholder, value: form[name], onChange: set,
  });

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div className="page-header fade-up">
        <h1>Post a New Job</h1>
        <p>Fill in the details below to attract the right candidates.</p>
      </div>

      <div className="card fade-up fade-up-1" style={{ padding: '32px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Job Title *</label>
            <input {...inp('title', 'e.g. Software Engineer')} />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Job Type *</label>
              <select className="form-input" name="jobType" value={form.jobType} onChange={set}>
                {JOB_TYPES.map(t => <option key={t} value={t}>{t.replace('_',' ')}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input {...inp('location', 'e.g. Bangalore, India')} />
            </div>
            <div className="form-group">
              <label className="form-label">Min Salary (₹)</label>
              <input {...inp('salaryMin', '800000', 'number')} min="0" />
            </div>
            <div className="form-group">
              <label className="form-label">Max Salary (₹)</label>
              <input {...inp('salaryMax', '1500000', 'number')} min="0" />
            </div>
            <div className="form-group">
              <label className="form-label">Min CGPA Cutoff</label>
              <input {...inp('cgpaCutoff', '6.5', 'number')} min="0" max="10" step="0.1" />
            </div>
            <div className="form-group">
              <label className="form-label">Application Deadline</label>
              <input {...inp('deadline', '', 'date')} min={new Date().toISOString().split('T')[0]} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Job Description</label>
            <textarea {...inp('description', 'Describe the role, responsibilities, and what the candidate will work on…')} rows={4} />
          </div>

          <div className="form-group">
            <label className="form-label">Requirements</label>
            <textarea {...inp('requirements', 'Skills, qualifications, and experience required…')} rows={4} />
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1, justifyContent: 'center', padding: '13px' }}>
              {loading
                ? <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                : <><PlusSquare size={16} /> Post Job</>}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/company/jobs')} style={{ padding: '13px 24px' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
