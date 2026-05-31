import { useEffect, useState, useMemo } from 'react';
import api from '../services/api';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [form, setForm] = useState({ projectId: '', assignedToUserId: '', title: '', description: '', priority: 'Medium', status: 'Todo', dueDate: '' });
  const [error, setError] = useState('');
  const [view, setView] = useState('Board');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    fetchTasks();
    api.get('/projects').then(r => setProjects(r.data));
    api.get('/users').then(r => setUsers(r.data));
  }, []);

  const fetchTasks = () => api.get('/tasks').then(r => setTasks(r.data));

  const handleSubmit = async () => {
    if (!form.title || !form.projectId) return setError('Title and Project are required.');
    setError('');
    const payload = { ...form, projectId: parseInt(form.projectId), assignedToUserId: form.assignedToUserId ? parseInt(form.assignedToUserId) : null, dueDate: form.dueDate || null };
    if (editTask) { await api.put(`/tasks/${editTask.taskId}`, payload); }
    else { await api.post('/tasks', payload); }
    setShowForm(false); setEditTask(null);
    setForm({ projectId: '', assignedToUserId: '', title: '', description: '', priority: 'Medium', status: 'Todo', dueDate: '' });
    fetchTasks();
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setForm({ projectId: task.projectId, assignedToUserId: task.assignedToUserId || '', title: task.title, description: task.description || '', priority: task.priority, status: task.status, dueDate: task.dueDate ? task.dueDate.split('T')[0] : '' });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    await api.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const filteredTasks = useMemo(() => {
    let r = [...tasks];
    if (search.trim()) r = r.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
    if (filterPriority) r = r.filter(t => t.priority === filterPriority);
    if (filterStatus) r = r.filter(t => t.status === filterStatus);
    if (filterUser) r = r.filter(t => t.assignedToUserId === parseInt(filterUser));
    if (sortBy === 'dueDate') r.sort((a, b) => !a.dueDate ? 1 : !b.dueDate ? -1 : new Date(a.dueDate) - new Date(b.dueDate));
    if (sortBy === 'priority') { const o = { High: 0, Medium: 1, Low: 2 }; r.sort((a, b) => o[a.priority] - o[b.priority]); }
    if (sortBy === 'title') r.sort((a, b) => a.title.localeCompare(b.title));
    return r;
  }, [tasks, search, sortBy, filterPriority, filterStatus, filterUser]);

  const hasFilters = filterPriority || filterStatus || filterUser || sortBy || search;

  const priorityStyle = {
    High: 'bg-red-50 text-red-500 border border-red-100',
    Medium: 'bg-amber-50 text-amber-600 border border-amber-100',
    Low: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
  };
  const statusDot = { Todo: 'bg-gray-300', InProgress: 'bg-amber-400', Done: 'bg-emerald-400' };
  const statusBadge = {
    Todo: 'bg-gray-100 text-gray-500',
    InProgress: 'bg-amber-50 text-amber-600 border border-amber-100',
    Done: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
  };
  const columns = [
    { id: 'Todo', label: 'To Do' },
    { id: 'InProgress', label: 'In Progress' },
    { id: 'Done', label: 'Done' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#F7F7F5]" onClick={() => { setShowSortMenu(false); setShowFilterMenu(false); setShowUserMenu(false); }}>

      {/* Header */}
      <div className="px-8 pt-8 pb-4 flex items-end justify-between">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-1">Manage</p>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Tasks</h1>
        </div>
        <button onClick={(e) => { e.stopPropagation(); setShowForm(true); setEditTask(null); setForm({ projectId: '', assignedToUserId: '', title: '', description: '', priority: 'Medium', status: 'Todo', dueDate: '' }); }}
          className="bg-[#111111] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition flex items-center gap-2">
          <span className="text-lg leading-none">+</span> New Task
        </button>
      </div>

      {/* Toolbar */}
      <div className="px-8 pb-5 flex items-center gap-3" onClick={e => e.stopPropagation()}>
        {/* Search */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3.5 py-2 flex-1 max-w-xs">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input className="bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400 w-full"
            placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch('')} className="text-gray-300 hover:text-gray-500 text-xs">✕</button>}
        </div>

        {/* Sort */}
        <div className="relative">
          <button onClick={(e) => { e.stopPropagation(); setShowSortMenu(!showSortMenu); setShowFilterMenu(false); setShowUserMenu(false); }}
            className={`text-sm flex items-center gap-2 px-3.5 py-2 rounded-xl border transition font-medium
              ${sortBy ? 'bg-[#111111] text-white border-transparent' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="21" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="3" y2="18"/>
            </svg>
            Sort {sortBy ? `· ${sortBy === 'dueDate' ? 'Date' : sortBy === 'title' ? 'A–Z' : 'Priority'}` : ''}
          </button>
          {showSortMenu && (
            <div className="absolute top-11 left-0 bg-white border border-gray-100 rounded-xl shadow-lg z-30 w-40 py-1 overflow-hidden">
              {[{ value: 'title', label: 'Title A–Z' }, { value: 'dueDate', label: 'Due Date' }, { value: 'priority', label: 'Priority' }].map(opt => (
                <button key={opt.value} onClick={() => { setSortBy(sortBy === opt.value ? '' : opt.value); setShowSortMenu(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition ${sortBy === opt.value ? 'text-gray-900 font-semibold bg-gray-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filter */}
        <div className="relative">
          <button onClick={(e) => { e.stopPropagation(); setShowFilterMenu(!showFilterMenu); setShowSortMenu(false); setShowUserMenu(false); }}
            className={`text-sm flex items-center gap-2 px-3.5 py-2 rounded-xl border transition font-medium
              ${(filterPriority || filterStatus) ? 'bg-[#111111] text-white border-transparent' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            Filter {(filterPriority || filterStatus) ? '·' : ''}
          </button>
          {showFilterMenu && (
            <div className="absolute top-11 left-0 bg-white border border-gray-100 rounded-xl shadow-lg z-30 w-56 p-4">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Priority</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {['High', 'Medium', 'Low'].map(p => (
                  <button key={p} onClick={() => setFilterPriority(filterPriority === p ? '' : p)}
                    className={`text-xs px-2.5 py-1 rounded-lg transition font-medium border
                      ${filterPriority === p ? 'bg-[#111111] text-white border-transparent' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
                    {p}
                  </button>
                ))}
              </div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Status</p>
              <div className="flex flex-wrap gap-1.5">
                {['Todo', 'InProgress', 'Done'].map(s => (
                  <button key={s} onClick={() => setFilterStatus(filterStatus === s ? '' : s)}
                    className={`text-xs px-2.5 py-1 rounded-lg transition font-medium border
                      ${filterStatus === s ? 'bg-[#111111] text-white border-transparent' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
                    {s === 'InProgress' ? 'In Progress' : s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Assignee filter */}
        <div className="relative">
          <button onClick={(e) => { e.stopPropagation(); setShowUserMenu(!showUserMenu); setShowSortMenu(false); setShowFilterMenu(false); }}
            className={`text-sm flex items-center gap-2 px-3.5 py-2 rounded-xl border transition font-medium
              ${filterUser ? 'bg-[#111111] text-white border-transparent' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            {filterUser ? users.find(u => u.userId === parseInt(filterUser))?.username : 'Assignee'}
          </button>
          {showUserMenu && (
            <div className="absolute top-11 left-0 bg-white border border-gray-100 rounded-xl shadow-lg z-30 w-44 py-1">
              <button onClick={() => { setFilterUser(''); setShowUserMenu(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm transition ${!filterUser ? 'font-semibold text-gray-900 bg-gray-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                All members
              </button>
              {users.map(u => (
                <button key={u.userId} onClick={() => { setFilterUser(filterUser === String(u.userId) ? '' : String(u.userId)); setShowUserMenu(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition flex items-center gap-2.5
                    ${filterUser === String(u.userId) ? 'font-semibold text-gray-900 bg-gray-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-[8px] text-white font-bold">
                    {u.username[0].toUpperCase()}
                  </div>
                  {u.username}
                </button>
              ))}
            </div>
          )}
        </div>

        {hasFilters && (
          <button onClick={() => { setSearch(''); setSortBy(''); setFilterPriority(''); setFilterStatus(''); setFilterUser(''); }}
            className="text-xs text-gray-400 hover:text-gray-700 transition px-3 py-2 rounded-xl hover:bg-white border border-transparent hover:border-gray-200">
            Clear all
          </button>
        )}

        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-gray-400">{filteredTasks.length} of {tasks.length} tasks</span>
          <div className="flex items-center gap-0.5 bg-white border border-gray-200 rounded-lg p-0.5">
            {['Board', 'List', 'Workflow'].map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all
                  ${view === v ? 'bg-[#111111] text-white shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}>
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => { setShowForm(false); setError(''); }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-100"
            onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-bold text-gray-900 mb-5">{editTask ? 'Edit Task' : 'New Task'}</h3>
            {error && <p className="text-red-500 text-sm mb-3 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            <div className="flex flex-col gap-3">
              {[
                { label: 'Title', placeholder: 'Task title', key: 'title' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">{f.label}</label>
                  <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition"
                    placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Description</label>
                <textarea className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition resize-none"
                  placeholder="Optional" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Project</label>
                  <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition bg-white"
                    value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })}>
                    <option value="">Select</option>
                    {projects.map(p => <option key={p.projectId} value={p.projectId}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Assignee</label>
                  <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition bg-white"
                    value={form.assignedToUserId} onChange={e => setForm({ ...form, assignedToUserId: e.target.value })}>
                    <option value="">Unassigned</option>
                    {users.map(u => <option key={u.userId} value={u.userId}>{u.username}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Priority</label>
                  <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition bg-white"
                    value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                    {['Low', 'Medium', 'High'].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Status</label>
                  <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition bg-white"
                    value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    {['Todo', 'InProgress', 'Done'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Due Date</label>
                  <input type="date" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition"
                    value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={handleSubmit} className="flex-1 bg-[#111111] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition">
                {editTask ? 'Save Changes' : 'Create Task'}
              </button>
              <button onClick={() => { setShowForm(false); setError(''); }} className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-200 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Board */}
      {view === 'Board' && (
        <div className="flex gap-5 px-8 pb-8 overflow-x-auto flex-1">
          {columns.map(col => {
            const colTasks = filteredTasks.filter(t => t.status === col.id);
            return (
              <div key={col.id} className="flex-shrink-0 w-72">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${statusDot[col.id]}`} />
                    <span className="text-sm font-semibold text-gray-700">{col.label}</span>
                  </div>
                  <span className="text-xs text-gray-400 bg-white border border-gray-100 px-2 py-0.5 rounded-full">{colTasks.length}</span>
                </div>
                <div className="flex flex-col gap-3">
                  {colTasks.length === 0 && (
                    <div className="text-center text-gray-200 text-xs py-10 border-2 border-dashed border-gray-100 rounded-2xl">No tasks</div>
                  )}
                  {colTasks.map(task => (
                    <div key={task.taskId} className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all group">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${priorityStyle[task.priority]}`}>{task.priority}</span>
                        {task.dueDate && <span className="text-[10px] text-gray-400">📅 {new Date(task.dueDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}</span>}
                      </div>
                      <p className="text-sm font-semibold text-gray-900 mb-1 leading-snug">{task.title}</p>
                      {task.description && <p className="text-xs text-gray-400 mb-3 line-clamp-2">{task.description}</p>}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                        <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{task.projectName}</span>
                        <div className="flex items-center gap-2">
                          {task.assignedToUsername && (
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-[8px] font-bold text-white">
                              {task.assignedToUsername[0].toUpperCase()}
                            </div>
                          )}
                          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition">
                            <button onClick={() => handleEdit(task)} className="text-[10px] text-gray-400 hover:text-gray-700 font-medium">Edit</button>
                            <button onClick={() => handleDelete(task.taskId)} className="text-[10px] text-gray-400 hover:text-red-500 font-medium">Del</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List */}
      {view === 'List' && (
        <div className="px-8 pb-8 flex-1 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-gray-50">
              {[['Task', 4], ['Project', 2], ['Priority', 1], ['Status', 2], ['Due', 1], ['Assignee', 2]].map(([h, span]) => (
                <div key={h} className={`col-span-${span} text-[11px] font-semibold text-gray-400 uppercase tracking-wider`}>{h}</div>
              ))}
            </div>
            {filteredTasks.length === 0 && (
              <div className="text-center text-gray-200 py-16 text-sm">No tasks match your filters.</div>
            )}
            {filteredTasks.map(task => (
              <div key={task.taskId} className="grid grid-cols-12 gap-4 items-center px-5 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition group">
                <div className="col-span-4 flex items-center gap-2.5 min-w-0">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDot[task.status]}`} />
                  <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{task.projectName}</span>
                </div>
                <div className="col-span-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${priorityStyle[task.priority]}`}>{task.priority}</span>
                </div>
                <div className="col-span-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusBadge[task.status]}`}>
                    {task.status === 'InProgress' ? 'In Progress' : task.status}
                  </span>
                </div>
                <div className="col-span-1">
                  {task.dueDate ? <span className="text-xs text-gray-400">{new Date(task.dueDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}</span> : <span className="text-gray-200">—</span>}
                </div>
                <div className="col-span-2 flex items-center justify-between">
                  {task.assignedToUsername ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-[8px] font-bold text-white">
                        {task.assignedToUsername[0].toUpperCase()}
                      </div>
                      <span className="text-xs text-gray-500">{task.assignedToUsername}</span>
                    </div>
                  ) : <span className="text-gray-200 text-xs">—</span>}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => handleEdit(task)} className="text-xs text-gray-400 hover:text-gray-700 font-medium">Edit</button>
                    <button onClick={() => handleDelete(task.taskId)} className="text-xs text-gray-400 hover:text-red-500 font-medium">Del</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Workflow */}
      {view === 'Workflow' && (
        <div className="px-8 pb-8 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-5">
            {columns.map(col => {
              const colTasks = filteredTasks.filter(t => t.status === col.id);
              return (
                <div key={col.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${statusDot[col.id]}`} />
                      <span className="text-sm font-semibold text-gray-700">{col.label}</span>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{colTasks.length}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-3 p-4">
                    {colTasks.length === 0 && <div className="col-span-4 text-center text-gray-200 text-xs py-4">No tasks</div>}
                    {colTasks.map(task => (
                      <div key={task.taskId} className="bg-gray-50 rounded-xl p-3 border border-gray-100 hover:border-gray-200 transition group">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${priorityStyle[task.priority]}`}>{task.priority}</span>
                        <p className="text-sm font-semibold text-gray-900 mt-2 mb-1 leading-snug">{task.title}</p>
                        <p className="text-xs text-gray-400 truncate">{task.projectName}</p>
                        {task.dueDate && <p className="text-[10px] text-gray-300 mt-2">📅 {new Date(task.dueDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}</p>}
                        <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition">
                          <button onClick={() => handleEdit(task)} className="text-[10px] text-gray-400 hover:text-gray-700 font-medium">Edit</button>
                          <button onClick={() => handleDelete(task.taskId)} className="text-[10px] text-gray-400 hover:text-red-500 font-medium">Del</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}