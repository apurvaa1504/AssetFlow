import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/organization', label: 'Organization Setup' },
  { to: '/booking', label: 'Booking' },
  { to: '/maintenance', label: 'Maintenance' },
  { to: '/audit', label: 'Audit' },
  { to: '/reports', label: 'Reports' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

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
              `block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-bg hover:text-ink'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-line px-3 py-4">
        {user && (
          <p className="mb-2 truncate px-3 text-xs text-muted">
            {user.name} · <span className="capitalize">{user.role}</span>
          </p>
        )}
        <button
          id="nav-logout"
          onClick={handleLogout}
          className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-muted hover:bg-danger-light hover:text-danger transition-colors"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}