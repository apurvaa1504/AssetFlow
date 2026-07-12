import { useEffect, useState } from 'react';
import Table from '../components/Table.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { getUsers } from '../services/orgService.js';

export default function EmployeeDirectory() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getUsers()
      .then(setEmployees)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);


  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">Employee Directory</h1>
        <p className="mt-1 text-sm text-muted">Manage system users, department assignments, and access levels.</p>
      </div>

      {error && (
        <div className="rounded-md border border-danger/30 bg-danger-light px-3 py-2 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="rounded-card border border-line bg-surface p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Active Staff</h2>
          <button className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-dark">
            + Add Employee
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-muted">Loading employees…</p>
        ) : (
          <Table
            emptyLabel="No employees found."
            columns={[
              { key: 'name', label: 'Name', render: (r) => <span className="font-medium text-ink">{r.name}</span> },
              { key: 'email', label: 'Email' },
              { key: 'role', label: 'Role', render: (r) => <span className="font-mono text-xs uppercase text-primary bg-primary/5 px-2 py-0.5 rounded">{r.role}</span> },
              { key: 'department', label: 'Department', render: (r) => r.department || '—' },
              { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
            ]}
            rows={employees}
          />
        )}
      </div>
    </div>
  );
}

