import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

export default function IdeaForm({ onResult }) {
  const { t } = useTranslation();
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idea.trim()) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/ideas', { description: idea });
      onResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ marginBottom: '32px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>
        ✨ {t('submitIdea')}
      </h2>
      <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '20px' }}>
        Describe your startup idea and our AI will research competitors, analyze the market, and rate your concept.
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          className="input"
          placeholder={t('ideaPlaceholder')}
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          rows={5}
          style={{ resize: 'vertical', marginBottom: '16px', fontFamily: 'inherit' }}
        />
        {error && <p style={{ color: 'var(--red)', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button type="submit" className="btn btn-primary" disabled={loading || !idea.trim()}>
            {loading ? (
              <>
                <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚙️</span>
                {t('analyzing')}
              </>
            ) : (
              <>{t('analyze')} 🔍</>
            )}
          </button>
          {loading && (
            <p style={{ color: 'var(--muted)', fontSize: '13px' }}>
              Researching competitors and analyzing market data...
            </p>
          )}
        </div>
      </form>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </motion.div>
  );
}
