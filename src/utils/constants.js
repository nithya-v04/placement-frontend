export const API_BASE_URL = '/api';

export const ROLES = {
  ADMIN:   'ADMIN',
  STUDENT: 'STUDENT',
  COMPANY: 'COMPANY',
};

export const JOB_TYPES = ['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT'];

export const JOB_STATUSES = ['OPEN', 'CLOSED', 'DRAFT'];

export const APPLICATION_STATUSES = [
  'APPLIED',
  'UNDER_REVIEW',
  'SHORTLISTED',
  'INTERVIEW_SCHEDULED',
  'SELECTED',
  'REJECTED',
  'WITHDRAWN',
];

export const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics & Communication',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Data Science',
  'Artificial Intelligence',
  'Business Administration',
];

export const STATUS_COLORS = {
  APPLIED:              'badge-blue',
  UNDER_REVIEW:         'badge-yellow',
  SHORTLISTED:          'badge-purple',
  INTERVIEW_SCHEDULED:  'badge-purple',
  SELECTED:             'badge-green',
  REJECTED:             'badge-red',
  WITHDRAWN:            'badge-gray',
  OPEN:                 'badge-green',
  CLOSED:               'badge-red',
  DRAFT:                'badge-gray',
  FULL_TIME:            'badge-blue',
  PART_TIME:            'badge-yellow',
  INTERNSHIP:           'badge-purple',
  CONTRACT:             'badge-gray',
};
