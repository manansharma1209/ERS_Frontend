import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Toast } from '../ui/Toast';
import { LoadingOverlay } from '../ui/LoadingOverlay';
import { useUsers } from '../../hooks/useUsers';
import { Info } from 'lucide-react'; // Make sure to import this icon

const ROLE_OPTIONS = [
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

const passwordValidations = {
  length: (password) => password.length >= 8,
  lowercase: (password) => /[a-z]/.test(password),
  uppercase: (password) => /[A-Z]/.test(password),
  digit: (password) => /\d/.test(password),
  special: (password) => /[_@$]/.test(password),
};

function PasswordValidationTooltip({ password, visible, onToggle }) {
  const validations = [
    { 
      check: passwordValidations.length(password),
      message: 'Minimum 8 characters'
    },
    {
      check: passwordValidations.lowercase(password),
      message: 'At least one lowercase letter [a-z]'
    },
    {
      check: passwordValidations.uppercase(password),
      message: 'At least one uppercase letter [A-Z]'
    },
    {
      check: passwordValidations.digit(password),
      message: 'At least one number [0-9]'
    },
    {
      check: passwordValidations.special(password),
      message: 'At least one special character [_@$]'
    },
  ];

  if (!visible) return null;

  return (
    <div className="absolute left-full ml-2 top-0 w-64 p-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="space-y-1.5">
        {validations.map(({ check, message }, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <div className={`h-2 w-2 flex-shrink-0 rounded-full ${check ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={`text-xs ${check ? 'text-green-700' : 'text-red-700'} font-medium`}>
              {message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AddUser({ editingUser, setEditingUser }) {
  const { createUser, updateUser } = useUsers();
  const [formData, setFormData] = useState({
    wissenId: '',
    fullName: '',
    email: '',
    joiningDate: '',
    role: '',
    managerId: '',
    isManager: 'No', // Default set to 'No'
    reportees: '',
    password: ''
  });

  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (editingUser) {
      setFormData({
        wissenId: editingUser.wissenID || '',
        fullName: editingUser.name || '',
        email: editingUser.email || '',
        joiningDate: editingUser.dateOfJoining ? new Date(editingUser.dateOfJoining).toISOString().split('T')[0] : '',
        role: editingUser.role || '',
        managerId: editingUser.managerId || '',
        isManager: editingUser.isManager ? 'Yes' : 'No',
        reportees: editingUser.reportees ? editingUser.reportees.join(', ') : '',
      });
    }
  }, [editingUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const showSuccessToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setSuccess(false);
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    // Add password validation for new users
    if (!editingUser) {
      const isPasswordValid = Object.values(passwordValidations)
        .every(validation => validation(formData.password));
      
      if (!isPasswordValid) {
        setError('Please ensure the password meets all requirements');
        setShowPasswordRequirements(true); // Show requirements on validation error
        setLoading(false);
        return;
      }
    }

    try {
      const userData = {
        wissenID: formData.wissenId,
        name: formData.fullName,
        email: formData.email,
        dateOfJoining: formData.joiningDate,
        role: formData.role,
        managerId: formData.managerId || null,
        isManager: formData.isManager === 'Yes',
        reportees: formData.reportees ? formData.reportees.split(',').map(id => id.trim()) : []
      };

      if (!editingUser) {
        userData.password = formData.password;
      }

      const result = editingUser
        ? await updateUser(formData.wissenId, userData)
        : await createUser(userData);

      if (result.success) {
        showSuccessToast(`User ${editingUser ? 'updated' : 'created'} successfully!`);
        if (editingUser) {
          setEditingUser(null);
        }
        resetForm();
      } else {
        handleValidationError(result.error);
      }
    } catch (error) {
      handleValidationError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleValidationError = (errorMessage) => {
    if (typeof errorMessage !== 'string') {
      setError('An unexpected error occurred');
      return;
    }

    // Clear previous errors
    setFieldErrors({});

    if (errorMessage.includes('WissenID') && errorMessage.includes('already exists')) {
      setFieldErrors(prev => ({ ...prev, wissenId: 'This Wissen ID is already in use' }));
    }
    else if (errorMessage.includes('Email') && errorMessage.includes('already exists')) {
      setFieldErrors(prev => ({ ...prev, email: 'This email is already in use' }));
    }
    else if (errorMessage.includes('Manager with ID') && errorMessage.includes('does not exist')) {
      setFieldErrors(prev => ({ ...prev, managerId: 'This manager ID does not exist' }));
    }
    else if (errorMessage.includes('reportee IDs do not exist')) {
      setFieldErrors(prev => ({ ...prev, reportees: 'One or more reportee IDs do not exist' }));
    }
    else if (errorMessage.includes('User not found')) {
      setError('User not found. They may have been deleted.');
    }
    else {
      setError('Enter unique info for all fields.');
    }
  };

  const resetForm = () => {
    setFormData({
      wissenId: '',
      fullName: '',
      email: '',
      joiningDate: '',
      role: '',
      managerId: '',
      isManager: 'No',
      reportees: '',
      password: ''
    });
    setError('');
    setFieldErrors({});
  };

  const today = new Date().toISOString().split('T')[0];


  return (
    <>
      <Toast 
        message={toastMessage}
        visible={showToast}
      />

      {loading && (
        <LoadingOverlay 
          message={editingUser ? "Updating user..." : "Creating user..."}
        />
      )}

      <Card className="p-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">
          {editingUser ? 'Edit User' : 'Add New User'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wissen ID
            </label>
            <input
              type="text"
              name="wissenId"
              value={formData.wissenId}
              onChange={handleChange}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                editingUser ? 'bg-gray-100 cursor-not-allowed' : ''
              } ${fieldErrors.wissenId ? 'border-red-500' : 'border-gray-300'}`}
              required
              disabled={!!editingUser}
            />
            {fieldErrors.wissenId && (
              <p className="text-sm text-red-600 mt-1">{fieldErrors.wissenId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                fieldErrors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {fieldErrors.email && (
              <p className="text-sm text-red-600 mt-1">{fieldErrors.email}</p>
            )}
          </div>

          {!editingUser && (
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative flex items-start">
                <div className="flex-grow relative">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 pr-10 border ${
                      formData.password && Object.values(passwordValidations).every(v => v(formData.password))
                        ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    } rounded-md transition-colors`}
                    required={!editingUser}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordRequirements(!showPasswordRequirements)}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-100 transition-colors ${
                      showPasswordRequirements ? 'bg-gray-100' : ''
                    }`}
                    aria-label="Toggle password requirements"
                  >
                    <Info className={`h-5 w-5 ${showPasswordRequirements ? 'text-blue-700' : 'text-blue-600'}`} />
                  </button>
                </div>
                {!editingUser && (
                  <PasswordValidationTooltip 
                    password={formData.password} 
                    visible={showPasswordRequirements}
                    onToggle={() => setShowPasswordRequirements(!showPasswordRequirements)}
                  />
                )}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Joining
            </label>
            <input
              type="date"
              name="joiningDate"
              value={formData.joiningDate}
              onChange={handleChange}
              max={today} // Add this line to prevent future dates
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Role</option>
              {ROLE_OPTIONS.map(role => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Manager ID
            </label>
            <input
              type="text"
              name="managerId"
              value={formData.managerId}
              onChange={handleChange}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                fieldErrors.managerId ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Leave blank if no manager"
            />
            {fieldErrors.managerId && (
              <p className="text-sm text-red-600 mt-1">{fieldErrors.managerId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Is Manager
            </label>
            <select
              name="isManager"
              value={formData.isManager}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reportees (Comma separated IDs)
            </label>
            <textarea
              name="reportees"
              value={formData.reportees}
              onChange={handleChange}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                formData.isManager === 'No' ? 'bg-gray-100 cursor-not-allowed' : ''
              } ${fieldErrors.reportees ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g. WCS001, WCS002, WCS003"
              rows="3"
              disabled={formData.isManager === 'No'}
            />
            {fieldErrors.reportees && (
              <p className="text-sm text-red-600 mt-1">{fieldErrors.reportees}</p>
            )}
            {formData.isManager === 'No' && (
              <p className="text-sm text-gray-500 mt-1">
                Enable 'Is Manager' to add reportees
              </p>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-600 mt-2">{error}</p>
          )}

          <div className="flex justify-end space-x-3">
            {editingUser && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setEditingUser(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : editingUser ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
}