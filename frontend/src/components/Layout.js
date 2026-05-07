import { Outlet, NavLink, useNavigate } from 'react-router-dom';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: #0f1117; color: #e2e8f0; }

  .layout { display: flex; min-height: 100vh; }

  .sidebar {
    width: 240px;
    background: #161b27;
    border-right: 1px solid rgba(255,255,255,0.06);
    display: flex;
    flex-direction: column;
    padding: 24px 16px;
    position: fixed;
    height: 100vh;
    top: 0; left: 0;
  }

  .logo {
    font-size: 20px;
    font-weight: 700;
    color: #f8fafc;
    margin-bottom: 8px;
    padding: 0 8px;
  }

  .logo span { color: #6366f1; }

  .logo-sub {
    font-size: 11px;
    color: #475569;
    padding: 0 8px;
    margin-bottom: 32px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .nav-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #334155;
    padding: 0 8px;
    margin-bottom: 8px;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #64748b;
    text-decoration: none;
    margin-bottom: 4px;
    transition: all 0.15s;
  }

  .nav-link:hover { background: rgba(255,255,255,0.05); color: #e2e8f0; }
  .nav-link.active { background: rgba(99,102,241,0.15); color: #818cf8; }
  .nav-icon { font-size: 16px; }

  .sidebar-bottom {
    margin-top: auto;
    padding-top: 16px;
    border-top: 1px solid rgba(255,255,255,0.06);
  }

  .user-card {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    margin-bottom: 8px;
  }

  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 600;
    color: white;
    flex-shrink: 0;
  }

  .user-name { font-size: 13px; font-weight: 500; color: #e2e8f0; }
  .user-role {
    font-size: 10px;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .logout-btn {
    width: 100%;
    padding: 9px 12px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.08);
    background: transparent;
    color: #64748b;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .logout-btn:hover { background: rgba(239,68,68,0.1); color: #f87171; border-color: rgba(239,68,68,0.2); }

  .main { margin-left: 240px; flex: 1; padding: 32px; min-height: 100vh; background: #0f1117; }

  .page-header { margin-bottom: 28px; }
  .page-title { font-size: 24px; font-weight: 700; color: #f8fafc; margin-bottom: 4px; }
  .page-sub { font-size: 14px; color: #475569; }

  .card {
    background: #161b27;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    padding: 20px;
  }

  .btn {
    padding: 9px 18px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    font-family: 'Inter', sans-serif;
    transition: all 0.15s;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .btn-primary { background: #6366f1; color: white; }
  .btn-primary:hover { background: #4f46e5; }
  .btn-danger { background: rgba(239,68,68,0.1); color: #f87171; border: 1px solid rgba(239,68,68,0.2); }
  .btn-danger:hover { background: rgba(239,68,68,0.2); }
  .btn-secondary { background: rgba(255,255,255,0.05); color: #94a3b8; border: 1px solid rgba(255,255,255,0.08); }
  .btn-secondary:hover { background: rgba(255,255,255,0.1); color: #e2e8f0; }
  .btn-sm { padding: 5px 12px; font-size: 12px; }

  .badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 99px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.03em;
  }

  .badge-todo { background: rgba(100,116,139,0.15); color: #94a3b8; }
  .badge-in_progress { background: rgba(234,179,8,0.15); color: #facc15; }
  .badge-done { background: rgba(34,197,94,0.15); color: #4ade80; }
  .badge-high { background: rgba(239,68,68,0.15); color: #f87171; }
  .badge-medium { background: rgba(234,179,8,0.15); color: #facc15; }
  .badge-low { background: rgba(34,197,94,0.15); color: #4ade80; }
  .badge-admin { background: rgba(99,102,241,0.15); color: #818cf8; }
  .badge-user { background: rgba(100,116,139,0.15); color: #94a3b8; }
  .badge-active { background: rgba(34,197,94,0.15); color: #4ade80; }
  .badge-completed { background: rgba(99,102,241,0.15); color: #818cf8; }
  .badge-archived { background: rgba(100,116,139,0.15); color: #94a3b8; }

  .input {
    width: 100%;
    padding: 10px 14px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.04);
    color: #e2e8f0;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    outline: none;
    transition: border-color 0.15s;
  }
  .input:focus { border-color: #6366f1; }
  .input::placeholder { color: #475569; }
  .input option { background: #1e293b; }

  .form-group { margin-bottom: 16px; }
  .form-label { display: block; font-size: 13px; font-weight: 500; color: #94a3b8; margin-bottom: 6px; }
  .form-error { font-size: 12px; color: #f87171; margin-top: 4px; }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    backdrop-filter: blur(4px);
  }

  .modal {
    background: #1e293b;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 16px;
    padding: 28px;
    width: 100%;
    max-width: 480px;
    box-shadow: 0 25px 50px rgba(0,0,0,0.5);
  }

  .modal-title {
    font-size: 18px;
    font-weight: 700;
    color: #f8fafc;
    margin-bottom: 20px;
  }

  .modal-footer {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 24px;
  }

  .table { width: 100%; border-collapse: collapse; }
  .table th {
    text-align: left;
    padding: 10px 16px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #334155;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .table td {
    padding: 14px 16px;
    font-size: 14px;
    color: #94a3b8;
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }
  .table td:first-child { color: #e2e8f0; font-weight: 500; }
  .table tbody tr:hover { background: rgba(255,255,255,0.02); }

  .stat-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 24px; }
  .stat-card {
    background: #161b27;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    padding: 20px;
    position: relative;
    overflow: hidden;
  }
  .stat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
  }
  .stat-card:nth-child(1)::before { background: linear-gradient(90deg,#6366f1,#8b5cf6); }
  .stat-card:nth-child(2)::before { background: linear-gradient(90deg,#06b6d4,#3b82f6); }
  .stat-card:nth-child(3)::before { background: linear-gradient(90deg,#f59e0b,#ef4444); }
  .stat-card:nth-child(4)::before { background: linear-gradient(90deg,#10b981,#06b6d4); }
  .stat-label { font-size: 12px; color: #475569; margin-bottom: 8px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }
  .stat-val { font-size: 32px; font-weight: 700; color: #f8fafc; }

  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #475569;
  }
  .empty-icon { font-size: 48px; margin-bottom: 16px; }
  .empty-title { font-size: 16px; font-weight: 600; color: #64748b; margin-bottom: 8px; }
  .empty-sub { font-size: 14px; }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px;
    color: #475569;
    font-size: 14px;
    gap: 10px;
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(99,102,241,0.2);
    border-top-color: #6366f1;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .alert {
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 16px;
  }
  .alert-error { background: rgba(239,68,68,0.1); color: #f87171; border: 1px solid rgba(239,68,68,0.2); }
  .alert-success { background: rgba(34,197,94,0.1); color: #4ade80; border: 1px solid rgba(34,197,94,0.2); }

  .flex { display: flex; }
  .items-center { align-items: center; }
  .justify-between { justify-content: space-between; }
  .gap-2 { gap: 8px; }
  .gap-3 { gap: 12px; }
  .mb-4 { margin-bottom: 16px; }
  .mb-6 { margin-bottom: 24px; }
  .chart-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
  .chart-card { background: #161b27; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 20px; }
  .chart-title { font-size: 14px; font-weight: 600; color: #f8fafc; margin-bottom: 16px; }
`;

export default function Layout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  const initials = user.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <>
      <style>{css}</style>
      <div className="layout">
        <aside className="sidebar">
          <div className="logo">Ethara<span>.</span></div>
          <div className="logo-sub">Task Manager</div>

          <div className="nav-label">Main Menu</div>
          <NavLink to="/dashboard" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
            <span className="nav-icon">◈</span> Dashboard
          </NavLink>
          <NavLink to="/projects" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
            <span className="nav-icon">◇</span> Projects
          </NavLink>
          <NavLink to="/tasks" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
            <span className="nav-icon">◎</span> Tasks
          </NavLink>

          {user.role === 'admin' && (
            <>
              <div className="nav-label" style={{ marginTop: 16 }}>Admin</div>
              <NavLink to="/users" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
                <span className="nav-icon">◉</span> Users
              </NavLink>
            </>
          )}

          <div className="sidebar-bottom">
            <div className="user-card">
              <div className="user-avatar">{initials}</div>
              <div>
                <div className="user-name">{user.full_name || 'User'}</div>
                <div className="user-role">{user.role || 'user'}</div>
              </div>
            </div>
            <button className="logout-btn" onClick={logout}>
              ⇥ Logout
            </button>
          </div>
        </aside>

        <main className="main">
          <Outlet />
        </main>
      </div>
    </>
  );
}