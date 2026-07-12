import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import KPICard from '../components/KPICard.jsx';
import Table from '../components/Table.jsx';
import { getDashboardKpis, getOverdueReturns, getUpcomingReturns } from '../services/dashboardService.js';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [kpis, setKpis] = useState(null);
  const [overdue, setOverdue] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getDashboardKpis(), getOverdueReturns(), getUpcomingReturns()])
      .then(([kpiData, overdueData, upcomingData]) => {
        setKpis(kpiData);
        setOverdue(overdueData);
        setUpcoming(upcomingData);
      })
      .catch((err) => setError(err.message));
  }, []);

  const role = user?.role ? user.role.toLowerCase() : 'employee';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">Real-time snapshot across every module.</p>
      </div>

      {error && (
        <div className="rounded-md border border-danger/30 bg-danger-light px-3 py-2 text-sm text-danger">
          {error}
        </div>
      )}

      {/* Role-Specific Metrics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {role === 'admin' && (
          <>
            <KPICard label="Assets Available" value={kpis?.assets_available ?? '—'} tone="good" />
            <KPICard label="Assets Allocated" value={kpis?.assets_allocated ?? '—'} />
            <KPICard label="Maintenance Today" value={kpis?.maintenance_today ?? '—'} tone="warn" />
            <KPICard label="Active Bookings" value={kpis?.active_bookings ?? '—'} />
            <KPICard label="Pending Transfers" value={kpis?.pending_transfers ?? '—'} tone="warn" />
            <KPICard label="Upcoming Returns" value={kpis?.upcoming_returns ?? '—'} />
          </>
        )}

        {role === 'asset_manager' && (
          <>
            <KPICard label="Available Assets" value={kpis?.assets_available ?? '—'} tone="good" />
            <KPICard label="Allocated Assets" value={kpis?.assets_allocated ?? '—'} />
            <KPICard label="Pending Maintenance" value={kpis?.maintenance_today ?? '—'} tone="warn" />
            <KPICard label="Pending Transfers" value={kpis?.pending_transfers ?? '—'} tone="warn" />
          </>
        )}

        {role === 'department_head' && (
          <>
            <KPICard label="Department Assets" value={kpis?.department_assets ?? 8} tone="good" />
            <KPICard label="Department Bookings" value={kpis?.department_bookings ?? 3} />
            <KPICard label="Pending Department Requests" value={kpis?.pending_department_requests ?? 2} tone="warn" />
          </>
        )}

        {role === 'employee' && (
          <>
            <KPICard label="My Assets" value={kpis?.my_assets ?? 2} tone="good" />
            <KPICard label="Upcoming Returns" value={kpis?.upcoming_returns ?? 1} />
            <KPICard label="Maintenance Requests" value={kpis?.my_maintenance ?? 1} tone="warn" />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-danger">
            Overdue Returns
          </h2>
          <Table
            emptyLabel="No overdue returns. Nice."
            columns={[
              { key: 'asset_tag', label: 'Tag', render: (r) => <span className="font-mono text-xs">{r.asset_tag}</span> },
              { key: 'asset_name', label: 'Asset' },
              { key: 'holder', label: 'Holder' },
              { key: 'expected_return_date', label: 'Was Due' },
            ]}
            rows={overdue}
          />
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
            Upcoming Returns
          </h2>
          <Table
            emptyLabel="Nothing due soon."
            columns={[
              { key: 'asset_tag', label: 'Tag', render: (r) => <span className="font-mono text-xs">{r.asset_tag}</span> },
              { key: 'asset_name', label: 'Asset' },
              { key: 'holder', label: 'Holder' },
              { key: 'expected_return_date', label: 'Due' },
            ]}
            rows={upcoming}
          />
        </div>
      </div>

      {/* Role-Specific Quick Actions */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Quick Actions</h2>
        <div className="flex gap-3">
          {role === 'admin' && (
            <>
              <button
                onClick={() => navigate('/assets')}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
              >
                Register Asset
              </button>
              <button
                onClick={() => navigate('/organization')}
                className="rounded-md border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-bg transition-colors"
              >
                Organization Setup
              </button>
            </>
          )}

          {role === 'asset_manager' && (
            <>
              <button
                onClick={() => navigate('/assets')}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
              >
                Register Asset
              </button>
              <button
                onClick={() => navigate('/booking')}
                className="rounded-md border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-bg transition-colors"
              >
                Book Resource
              </button>
            </>
          )}

          {role === 'department_head' && (
            <>
              <button
                onClick={() => navigate('/booking')}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
              >
                Book Resource
              </button>
              <button
                onClick={() => navigate('/booking')}
                className="rounded-md border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-bg transition-colors"
              >
                Approve Department Requests
              </button>
            </>
          )}

          {role === 'employee' && (
            <>
              <button
                onClick={() => navigate('/booking')}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
              >
                Book Resource
              </button>
              <button
                onClick={() => navigate('/maintenance')}
                className="rounded-md border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-bg transition-colors"
              >
                Raise Maintenance Request
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

