import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

const COUNTRIES = ['India', 'United States', 'United Kingdom', 'Singapore', 'UAE', 'Canada', 'Australia', 'Germany', 'France', 'Other'];
const ID_TYPES = { India: ['CIN', 'PAN', 'GSTIN'], 'United States': ['EIN', 'SSN'], 'United Kingdom': ['UTR', 'CRN'], Singapore: ['UEN'], UAE: ['TRN'], Other: ['National ID', 'Business License'] };

export default function GovtVerifyModal({ onVerified, onClose }) {
  const [form, setForm] = useState({ companyName: '', registrationNumber: '', registrationCountry: 'India', registrationDate: '', directorName: '', govtIdType: 'CIN', govtIdNumber: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1=form, 2=verifying, 3=success

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleCountryChange = (country) => {
    const types = ID_TYPES[country] || ID_TYPES['Other'];
    set('registrationCountry', country);
    set('govtIdType', types[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setStep(2);
    try {
      await new Promise(r => setTimeout(r, 2000)); // simulate verification delay
      const { data } = await api.post('/startup/verify', form);
      setStep(3);
      setTimeout(() => onVerified(data.profile), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const idTypes = ID_TYPES[form.registrationCountry] || ID_TYPES['Other'];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>

        <AnimatePresence mode="wait">
          {step === 2 && (
            <motion.div key="verifying" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', animation: 'spin 2s linear infinite', display: 'inline-block' }}>⚙️</div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Verifying your company...</h3>
              <p style={{ color: 'var(--muted)' }}>Checking government registration records</p>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
              <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--green)', marginBottom: '8px' }}>Company Verified!</h3>
              <p style={{ color: 'var(--muted)' }}>Redirecting to your startup profile...</p>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>🏛️ Company Verification</h2>
                  <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Enter your government-registered company details to connect with investors.</p>
                </div>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '20px' }}>✕</button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', display: 'block' }}>Company Name *</label>
                  <input className="input" placeholder="e.g. Acme Technologies Pvt Ltd" value={form.companyName} onChange={e => set('companyName', e.target.value)} required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', display: 'block' }}>Registration Country *</label>
                    <select className="input" value={form.registrationCountry} onChange={e => handleCountryChange(e.target.value)} style={{ cursor: 'pointer' }}>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', display: 'block' }}>Registration Date</label>
                    <input className="input" type="date" value={form.registrationDate} onChange={e => set('registrationDate', e.target.value)} />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', display: 'block' }}>Company Registration Number *</label>
                  <input className="input" placeholder="e.g. U72900MH2020PTC123456" value={form.registrationNumber} onChange={e => set('registrationNumber', e.target.value)} required />
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', display: 'block' }}>Director / Founder Name *</label>
                  <input className="input" placeholder="As per government records" value={form.directorName} onChange={e => set('directorName', e.target.value)} required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', display: 'block' }}>ID Type *</label>
                    <select className="input" value={form.govtIdType} onChange={e => set('govtIdType', e.target.value)} style={{ cursor: 'pointer' }}>
                      {idTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', display: 'block' }}>{form.govtIdType} Number *</label>
                    <input className="input" placeholder={`Enter your ${form.govtIdType}`} value={form.govtIdNumber} onChange={e => set('govtIdNumber', e.target.value)} required />
                  </div>
                </div>

                {error && <p style={{ color: 'var(--red)', fontSize: '13px' }}>{error}</p>}

                <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '10px', padding: '12px', fontSize: '12px', color: 'var(--muted)' }}>
                  🔒 Your information is encrypted and only used for verification purposes. We do not share your govt details with investors.
                </div>

                <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }}>
                  Verify & Continue →
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
        <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      </motion.div>
    </div>
  );
}
