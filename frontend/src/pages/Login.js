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
    background-image:
      radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,0.1) 0%, transparent 70%);
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

  .demo-box {
    background: rgba(99,102,241,0.05);
    border: 1px solid rgba(99,102,241,0.15);
    border-radius: 10px;
    padding: 14px;
    margin-bottom: 24px;
  }
  .demo-title { font-size: 12px; font-weight: 600; color: #818cf8; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em; }
  .demo-row { font-size: 12px; color: #64748b; margin-bottom: 4px; }
  .demo-row span { color: #94a3b8; font-weight: 500; }
`;

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email) return setError('Email is required');
    if (!form.password) return setError('Password is required');

    setLoading(true);
    try {
      const data = new URLSearchParams();
      data.append('username', form.email);
      data.append('password', form.password);

      const res = await API.post('/auth/login', data, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password');
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

          <div className="auth-title">Welcome back</div>
          <div className="auth-desc">Sign in to your account to continue</div>

          <div className="demo-box">
            <div className="demo-title">Demo Credentials</div>
            <div className="demo-row">Register as admin: set role to <span>admin</span></div>
            <div className="demo-row">Or register as <span>user</span> for limited access</div>
          </div>

          {error && <div className="alert-error">⚠ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input
                className="input"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="input"
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
              />
            </div>
            <button className="btn-submit" type="submit" disabled={loading}>
              {loading ? <><div className="spinner"></div> Signing in...</> : 'Sign in →'}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account? <Link to="/register">Create one</Link>
          </div>
        </div>
      </div>
    </>
  );
}