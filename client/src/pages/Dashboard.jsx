import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldAlert, Trash2, KeyRound, Globe, User, Plus, Pencil } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const [passwords, setPasswords] = useState([]);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    site: '',
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { site, username, password } = formData;

  const fetchPasswords = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/passwords`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPasswords(res.data);
    } catch (err) {
      setError('Failed to fetch passwords');
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPasswords();
  }, []);

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (!site || !username || !password) {
      return setError('Please fill in all fields');
    }

    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      
      if (editId) {
        // Update existing
        const res = await axios.put(`${API_URL}/passwords/${editId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setPasswords(passwords.map(p => p._id === editId ? res.data : p));
        setSuccess('Password updated successfully!');
        setEditId(null);
      } else {
        // Add new
        const res = await axios.post(`${API_URL}/passwords`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setPasswords([res.data, ...passwords]);
        setSuccess('Password added successfully!');
      }

      setFormData({ site: '', username: '', password: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || (editId ? 'Failed to update password' : 'Failed to add password'));
    }
  };

  const handleEditClick = (pw) => {
    setEditId(pw._id);
    setFormData({
      site: pw.site,
      username: pw.username,
      password: pw.password
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditId(null);
    setFormData({ site: '', username: '', password: '' });
    setError('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const deletePassword = async id => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/passwords/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPasswords(passwords.filter(p => p._id !== id));
    } catch (err) {
      setError('Failed to delete password');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Loading vault...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header" style={{ alignItems: 'center' }}>
        <div>
          <h2>My Vault</h2>
          <span style={{ color: 'var(--text-muted)' }}>{passwords.length} items securely stored</span>
        </div>
      </div>

      <div className="grid-layout">
        {/* Add Password Form */}
        <div>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {editId ? <Pencil size={20} className="text-primary" /> : <Plus size={20} className="text-primary" />}
              {editId ? 'Edit Password' : 'Add New Password'}
            </h3>

            {error && (
              <div className="error-message">
                <ShieldAlert size={16} />
                {error}
              </div>
            )}

            {success && (
              <div style={{ color: 'var(--success)', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
                {success}
              </div>
            )}

            <form onSubmit={onSubmit}>
              <div className="form-group">
                <label>Website/App Name</label>
                <div style={{ position: 'relative' }}>
                  <Globe size={18} style={{ position: 'absolute', left: '10px', top: '14px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    name="site"
                    value={site}
                    onChange={onChange}
                    className="form-control"
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="e.g. Google, Netflix"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Username / Email</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '10px', top: '14px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={onChange}
                    className="form-control"
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={18} style={{ position: 'absolute', left: '10px', top: '14px', color: 'var(--text-muted)' }} />
                  <input
                    type="text" // Shown as plain text in mini project, typically type="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    className="form-control"
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="SuperSecret123!"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {editId ? 'Update Password' : 'Save Password'}
                </button>
                {editId && (
                  <button type="button" onClick={cancelEdit} className="btn" style={{ flex: 1, backgroundColor: 'transparent', border: '1px solid var(--border)' }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Passwords List */}
        <div className="password-list">
          {passwords.length === 0 ? (
            <div className="empty-state">
              <ShieldAlert size={48} />
              <h3>Your vault is empty</h3>
              <p>Add your first password using the form.</p>
            </div>
          ) : (
            passwords.map(pw => (
              <div key={pw._id} className="password-item">
                <div>
                  <div className="password-info">
                    <h3>{pw.site}</h3>
                  </div>
                  <div className="password-info">
                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <User size={14} /> {pw.username}
                    </p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontFamily: 'monospace', color: 'var(--text-main)', marginTop: '0.25rem', backgroundColor: 'rgba(0,0,0,0.2)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', display: 'inline-block' }}>
                      {pw.password}
                    </p>
                  </div>
                </div>
                <div className="password-actions">
                  <button
                    onClick={() => handleEditClick(pw)}
                    className="btn-icon"
                    title="Edit Password"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => deletePassword(pw._id)}
                    className="btn-icon delete"
                    title="Delete Password"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
