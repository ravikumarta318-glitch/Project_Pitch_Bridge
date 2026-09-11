import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from 'recharts';

export default function InvestorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('matches');
  const [matches, setMatches] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [workflowResult, setWorkflowResult] = useState(null);
  const [workflowLoading, setWorkflowLoading] = useState(false);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [compareResult, setCompareResult] = useState(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareA, setCompareA] = useState(null);
  const [compareB, setCompareB] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'investor') { navigate('/investor/login'); return; }
    Promise.all([
      api.get('/investor/profile'),
      api.get('/matches/my'),
      api.get('/matches/unread-count'),
    ]).then(([p, m, u]) => {
      setProfile(p.data);
      setMatches(m.data);
      setUnreadCount(u.data.count);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  const handleWorkflowCompare = async (startup) => {
    setSelectedStartup(startup);
    setWorkflowLoading(true);
    setWorkflowResult(null);
    setActiveTab('workflow');
    try {
      const { data } = await api.post('/investor/workflow-compare', startup);
      setWorkflowResult(data);
    } catch {}
    finally { setWorkflowLoading(false); }
  };

  const handleCompareTwo = async () => {
    if (!compareA || !compareB) return;
    setCompareLoading(true);
    setCompareResult(null);
    try {
      const { data } = await api.post('/investor/compare-two', { startupA: compareA, startupB: compareB });
      setCompareResult(data);
    } catch {}
    finally { setCompareLoading(false); }
  };

  const tabs = [
    { key: 'matches', label: `🎯 AI Matches${unreadCount > 0 ? ` (${unreadCount} new)` : ''}` },
    { key: 'workflow', label: '📊 Workflow Analysis' },
    { key: 'compare', label: '⚔️ Compare & Decide' },
    { key: 'portfolio', label: '💼 My Portfolio' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Navbar */}
      <nav style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>🚀</span>
          <span style={{ fontWeight: 800, fontSize: '18px' }}><span className="gradient-text">PitchBridge</span></span>
          <span className="badge badge-green">Investor</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => navigate('/investor/profile-setup')} className="btn btn-outline" style={{ fontSize: '13px', padding: '8px 14px' }}>⚙️ My Profile</button>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px' }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <span style={{ fontSize: '14px', fontWeight: 500 }}>{user?.name}</span>
          <button onClick={() => { logout(); navigate('/'); }} className="btn btn-outline" style={{ fontSize: '13px', padding: '8px 14px' }}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '6px' }}>Welcome back, {user?.name} 👋</h1>
          <p style={{ color: 'var(--muted)', fontSize: '15px' }}>AI-matched startups, workflow comparisons, and smart investment suggestions.</p>
        </motion.div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          {[
            { label: 'Matched Startups', value: matches.length, icon: '🎯', color: '#6366f1' },
            { label: 'Domains Tracked', value: profile?.interestedDomains?.length || 0, icon: '🏷️', color: '#10b981' },
            { label: 'Past Investments', value: profile?.pastInvestments?.length || 0, icon: '📊', color: '#f59e0b' },
            { label: 'Recent Deals', value: profile?.recentInvestments?.length || 0, icon: '🔥', color: '#3b82f6' },
          ].map((s, i) => (
            <motion.div key={i} whileHover={{ scale: 1.02 }} className="card" style={{ textAlign: 'center', borderColor: `${s.color}33` }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ color: 'var(--muted)', fontSize: '12px' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '28px', borderBottom: '1px solid var(--border)', paddingBottom: '0' }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{ padding: '10px 18px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: activeTab === tab.key ? 'var(--accent)' : 'var(--muted)', borderBottom: activeTab === tab.key ? '2px solid var(--accent)' : '2px solid transparent', transition: 'all 0.2s', marginBottom: '-1px' }}>
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Matched Startups */}
          {activeTab === 'matches' && (
            <motion.div key="matches" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px', animation: 'spin 2s linear infinite', display: 'inline-block' }}>🤖</div>
                  <p>AI is loading your matches...</p>
                </div>
              ) : matches.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
                  <p style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</p>
                  <h3 style={{ fontWeight: 700, marginBottom: '8px' }}>No matches yet</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Founders need to go live and run AI matchmaking. Check back soon.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {matches.map((m, i) => {
                    const s = m.startup;
                    if (!s) return null;
                    return (
                      <motion.div key={i} whileHover={{ scale: 1.005 }} className="card"
                        style={{ borderColor: m.matchScore >= 80 ? '#10b98133' : m.status === 'new' ? '#6366f133' : 'var(--border)' }}
                        onClick={() => { if (m.status === 'new') { api.put(`/matches/${m._id}/view`); setUnreadCount(c => Math.max(0, c - 1)); setMatches(prev => prev.map(x => x._id === m._id ? { ...x, status: 'viewed' } : x)); } }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                              {m.status === 'new' && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1', display: 'inline-block', flexShrink: 0 }} />}
                              <h3 style={{ fontWeight: 700, fontSize: '18px' }}>{s.companyName}</h3>
                              <span className="badge badge-blue">{s.domain}</span>
                              <span className="badge badge-purple">{s.stage?.replace('-', ' ')}</span>
                              {m.matchScore >= 85 && <span className="badge badge-green">🔥 Top Match</span>}
                              {m.status === 'interested' && <span className="badge badge-green">✅ Interested</span>}
                              {m.status === 'passed' && <span className="badge badge-red">❌ Passed</span>}
                            </div>
                            <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: '1.6', marginBottom: '12px', maxWidth: '600px' }}>{s.pitchDescription}</p>
                            <div style={{ display: 'flex', gap: '16px', fontSize: '13px', flexWrap: 'wrap', marginBottom: '12px' }}>
                              <span style={{ color: 'var(--green)' }}>💰 ${s.fundingAsk?.toLocaleString()}</span>
                              <span style={{ color: 'var(--accent)' }}>📊 {s.equityOffered}% equity</span>
                              <span style={{ color: 'var(--muted)' }}>👤 {m.founder?.name}</span>
                              {s.existingInvestors?.length > 0 && <span style={{ color: 'var(--yellow)' }}>✅ {s.existingInvestors.length} existing investor(s)</span>}
                            </div>
                            {/* Match reasons */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {m.matchReasons?.map((r, ri) => (
                                <span key={ri} style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', background: r.startsWith('✅') ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: r.startsWith('✅') ? '#10b981' : '#f59e0b' }}>{r}</span>
                              ))}
                            </div>
                            {/* Score breakdown */}
                            <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
                              {[
                                { label: 'Domain', val: m.matchBreakdown?.domainScore },
                                { label: 'Stage', val: m.matchBreakdown?.stageScore },
                                { label: 'Ticket', val: m.matchBreakdown?.ticketScore },
                                { label: 'Idea', val: m.matchBreakdown?.ideaScore },
                              ].map((b, bi) => (
                                <div key={bi} style={{ textAlign: 'center' }}>
                                  <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '2px' }}>{b.label}</div>
                                  <div style={{ fontSize: '13px', fontWeight: 700, color: b.val >= 80 ? '#10b981' : b.val >= 50 ? '#f59e0b' : '#ef4444' }}>{b.val}%</div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div style={{ textAlign: 'center', minWidth: '110px' }}>
                            <div style={{ fontSize: '40px', fontWeight: 800, color: m.matchScore >= 80 ? '#10b981' : m.matchScore >= 60 ? '#6366f1' : '#f59e0b', marginBottom: '4px' }}>{m.matchScore}%</div>
                            <div style={{ color: 'var(--muted)', fontSize: '11px', marginBottom: '14px' }}>AI Match Score</div>
                            <button onClick={(e) => { e.stopPropagation(); handleWorkflowCompare({ ...s, _id: s._id }); }} className="btn btn-primary" style={{ fontSize: '12px', padding: '8px 14px', width: '100%', justifyContent: 'center', marginBottom: '6px' }}>
                              Analyze →
                            </button>
                            {m.status !== 'interested' && m.status !== 'passed' && (
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button onClick={(e) => { e.stopPropagation(); api.put(`/matches/${m._id}/status`, { status: 'interested' }); setMatches(prev => prev.map(x => x._id === m._id ? { ...x, status: 'interested' } : x)); }} className="btn btn-outline" style={{ fontSize: '11px', padding: '5px 8px', flex: 1, justifyContent: 'center', borderColor: '#10b981', color: '#10b981' }}>✅</button>
                                <button onClick={(e) => { e.stopPropagation(); api.put(`/matches/${m._id}/status`, { status: 'passed' }); setMatches(prev => prev.map(x => x._id === m._id ? { ...x, status: 'passed' } : x)); }} className="btn btn-outline" style={{ fontSize: '11px', padding: '5px 8px', flex: 1, justifyContent: 'center', borderColor: '#ef4444', color: '#ef4444' }}>❌</button>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* Workflow Analysis */}
          {activeTab === 'workflow' && (
            <motion.div key="workflow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {!selectedStartup && (
                <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
                  <p style={{ fontSize: '40px', marginBottom: '16px' }}>📊</p>
                  <p style={{ color: 'var(--muted)' }}>Click "Analyze →" on any matched startup to see workflow comparison.</p>
                </div>
              )}
              {workflowLoading && (
                <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px', animation: 'spin 2s linear infinite', display: 'inline-block' }}>⚙️</div>
                  <p style={{ color: 'var(--muted)' }}>Comparing workflow with famous companies...</p>
                </div>
              )}
              {workflowResult && !workflowLoading && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Header */}
                  <div className="card" style={{ borderColor: '#6366f133', background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(16,185,129,0.08))' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                      <div>
                        <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>
                          {selectedStartup.companyName} vs {workflowResult.famousCompany} Early Days
                        </h2>
                        <p style={{ color: 'var(--muted)', fontSize: '14px', maxWidth: '600px' }}>{workflowResult.verdict}</p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', fontWeight: 800, color: workflowResult.trustScore >= 80 ? '#10b981' : '#f59e0b' }}>{workflowResult.trustScore}%</div>
                        <div style={{ color: 'var(--muted)', fontSize: '12px' }}>Trust Score</div>
                      </div>
                    </div>
                  </div>

                  {/* Famous company pattern */}
                  <div className="card">
                    <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>🏆 {workflowResult.famousCompany}'s Winning Pattern</h3>
                    <div style={{ background: 'var(--bg2)', borderRadius: '10px', padding: '16px', borderLeft: '3px solid var(--accent)' }}>
                      <p style={{ fontWeight: 600, marginBottom: '6px', color: 'var(--accent)' }}>Growth Pattern:</p>
                      <p style={{ color: 'var(--text)', fontSize: '14px', marginBottom: '12px' }}>{workflowResult.earlyPattern}</p>
                      <p style={{ fontWeight: 600, marginBottom: '6px', color: '#10b981' }}>Key Early Metric:</p>
                      <p style={{ color: 'var(--text)', fontSize: '14px' }}>{workflowResult.earlyMetric}</p>
                    </div>
                  </div>

                  {/* Radar Chart */}
                  <div className="card">
                    <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>📡 Phase-by-Phase Comparison</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={workflowResult.workflowSimilarity}>
                        <PolarGrid stroke="#2d3748" />
                        <PolarAngleAxis dataKey="phase" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <Radar name={selectedStartup.companyName} dataKey="startup" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                        <Radar name={workflowResult.famousCompany} dataKey="famous" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                        <Legend wrapperStyle={{ color: '#94a3b8' }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Matches & Differences */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="card">
                      <h3 style={{ fontWeight: 700, marginBottom: '14px', color: '#10b981' }}>✅ Key Matches</h3>
                      {workflowResult.keyMatches.map((m, i) => <p key={i} style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '8px', paddingLeft: '12px', borderLeft: '2px solid #10b981' }}>• {m}</p>)}
                    </div>
                    <div className="card">
                      <h3 style={{ fontWeight: 700, marginBottom: '14px', color: '#f59e0b' }}>⚠️ Key Differences</h3>
                      {workflowResult.keyDifferences.map((d, i) => <p key={i} style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '8px', paddingLeft: '12px', borderLeft: '2px solid #f59e0b' }}>• {d}</p>)}
                    </div>
                  </div>
                </div>
              )}
              <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
            </motion.div>
          )}

          {/* Compare Two */}
          {activeTab === 'compare' && (
            <motion.div key="compare" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="card" style={{ marginBottom: '24px' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '6px' }}>⚔️ AI Investment Decision Engine</h3>
                <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '20px' }}>Confused between two startups? Our AI analyzes market saturation, growth potential, and competition to tell you where to invest.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '16px', alignItems: 'center' }}>
                  <StartupSelector label="Startup A" selected={compareA} options={matches} onSelect={setCompareA} />
                  <div style={{ fontSize: '24px', textAlign: 'center', color: 'var(--muted)' }}>VS</div>
                  <StartupSelector label="Startup B" selected={compareB} options={matches} onSelect={setCompareB} />
                </div>
                <button onClick={handleCompareTwo} disabled={!compareA || !compareB || compareLoading} className="btn btn-primary" style={{ marginTop: '20px', width: '100%', justifyContent: 'center', padding: '14px' }}>
                  {compareLoading ? '🤖 Analyzing...' : '🤖 Get AI Recommendation'}
                </button>
              </div>

              {compareResult && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Winner Banner */}
                  <div className="card" style={{ borderColor: '#10b98133', background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(99,102,241,0.1))', textAlign: 'center', padding: '32px' }}>
                    <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '8px' }}>AI Recommends</p>
                    <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#10b981', marginBottom: '8px' }}>
                      🏆 {compareResult.recommendation?.companyName}
                    </h2>
                    <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Better investment opportunity based on market analysis</p>
                  </div>

                  {/* Reasoning */}
                  <div className="card">
                    <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>🧠 Why This Recommendation?</h3>
                    {compareResult.reasoning.map((r, i) => (
                      <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '12px', padding: '12px', background: 'var(--bg2)', borderRadius: '10px' }}>
                        <span style={{ color: '#10b981', fontWeight: 700, minWidth: '20px' }}>{i + 1}.</span>
                        <p style={{ color: 'var(--text)', fontSize: '14px' }}>{r}</p>
                      </div>
                    ))}
                  </div>

                  {/* Comparison Bar Chart */}
                  <div className="card">
                    <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>📊 Head-to-Head Comparison</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={compareResult.comparisonChart} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                        <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 12 }} domain={[0, 100]} />
                        <YAxis type="category" dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 12 }} width={120} />
                        <Tooltip contentStyle={{ background: '#1a2235', border: '1px solid #2d3748', borderRadius: '8px' }} />
                        <Legend wrapperStyle={{ color: '#94a3b8' }} />
                        <Bar dataKey="a" name={compareResult.startupA?.companyName} fill="#6366f1" radius={[0, 4, 4, 0]} />
                        <Bar dataKey="b" name={compareResult.startupB?.companyName} fill="#10b981" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Market Data */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {[compareResult.startupA, compareResult.startupB].map((s, i) => (
                      <div key={i} className="card" style={{ borderColor: s._id === compareResult.recommendation?._id ? '#10b98133' : 'var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                          <h4 style={{ fontWeight: 700 }}>{s.companyName}</h4>
                          {s._id === compareResult.recommendation?._id && <span className="badge badge-green">✅ Recommended</span>}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <MarketStat label="Market Size" value={s.market?.marketSize} />
                          <MarketStat label="Market Saturation" value={`${s.market?.saturation}%`} warn={s.market?.saturation > 60} />
                          <MarketStat label="Growth Rate" value={`${s.market?.growthRate}% YoY`} good />
                          <MarketStat label="Competitors" value={s.market?.competitorCount} warn={s.market?.competitorCount > 30} />
                          <MarketStat label="Future Outlook" value={s.market?.futureOutlook} good={s.market?.futureOutlook === 'High Growth'} />
                          <MarketStat label="AI Score" value={`${s.score}/100`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Portfolio */}
          {activeTab === 'portfolio' && (
            <motion.div key="portfolio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {(!profile?.pastInvestments?.length && !profile?.recentInvestments?.length) ? (
                <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
                  <p style={{ fontSize: '40px', marginBottom: '16px' }}>💼</p>
                  <p style={{ color: 'var(--muted)', marginBottom: '16px' }}>No portfolio data yet.</p>
                  <button onClick={() => navigate('/investor/profile-setup')} className="btn btn-primary">Add Investments →</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {profile?.recentInvestments?.length > 0 && (
                    <div className="card">
                      <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>🔥 Recent Investments</h3>
                      {profile.recentInvestments.map((inv, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg2)', borderRadius: '10px', marginBottom: '8px' }}>
                          <div><span style={{ fontWeight: 600 }}>{inv.companyName}</span><span className="badge badge-blue" style={{ marginLeft: '8px' }}>{inv.domain}</span><span className="badge badge-purple" style={{ marginLeft: '6px' }}>{inv.stage}</span></div>
                          <span style={{ color: 'var(--green)', fontWeight: 600 }}>${Number(inv.amount).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {profile?.pastInvestments?.length > 0 && (
                    <div className="card">
                      <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>📊 Past Investments</h3>
                      {profile.pastInvestments.map((inv, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg2)', borderRadius: '10px', marginBottom: '8px' }}>
                          <div><span style={{ fontWeight: 600 }}>{inv.companyName}</span><span className="badge badge-blue" style={{ marginLeft: '8px' }}>{inv.domain}</span><span className={`badge ${inv.outcome === 'exited' || inv.outcome === 'ipo' ? 'badge-green' : inv.outcome === 'failed' ? 'badge-red' : 'badge-yellow'}`} style={{ marginLeft: '6px' }}>{inv.outcome}</span></div>
                          <div style={{ display: 'flex', gap: '12px' }}>
                            <span style={{ color: 'var(--green)', fontWeight: 600 }}>${Number(inv.amount).toLocaleString()}</span>
                            {inv.returnMultiple > 0 && <span style={{ color: 'var(--accent)' }}>{inv.returnMultiple}x</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StartupSelector({ label, selected, options, onSelect }) {
  return (
    <div style={{ background: 'var(--bg2)', borderRadius: '12px', padding: '16px', border: `1px solid ${selected ? 'var(--accent)' : 'var(--border)'}` }}>
      <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '10px' }}>{label}</p>
      {selected ? (
        <div>
          <p style={{ fontWeight: 700, marginBottom: '4px' }}>{selected.companyName}</p>
          <span className="badge badge-blue">{selected.domain}</span>
          <button onClick={() => onSelect(null)} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', marginLeft: '8px', fontSize: '12px' }}>✕ Clear</button>
        </div>
      ) : (
        <select onChange={e => onSelect(options.find(o => o._id === e.target.value))} defaultValue="" className="input" style={{ cursor: 'pointer' }}>
          <option value="" disabled>Select startup...</option>
          {options.map(o => <option key={o._id} value={o._id}>{o.companyName}</option>)}
        </select>
      )}
    </div>
  );
}

function MarketStat({ label, value, good, warn }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
      <span style={{ color: 'var(--muted)' }}>{label}</span>
      <span style={{ fontWeight: 600, color: good ? '#10b981' : warn ? '#f59e0b' : 'var(--text)' }}>{value}</span>
    </div>
  );
}
