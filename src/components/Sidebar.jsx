import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Sidebar({ currentPage, setCurrentPage }) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get('/projects').then(r => setProjects(r.data.slice(0, 5)));
  }, []);

  const nav = [
    { id: 'dashboard', label: 'Overview', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
      </svg>
    )},
    { id: 'tasks', label: 'Tasks', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    )},
    { id: 'projects', label: 'Projects', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
      </svg>
    )},
    { id: 'users', label: 'Members', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    )},
  ];

  const dotColors = ['bg-orange-400', 'bg-violet-400', 'bg-emerald-400', 'bg-blue-400', 'bg-pink-400'];

  return (
    <aside className="w-60 bg-[#111111] flex flex-col py-6 px-4 flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </div>
        <span className="text-white font-semibold text-sm tracking-tight">ProjectTracker</span>
      </div>

      {/* Main Nav */}
      <div className="mb-6">
        <p className="text-[11px] text-white/25 uppercase tracking-widest font-medium px-2 mb-2">Main</p>
        <nav className="flex flex-col gap-0.5">
          {nav.map(item => (
            <button key={item.id} onClick={() => setCurrentPage(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left
                ${currentPage === item.id
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}>
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Projects */}
      <div className="mb-6">
        <p className="text-[11px] text-white/25 uppercase tracking-widest font-medium px-2 mb-2">Projects</p>
        <div className="flex flex-col gap-0.5">
          {projects.map((p, i) => (
            <button key={p.projectId} onClick={() => setCurrentPage('projects')}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-all text-left">
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColors[i % dotColors.length]}`} />
              <span className="truncate">{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-auto px-2 pt-4 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex-shrink-0" />
          <div>
            <p className="text-white text-xs font-medium">Student</p>
            <p className="text-white/30 text-[10px]">SWE310</p>
          </div>
        </div>
      </div>
    </aside>
  );
}