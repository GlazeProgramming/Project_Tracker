import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Dashboard({ setCurrentPage }) {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({ tasks: 0, projects: 0, users: 0, done: 0 });
  const [view, setView] = useState('Board');

  useEffect(() => {
    Promise.all([api.get('/tasks'), api.get('/projects'), api.get('/users')]).then(([t, p, u]) => {
      setTasks(t.data);
      setProjects(p.data);
      setStats({
        tasks: t.data.length,
        projects: p.data.length,
        users: u.data.length,
        done: t.data.filter(x => x.status === 'Done').length,
      });
    });
  }, []);

  const columns = [
    { id: 'Todo', label: 'To Do' },
    { id: 'InProgress', label: 'In Progress' },
    { id: 'Done', label: 'Done' },
  ];

  const priorityStyle = {
    High: 'bg-red-50 text-red-500 border border-red-100',
    Medium: 'bg-amber-50 text-amber-600 border border-amber-100',
    Low: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
  };

  const statusDot = {
    Todo: 'bg-gray-300',
    InProgress: 'bg-amber-400',
    Done: 'bg-emerald-400',
  };

  const statusBadge = {
    Todo: 'bg-gray-100 text-gray-500',
    InProgress: 'bg-amber-50 text-amber-600 border border-amber-100',
    Done: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
  };

  const completion = stats.tasks > 0 ? Math.round((stats.done / stats.tasks) * 100) : 0;

  return (
    <div className="flex flex-col h-full bg-[#F7F7F5]">

      {/* Page Header */}
      <div className="px-8 pt-8 pb-6">
        <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-1">Overview</p>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
      </div>

      {/* Stat Cards */}
      <div className="px-8 grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Tasks', value: stats.tasks, sub: `${stats.done} completed`, color: 'bg-white' },
          { label: 'Active Projects', value: stats.projects, sub: 'across all teams', color: 'bg-white' },
          { label: 'Team Members', value: stats.users, sub: 'contributors', color: 'bg-white' },
          { label: 'Completion Rate', value: `${completion}%`, sub: 'tasks done', color: 'bg-[#111111]', dark: true },
        ].map((card, i) => (
          <div key={i} className={`${card.color} rounded-2xl p-5 border border-gray-100 ${card.dark ? 'border-transparent' : ''}`}>
            <p className={`text-xs font-medium mb-3 ${card.dark ? 'text-white/40' : 'text-gray-400'}`}>{card.label}</p>
            <p className={`text-3xl font-bold tracking-tight mb-1 ${card.dark ? 'text-white' : 'text-gray-900'}`}>{card.value}</p>
            <p className={`text-xs ${card.dark ? 'text-white/30' : 'text-gray-400'}`}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* View Toggle */}
      <div className="px-8 flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-gray-700">Task Board</h2>
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5">
          {['Board', 'List', 'Workflow'].map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all
                ${view === v ? 'bg-[#111111] text-white shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Board View */}
      {view === 'Board' && (
        <div className="flex gap-5 px-8 pb-8 overflow-x-auto flex-1">
          {columns.map(col => {
            const colTasks = tasks.filter(t => t.status === col.id);
            return (
              <div key={col.id} className="flex-shrink-0 w-72">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${statusDot[col.id]}`} />
                    <span className="text-sm font-semibold text-gray-700">{col.label}</span>
                  </div>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{colTasks.length}</span>
                </div>
                <div className="flex flex-col gap-3">
                  {colTasks.length === 0 && (
                    <div className="text-center text-gray-200 text-xs py-10 border-2 border-dashed border-gray-100 rounded-2xl">
                      No tasks
                    </div>
                  )}
                  {colTasks.map(task => (
                    <div key={task.taskId} className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all cursor-default">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${priorityStyle[task.priority]}`}>
                          {task.priority}
                        </span>
                        {task.dueDate && (
                          <span className="text-[10px] text-gray-400">
                            📅 {new Date(task.dueDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-gray-900 mb-1 leading-snug">{task.title}</p>
                      {task.description && (
                        <p className="text-xs text-gray-400 mb-3 line-clamp-2 leading-relaxed">{task.description}</p>
                      )}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                        <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{task.projectName}</span>
                        {task.assignedToUsername && (
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-[8px] font-bold text-white">
                            {task.assignedToUsername[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {view === 'List' && (
        <div className="px-8 pb-8 flex-1 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-gray-50">
              {['Task', 'Project', 'Priority', 'Status', 'Due Date', 'Assignee'].map((h, i) => (
                <div key={h} className={`text-[11px] font-semibold text-gray-400 uppercase tracking-wider ${i === 0 ? 'col-span-4' : i === 1 ? 'col-span-2' : 'col-span-1'} ${i === 5 ? 'col-span-2' : ''}`}>
                  {h}
                </div>
              ))}
            </div>
            {tasks.map((task, i) => (
              <div key={task.taskId}
                className="grid grid-cols-12 gap-4 items-center px-5 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-all">
                <div className="col-span-4 flex items-center gap-2.5 min-w-0">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDot[task.status]}`} />
                  <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full truncate block w-fit max-w-full">{task.projectName}</span>
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
                  {task.dueDate
                    ? <span className="text-xs text-gray-400">{new Date(task.dueDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}</span>
                    : <span className="text-gray-200 text-xs">—</span>}
                </div>
                <div className="col-span-2">
                  {task.assignedToUsername ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0">
                        {task.assignedToUsername[0].toUpperCase()}
                      </div>
                      <span className="text-xs text-gray-500 truncate">{task.assignedToUsername}</span>
                    </div>
                  ) : <span className="text-gray-200 text-xs">—</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Workflow View */}
      {view === 'Workflow' && (
        <div className="px-8 pb-8 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-6">
            {columns.map(col => {
              const colTasks = tasks.filter(t => t.status === col.id);
              return (
                <div key={col.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${statusDot[col.id]}`} />
                      <span className="text-sm font-semibold text-gray-700">{col.label}</span>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{colTasks.length}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-4 p-4">
                    {colTasks.length === 0 && (
                      <div className="col-span-4 text-center text-gray-200 text-xs py-6">No tasks</div>
                    )}
                    {colTasks.map(task => (
                      <div key={task.taskId} className="bg-gray-50 rounded-xl p-3 border border-gray-100 hover:border-gray-200 transition-all">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${priorityStyle[task.priority]}`}>{task.priority}</span>
                        <p className="text-sm font-semibold text-gray-900 mt-2 mb-1 leading-snug">{task.title}</p>
                        <p className="text-xs text-gray-400 truncate">{task.projectName}</p>
                        {task.dueDate && (
                          <p className="text-[10px] text-gray-300 mt-2">
                            📅 {new Date(task.dueDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                          </p>
                        )}
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