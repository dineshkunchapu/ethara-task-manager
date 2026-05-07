import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: #0f1117; color: #e2e8f0; }

  .auth-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0f1117;
    background-image: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,0.1) 0%, transparent 70%);
    padding: 24px;
  }

  .auth-card {
    background: #161b27;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 40px;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 25px 50px rgba(0,0,0,0.4);
  }

  .auth-logo { font-size: 24px; font-weight: 700; color: #f8fafc; margin-bottom: 4px; }
  .auth-logo span { color: #6366f1; }
  .auth-sub { font-size: 13px; color: #475569; margin-bottom: 32px; }
  .auth-title { font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 4px; }
  .auth-desc { font-size: 13px; color: #475569; margin-bottom: 28px; }

  .form-group { margin-bottom: 16px; }
  .form-label { display: block; font-size: 13px; font-weight: 500; color: #94a3b8; margin-bottom: 6px; }

  .input {
    width: 100%;
    padding: 11px 14px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.04);
    color: #e2e8f0;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    outline: none;
    transition: border-color 0.15s;
  }
  .input:focus { border-color: #6366f1; background: rgba(99,102,241,0.05); }
  .input::placeholder { color: #334155; }
  .input option { background: #1e293b; }

  .btn-submit {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    border: none;
    background: #6366f1;
    color: white;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: all 0.15s;
    margin-top: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .btn-submit:hover { background: #4f46e5; }
  .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

  .alert-error {
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 16px;
    background: rgba(239,68,68,0.1);
    color: #f87171;
    border: 1px solid rgba(239,68,68,0.2);
  }

  .alert-success {
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 16px;
    background: rgba(34,197,94,0.1);
    color: #4ade80;
    border: 1px solid rgba(34,197,94,0.2);
  }

  .auth-footer { text-align: center; margin-top: 24px; font-size: 13px; color: #475569; }
  .auth-footer a { color: #818cf8; text-decoration: none; font-weight: 500; }
  .auth-footer a:hover { color: #6366f1; }

  .spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm: '', role: 'user' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.full_name.trim()) return setError('Full name is required');
    if (!form.email.trim()) return setError('Email is required');
    if (!form.email.includes('@')) return setError('Enter a valid email');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    if (form.password !== form.confirm) return setError('Passwords do not match');

    setLoading(true);
    try {
      await API.post('/auth/register', {
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{css}</style>
      <div className="auth-root">
        <div className="auth-card">
          <div className="auth-logo">Ethara<span>.</span></div>
          <div className="auth-sub">Task Management Platform</div>

          <div className="auth-title">Create account</div>
          <div className="auth-desc">Join the platform to manage your projects</div>

          {error && <div className="alert-error">⚠ {error}</div>}
          {success && <div className="alert-success">✓ {success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="input" type="text" name="full_name" placeholder="John Doe"
                value={form.full_name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input className="input" type="email" name="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="input" type="password" name="password" placeholder="Min 6 characters"
                value={form.password} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input className="input" type="password" name="confirm" placeholder="Re-enter password"
                value={form.confirm} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="input" name="role" value={form.role} onChange={handleChange}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button className="btn-submit" type="submit" disabled={loading}>
              {loading ? <><div className="spinner"></div> Creating account...</> : 'Create account →'}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </>
  );
}