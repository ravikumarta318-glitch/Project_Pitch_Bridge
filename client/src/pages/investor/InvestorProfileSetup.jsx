import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const DOMAINS = ['FinTech','HealthTech','EdTech','AgriTech','CleanTech','AI/ML','SaaS','E-Commerce','Logistics','Gaming','Web3/Crypto','FoodTech','HRTech','LegalTech','PropTech','SpaceTech','Cybersecurity','BioTech','Other'];
const STAGES = ['idea','mvp','early-traction','growth','scaling'];
const OUTCOMES = ['active','exited','failed','ipo'];

export default function InvestorProfileSetup() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    currentCompany: '', designation: '', bio: '', linkedIn: '',
    interestedDomains: [], preferredStages: [],
    preferredTicketSize: { min: '', max: '' },
    pastInvestments: [], recentInvestments: [],
  });
  const [newPast, setNewPast] = useState({ companyName: '', domain: 'FinTech', amount: '', year: '', outcome: 'active', returnMultiple: '' });
  const [newRecent, setNewRecent] = useState({ companyName: '', domain: 'FinTech', amount: '', year: new Date().getFullYear(), stage: 'mvp' });

  useEffect(() => {
    if (!user || user.role !== 'investor') { navigate('/investor/login'); return; }
    api.get('/investor/profile').then(({ data }) => {
      if (data) {
        setForm({
          currentCompany: data.currentCompany || '',
          designation: data.designation || '',
          bio: data.bio || '',
          linkedIn: data.linkedIn || '',
          interestedDomains: data.interestedDomains || [],
          preferredStages: data.preferredStages || [],
          preferredTicketSize: data.preferredTicketSize || { min: '', max: '' },
          pastInvestments: data.pastInvestments || [],
          recentInvestments: data.recentInvestments || [],
        });
      }
    }).catch(() => {});
  }, [user]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleDomain = (d) => set('interestedDomains', form.interestedDomains.includes(d) ? form.interestedDomains.filter(x => x !== d) : [...form.interestedDomains, d]);
  const toggleStage = (s) => set('preferredStages', form.preferredStages.includes(s) ? form.preferredStages.filter(x => x !== s) : [...form.preferredStages, s]);

  const addPast = () => {
    if (!newPast.companyName) return;
    set('pastInvestments', [...form.pastInvestments, { ...newPast, amount: Number(newPast.amount), year: Number(newPast.year), returnMultiple: Number(newPast.returnMultiple) }]);
    setNewPast({ companyName: '', domain: 'FinTech', amount: '', year: '', outcome: 'active', returnMultiple: '' });
  };

  const addRecent = () => {
    if (!newRecent.companyName) return;
    set('recentInvestments', [...form.recentInvestments, { ...newRecent, amount: Number(newRecent.amount), year: Number(newRecent.year) }]);
    setNewRecent({ companyName: '', domain: 'FinTech', amount: '', year: new Date().getFullYear(), stage: 'mvp' });
  };

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      await api.put('/investor/profile', { ...form, preferredTicketSize: { min: Number(form.preferredTicketSize.min), max: Number(form.preferredTicketSize.max) } });
      navigate('/investor/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  const steps = ['Basic Info', 'Interests', 'Past Investments', 'Recent Investments'];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>🚀</span>
          <span style={{ fontWeight: 800, fontSize: '18px' }}><span className="gradient-text">PitchBridge</span></span>
          <span className="badge badge-green">Investor Setup</span>
        </div>
        <button onClick={() => { logout(); navigate('/'); }} className="btn btn-outline" style={{ fontSize: '13px', padding: '8px 14px' }}>Logout</button>
      </nav>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 24px' }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>💼 Investor Profile</h1>
          <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Complete your profile to get AI-matched with the best startups.</p>
        </motion.div>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          {steps.map((s, i) => (
            <div key={i} onClick={() => setStep(i + 1)} style={{ flex: 1, textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ height: '4px', borderRadius: '2px', background: step > i ? 'var(--accent)' : 'var(--border)', marginBottom: '6px', transition: 'background 0.3s' }} />
              <span style={{ fontSize: '11px', color: step > i ? 'var(--accent)' : 'var(--muted)', fontWeight: step === i + 1 ? 700 : 400 }}>{s}</span>
            </div>
          ))}
        </div>

        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '4px' }}>👤 Basic Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', display: 'block' }}>Current Company</label>
                  <input className="input" placeholder="e.g. Sequoia Capital" value={form.currentCompany} onChange={e => set('currentCompany', e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', display: 'block' }}>Designation</label>
                  <input className="input" placeholder="e.g. Partner, Angel Investor" value={form.designation} onChange={e => set('designation', e.target.value)} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', display: 'block' }}>LinkedIn URL</label>
                <input className="input" placeholder="https://linkedin.com/in/yourprofile" value={form.linkedIn} onChange={e => set('linkedIn', e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', display: 'block' }}>Bio</label>
                <textarea className="input" rows={3} placeholder="Tell founders about your investment thesis..." value={form.bio} onChange={e => set('bio', e.target.value)} style={{ resize: 'vertical', fontFamily: 'inherit' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', display: 'block' }}>Min Ticket Size (USD)</label>
                  <input className="input" type="number" placeholder="e.g. 25000" value={form.preferredTicketSize.min} onChange={e => set('preferredTicketSize', { ...form.preferredTicketSize, min: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', display: 'block' }}>Max Ticket Size (USD)</label>
                  <input className="input" type="number" placeholder="e.g. 500000" value={form.preferredTicketSize.max} onChange={e => set('preferredTicketSize', { ...form.preferredTicketSize, max: e.target.value })} />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Interests */}
          {step === 2 && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: '14px' }}>🎯 Interested Domains</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {DOMAINS.map(d => (
                    <button key={d} type="button" onClick={() => toggleDomain(d)}
                      style={{ padding: '7px 14px', borderRadius: '20px', border: `1px solid ${form.interestedDomains.includes(d) ? 'var(--accent)' : 'var(--border)'}`, background: form.interestedDomains.includes(d) ? 'rgba(99,102,241,0.15)' : 'transparent', color: form.interestedDomains.includes(d) ? 'var(--accent)' : 'var(--muted)', cursor: 'pointer', fontSize: '13px', fontWeight: 500, transition: 'all 0.2s' }}>
                      {form.interestedDomains.includes(d) ? '✓ ' : ''}{d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: '14px' }}>📈 Preferred Startup Stages</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {STAGES.map(s => (
                    <button key={s} type="button" onClick={() => toggleStage(s)}
                      style={{ padding: '8px 18px', borderRadius: '20px', border: `1px solid ${form.preferredStages.includes(s) ? '#10b981' : 'var(--border)'}`, background: form.preferredStages.includes(s) ? 'rgba(16,185,129,0.15)' : 'transparent', color: form.preferredStages.includes(s) ? '#10b981' : 'var(--muted)', cursor: 'pointer', fontSize: '13px', fontWeight: 600, transition: 'all 0.2s', textTransform: 'capitalize' }}>
                      {form.preferredStages.includes(s) ? '✓ ' : ''}{s.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Past Investments */}
          {step === 3 && (
            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: '20px' }}>📊 Past Investments</h3>
              {form.pastInvestments.length > 0 && (
                <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {form.pastInvestments.map((inv, i) => (
                    <div key={i} style={{ background: 'var(--bg2)', borderRadius: '10px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontWeight: 600 }}>{inv.companyName}</span>
                        <span className="badge badge-blue" style={{ marginLeft: '8px' }}>{inv.domain}</span>
                        <span className={`badge ${inv.outcome === 'exited' || inv.outcome === 'ipo' ? 'badge-green' : inv.outcome === 'failed' ? 'badge-red' : 'badge-yellow'}`} style={{ marginLeft: '6px' }}>{inv.outcome}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ color: 'var(--green)', fontSize: '13px' }}>${Number(inv.amount).toLocaleString()}</span>
                        {inv.returnMultiple > 0 && <span style={{ color: 'var(--accent)', fontSize: '12px' }}>{inv.returnMultiple}x return</span>}
                        <button type="button" onClick={() => set('pastInvestments', form.pastInvestments.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer' }}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div><label style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', display: 'block' }}>Company Name</label><input className="input" placeholder="e.g. Flipkart" value={newPast.companyName} onChange={e => setNewPast(n => ({ ...n, companyName: e.target.value }))} /></div>
                <div><label style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', display: 'block' }}>Domain</label><select className="input" value={newPast.domain} onChange={e => setNewPast(n => ({ ...n, domain: e.target.value }))} style={{ cursor: 'pointer' }}>{DOMAINS.map(d => <option key={d}>{d}</option>)}</select></div>
                <div><label style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', display: 'block' }}>Amount (USD)</label><input className="input" type="number" placeholder="100000" value={newPast.amount} onChange={e => setNewPast(n => ({ ...n, amount: e.target.value }))} /></div>
                <div><label style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', display: 'block' }}>Year</label><input className="input" type="number" placeholder="2020" value={newPast.year} onChange={e => setNewPast(n => ({ ...n, year: e.target.value }))} /></div>
                <div><label style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', display: 'block' }}>Outcome</label><select className="input" value={newPast.outcome} onChange={e => setNewPast(n => ({ ...n, outcome: e.target.value }))} style={{ cursor: 'pointer' }}>{OUTCOMES.map(o => <option key={o}>{o}</option>)}</select></div>
                <div><label style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', display: 'block' }}>Return Multiple</label><input className="input" type="number" placeholder="e.g. 5 (for 5x)" value={newPast.returnMultiple} onChange={e => setNewPast(n => ({ ...n, returnMultiple: e.target.value }))} /></div>
              </div>
              <button type="button" onClick={addPast} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>+ Add Past Investment</button>
            </div>
          )}

          {/* Step 4: Recent Investments */}
          {step === 4 && (
            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: '20px' }}>🔥 Recent Investments</h3>
              {form.recentInvestments.length > 0 && (
                <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {form.recentInvestments.map((inv, i) => (
                    <div key={i} style={{ background: 'var(--bg2)', borderRadius: '10px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div><span style={{ fontWeight: 600 }}>{inv.companyName}</span><span className="badge badge-blue" style={{ marginLeft: '8px' }}>{inv.domain}</span><span className="badge badge-purple" style={{ marginLeft: '6px' }}>{inv.stage}</span></div>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ color: 'var(--green)', fontSize: '13px' }}>${Number(inv.amount).toLocaleString()}</span>
                        <button type="button" onClick={() => set('recentInvestments', form.recentInvestments.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer' }}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div><label style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', display: 'block' }}>Company Name</label><input className="input" placeholder="e.g. Razorpay" value={newRecent.companyName} onChange={e => setNewRecent(n => ({ ...n, companyName: e.target.value }))} /></div>
                <div><label style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', display: 'block' }}>Domain</label><select className="input" value={newRecent.domain} onChange={e => setNewRecent(n => ({ ...n, domain: e.target.value }))} style={{ cursor: 'pointer' }}>{DOMAINS.map(d => <option key={d}>{d}</option>)}</select></div>
                <div><label style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', display: 'block' }}>Amount (USD)</label><input className="input" type="number" placeholder="50000" value={newRecent.amount} onChange={e => setNewRecent(n => ({ ...n, amount: e.target.value }))} /></div>
                <div><label style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', display: 'block' }}>Stage at Investment</label><select className="input" value={newRecent.stage} onChange={e => setNewRecent(n => ({ ...n, stage: e.target.value }))} style={{ cursor: 'pointer' }}>{STAGES.map(s => <option key={s}>{s}</option>)}</select></div>
              </div>
              <button type="button" onClick={addRecent} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>+ Add Recent Investment</button>
            </div>
          )}
        </motion.div>

        {error && <p style={{ color: 'var(--red)', fontSize: '13px', marginTop: '16px' }}>{error}</p>}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
          <button onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/investor/dashboard')} className="btn btn-outline">
            {step === 1 ? 'Skip for now' : '← Back'}
          </button>
          {step < 4
            ? <button onClick={() => setStep(s => s + 1)} className="btn btn-primary">Next →</button>
            : <button onClick={handleSave} className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : '✅ Save & Go to Dashboard'}</button>
          }
        </div>
      </div>
    </div>
  );
}
