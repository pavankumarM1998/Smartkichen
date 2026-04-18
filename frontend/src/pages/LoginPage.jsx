import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]         = useState('');
  const [isLogin, setIsLogin]   = useState(true);
  const [loading, setLoading]   = useState(false);
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const result = await login(email, password);
        if (result.success) { toast.success('Welcome back! 👋'); navigate('/'); }
      } else {
        const result = await register(email, password, name);
        if (result.success) { toast.success(`Welcome, ${result.user.name}!`); navigate('/'); }
        else throw new Error(result.error || 'Registration failed');
      }
    } catch (err) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: '🤖', text: 'AI-generated recipes from your ingredients' },
    { icon: '📅', text: 'Smart weekly meal planning' },
    { icon: '📦', text: 'Pantry & expiry tracking' },
    { icon: '🛒', text: 'Auto shopping list generation' },
  ];

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-emerald-600 px-14 py-12 text-white">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <span className="text-3xl">🍳</span>
            <span className="text-2xl font-bold">SmartKitchen AI</span>
          </div>
          <h1 className="text-4xl font-extrabold leading-tight mb-4">
            Your personal<br />AI chef is here.
          </h1>
          <p className="text-emerald-100 text-lg font-medium mb-12">
            Turn your pantry into restaurant-quality meals with the power of AI.
          </p>
          <ul className="space-y-5">
            {features.map((f, i) => (
              <li key={i} className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-xl shrink-0">
                  {f.icon}
                </span>
                <span className="text-emerald-50 font-medium">{f.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-emerald-200 text-sm">© 2025 SmartKitchen AI. All rights reserved.</p>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <span className="text-2xl">🍳</span>
            <span className="text-xl font-bold text-gray-900">SmartKitchen AI</span>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-1">
            {isLogin ? 'Sign in' : 'Create account'}
          </h2>
          <p className="text-gray-500 text-sm font-medium mb-8">
            {isLogin ? 'Welcome back! Enter your details below.' : 'Start your AI cooking journey today.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="label">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="John Doe"
                  className="input-field"
                  required
                />
              </div>
            )}
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base mt-2 disabled:opacity-50"
            >
              {loading
                ? <span className="flex items-center gap-2"><span className="spinner w-4 h-4 inline-block" />{isLogin ? 'Signing in…' : 'Creating account…'}</span>
                : isLogin ? 'Sign in →' : 'Create account →'
              }
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setIsLogin(v => !v)}
              className="text-emerald-600 font-semibold hover:underline"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-400 text-center font-medium">
              Demo credentials &nbsp;·&nbsp; <code className="bg-gray-100 px-1 rounded">test@test.com</code> / <code className="bg-gray-100 px-1 rounded">password123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
