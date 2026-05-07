import { useState, useEffect } from 'react';
import API from '../api';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', status: 'todo', priority: 'medium', project_id: '', assignee_id: '', due_date: '' });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(function () { fetchAll(); }, []);

  async function fetchAll() {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        API.get('/tasks'),
        API.get('/projects'),
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      if (user.role === 'admin') {
        const usersRes = await API.get('/users');
        setUsers(usersRes.data);
      }
    } catch {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setForm({ title: '', description: '', status: 'todo', priority: 'medium', project_id: projects[0]?.id || '', assignee_id: '', due_date: '' });
    setFormError('');
    setShowModal(true);
  }

  function openEdit(task) {
    setEditing(task);
    setForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      project_id: task.project_id,
      assignee_id: task.assignee_id || '',
      due_date: task.due_date || '',
    });
    setFormError('');
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return setFormError('Task title is required');
    if (!form.project_id) return setFormError('Please select a project');
    setSaving(true);
    try {
      const payload = {
        ...form,
        project_id: parseInt(form.project_id),
        assignee_id: form.assignee_id ? parseInt(form.assignee_id) : null,
        due_date: form.due_date || null,
      };
      if (editing) {
        await API.put('/tasks/' + editing.id, payload);
      } else {
        await API.post('/tasks', payload);
      }
      setShowModal(false);
      fetchAll();
    } catch (err) {
      setFormError(err.response?.data?.detail || 'Failed to save task');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this task?')) return;
    try {
      await API.delete('/tasks/' + id);
      fetchAll();
    } catch {
      alert('Failed to delete task');
    }
  }

  async function quickStatus(task, newStatus) {
    try {
      await API.put('/tasks/' + task.id, { status: newStatus });
      fetchAll();
    } catch {
      alert('Failed to update status');
    }
  }

  const filtered = tasks.filter(function (t) {
    return (!filterStatus || t.status === filterStatus) &&
           (!filterPriority || t.priority === filterPriority);
  });

  const getProject = function (id) { return projects.find(function (p) { return p.id === id; }); };
  const getUser = function (id) { return users.find(function (u) { return u.id === id; }); };

  if (loading) return <div className="loading"><div className="spinner"></div> Loading tasks...</div>;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div className="page-title">Tasks</div>
          <div className="page-sub">{filtered.length} task{filtered.length !== 1 ? 's' : ''} found</div>
        </div>
        <button className="btn btn-primary" onClick={openCreate} disabled={projects.length === 0}>
          + New Task
        </button>
      </div>

      {projects.length === 0 && (
        <div className="alert alert-error" style={{ marginBottom: 16 }}>
          ⚠ Create a project first before adding tasks
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <select className="input" style={{ width: 'auto', padding: '8px 12px' }}
          value={filterStatus} onChange={function (e) { setFilterStatus(e.target.value); }}>
          <option value="">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select className="input" style={{ width: 'auto', padding: '8px 12px' }}
          value={filterPriority} onChange={function (e) { setFilterPriority(e.target.value); }}>
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        {(filterStatus || filterPriority) && (
          <button className="btn btn-secondary" onClick={function () { setFilterStatus(''); setFilterPriority(''); }}>
            Clear
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">◎</div>
            <div className="empty-title">No tasks found</div>
            <div className="empty-sub">{tasks.length === 0 ? 'Create your first task to get started' : 'Try clearing the filters'}</div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Due Date</th>
                {user.role === 'admin' && <th>Assignee</th>}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(function (task) {
                const project = getProject(task.project_id);
                const assignee = getUser(task.assignee_id);
                return (
                  <tr key={task.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#f8fafc', marginBottom: 2 }}>{task.title}</div>
                      {task.description && <div style={{ fontSize: 12, color: '#475569' }}>{task.description.slice(0, 60)}{task.description.length > 60 ? '...' : ''}</div>}
                    </td>
                    <td>{project ? project.title : '—'}</td>
                    <td>
                      <select
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, color: 'inherit', fontFamily: 'Inter, sans-serif' }}
                        value={task.status}
                        onChange={function (e) { quickStatus(task, e.target.value); }}
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                    </td>
                    <td><span className={'badge badge-' + task.priority}>{task.priority}</span></td>
                    <td>{task.due_date || '—'}</td>
                    {user.role === 'admin' && <td>{assignee ? assignee.full_name : '—'}</td>}
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-secondary btn-sm" onClick={function () { openEdit(task); }}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={function () { handleDelete(task.id); }}>Del</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={function (e) { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal">
            <div className="modal-title">{editing ? 'Edit Task' : 'New Task'}</div>
            {formError && <div className="alert alert-error">{formError}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Task Title *</label>
                <input className="input" type="text" placeholder="Enter task title"
                  value={form.title} onChange={function (e) { setForm({ ...form, title: e.target.value }); setFormError(''); }} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="input" placeholder="Task description (optional)" rows={2}
                  style={{ resize: 'vertical' }}
                  value={form.description} onChange={function (e) { setForm({ ...form, description: e.target.value }); }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Project *</label>
                  <select className="input" value={form.project_id}
                    onChange={function (e) { setForm({ ...form, project_id: e.target.value }); }}>
                    <option value="">Select project</option>
                    {projects.map(function (p) { return <option key={p.id} value={p.id}>{p.title}</option>; })}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select className="input" value={form.priority}
                    onChange={function (e) { setForm({ ...form, priority: e.target.value }); }}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="input" value={form.status}
                    onChange={function (e) { setForm({ ...form, status: e.target.value }); }}>
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input className="input" type="date" value={form.due_date}
                    onChange={function (e) { setForm({ ...form, due_date: e.target.value }); }} />
                </div>
              </div>
              {user.role === 'admin' && (
                <div className="form-group">
                  <label className="form-label">Assign To</label>
                  <select className="input" value={form.assignee_id}
                    onChange={function (e) { setForm({ ...form, assignee_id: e.target.value }); }}>
                    <option value="">Unassigned</option>
                    {users.map(function (u) { return <option key={u.id} value={u.id}>{u.full_name}</option>; })}
                  </select>
                </div>
              )}
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={function () { setShowModal(false); }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}