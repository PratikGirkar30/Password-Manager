import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Trash2, Edit, Shield, ShieldCheck } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editUser, setEditUser] = useState(null); // User currently being edited
  const [formData, setFormData] = useState({ name: '', email: '', role: '' });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user and all their saved passwords?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(user => user._id !== id));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const handleEditClick = (user) => {
    setEditUser(user._id);
    setFormData({ name: user.name, email: user.email, role: user.role });
  };

  const handleCancelEdit = () => {
    setEditUser(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e, id) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_URL}/admin/users/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUsers(users.map(u => u._id === id ? { ...u, ...res.data } : u));
      setEditUser(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user');
    }
  };

  if (loading) return <div className="loading">Loading admin dashboard...</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Admin Dashboard</h2>
          <p className="subtitle">Manage user accounts and permissions.</p>
        </div>
        <div className="stats-card" style={{ background: 'var(--surface-color)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Users size={24} color="var(--primary-color)" />
          <div>
            <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{users.length}</h3>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total Users</span>
          </div>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="card" style={{ marginTop: '2rem', padding: '0', overflow: 'hidden',maxWidth:'none' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--background-color)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem' }}>Name</th>
                <th style={{ padding: '1rem' }}>Email</th>
                <th style={{ padding: '1rem' }}>Role</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  {editUser === user._id ? (
                    <td colSpan="4" style={{ padding: '1rem' }}>
                      <form onSubmit={(e) => handleUpdate(e, user._id)} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <input 
                          type="text" 
                          name="name" 
                          value={formData.name} 
                          onChange={handleChange} 
                          className="form-control" 
                          required 
                          style={{ margin: 0 }}
                        />
                        <input 
                          type="email" 
                          name="email" 
                          value={formData.email} 
                          onChange={handleChange} 
                          className="form-control" 
                          required 
                          style={{ margin: 0 }}
                        />
                        <select 
                          name="role" 
                          value={formData.role} 
                          onChange={handleChange} 
                          className="form-control" 
                          style={{ margin: 0, width: 'auto' }}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                        <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
                          <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Save</button>
                          <button type="button" onClick={handleCancelEdit} className="btn" style={{ background: 'var(--background-color)', border: '1px solid var(--border-color)', color: 'var(--text-color)', padding: '0.5rem 1rem' }}>Cancel</button>
                        </div>
                      </form>
                    </td>
                  ) : (
                    <>
                      <td style={{ padding: '1rem' }}>{user.name}</td>
                      <td style={{ padding: '1rem' }}>{user.email}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '0.25rem',
                          background: user.role === 'admin' ? 'rgba(99, 102, 241, 0.1)' : 'var(--background-color)',
                          color: user.role === 'admin' ? 'var(--primary-color)' : 'var(--text-muted)',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '1rem',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}>
                          {user.role === 'admin' ? <ShieldCheck size={14} /> : <Shield size={14} />}
                          {user.role}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button 
                            onClick={() => handleEditClick(user)} 
                            className="btn" 
                            style={{ padding: '0.5rem', background: 'transparent', color: 'var(--text-color)' }}
                            title="Edit User"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(user._id)} 
                            className="btn" 
                            style={{ padding: '0.5rem', background: 'transparent', color: 'var(--danger-color)' }}
                            title="Delete User"
                            disabled={user.role === 'admin'} // Optional: prevent deleting other admins easily
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
