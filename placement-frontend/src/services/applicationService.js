import api from './api';

export const applicationService = {
  // Student
  getMyApplications: ()                          => api.get('/applications/my-applications'),
  apply:             (jobId, data)         => api.post(`/applications/apply/${jobId}`, data),
  withdraw:          (id)                        => api.patch(`/applications/${id}/withdraw`),

  // Company
  getForMyCompany:   ()                          => api.get('/applications/company'),
  getByJob:          (jobId)                     => api.get(`/applications/job/${jobId}`),
  updateStatus:      (id, status, feedback = '') => api.patch(`/applications/${id}/status`, { status, feedback }),

  // Admin
  getAll:            ()                          => api.get('/applications'),
  getById:           (id)                        => api.get(`/applications/${id}`),
  deleteApplication: (id)                        => api.delete(`/applications/${id}`),
};
