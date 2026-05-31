import { useEffect, useState } from 'react';
import api from '../services/api';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => { fetchUsers(); }, []);
  const fetchUsers = () => api.get('/users').then(r => setUsers(r.data));

  const handleSubmit = async () => {
    if (!form.username || !form.email) return setError('Username and Email are required.');
    if (!editUser && !form.password) return setError('Password is required.');
    setError('');
    if (editUser) {
      await api.put(`/users/${editUser.userId}`, { username: form.username, email: form.email });
    } else {
      await api.post('/users', form);
    }
    setShowForm(false); setEditUser(null);
    setForm({ username: '', email: '', password: '' });
    fetchUsers();
  };

  const handleEdit = (u) => { setEditUser(u); setForm({ username: u.username, email: u.email, password: '' }); setShowForm(true); };
  const handleDelete = async (id) => { if (!window.confirm('Delete this member?')) return; await api.delete(`/users/${id}`); fetchUsers(); };

  const gradients = [
    'from-orange-400 to-pink-500',
    'from-violet-400 to-purple-600',
    'from-emerald-400 to-teal-500',
    'from-blue-400 to-indigo-500',
    'from-pink-400 to-rose-500',
    'from-amber-400 to-orange-500',
    'from-cyan-400 to-blue-500',
    'from-fuchsia-400 to-pink-500',
    'from-lime-400 to-emerald-500',
    'from-sky-400 to-cyan-500',
  ];

  return (
    <div className="flex flex-col h-full bg-[#F7F7F5]">
      <div className="px-8 pt-8 pb-6 flex items-end justify-between">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-1">Team</p>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Members</h1>
        </div>
        <button onClick={() => { setShowForm(true); setEditUser(null); setForm({ username: '', email: '', password: '' }); }}
          className="bg-[#111111] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition flex items-center gap-2">
          <span className="text-lg leading-none">+</span> New Member
        </button>
      </div>

      {/* Summary */}
      <div className="px-8 mb-6 flex items-center gap-2">
        <div className="flex -space-x-2">
          {users.slice(0, 5).map((u, i) => (
            <div key={u.userId} className={`w-7 h-7 rounded-full bg-gradient-to-br ${gradients[i % gradients.length]} border-2 border-[#F7F7F5] flex items-center justify-center text-[10px] font-bold text-white`}>
              {u.username[0].toUpperCase()}
            </div>
          ))}
        </div>
        <span className="text-sm text-gray-500 ml-2">{users.length} members in your team</span>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => { setShowForm(false); setError(''); }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-100"
            onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-bold text-gray-900 mb-5">{editUser ? 'Edit Member' : 'New Member'}</h3>
            {error && <p className="text-red-500 text-sm mb-3 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Username</label>
                <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition"
                  placeholder="Enter username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Email</label>
                <input type="email" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition"
                  placeholder="Enter email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              {!editUser && (
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Password</label>
                  <input type="password" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition"
                    placeholder="Min. 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={handleSubmit} className="flex-1 bg-[#111111] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition">
                {editUser ? 'Save Changes' : 'Create Member'}
              </button>
              <button onClick={() => { setShowForm(false); setError(''); }} className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-200 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="px-8 pb-8">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="text-left px-6 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Member</th>
                <th className="text-left px-6 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                <th className="text-left px-6 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user.userId} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradients[idx % gradients.length]} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                        {user.username[0].toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{user.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition justify-end">
                      <button onClick={() => handleEdit(user)} className="text-xs text-gray-400 hover:text-gray-700 transition font-medium">Edit</button>
                      <button onClick={() => handleDelete(user.userId)} className="text-xs text-gray-400 hover:text-red-500 transition font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}