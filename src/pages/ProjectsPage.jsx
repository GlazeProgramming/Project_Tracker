import { useEffect, useState } from 'react';
import api from '../services/api';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [form, setForm] = useState({ ownerId: '', name: '', description: '', status: 'Active' });
  const [error, setError] = useState('');

  useEffect(() => { fetchProjects(); api.get('/users').then(r => setUsers(r.data)); }, []);
  const fetchProjects = () => api.get('/projects').then(r => setProjects(r.data));

  const handleSubmit = async () => {
    if (!form.name || !form.ownerId) return setError('Name and Owner are required.');
    setError('');
    if (editProject) {
      await api.put(`/projects/${editProject.projectId}`, form);
    } else {
      await api.post('/projects', { ...form, ownerId: parseInt(form.ownerId) });
    }
    setShowForm(false); setEditProject(null);
    setForm({ ownerId: '', name: '', description: '', status: 'Active' });
    fetchProjects();
  };

  const handleEdit = (p) => {
    setEditProject(p);
    setForm({ ownerId: p.ownerId, name: p.name, description: p.description || '', status: p.status });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    await api.delete(`/projects/${id}`);
    fetchProjects();
  };

  const statusStyle = {
    Active: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    Completed: 'bg-blue-50 text-blue-600 border border-blue-100',
    Archived: 'bg-gray-100 text-gray-400',
  };

  const accentColors = [
    'from-orange-400 to-pink-500',
    'from-violet-400 to-purple-600',
    'from-emerald-400 to-teal-500',
    'from-blue-400 to-indigo-500',
    'from-pink-400 to-rose-500',
    'from-amber-400 to-orange-500',
  ];

  return (
    <div className="flex flex-col h-full bg-[#F7F7F5]">
      <div className="px-8 pt-8 pb-6 flex items-end justify-between">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-1">Manage</p>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Projects</h1>
        </div>
        <button onClick={() => { setShowForm(true); setEditProject(null); setForm({ ownerId: '', name: '', description: '', status: 'Active' }); }}
          className="bg-[#111111] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition flex items-center gap-2">
          <span className="text-lg leading-none">+</span> New Project
        </button>
      </div>

      {/* Stats Row */}
      <div className="px-8 flex items-center gap-6 mb-6">
        {[
          { label: 'Total', value: projects.length },
          { label: 'Active', value: projects.filter(p => p.status === 'Active').length },
          { label: 'Completed', value: projects.filter(p => p.status === 'Completed').length },
          { label: 'Archived', value: projects.filter(p => p.status === 'Archived').length },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">{s.value}</span>
            <span className="text-sm text-gray-400">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => { setShowForm(false); setError(''); }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-100"
            onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-bold text-gray-900 mb-5">{editProject ? 'Edit Project' : 'New Project'}</h3>
            {error && <p className="text-red-500 text-sm mb-3 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Project Name</label>
                <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition"
                  placeholder="Enter project name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Description</label>
                <textarea className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition resize-none"
                  placeholder="Optional description" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Owner</label>
                <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition bg-white"
                  value={form.ownerId} onChange={e => setForm({ ...form, ownerId: e.target.value })}>
                  <option value="">Select owner</option>
                  {users.map(u => <option key={u.userId} value={u.userId}>{u.username}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Status</label>
                <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition bg-white"
                  value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  {['Active', 'Completed', 'Archived'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={handleSubmit} className="flex-1 bg-[#111111] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition">
                {editProject ? 'Save Changes' : 'Create Project'}
              </button>
              <button onClick={() => { setShowForm(false); setError(''); }} className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-200 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="px-8 pb-8 grid grid-cols-3 gap-4">
        {projects.map((project, idx) => (
          <div key={project.projectId}
            className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all overflow-hidden group">
            {/* Accent bar */}
            <div className={`h-1 bg-gradient-to-r ${accentColors[idx % accentColors.length]}`} />
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${accentColors[idx % accentColors.length]} flex items-center justify-center text-white font-bold text-sm`}>
                  {project.name[0].toUpperCase()}
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusStyle[project.status]}`}>
                  {project.status}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">{project.name}</h3>
              <p className="text-xs text-gray-400 mb-5 line-clamp-2 leading-relaxed">{project.description || 'No description provided.'}</p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${accentColors[idx % accentColors.length]} flex items-center justify-center text-[8px] font-bold text-white`}>
                    {project.ownerUsername?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-xs text-gray-400">{project.ownerUsername}</span>
                </div>
                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => handleEdit(project)} className="text-xs text-gray-400 hover:text-gray-700 transition font-medium">Edit</button>
                  <button onClick={() => handleDelete(project.projectId)} className="text-xs text-gray-400 hover:text-red-500 transition font-medium">Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}