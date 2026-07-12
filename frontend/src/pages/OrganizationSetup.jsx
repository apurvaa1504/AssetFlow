import { useEffect, useState } from 'react';
import Table from '../components/Table.jsx';
import {
  getDepartments,
  createDepartment,
  getCategories,
  createCategory,
  getUsers,
  promoteUser,
} from '../services/orgService.js';

const ROLES = ['employee', 'department_head', 'asset_manager', 'admin'];

export default function OrganizationSetup() {
  const [tab, setTab] = useState('departments'); // departments | categories | employees
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [newDeptName, setNewDeptName] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  function loadAll() {
    setLoading(true);
    setError('');
    Promise.all([getDepartments(), getCategories(), getUsers()])
      .then(([deptData, catData, userData]) => {
        setDepartments(deptData);
        setCategories(catData);
        setUsers(userData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleAddDepartment(e) {
    e.preventDefault();
    if (!newDeptName.trim()) return;
    try {
      await createDepartment({ name: newDeptName.trim() });
      setNewDeptName('');
      loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleAddCategory(e) {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      await createCategory({ name: newCatName.trim(), description: newCatDesc.trim() || undefined });
      setNewCatName('');
      setNewCatDesc('');
      loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRoleChange(userId, newRole) {
    try {
      await promoteUser(userId, newRole);
      loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  const TABS = [
    { key: 'departments', label: 'Departments' },
    { key: 'categories', label: 'Categories' },
    { key: 'employees', label: 'Employee Directory' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Organization Setup</h1>
        <p className="mt-1 text-sm text-muted">Manage departments, categories, and employee roles.</p>
      </div>

      {error && (
        <div className="rounded-md border border-danger/30 bg-danger-light px-3 py-2 text-sm text-danger">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex rounded-md border border-line p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`rounded px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === t.key ? 'bg-primary text-white' : 'text-muted hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : (
        <>
          {/* --- Departments Tab --- */}
          {tab === 'departments' && (
            <div className="space-y-4">
              <form onSubmit={handleAddDepartment} className="flex gap-3 rounded-card border border-line bg-surface p-4 shadow-card">
                <input
                  type="text"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  placeholder="New department name"
                  className="flex-1 rounded-md border border-line px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
                >
                  Add Department
                </button>
              </form>

              <Table
                emptyLabel="No departments yet."
                columns={[
                  { key: 'name', label: 'Name' },
                  { key: 'status', label: 'Status', render: (r) => <span className="capitalize">{r.status}</span> },
                  { key: 'createdAt', label: 'Created', render: (r) => new Date(r.createdAt).toLocaleDateString() },
                ]}
                rows={departments}
              />
            </div>
          )}

          {/* --- Categories Tab --- */}
          {tab === 'categories' && (
            <div className="space-y-4">
              <form onSubmit={handleAddCategory} className="flex gap-3 rounded-card border border-line bg-surface p-4 shadow-card">
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Category name"
                  className="flex-1 rounded-md border border-line px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <input
                  type="text"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Description (optional)"
                  className="flex-1 rounded-md border border-line px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
                >
                  Add Category
                </button>
              </form>

              <Table
                emptyLabel="No categories yet."
                columns={[
                  { key: 'name', label: 'Name' },
                  { key: 'description', label: 'Description', render: (r) => r.description || '—' },
                  { key: 'createdAt', label: 'Created', render: (r) => new Date(r.createdAt).toLocaleDateString() },
                ]}
                rows={categories}
              />
            </div>
          )}

          {/* --- Employee Directory Tab --- */}
          {tab === 'employees' && (
            <Table
              emptyLabel="No employees yet."
              columns={[
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                {
                  key: 'role',
                  label: 'Role',
                  render: (r) => (
                    <select
                      value={r.role}
                      onChange={(e) => handleRoleChange(r.id, e.target.value)}
                      className="rounded-md border border-line px-2 py-1 text-sm capitalize focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {ROLES.map((role) => (
                        <option key={role} value={role} className="capitalize">
                          {role.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  ),
                },
                { key: 'status', label: 'Status', render: (r) => <span className="capitalize">{r.status}</span> },
              ]}
              rows={users}
            />
          )}
        </>
      )}
    </div>
  );
}