import { useState, useEffect } from 'react';
import API from '../api';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', status: 'active' });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(function () { fetchProjects(); }, []);

  async function fetchProjects() {
    try {
      const res = await API.get('/projects');
      setProjects(res.data);
    } catch {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setForm({ title: '', description: '', status: 'active' });
    setFormError('');
    setShowModal(true);
  }

  function openEdit(project) {
    setEditing(project);
    setForm({ title: project.title, description: project.description || '', status: project.status });
    setFormError('');
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return setFormError('Project title is required');
    setSaving(true);
    try {
      if (editing) {
        await API.put('/projects/' + editing.id, form);
      } else {
        await API.post('/projects', form);
      }
      setShowModal(false);
      fetchProjects();
    } catch (err) {
      setFormError(err.response?.data?.detail || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this project and all its tasks?')) return;
    try {
      await API.delete('/projects/' + id);
      fetchProjects();
    } catch {
      alert('Failed to delete project');
    }
  }

  if (loading) return <div className="loading"><div className="spinner"></div> Loading projects...</div>;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div className="page-title">Projects</div>
          <div className="page-sub">{projects.length} project{projects.length !== 1 ? 's' : ''} total</div>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ New Project</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {projects.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">◇</div>
            <div className="empty-title">No projects yet</div>
            <div className="empty-sub">Create your first project to get started</div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {projects.map(function (project) {
            return (
              <div key={project.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#f8fafc' }}>{project.title}</div>
                  <span className={'badge badge-' + project.status}>{project.status}</span>
                </div>
                {project.description && (
                  <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{project.description}</div>
                )}
                <div style={{ fontSize: 12, color: '#334155' }}>
                  Created {new Date(project.created_at).toLocaleDateString()}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <button className="btn btn-secondary btn-sm" onClick={function () { openEdit(project); }}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={function () { handleDelete(project.id); }}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={function (e) { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal">
            <div className="modal-title">{editing ? 'Edit Project' : 'New Project'}</div>
            {formError && <div className="alert alert-error">{formError}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Project Title *</label>
                <input className="input" type="text" placeholder="Enter project title"
                  value={form.title} onChange={function (e) { setForm({ ...form, title: e.target.value }); setFormError(''); }} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="input" placeholder="Project description (optional)"
                  rows={3} style={{ resize: 'vertical' }}
                  value={form.description} onChange={function (e) { setForm({ ...form, description: e.target.value }); }} />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="input" value={form.status} onChange={function (e) { setForm({ ...form, status: e.target.value }); }}>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
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