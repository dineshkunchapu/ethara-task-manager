import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import API from '../api';

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#8b5cf6'];

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>
        <div style={{ color: '#94a3b8', marginBottom: 4 }}>{label || payload[0].name}</div>
        <div style={{ color: '#6366f1', fontWeight: 600 }}>{payload[0].value}</div>
      </div>
    );
  }
  return null;
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(function () {
    API.get('/dashboard')
      .then(function (res) { setData(res.data); setLoading(false); })
      .catch(function () { setError('Failed to load dashboard'); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="loading">
      <div className="spinner"></div> Loading dashboard...
    </div>
  );

  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Dashboard</div>
        <div className="page-sub">Welcome back, {user.full_name} 👋</div>
      </div>

      {/* Stat Cards */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Total Projects</div>
          <div className="stat-val">{data.total_projects}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Tasks</div>
          <div className="stat-val">{data.total_tasks}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Completed</div>
          <div className="stat-val">{data.task_status.find(t => t.name === 'Done')?.value || 0}</div>
        </div>
        {user.role === 'admin' && (
          <div className="stat-card">
            <div className="stat-label">Total Users</div>
            <div className="stat-val">{data.total_users}</div>
          </div>
        )}
        {user.role !== 'admin' && (
          <div className="stat-card">
            <div className="stat-label">In Progress</div>
            <div className="stat-val">{data.task_status.find(t => t.name === 'In Progress')?.value || 0}</div>
          </div>
        )}
      </div>

      {/* Charts */}
      <div className="chart-grid">
        <div className="chart-card">
          <div className="chart-title">Task Status Breakdown</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data.task_status} dataKey="value" nameKey="name"
                cx="50%" cy="50%" outerRadius={80} innerRadius={48} paddingAngle={3}
                label={function (e) { return e.name + ' ' + e.value; }}
                labelLine={{ stroke: 'rgba(255,255,255,0.15)' }}
              >
                {data.task_status.map(function (_, i) {
                  return <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />;
                })}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-title">Task Priority</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.task_priority} barCategoryGap="40%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#475569' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {data.task_priority.map(function (_, i) {
                  return <Cell key={i} fill={COLORS[i % COLORS.length]} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Projects Overview */}
      {data.projects.length > 0 && (
        <div className="chart-card" style={{ marginBottom: 24 }}>
          <div className="chart-title">Tasks per Project</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.projects} layout="vertical" barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: '#94a3b8' }} width={120} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="tasks" fill="#6366f1" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Empty state */}
      {data.total_tasks === 0 && (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <div className="empty-title">No tasks yet</div>
            <div className="empty-sub">Create a project and add tasks to get started</div>
          </div>
        </div>
      )}
    </div>
  );
}