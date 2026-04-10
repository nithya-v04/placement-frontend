import { useState, useEffect } from 'react';
import { Users, Trash2, CheckCircle, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
import { studentService, companyService } from '../../services/jobService';

export default function ManageUsers() {
  const [students,  setStudents]  = useState([]);
  const [companies, setCompanies] = useState([]);
  const [tab,       setTab]       = useState('students');
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');

  const load = async () => {
    try {
      const [sRes, cRes] = await Promise.all([studentService.getAll(), companyService.getAll()]);
      setStudents(sRes.data);
      setCompanies(cRes.data);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleMarkPlaced = async (id) => {
    try { await studentService.markPlaced(id); toast.success('Marked as placed'); load(); }
    catch { toast.error('Failed to update'); }
  };

  const handleDeleteStudent = async (id) => {
    if (!confirm('Delete this student?')) return;
    try { await studentService.deleteStudent(id); toast.success('Student deleted'); load(); }
    catch { toast.error('Cannot delete'); }
  };

  const handleDeleteCompany = async (id) => {
    if (!confirm('Delete this company?')) return;
    try { await companyService.deleteCompany(id); toast.success('Company deleted'); load(); }
    catch { toast.error('Cannot delete'); }
  };

  const filteredStudents  = students.filter(s =>
    !search || `${s.firstName} ${s.lastName} ${s.rollNumber} ${s.department}`.toLowerCase().includes(search.toLowerCase()));
  const filteredCompanies = companies.filter(c =>
    !search || `${c.name} ${c.industry} ${c.location}`.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <Loader />;

  return (
    <div>
      <div className="page-header fade-up">
        <h1>Manage Users</h1>
        <p>{students.length} students · {companies.length} companies</p>
      </div>

      {/* Tabs + search */}
      <div className="fade-up fade-up-1" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className={`btn btn-sm ${tab === 'students' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('students')}>
            Students ({students.length})
          </button>
          <button className={`btn btn-sm ${tab === 'companies' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('companies')}>
            Companies ({companies.length})
          </button>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
          <input className="form-input" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 32, width: 220 }} />
        </div>
      </div>

      {/* Students table */}
      {tab === 'students' && (
        filteredStudents.length === 0 ? (
          <div className="empty-state"><Users size={40} /><h3>No students found</h3></div>
        ) : (
          <div className="table-wrap fade-up">
            <table>
              <thead><tr>
                <th>Name</th><th>Roll No</th><th>Department</th><th>CGPA</th><th>Year</th><th>Placed</th><th>Actions</th>
              </tr></thead>
              <tbody>
                {filteredStudents.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--accent-glow)', border: '1px solid rgba(108,99,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)' }}>
                          {s.firstName?.[0]}
                        </div>
                        <span style={{ color: 'var(--text-1)', fontWeight: 500 }}>{s.firstName} {s.lastName}</span>
                      </div>
                    </td>
                    <td>{s.rollNumber}</td>
                    <td>{s.department}</td>
                    <td style={{ fontWeight: 600, color: s.cgpa >= 8 ? 'var(--accent-3)' : s.cgpa >= 6.5 ? '#ffc837' : 'var(--accent-2)' }}>{s.cgpa}</td>
                    <td>{s.yearOfGraduation}</td>
                    <td>
                      <span className={`badge ${s.isPlaced ? 'badge-green' : 'badge-yellow'}`}>
                        {s.isPlaced ? 'Placed' : 'Seeking'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {!s.isPlaced && (
                          <button className="btn btn-success btn-sm" onClick={() => handleMarkPlaced(s.id)} title="Mark as placed">
                            <CheckCircle size={13} />
                          </button>
                        )}
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteStudent(s.id)}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Companies table */}
      {tab === 'companies' && (
        filteredCompanies.length === 0 ? (
          <div className="empty-state"><Users size={40} /><h3>No companies found</h3></div>
        ) : (
          <div className="table-wrap fade-up">
            <table>
              <thead><tr>
                <th>Company</th><th>Industry</th><th>Location</th><th>Contact</th><th>Actions</th>
              </tr></thead>
              <tbody>
                {filteredCompanies.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(56,182,255,0.15)', border: '1px solid rgba(56,182,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#38b6ff' }}>
                          {c.name?.[0]}
                        </div>
                        <span style={{ color: 'var(--text-1)', fontWeight: 500 }}>{c.name}</span>
                      </div>
                    </td>
                    <td>{c.industry || '—'}</td>
                    <td>{c.location || '—'}</td>
                    <td>{c.contactPerson || '—'}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteCompany(c.id)}>
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}
