import api from './api';

export const jobService = {
  // All authenticated
  getAll:          ()           => api.get('/jobs'),
  getActive:       ()           => api.get('/jobs/active'),
  getById:         (id)         => api.get(`/jobs/${id}`),
  getByCompany:    (companyId)  => api.get(`/jobs/company/${companyId}`),

  // Student
  getEligible:     (cgpa)       => api.get(`/jobs/eligible?cgpa=${cgpa}`),

  // Company
  getMyJobs:       ()           => api.get('/jobs/my-jobs'),
  createJob:       (data)       => api.post('/jobs', data),
  updateJob:       (id, data)   => api.put(`/jobs/${id}`, data),
  updateStatus:    (id, status) => api.patch(`/jobs/${id}/status`, { status }),
  deleteJob:       (id)         => api.delete(`/jobs/${id}`),
};

export const studentService = {
  getMyProfile:    ()           => api.get('/students/me'),
  updateProfile:   (data)       => api.put('/students/me', data),
  getAll:          ()           => api.get('/students'),
  getById:         (id)         => api.get(`/students/${id}`),
  getStats:        ()           => api.get('/students/stats'),
  markPlaced:      (id)         => api.patch(`/students/${id}/mark-placed`),
  deleteStudent:   (id)         => api.delete(`/students/${id}`),
};

export const companyService = {
  getMyProfile:    ()           => api.get('/companies/me'),
  updateProfile:   (data)       => api.put('/companies/me', data),
  getAll:          ()           => api.get('/companies'),
  getById:         (id)         => api.get(`/companies/${id}`),
  deleteCompany:   (id)         => api.delete(`/companies/${id}`),
};
