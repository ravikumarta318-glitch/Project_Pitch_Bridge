import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import IdeaForm from './IdeaForm';
import AnalysisDashboard from './AnalysisDashboard';
import GovtVerifyModal from './GovtVerifyModal';
import api from '../../services/api';

const LANGUAGES = [
  { code: 'en', label: '🇺🇸 EN' },
  { code: 'hi', label: '🇮🇳 HI' },
  { code: 'es', label: '🇪🇸 ES' },
];

export default function FounderDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [analysis, setAnalysis] = useState(null);
  const [myIdeas, setMyIdeas] = useState([]);
  const [activeTab, setActiveTab] = useState('new');
  const [speaking, setSpeaking] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'founder') { navigate('/founder/login'); return; }
    loadMyIdeas();
  }, [user]);

  const loadMyIdeas = async () => {
    try {
      const { data } = await api.get('/ideas/my');
      setMyIdeas(data);
    } catch {}
  };

  const handleResult = (data) => {
    setAnalysis(data.analysis);
    setMyIdeas((prev) => [data, ...prev]);
    setActiveTab('analysis');
  };

  const handleVoiceRead = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = i18n.language === 'hi' ? 'hi-IN' : i18n.language === 'es' ? 'es-ES' : 'en-US';
      utter.rate = 0.9;
      utter.onstart = () => setSpeaking(true);
      utter.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(utter);
    }
  };

  const stopVoice = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Navbar */}
      <nav style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>🚀</span>
          <span style={{ fontWeight: 800, fontSize: '18px' }}>
            <span className="gradient-text">PitchBridge</span>
          </span>
          <span className="badge badge-purple" style={{ marginLeft: '8px' }}>Founder</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Voice indicator */}
          {speaking && (
            <button onClick={stopVoice} className="badge badge-blue" style={{ cursor: 'pointer', border: 'none', animation: 'pulse 1s infinite' }}>
              🔊 Speaking... (click to stop)
            </button>
          )}

          {/* Language switcher */}
          <div style={{ display: 'flex', gap: '4px', background: 'var(--bg2)', borderRadius: '8px', padding: '4px' }}>
            {LANGUAGES.map((lang) => (
              <button key={lang.code} onClick={() => i18n.changeLanguage(lang.code)}
                style={{ padding: '4px 10px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, transition: 'all 0.2s',
                  background: i18n.language === lang.code ? 'var(--accent)' : 'transparent',
                  color: i18n.language === lang.code ? 'white' : 'var(--muted)' }}>
                {lang.label}
              </button>
            ))}
          </div>

          {/* Voice assistant button */}
          <button onClick={() => navigate('/founder/ai-agent')} className="btn btn-outline" style={{ padding: '8px 14px', fontSize: '13px', borderColor: '#6366f1', color: '#6366f1' }}>
            🤖 AI Agent
          </button>

          <button onClick={() => handleVoiceRead(`Welcome ${user?.name}. You are on the founder dashboard. Submit your idea to get AI analysis.`)}
            className="btn btn-outline" style={{ padding: '8px 14px', fontSize: '13px' }}>
            🎙️ Voice Guide
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px' }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>{user?.name}</span>
          </div>

          <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '8px 14px', fontSize: '13px' }}>
            {t('logout')}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '6px' }}>
            {t('welcome')}, {user?.name} 👋
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '15px' }}>
            Submit your startup idea and get a full AI-powered competitive analysis.
          </p>
        </motion.div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', borderBottom: '1px solid var(--border)', paddingBottom: '0' }}>
          {[
            { key: 'new', label: '✨ New Idea' },
            { key: 'analysis', label: '📊 Analysis', disabled: !analysis },
            { key: 'history', label: `📁 My Ideas (${myIdeas.length})` },
          ].map((tab) => (
            <button key={tab.key} onClick={() => !tab.disabled && setActiveTab(tab.key)}
              style={{ padding: '10px 20px', border: 'none', background: 'none', cursor: tab.disabled ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 600,
                color: activeTab === tab.key ? 'var(--accent)' : 'var(--muted)',
                borderBottom: activeTab === tab.key ? '2px solid var(--accent)' : '2px solid transparent',
                opacity: tab.disabled ? 0.4 : 1, transition: 'all 0.2s', marginBottom: '-1px' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'new' && (
            <motion.div key="new" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <IdeaForm onResult={handleResult} />
            </motion.div>
          )}

          {activeTab === 'analysis' && analysis && (
            <motion.div key="analysis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Connect to Investors CTA */}
              <div className="card" style={{ marginBottom: '24px', borderColor: '#10b98133', background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(99,102,241,0.08))' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: '18px', marginBottom: '6px' }}>🤝 Ready to connect with investors?</h3>
                    <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Verify your registered company and create a startup profile to get discovered by investors.</p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button onClick={() => navigate('/founder/ai-agent')} className="btn btn-outline" style={{ whiteSpace: 'nowrap', borderColor: '#6366f1', color: '#6366f1' }}>
                      🤖 AI Agent Report
                    </button>
                    <button onClick={() => setShowVerifyModal(true)} className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', whiteSpace: 'nowrap' }}>
                      🏛️ Verify Company & Connect
                    </button>
                  </div>
                </div>
              </div>
              <AnalysisDashboard analysis={analysis} onVoiceRead={handleVoiceRead} />
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {myIdeas.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
                  <p style={{ fontSize: '40px', marginBottom: '16px' }}>💭</p>
                  <p style={{ color: 'var(--muted)' }}>No ideas submitted yet. Go submit your first idea!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {myIdeas.map((idea) => (
                    <div key={idea._id} className="card" style={{ cursor: 'pointer' }}
                      onClick={() => { setAnalysis(idea.analysis); setActiveTab('analysis'); }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h3 style={{ fontWeight: 700, marginBottom: '6px' }}>{idea.analysis?.ideaTitle || 'Untitled Idea'}</h3>
                          <p style={{ color: 'var(--muted)', fontSize: '13px', maxWidth: '600px' }}>{idea.description.slice(0, 120)}...</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent)' }}>{idea.analysis?.overallRating}/10</div>
                          <div style={{ color: 'var(--muted)', fontSize: '12px' }}>{new Date(idea.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }`}</style>

      {/* Govt Verify Modal */}
      {showVerifyModal && (
        <GovtVerifyModal
          onVerified={() => { setShowVerifyModal(false); navigate('/founder/startup-profile'); }}
          onClose={() => setShowVerifyModal(false)}
        />
      )}
    </div>
  );
}
