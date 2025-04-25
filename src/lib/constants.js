export const API_CONFIG = {
  BASE_URL: 'http://localhost:8081/api',
  UPLOAD_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],
};

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
};

export const EXPENSE_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

export const EXPENSE_CATEGORIES = [
  'Travel',
  'Electronics',
  'Clothes',
  'Vehicle',
  'Accommodation'
];

export const ROLE_OPTIONS = [
  'Intern',
  'Trainee Analyst',
  'Software Developer',
  'Senior Software Developer',
  'Principal Software Developer',
  'Principal Architect',
  'Associate Director',
  'Executive Director',
  'Managing Partner'
];

export const DATE_ORDER_OPTIONS = [
  'New to old',
  'Old to new'
];

export const TOAST_DURATION = 3000; // 3 seconds

export const FILTER_STATUS_OPTIONS = [
  { label: 'Active Users', value: 'active' },
  { label: 'Inactive Users', value: 'inactive' },
  { label: 'All Users', value: 'all' }
];

export const MANAGER_FILTER_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' }
];