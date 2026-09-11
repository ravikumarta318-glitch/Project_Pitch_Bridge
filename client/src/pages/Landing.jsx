import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'radial-gradient(ellipse at top, #1a1040 0%, #0a0e1a 60%)' }}>
      {/* Logo */}
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🚀</div>
        <h1 style={{ fontSize: '42px', fontWeight: 800, marginBottom: '12px' }}>
          <span className="gradient-text">PitchBridge</span>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '18px', maxWidth: '480px' }}>
          Where visionary founders meet the right investors. Powered by AI-driven idea analysis.
        </p>
      </motion.div>

      {/* Role Cards */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
        style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
        
        <RoleCard
          icon="💡"
          title="I'm a Founder"
          description="Submit your startup idea, get AI-powered analysis, compare with competitors, and connect with investors."
          color="#6366f1"
          onClick={() => navigate('/founder/login')}
        />
        <RoleCard
          icon="💼"
          title="I'm an Investor"
          description="Discover vetted startup ideas, review AI analysis reports, and connect with promising founders."
          color="#10b981"
          onClick={() => navigate('/investor/login')}
        />
      </motion.div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        style={{ marginTop: '48px', color: 'var(--muted)', fontSize: '13px' }}>
        Trusted by 2,400+ founders and 800+ investors worldwide
      </motion.p>
    </div>
  );
}

function RoleCard({ icon, title, description, color, onClick }) {
  return (
    <motion.div whileHover={{ scale: 1.03, y: -4 }} whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        background: 'var(--card)', border: `1px solid ${color}33`, borderRadius: '20px',
        padding: '36px 32px', width: '300px', cursor: 'pointer', textAlign: 'center',
        boxShadow: `0 0 40px ${color}15`, transition: 'box-shadow 0.3s',
      }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>{icon}</div>
      <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px', color }}>{title}</h2>
      <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>{description}</p>
      <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', background: `linear-gradient(135deg, ${color}, ${color}cc)` }}>
        Get Started →
      </button>
    </motion.div>
  );
}
