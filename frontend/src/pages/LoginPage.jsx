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
  const { login, register, loginWithGoogle, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      if (typeof loginWithGoogle === 'function') {
        const result = await loginWithGoogle();
        if (result && result.success) {
          toast.success('Successfully logged in!');
          navigate('/');
        } else {
          toast.error(result?.error || 'Login failed');
        }
      }
    } catch {
      toast.error('Authentication error.');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen flex font-sans">
      {/* ── Left panel (Image & Overlay) ── */}
      <div className="hidden lg:flex w-1/2 relative bg-[#1f332c] text-white overflow-hidden flex-col justify-between p-16">
        
        {/* Rich atmospheric background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transform scale-105"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop')" }}
        />
        {/* Darker, richer gradient overlay to make text pop and feel premium */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1f332c] via-[#1f332c]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1f332c]/60 to-transparent" />

        {/* ─── Animated Premium Floating Elements (Scattered to avoid overlap) ─── */}
        <div className="absolute top-[10%] right-[5%] animate-float z-20">
          <div className="px-5 py-3 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl flex items-center gap-3">
            <span className="text-2xl bg-white/20 p-2 rounded-2xl">🥗</span>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-[#d49340]">Daily Feature</p>
              <p className="text-[11px] font-bold text-white/90">Healthy Salad Bowl</p>
            </div>
          </div>
        </div>
        
        <div className="absolute top-[32%] right-[12%] animate-float-delayed z-20">
          <div className="px-5 py-4 bg-[#246A48]/20 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl flex items-center gap-4">
            <span className="text-2xl bg-white/20 p-2 rounded-2xl">🍳</span>
            <div className="pr-2">
              <p className="text-xs font-bold text-white leading-tight">Smart Cooking</p>
              <p className="text-[9px] font-medium text-white/60">AI assistant</p>
            </div>
          </div>
        </div>

        <div className="absolute top-[55%] right-[5%] animate-float z-20">
          <div className="px-5 py-3 bg-[#d49340]/20 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl flex items-center gap-4">
            <span className="text-2xl bg-white/20 p-2 rounded-xl">🍽️</span>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-white/70">Pro Extension</p>
              <p className="text-[11px] font-bold text-white">Personalized Menus</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-[20%] right-[15%] animate-bounce-subtle z-20">
          <div className="px-4 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl flex items-center gap-3">
             <span className="text-xl">✨</span>
             <p className="text-[10px] font-black uppercase tracking-tighter text-white">Zero Waste Planning</p>
          </div>
        </div>

        <div className="relative z-30 flex flex-col justify-between h-full">
          {/* Logo with Glow (Matches Attached Image) */}
          <div className="flex items-center gap-5 group cursor-pointer">
            <div className="w-20 h-20 rounded-[1.75rem] overflow-hidden bg-white shadow-2xl shadow-[#3e6b41]/40 flex items-center justify-center border-2 border-white/30 transform group-hover:scale-105 transition-all">
              <img src="/logo.png" alt="CookGenie Logo" className="w-[200%] max-w-none h-full object-cover object-left" />
            </div>
            <div>
              <span className="text-3xl font-black tracking-tighter text-white block leading-none">CookGenie</span>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-[2px] w-6 bg-[#3e6b41]" />
                <span className="text-[12px] font-bold text-[#4ade80] uppercase tracking-[0.2em]">Your AI Cooking Assistant</span>
              </div>
            </div>
          </div>

          {/* Bold Centered Hero Message */}
          <div className="max-w-xl pr-10">
            <h1 className="text-7xl lg:text-8xl font-black leading-[0.85] mb-8 tracking-tighter text-white">
              MASTER <br/>
              YOUR <br/>
              <span className="text-[#3e6b41]">KITCHEN.</span>
            </h1>
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="px-6 py-2.5 bg-white/10 backdrop-blur-md rounded-full text-[11px] font-black uppercase tracking-widest border border-white/10">Recipes</span>
              <span className="px-6 py-2.5 bg-white/10 backdrop-blur-md rounded-full text-[11px] font-black uppercase tracking-widest border border-white/10">Pantry</span>
              <span className="px-6 py-2.5 bg-[#3e6b41] rounded-full text-[11px] font-black uppercase tracking-widest text-white shadow-lg shadow-[#3e6b41]/20">AI POWERED</span>
            </div>
            <p className="text-white/80 text-xl font-medium leading-relaxed max-w-sm">
              Level up your cooking with our <span className="text-white font-bold">next-gen</span> kitchen companion.
            </p>
          </div>
          
          <div className="flex items-center gap-4 opacity-50">
            <div className="h-[1px] w-16 bg-white" />
            <span className="text-[11px] font-black uppercase tracking-[0.3em]">Established 2024</span>
          </div>
        </div>
      </div>

      {/* ── Right panel (Light Gray Background with White Card) ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-[#f8fafc]">
        {/* Floating White Card */}
        <div className="w-full max-w-[380px] bg-white rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100/50 relative overflow-hidden">
          {/* Subtle decorative accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50" />
          
          <div className="relative z-10">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 mb-4 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Secure Access</span>
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-2">
                {isLogin ? 'Resume Mastery' : 'Start Legacy'}
              </h2>
              <p className="text-gray-400 text-xs font-medium">
                {isLogin ? 'Enter credentials to continue.' : 'Join the culinary intelligence network.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Full Name</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-gray-400">👤</span>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all text-gray-900 placeholder-gray-400 font-medium text-sm"
                      required
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Email Address</label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-gray-400">✉️</span>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all text-gray-900 placeholder-gray-400 font-medium text-sm"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-gray-400">🔒</span>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all text-gray-900 placeholder-gray-400 font-medium text-sm"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-4 rounded-xl text-white font-semibold text-base transition-all duration-300 shadow-xl shadow-[#246A48]/20 flex justify-center items-center gap-2 hover:translate-y-[-2px] hover:shadow-2xl hover:shadow-[#246A48]/30 disabled:opacity-50 bg-gradient-to-r from-[#246A48] to-[#1f332c]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    {isLogin ? 'Authenticating…' : 'Creating…'}
                  </span>
                ) : (
                  <>
                    {isLogin ? 'Access Kitchen' : 'Create Account'}
                    {isLogin && <span className="ml-1 text-[#3e6b41]">🔓</span>}
                  </>
                )}
              </button>
            </form>

            {/* Google SSO */}
            <div className="mt-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-semibold text-sm transition-all hover:bg-gray-50 hover:border-[#246A48]/30 flex items-center justify-center gap-2 shadow-sm"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                Continue with Google
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-8 font-medium">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => setIsLogin(v => !v)}
                className="text-[#246A48] font-bold hover:underline"
              >
                {isLogin ? 'Sign up for free' : 'Sign in'}
              </button>
            </p>

            <div className="mt-8 flex justify-center">
              <div className="inline-flex items-center gap-3 py-2 px-4 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                <span className="text-xs font-semibold text-gray-400">Demo:</span>
                <div className="flex gap-2">
                  <code className="text-[11px] font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">test@test.com</code>
                  <span className="text-gray-300">/</span>
                  <code className="text-[11px] font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">password123</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
