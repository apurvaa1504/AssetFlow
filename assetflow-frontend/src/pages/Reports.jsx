import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  dummyMaintenanceFrequency,
  dummyBookingHeatmap,
  dummyDeptAllocationSummary,
} from '../data/dummyData.js';

function ChartCard({ title, children }) {
  return (
    <div className="rounded-card border border-line bg-surface p-5 shadow-card">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">{title}</h2>
      <div className="h-64">{children}</div>
    </div>
  );
}

export default function Reports() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">Reports & Analytics</h1>
        <p className="mt-1 text-sm text-muted">
          Charts are wired to dummy data now — swap the arrays in reportsService.js for live queries later.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Maintenance Frequency by Category">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dummyMaintenanceFrequency}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" />
              <XAxis dataKey="category" tick={{ fontSize: 12, fill: '#5B6478' }} />
              <YAxis tick={{ fontSize: 12, fill: '#5B6478' }} />
              <Tooltip />
              <Bar dataKey="count" fill="#2E4374" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Booking Heatmap (Peak Usage Windows)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dummyBookingHeatmap}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" />
              <XAxis dataKey="hour" tick={{ fontSize: 12, fill: '#5B6478' }} />
              <YAxis tick={{ fontSize: 12, fill: '#5B6478' }} />
              <Tooltip />
              <Bar dataKey="bookings" fill="#0F9D8C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Department-wise Allocation Summary">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dummyDeptAllocationSummary} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#5B6478' }} />
              <YAxis dataKey="department" type="category" width={90} tick={{ fontSize: 12, fill: '#5B6478' }} />
              <Tooltip />
              <Bar dataKey="allocated" fill="#7B5CC7" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="rounded-card border border-line bg-surface p-5 shadow-card">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">Export</h2>
          <p className="text-sm text-muted">
            Utilization trends, assets due for maintenance/retirement, and exportable reports go here once
            Member 2's asset lifecycle data is live.
          </p>
          <button className="mt-4 rounded-md border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-bg">
            Export as CSV
          </button>
        </div>
      </div>
    </div>
  );
}
