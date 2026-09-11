import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const { role } = useParams();
  const navigate = useNavigate();
  const { login, register, googleLogin } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isFounder = role === 'founder';
  const color = isFounder ? '#6366f1' : '#10b981';
  const icon = isFounder ? '💡' : '💼';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let user;
      if (isLogin) {
        user = await login(form.email, form.password, role);
        navigate(`/${user.role}/dashboard`);
      } else {
        user = await register(form.name, form.email, form.password, role);
        // New investors go to profile setup first
        if (user.role === 'investor' && user.isNew) {
          navigate('/investor/profile-setup');
        } else {
          navigate(`/${user.role}/dashboard`);
        }
      }
    } catch (err) {
      if (!err.response) {
        setError('Cannot reach server. Make sure backend is running on port 5000.');
      } else {
        setError(err.response?.data?.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const user = await googleLogin(role);
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      setError('Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'radial-gradient(ellipse at top, #1a1040 0%, #0a0e1a 60%)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: '420px' }}>

        {/* Back */}
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', marginBottom: '24px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          ← Back to home
        </button>

        <div className="card" style={{ borderColor: `${color}33` }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>{icon}</div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '6px' }}>
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
              {isFounder ? 'Founder Portal' : 'Investor Portal'}
            </p>
          </div>

          {/* Toggle */}
          <div style={{ display: 'flex', background: 'var(--bg2)', borderRadius: '10px', padding: '4px', marginBottom: '24px' }}>
            {['Login', 'Register'].map((t) => (
              <button key={t} onClick={() => setIsLogin(t === 'Login')}
                style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, transition: 'all 0.2s',
                  background: (t === 'Login') === isLogin ? color : 'transparent',
                  color: (t === 'Login') === isLogin ? 'white' : 'var(--muted)' }}>
                {t}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <AnimatePresence>
              {!isLogin && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <input className="input" placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </motion.div>
              )}
            </AnimatePresence>
            <input className="input" type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />

            {error && <p style={{ color: 'var(--red)', fontSize: '13px', textAlign: 'center' }}>{error}</p>}

            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ justifyContent: 'center', background: `linear-gradient(135deg, ${color}, ${color}cc)`, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <span style={{ color: 'var(--muted)', fontSize: '12px' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>

          {/* Google */}
          <button onClick={handleGoogle} disabled={loading} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google (Mock)
          </button>
        </div>
      </motion.div>
    </div>
  );
}
