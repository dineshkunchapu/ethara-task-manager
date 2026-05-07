import { useState, useEffect } from 'react';
import API from '../api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(function () { fetchUsers(); }, []);

  async function fetchUsers() {
    try {
      const res = await API.get('/users');
      setUsers(res.data);
    } catch {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const me = JSON.parse(localStorage.getItem('user') || '{}');
    if (me.id === id) return alert('You cannot delete your own account');
    if (!window.confirm('Delete this user?')) return;
    try {
      await API.delete('/users/' + id);
      fetchUsers();
    } catch {
      alert('Failed to delete user');
    }
  }

  if (loading) return <div className="loading"><div className="spinner"></div> Loading users...</div>;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Users</div>
        <div className="page-sub">{users.length} registered user{users.length !== 1 ? 's' : ''}</div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {users.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">◉</div>
            <div className="empty-title">No users found</div>
            <div className="empty-sub">No users have registered yet</div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(function (user) {
                const initials = user.full_name
                  ? user.full_name.split(' ').map(function (n) { return n[0]; }).join('').toUpperCase().slice(0, 2)
                  : 'U';
                return (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: '50%',
                          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 13, fontWeight: 600, color: 'white', flexShrink: 0
                        }}>{initials}</div>
                        <span style={{ fontWeight: 600, color: '#f8fafc' }}>{user.full_name}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td><span className={'badge badge-' + user.role}>{user.role}</span></td>
                    <td>
                      <span className={user.is_active ? 'badge badge-active' : 'badge badge-archived'}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={function () { handleDelete(user.id); }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}