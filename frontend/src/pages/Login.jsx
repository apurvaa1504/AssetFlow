import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const BASE = import.meta.env.VITE_API_BASE_URL || '';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const body = tab === 'login' ? { email, password } : { name, email, password };

      const res = await fetch(`${BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      if (tab === 'login') {
        login(data.user, data.token);
        navigate('/dashboard');
      } else {
        // After signup, switch to login tab
        setTab('login');
        setError('');
        setEmail(email);
        setPassword('');
        setName('');
        setError('Account created! Please log in.');
      }
    } catch {
      setError('Network error — is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg">
            <span className="font-display text-xl font-bold text-white">A</span>
          </div>
          <h1 className="mt-3 font-display text-2xl font-semibold text-ink">AssetFlow</h1>
          <p className="mt-1 text-sm text-muted">Asset lifecycle management platform</p>
        </div>

        {/* Card */}
        <div className="rounded-card border border-line bg-surface p-8 shadow-card">
          {/* Tabs */}
          <div className="mb-6 flex rounded-md border border-line p-1">
            <button
              type="button"
              onClick={() => { setTab('login'); setError(''); }}
              className={`flex-1 rounded py-1.5 text-sm font-medium transition-colors ${
                tab === 'login' ? 'bg-primary text-white' : 'text-muted hover:text-ink'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setTab('signup'); setError(''); }}
              className={`flex-1 rounded py-1.5 text-sm font-medium transition-colors ${
                tab === 'signup' ? 'bg-primary text-white' : 'text-muted hover:text-ink'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'signup' && (
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-muted">
                  Full Name
                </label>
                <input
                  id="auth-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={tab === 'signup'}
                  placeholder="Apurva Sharma"
                  className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-muted">
                Email
              </label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@company.com"
                className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-muted">
                Password
              </label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {error && (
              <div
                className={`rounded-md px-3 py-2 text-sm ${
                  error.startsWith('Account created')
                    ? 'border border-good/30 bg-good-light text-good'
                    : 'border border-danger/30 bg-danger-light text-danger'
                }`}
              >
                {error}
              </div>
            )}

            <button
              id="auth-submit"
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-60"
            >
              {loading ? 'Please wait…' : tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
