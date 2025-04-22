import { useState, useEffect } from 'react';
import axios from 'axios';
import { UserCircle, Edit, Power, Users } from 'lucide-react';
import { Button } from './ui/Button';
import { Dialog, DialogContent, DialogTitle } from './ui/Dialog';
import { Tooltip } from './ui/Tooltip';
import { useAuth } from '../context/AuthContext';

export function UserCard({
  user,
  onEdit,
  onStatusChange,
  reportees = []
}) {
  const { auth } = useAuth();
  const [showReportees, setShowReportees] = useState(false);
  const [reporteeDetails, setReporteeDetails] = useState([]);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  
  const handleStatusToggle = () => {
    setShowStatusConfirm(true);
  };

  const confirmStatusUpdate = async () => {
    try {
      setIsUpdatingStatus(true);
      const response = await axios.put(`http://localhost:8080/api/users/toggle-status/${user.wissenID}`, {
        active: !user.isActive
      }, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      
      if (response.status === 200) {
        onStatusChange?.(user.wissenID, !user.isActive);
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    } finally {
      setIsUpdatingStatus(false);
      setShowStatusConfirm(false);
    }
  };

  const fetchReporteeDetails = async () => {
    try {
      const reporteeDetailsPromises = reportees.map(reporteeWissenId =>
        axios.get('http://localhost:8080/api/users/getReporteeInfo', {
          params: {
            reporteeWissenId: reporteeWissenId
          },
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        })
      );
      const responses = await Promise.all(reporteeDetailsPromises);
      const reporteeDetails = responses.map(response => response.data);
      setReporteeDetails(reporteeDetails);
      setShowReportees(true);
    } catch (error) {
      console.error('Error fetching reportee details:', error);
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-gray-100 p-3">
            <UserCircle className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium">{user.name} {user.wissenID}</h3>
            <p className="text-sm text-gray-500">{user.role}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
        <Tooltip content="Edit User Details" className="-top-8">
            <Button
              variant="primary"
              onClick={() => onEdit?.(user.id)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </Tooltip>
          
          <Tooltip content={`${user.isActive ? 'Deactivate' : 'Activate'} User`} className="-top-8">
          <Button
            variant={user.isActive ? "danger" : "success"}
            onClick={handleStatusToggle}
            className="h-8 w-8 p-0"
            disabled={isUpdatingStatus}
          >
            <Power className={`h-4 w-4 ${isUpdatingStatus ? 'animate-pulse' : ''}`} />
          </Button>
        </Tooltip>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <div>
          <p className="text-sm text-gray-600">Manager ID: {user.managerId || 'N/A'}</p>
          <p className="text-sm text-gray-600 mt-1">Date of Joining: {user.joiningDate}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            onClick={fetchReporteeDetails} // Trigger the fetch function
            className="flex items-center space-x-1 h-8 px-3 py-0"
          >
            <Users className="h-4 w-4" />
            <span>View Reportees</span>
          </Button>
        </div>
      </div>

      <Dialog open={showReportees} onOpenChange={setShowReportees}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Reportees</DialogTitle>
          <div className="mt-4 space-y-4">
            {reporteeDetails.length > 0 ? (
              <div className="max-h-60 overflow-y-auto">
                <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-center pb-2 px-2">Name</th>
                    <th className="text-center pb-2 px-2">Wissen ID</th>
                    <th className="text-center pb-2 px-2">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {reporteeDetails.map((reportee) => (
                    <tr key={reportee.wissenID}>
                      <td className="py-1 px-4 text-center">{reportee.name}</td>
                      <td className="py-1 px-4 text-center">{reportee.wissenID}</td>
                      <td className="py-1 px-4 text-center">{reportee.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            ) : (
              <p>No reportees found.</p>
            )}
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setShowReportees(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

<Dialog open={showStatusConfirm} onOpenChange={setShowStatusConfirm}>
  <DialogContent className="sm:max-w-[425px]">
    <DialogTitle>Confirm Status Change</DialogTitle>
    <div className="mt-4 space-y-4">
      <p>
        Are you sure you want to {user.isActive ? 'deactivate' : 'activate'} this user?
        {user.isActive ? 
          ' This will prevent them from accessing the system.' : 
          ' This will restore their access to the system.'}
      </p>
      <div className="flex justify-end space-x-2">
        <Button 
          variant="secondary" 
          onClick={() => setShowStatusConfirm(false)}
        >
          Cancel
        </Button>
        <Button 
          variant={user.isActive ? "danger" : "success"}
          onClick={confirmStatusUpdate}
          disabled={isUpdatingStatus}
        >
          {isUpdatingStatus ? (
            <span className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </span>
          ) : (
            user.isActive ? 'Deactivate' : 'Activate'
          )}
        </Button>
      </div>
    </div>
  </DialogContent>
</Dialog>
    </div>
  );
}