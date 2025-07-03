import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import './styles/AdminComponents.css';
import { HiMiniArrowTopRightOnSquare } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";

const UserManagement = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10
      });

      if (searchTerm) params.append('search', searchTerm);
      if (roleFilter) params.append('role', roleFilter);

      const response = await fetch(`http://localhost:5001/api/admin/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setTotalPages(data.pagination.totalPages);
        setTotalUsers(data.pagination.totalUsers);
      } else {
        showToast('Failed to fetch users', 'error');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showToast('Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        showToast(`User role updated to ${newRole}`, 'success');
        fetchUsers(); // Refresh the list
      } else {
        const data = await response.json();
        showToast(data.error || 'Failed to update user role', 'error');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      showToast('Failed to update user role', 'error');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        showToast(`User "${userName}" deleted successfully`, 'success');
        fetchUsers(); // Refresh the list
      } else {
        const data = await response.json();
        showToast(data.error || 'Failed to delete user', 'error');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      showToast('Failed to delete user', 'error');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="user-management">
      <div className="management-header">
        <h2>User Management</h2>
        <div className="management-actions">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">🔍</button>
          </form>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="role-filter"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      ) : (
        <>
          <div className="users-summary">
            <p>Showing {users.length} of {totalUsers} users</p>
          </div>

          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="user-info">
                        <img 
                          src={user.profilePicture || '/account.svg'} 
                          alt={user.fullName}
                          className="user-avatar"
                        />
                        <div>
                          <div className="user-name">{user.fullName}</div>
                          <div className="user-username">@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className={`role-select ${user.role}`}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>{formatDate(user.lastLogin)}</td>
                    <td>
                      <div className="user-actions">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserModal(true);
                          }}
                          className="action-btn view"
                          title="View Details"
                        >
                          <HiMiniArrowTopRightOnSquare />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id, user.fullName)}
                          className="action-btn delete"
                          title="Delete User"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                ← Previous
              </button>
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>User Details</h3>
              <button 
                onClick={() => setShowUserModal(false)}
                className="modal-close"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="user-detail">
                <img 
                  src={selectedUser.profilePicture || '/account.svg'} 
                  alt={selectedUser.fullName}
                  className="user-detail-avatar"
                />
                <div className="user-detail-info">
                  <h4>{selectedUser.fullName}</h4>
                  <p>@{selectedUser.username}</p>
                  <p>{selectedUser.email}</p>
                  <p>Role: <span className={`role-badge ${selectedUser.role}`}>{selectedUser.role}</span></p>
                  <p>Joined: {formatDate(selectedUser.createdAt)}</p>
                  <p>Last Login: {formatDate(selectedUser.lastLogin)}</p>
                  <p>Email Preferences: {selectedUser.wantsEmails ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement; 