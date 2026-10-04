import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  Terminal, 
  BookOpen, 
  Play, 
  Check, 
  X, 
  Calendar, 
  Layers, 
  Code2, 
  FileCode, 
  RefreshCw, 
  GitCommit,
  GitBranch,
  ArrowUpDown,
  FileText
} from 'lucide-react';

const INITIAL_TASKS = [
  {
    id: 'tsk_01h8a1',
    title: 'Configure PostgreSQL Connection Pool',
    description: 'Set up node-postgres connection pool with SSL enabled and max pool size set to 20 connections.',
    status: 'DONE',
    dueDate: '2026-10-01',
    createdAt: '2026-09-28T10:00:00.000Z'
  },
  {
    id: 'tsk_01h8a2',
    title: 'Implement Express Input Validation Middleware',
    description: 'Add Zod schema middleware checks for POST and PUT request bodies.',
    status: 'IN_PROGRESS',
    dueDate: '2026-10-06',
    createdAt: '2026-09-29T14:30:00.000Z'
  },
  {
    id: 'tsk_01h8a3',
    title: 'Write Integration Tests for Auth & Tasks APIs',
    description: 'Ensure Supertest covers CRUD operations, non-existent resource IDs (404), and validation failures (400).',
    status: 'TODO',
    dueDate: '2026-10-10',
    createdAt: '2026-10-01T09:15:00.000Z'
  }
];

class LocalTaskDB {
  static KEY = 'pragmatic_task_manager_db';

  static getTasks() {
    try {
      const data = localStorage.getItem(this.KEY);
      return data ? JSON.parse(data) : INITIAL_TASKS;
    } catch (e) {
      return INITIAL_TASKS;
    }
  }

  static saveTasks(tasks) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save to local storage', e);
    }
  }

  static reset() {
    this.saveTasks(INITIAL_TASKS);
    return INITIAL_TASKS;
  }
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('dueDate');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setTasks(LocalTaskDB.getTasks());
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateTask = (formData) => {
    const newTask = {
      id: `tsk_${Math.random().toString(36).substring(2, 8)}`,
      title: formData.title.trim(),
      description: formData.description ? formData.description.trim() : '',
      status: formData.status || 'TODO',
      dueDate: formData.dueDate,
      createdAt: new Date().toISOString()
    };

    const updated = [newTask, ...tasks];
    setTasks(updated);
    LocalTaskDB.saveTasks(updated);
    showToast('Task created successfully');
    setIsCreateOpen(false);
  };

  const handleUpdateTask = (id, updatedFields) => {
    const updated = tasks.map(t => t.id === id ? { ...t, ...updatedFields } : t);
    setTasks(updated);
    LocalTaskDB.saveTasks(updated);
    showToast('Task updated');
    if (editingTask) setEditingTask(null);
  };

  const handleDeleteTask = (id) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    LocalTaskDB.saveTasks(updated);
    showToast('Task deleted');
    setDeletingTaskId(null);
  };

  const processedTasks = useMemo(() => {
    return tasks
      .filter(t => {
        const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
        const matchesSearch = 
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'dueDate') {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [tasks, statusFilter, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 font-sans p-6 space-y-6">
      <header className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2 font-mono font-bold text-base">
          <Terminal className="w-5 h-5 text-emerald-400" />
          <span>Task Manager REST API</span>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="bg-zinc-100 text-zinc-900 font-bold text-xs px-3 py-1.5 rounded flex items-center gap-1 hover:bg-white"
        >
          <Plus className="w-4 h-4" /> New Task
        </button>
      </header>

      {toast && (
        <div className="fixed bottom-4 right-4 bg-zinc-800 border border-zinc-700 text-xs px-3 py-2 rounded font-mono shadow-lg text-emerald-400">
          {toast}
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4 bg-zinc-950 p-2 border border-zinc-800 rounded text-xs font-mono">
        <div className="flex items-center gap-1">
          {['ALL', 'TODO', 'IN_PROGRESS', 'DONE'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 rounded ${statusFilter === s ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400'}`}
            >
              {s}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200 focus:outline-none"
        />
      </div>

      {/* Task Table */}
      <div className="border border-zinc-800 rounded overflow-hidden bg-zinc-950 text-xs font-mono">
        <table className="w-full text-left">
          <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 uppercase">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Title & Description</th>
              <th className="p-3">Status</th>
              <th className="p-3">Due Date</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {processedTasks.map((t) => (
              <tr key={t.id} className="hover:bg-zinc-900/50">
                <td className="p-3 text-zinc-500">{t.id}</td>
                <td className="p-3">
                  <div className="font-bold text-zinc-200">{t.title}</div>
                  <div className="text-zinc-500 text-[11px]">{t.description}</div>
                </td>
                <td className="p-3">
                  <select
                    value={t.status}
                    onChange={(e) => handleUpdateTask(t.id, { status: e.target.value })}
                    className="bg-zinc-900 border border-zinc-800 text-zinc-200 p-1 rounded font-bold"
                  >
                    <option value="TODO">TODO</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="DONE">DONE</option>
                  </select>
                </td>
                <td className="p-3 text-zinc-400">{t.dueDate}</td>
                <td className="p-3 text-right space-x-2">
                  <button onClick={() => setDeletingTaskId(t.id)} className="text-red-400 hover:text-red-300">
                    <Trash2 className="w-3.5 h-3.5 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
