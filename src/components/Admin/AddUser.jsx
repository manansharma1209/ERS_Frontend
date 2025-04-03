import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Toast } from '../ui/Toast';

export function AddUser({ editingUser, setEditingUser }) {
  const [formData, setFormData] = useState({
    wissenId: '', // Add Wissen ID field
    fullName: '',
    email: '',
    joiningDate: '',
    role: '',
    managerId: '',
    isManager: 'No',
    reportees: '',
    password: ''  // Only for new users
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Update form when editing user changes
  useEffect(() => {
    console.log(editingUser);
    if (editingUser) {
      setFormData({
        wissenId: editingUser.wissenID || '', // Changed from wissenId to wissenID
        fullName: editingUser.name || '',
        email: editingUser.email || '',
        joiningDate: editingUser.dateOfJoining ? new Date(editingUser.dateOfJoining).toISOString().split('T')[0] : '', // Changed from joiningDate to dateOfJoining
        role: editingUser.role || '',
        managerId: editingUser.managerId || '',
        isManager: editingUser.isManager ? 'Yes' : 'No',
        reportees: editingUser.reportees ? editingUser.reportees.join(', ') : '',
      });
    }
  }, [editingUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    // Transform form data to API format
    const userData = {
      wissenID: formData.wissenId, // Add Wissen ID field
      name: formData.fullName,
      email: formData.email,
      dateOfJoining: formData.joiningDate,
      role: formData.role,
      managerId: formData.managerId || null,
      isManager: formData.isManager === 'Yes',
      reportees: formData.reportees ? formData.reportees.split(',').map(id => id.trim()) : []
    };

    if (!editingUser) {
      userData.password = formData.password; // Only include password for new users
    }

    try {
      if (editingUser) {
        await axios.put(`http://localhost:8080/api/users/${formData.wissenId}`, userData);
        setSuccess(true);
        setShowToast(true);
        setTimeout(() => {
          setSuccess(false);
          setShowToast(false);
          setEditingUser(null);
          resetForm();
        }, 3000);
      } else {
        await axios.post('http://localhost:8080/api/users/', userData);
        setSuccess(true);
        setShowToast(true);
        setTimeout(() => {
          setSuccess(false);
          setShowToast(false);
          resetForm();
        }, 3000);
      }
    } catch (error) {
      console.error('Error saving user:', error);
      setError(error.response?.data?.message || 'An error occurred while saving the user.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      wissenId: '', // Add Wissen ID field
      fullName: '',
      email: '',
      joiningDate: '',
      role: '',
      managerId: '',
      isManager: 'No',
      reportees: '',
      password: ''
    });
  };

  return (
    <>
    <Toast 
        message={`User ${editingUser ? 'updated' : 'created'} successfully!`}
        visible={showToast}
      />
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {!editingUser && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required={!editingUser}
            />
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
            <option value="Intern">Intern</option>
            <option value="Trainee Analyst">Trainee Analyst</option>
            <option value="Software Developer">Software Developer</option>
            <option value="Senior Software Developer">Senior Software Developer</option>
            <option value="Principal Software Developer">Principal Software Developer</option>
            <option value="Principal Architect">Principal Architect</option>
            <option value="Associate Director">Associate Director</option>
            <option value="Executive Director">Executive Director</option>
            <option value="Managing Partner">Managing Partner</option>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Leave blank if no manager"
          />
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
            <option value="Yes">Yes</option>
            <option value="No">No</option>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="e.g. WCS001, WCS002, WCS003"
            rows="3"
          />
        </div>

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