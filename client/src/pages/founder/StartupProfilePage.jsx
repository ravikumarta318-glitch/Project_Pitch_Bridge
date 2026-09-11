import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const DOMAINS = ['FinTech', 'HealthTech', 'EdTech', 'AgriTech', 'CleanTech', 'AI/ML', 'SaaS', 'E-Commerce', 'Logistics', 'Gaming', 'Web3/Crypto', 'SpaceTech', 'FoodTech', 'HRTech', 'LegalTech', 'PropTech', 'TravelTech', 'Cybersecurity', 'BioTech', 'Other'];
const STAGES = [
  { value: 'idea', label: '💡 Idea Stage', desc: 'Just an idea, no product yet' },
  { value: 'mvp', label: '🛠️ MVP', desc: 'Minimum viable product built' },
  { value: 'early-traction', label: '📈 Early Traction', desc: 'First users / revenue' },
  { value: 'growth', label: '🚀 Growth', desc: 'Scaling fast' },
  { value: 'scaling', label: '🌍 Scaling', desc: 'Expanding to new markets' },
];
const INVESTOR_TYPES = ['Angel Investor', 'Venture Capital', 'Corporate VC', 'Family Office', 'Government Grant', 'Crowdfunding', 'Strategic Partner'];

export default function StartupProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ website: '', domain: '', subDomain: '', stage: '', fundingAsk: '', equityOffered: '', valuation: '', pitchDescription: '', preferredInvestorType: [], preferredInvestorLocation: '', existingInvestors: [], isLive: false });
  const [newInvestor, setNewInvestor] = useState({ name: '', amount: '', type: 'Angel Investor' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [matching, setMatching] = useState(false);
  const [matchResult, setMatchResult] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'founder') { navigate('/founder/login'); return; }
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data } = await api.get('/startup/profile');
      if (data) {
        setProfile(data);
        setForm({
          website: data.website || '',
          domain: data.domain || '',
          subDomain: data.subDomain || '',
          stage: data.stage || '',
          fundingAsk: data.fundingAsk || '',
          equityOffered: data.equityOffered || '',
          valuation: data.valuation || '',
          pitchDescription: data.pitchDescription || '',
          preferredInvestorType: data.preferredInvestorType || [],
          preferredInvestorLocation: data.preferredInvestorLocation || '',
          existingInvestors: data.existingInvestors || [],
          isLive: data.isLive || false,
        });
      }
    } catch {}
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleInvestorType = (type) => {
    setForm(f => ({
      ...f,
      preferredInvestorType: f.preferredInvestorType.includes(type)
        ? f.preferredInvestorType.filter(t => t !== type)
        : [...f.preferredInvestorType, type]
    }));
  };

  const addExistingInvestor = () => {
    if (!newInvestor.name) return;
    setForm(f => ({ ...f, existingInvestors: [...f.existingInvestors, { ...newInvestor, amount: Number(newInvestor.amount) }] }));
    setNewInvestor({ name: '', amount: '', type: 'Angel Investor' });
  };

  const removeInvestor = (i) => setForm(f => ({ ...f, existingInvestors: f.existingInvestors.filter((_, idx) => idx !== i) }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const { data } = await api.put('/startup/profile', { ...form, fundingAsk: Number(form.fundingAsk), equityOffered: Number(form.equityOffered), valuation: Number(form.valuation) });
      setProfile(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      // Auto-run matchmaking if live
      if (form.isLive) runMatching();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const runMatching = async () => {
    setMatching(true);
    setMatchResult(null);
    try {
      const { data } = await api.post('/matches/run');
      setMatchResult(data);
    } catch {}
    finally { setMatching(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Navbar */}
      <nav style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>🚀</span>
          <span style={{ fontWeight: 800, fontSize: '18px' }}><span className="gradient-text">PitchBridge</span></span>
          <span className="badge badge-purple">Startup Profile</span>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button onClick={() => navigate('/founder/dashboard')} className="btn btn-outline" style={{ fontSize: '13px', padding: '8px 14px' }}>← Dashboard</button>
          <button onClick={() => { logout(); navigate('/'); }} className="btn btn-outline" style={{ fontSize: '13px', padding: '8px 14px' }}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{ fontSize: '28px' }}>🏢</span>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800 }}>{profile?.companyName}</h1>
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <span className="badge badge-green">✅ Govt Verified</span>
                <span className="badge badge-blue">{profile?.registrationCountry}</span>
                {form.isLive && <span className="badge badge-purple">🟢 Live to Investors</span>}
              </div>
            </div>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
            Complete your startup profile so investors can discover and connect with you.
          </p>
        </motion.div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Domain & Stage */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: '20px' }}>🎯 Domain & Stage</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', display: 'block' }}>Industry Domain *</label>
                <select className="input" value={form.domain} onChange={e => set('domain', e.target.value)} style={{ cursor: 'pointer' }}>
                  <option value="">Select domain</option>
                  {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', display: 'block' }}>Sub-domain / Niche</label>
                <input className="input" placeholder="e.g. B2B Payments, Mental Health" value={form.subDomain} onChange={e => set('subDomain', e.target.value)} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '10px', display: 'block' }}>Startup Stage *</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                {STAGES.map(s => (
                  <div key={s.value} onClick={() => set('stage', s.value)}
                    style={{ padding: '12px', borderRadius: '10px', border: `2px solid ${form.stage === s.value ? 'var(--accent)' : 'var(--border)'}`, cursor: 'pointer', background: form.stage === s.value ? 'rgba(99,102,241,0.1)' : 'var(--bg2)', transition: 'all 0.2s' }}>
                    <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>{s.label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Funding */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: '20px' }}>💰 Funding Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', display: 'block' }}>Funding Ask (USD) *</label>
                <input className="input" type="number" placeholder="e.g. 500000" value={form.fundingAsk} onChange={e => set('fundingAsk', e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', display: 'block' }}>Equity Offered (%)</label>
                <input className="input" type="number" placeholder="e.g. 10" min="0" max="100" value={form.equityOffered} onChange={e => set('equityOffered', e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', display: 'block' }}>Valuation (USD)</label>
                <input className="input" type="number" placeholder="e.g. 5000000" value={form.valuation} onChange={e => set('valuation', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Existing Investors */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: '20px' }}>👥 Existing Investors</h3>
            {form.existingInvestors.length > 0 && (
              <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {form.existingInvestors.map((inv, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg2)', borderRadius: '10px', padding: '12px 16px' }}>
                    <div>
                      <span style={{ fontWeight: 600, fontSize: '14px' }}>{inv.name}</span>
                      <span className="badge badge-blue" style={{ marginLeft: '8px' }}>{inv.type}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {inv.amount > 0 && <span style={{ color: 'var(--green)', fontSize: '13px' }}>${Number(inv.amount).toLocaleString()}</span>}
                      <button type="button" onClick={() => removeInvestor(i)} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', fontSize: '16px' }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 160px auto', gap: '10px', alignItems: 'end' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', display: 'block' }}>Investor Name</label>
                <input className="input" placeholder="e.g. John Smith" value={newInvestor.name} onChange={e => setNewInvestor(n => ({ ...n, name: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', display: 'block' }}>Amount (USD)</label>
                <input className="input" type="number" placeholder="50000" value={newInvestor.amount} onChange={e => setNewInvestor(n => ({ ...n, amount: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', display: 'block' }}>Type</label>
                <select className="input" value={newInvestor.type} onChange={e => setNewInvestor(n => ({ ...n, type: e.target.value }))} style={{ cursor: 'pointer' }}>
                  {INVESTOR_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <button type="button" onClick={addExistingInvestor} className="btn btn-outline" style={{ padding: '11px 16px' }}>+ Add</button>
            </div>
          </div>

          {/* Pitch Description */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: '8px' }}>📝 Pitch Description</h3>
            <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '16px' }}>This is what investors will see. Make it compelling.</p>
            <textarea className="input" rows={6} placeholder="Describe your startup, the problem you solve, your solution, traction, and why you're the right team..." value={form.pitchDescription} onChange={e => set('pitchDescription', e.target.value)} style={{ resize: 'vertical', fontFamily: 'inherit' }} />
          </div>

          {/* Investor Preference */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: '20px' }}>🎯 Preferred Investor Type</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
              {INVESTOR_TYPES.map(type => (
                <button key={type} type="button" onClick={() => toggleInvestorType(type)}
                  style={{ padding: '8px 16px', borderRadius: '20px', border: `1px solid ${form.preferredInvestorType.includes(type) ? 'var(--accent)' : 'var(--border)'}`, background: form.preferredInvestorType.includes(type) ? 'rgba(99,102,241,0.15)' : 'transparent', color: form.preferredInvestorType.includes(type) ? 'var(--accent)' : 'var(--muted)', cursor: 'pointer', fontSize: '13px', fontWeight: 500, transition: 'all 0.2s' }}>
                  {form.preferredInvestorType.includes(type) ? '✓ ' : ''}{type}
                </button>
              ))}
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', display: 'block' }}>Preferred Investor Location</label>
              <input className="input" placeholder="e.g. India, USA, Global" value={form.preferredInvestorLocation} onChange={e => set('preferredInvestorLocation', e.target.value)} />
            </div>
          </div>

          {/* Website */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>🌐 Company Website</h3>
            <input className="input" placeholder="https://yourcompany.com" value={form.website} onChange={e => set('website', e.target.value)} />
          </div>

          {/* Go Live Toggle */}
          <div className="card" style={{ borderColor: form.isLive ? 'var(--green)33' : 'var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: '4px' }}>🟢 Make Profile Live</h3>
                <p style={{ color: 'var(--muted)', fontSize: '13px' }}>When live, investors can discover and contact you.</p>
              </div>
              <div onClick={() => set('isLive', !form.isLive)}
                style={{ width: '52px', height: '28px', borderRadius: '14px', background: form.isLive ? 'var(--green)' : 'var(--border)', cursor: 'pointer', position: 'relative', transition: 'background 0.3s' }}>
                <div style={{ position: 'absolute', top: '4px', left: form.isLive ? '28px' : '4px', width: '20px', height: '20px', borderRadius: '50%', background: 'white', transition: 'left 0.3s' }} />
              </div>
            </div>
          </div>

          {error && <p style={{ color: 'var(--red)', fontSize: '13px' }}>{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={saving} style={{ justifyContent: 'center', padding: '14px' }}>
            {saving ? 'Saving...' : saved ? '✅ Saved!' : '💾 Save Profile'}
          </button>

          {/* AI Matchmaking trigger */}
          <div className="card" style={{ borderColor: '#6366f133', background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(16,185,129,0.08))' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '6px' }}>🤖 AI Investor Matching</h3>
            <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '16px' }}>
              Our AI will analyze your profile and automatically match you with the most relevant investors based on domain, stage, ticket size and idea quality score.
            </p>
            <button type="button" onClick={runMatching} disabled={matching || !form.isLive} className="btn btn-primary"
              style={{ justifyContent: 'center', width: '100%', padding: '14px', background: 'linear-gradient(135deg, #6366f1, #10b981)' }}>
              {matching ? '🤖 AI is matching you with investors...' : '🚀 Run AI Matchmaking Now'}
            </button>
            {!form.isLive && <p style={{ color: 'var(--yellow)', fontSize: '12px', marginTop: '8px', textAlign: 'center' }}>⚠️ Enable "Make Profile Live" above first</p>}

            <AnimatePresence>
              {matchResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ marginTop: '16px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', padding: '16px' }}>
                  <p style={{ color: '#10b981', fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>
                    🎉 Matched with {matchResult.matched} investor{matchResult.matched !== 1 ? 's' : ''}!
                  </p>
                  <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '10px' }}>
                    Investors have been notified and can now view your profile.
                  </p>
                  {matchResult.results?.slice(0, 5).map((r, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ color: 'var(--text)' }}>👤 {r.investor}</span>
                      <span style={{ color: r.score >= 70 ? '#10b981' : '#f59e0b', fontWeight: 700 }}>{r.score}% match</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
      </div>
    </div>
  );
}
