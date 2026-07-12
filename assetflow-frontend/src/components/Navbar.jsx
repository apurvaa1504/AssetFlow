import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/booking', label: 'Booking' },
  { to: '/maintenance', label: 'Maintenance' },
  { to: '/audit', label: 'Audit' },
  { to: '/reports', label: 'Reports' },
];

export default function Navbar() {
  return (
    <aside className="flex h-screen w-56 flex-col border-r border-line bg-surface">
      <div className="flex items-center gap-2 border-b border-line px-5 py-5">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary font-display text-sm font-semibold text-white">
          A
        </span>
        <span className="font-display text-base font-semibold text-ink">AssetFlow</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-bg hover:text-ink'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
