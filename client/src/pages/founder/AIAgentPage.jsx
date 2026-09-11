import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell,
} from 'recharts';

export default function AIAgentPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logStep, setLogStep] = useState(0);

  const runAgent = async () => {
    setLoading(true);
    setReport(null);
    setLogStep(0);
    // Animate log steps
    const interval = setInterval(() => setLogStep(s => s + 1), 600);
    try {
      const { data } = await api.get('/agent/report');
      clearInterval(interval);
      setLogStep(5);
      setReport(data);
    } catch {
      clearInterval(interval);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'founder') { navigate('/founder/login'); return; }
  }, [user]);

  const scoreColor = (s) => s >= 80 ? '#10b981' : s >= 60 ? '#6366f1' : s >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '32px 24px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #6366f1, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>🤖</div>
              <div>
                <h1 style={{ fontSize: '26px', fontWeight: 800 }}>AI Agent</h1>
                <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Collects all your data and generates a full investor-readiness report</p>
              </div>
            </div>
            <button onClick={() => navigate('/founder/dashboard')} className="btn btn-outline" style={{ fontSize: '13px', padding: '8px 14px' }}>← Dashboard</button>
          </div>
        </motion.div>

        {/* Run Button */}
        {!loading && !report && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ textAlign: 'center', padding: '60px', borderColor: '#6366f133' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🤖</div>
            <h2 style={{ fontWeight: 800, fontSize: '22px', marginBottom: '10px' }}>Run AI Agent Analysis</h2>
            <p style={{ color: 'var(--muted)', fontSize: '14px', maxWidth: '480px', margin: '0 auto 28px' }}>
              The agent scans your idea, startup profile, and investor matches — then gives you a full readiness report with action items.
            </p>
            <button onClick={runAgent} className="btn btn-primary" style={{ padding: '14px 40px', fontSize: '16px', justifyContent: 'center' }}>
              🚀 Analyse My Startup
            </button>
          </motion.div>
        )}

        {/* Agent Log (loading) */}
        {loading && (
          <div className="card" style={{ padding: '40px' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '24px', color: 'var(--accent)' }}>🤖 Agent is working...</h3>
            {['🔍 Scanning startup profile...', '💡 Reading idea analysis...', '🤝 Checking investor matches...', '📊 Computing readiness score...', '🧠 Generating recommendations...'].map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: logStep > i ? 1 : 0.2, x: 0 }} transition={{ delay: i * 0.1 }}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', marginBottom: '8px', borderRadius: '10px', background: logStep > i ? 'rgba(16,185,129,0.08)' : 'var(--bg2)' }}>
                <span style={{ fontSize: '18px' }}>{logStep > i ? '✅' : '⏳'}</span>
                <span style={{ fontSize: '14px', color: logStep > i ? 'var(--text)' : 'var(--muted)' }}>{step}</span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Report */}
        <AnimatePresence>
          {report && !loading && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* Readiness Score */}
              <div className="card" style={{ borderColor: `${scoreColor(report.readinessScore)}33`, background: `linear-gradient(135deg, ${scoreColor(report.readinessScore)}11, transparent)` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontWeight: 800, fontSize: '20px', marginBottom: '10px' }}>📋 Investor Readiness Report</h2>
                    <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: '1.7', maxWidth: '600px' }}>{report.summary}</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '56px', fontWeight: 900, color: scoreColor(report.readinessScore), lineHeight: 1 }}>{report.readinessScore}</div>
                    <div style={{ color: 'var(--muted)', fontSize: '12px', marginTop: '4px' }}>/ 100 Readiness</div>
                    <div style={{ marginTop: '8px', padding: '4px 12px', borderRadius: '20px', background: `${scoreColor(report.readinessScore)}22`, color: scoreColor(report.readinessScore), fontSize: '12px', fontWeight: 700 }}>
                      {report.readinessScore >= 80 ? 'Investor Ready' : report.readinessScore >= 60 ? 'Almost Ready' : report.readinessScore >= 40 ? 'In Progress' : 'Just Starting'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Agent Log */}
              <div className="card">
                <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>🔎 Agent Execution Log</h3>
                {report.agentLog?.map((log, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', marginBottom: '6px', borderRadius: '10px', background: 'var(--bg2)', borderLeft: `3px solid ${log.status === 'done' ? '#10b981' : log.status === 'missing' ? '#ef4444' : '#f59e0b'}` }}>
                    <span style={{ fontSize: '16px' }}>{log.status === 'done' ? '✅' : log.status === 'missing' ? '❌' : '⏳'}</span>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>{log.step}</span>
                      <span style={{ fontSize: '12px', color: 'var(--muted)', marginLeft: '10px' }}>{log.detail}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Radar Chart */}
              <div className="card">
                <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>📡 Startup Health Radar</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={report.radarData}>
                    <PolarGrid stroke="#2d3748" />
                    <PolarAngleAxis dataKey="axis" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Radar name="Your Startup" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.35} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Strengths & Gaps */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="card">
                  <h3 style={{ fontWeight: 700, marginBottom: '14px', color: '#10b981' }}>✅ Strengths</h3>
                  {report.strengths.length === 0 ? <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Complete your profile to see strengths.</p> :
                    report.strengths.map((s, i) => (
                      <div key={i} style={{ fontSize: '13px', padding: '8px 12px', marginBottom: '6px', borderRadius: '8px', background: 'rgba(16,185,129,0.08)', borderLeft: '3px solid #10b981', color: 'var(--text)' }}>{s}</div>
                    ))}
                </div>
                <div className="card">
                  <h3 style={{ fontWeight: 700, marginBottom: '14px', color: '#ef4444' }}>⚠️ Gaps Found</h3>
                  {report.gaps.length === 0 ? <p style={{ color: '#10b981', fontSize: '13px' }}>No gaps — you're in great shape!</p> :
                    report.gaps.map((g, i) => (
                      <div key={i} style={{ fontSize: '13px', padding: '8px 12px', marginBottom: '6px', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', borderLeft: '3px solid #ef4444', color: 'var(--text)' }}>{g}</div>
                    ))}
                </div>
              </div>

              {/* Action Items */}
              {report.actions?.length > 0 && (
                <div className="card" style={{ borderColor: '#f59e0b33' }}>
                  <h3 style={{ fontWeight: 700, marginBottom: '16px', color: '#f59e0b' }}>🎯 Action Items</h3>
                  {report.actions.map((a, i) => (
                    <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px', marginBottom: '8px', borderRadius: '10px', background: 'rgba(245,158,11,0.08)' }}>
                      <span style={{ color: '#f59e0b', fontWeight: 700, minWidth: '24px' }}>{i + 1}.</span>
                      <p style={{ fontSize: '14px', color: 'var(--text)' }}>{a}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Funding Gap */}
              {report.fundingGap && (
                <div className="card">
                  <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>💰 Funding Ask Analysis</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ background: 'var(--bg2)', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                      <div style={{ color: 'var(--muted)', fontSize: '12px', marginBottom: '4px' }}>Your Ask</div>
                      <div style={{ fontSize: '24px', fontWeight: 800, color: '#6366f1' }}>${report.fundingGap.ask?.toLocaleString()}</div>
                    </div>
                    <div style={{ background: 'var(--bg2)', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                      <div style={{ color: 'var(--muted)', fontSize: '12px', marginBottom: '4px' }}>Stage Average</div>
                      <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981' }}>${report.fundingGap.stageAvg?.toLocaleString()}</div>
                    </div>
                  </div>
                  <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(99,102,241,0.08)', borderLeft: '3px solid var(--accent)', fontSize: '14px', color: 'var(--text)' }}>
                    {report.fundingGap.assessment}
                  </div>
                </div>
              )}

              {/* Next Milestones */}
              {report.milestones && (
                <div className="card">
                  <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>🏁 Next Milestones for Your Stage</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {report.milestones.map((m, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '10px', background: 'var(--bg2)' }}>
                        <span style={{ fontSize: '14px' }}>🎯 {m.milestone}</span>
                        <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: m.priority === 'High' ? 'rgba(239,68,68,0.15)' : m.priority === 'Medium' ? 'rgba(245,158,11,0.15)' : 'rgba(99,102,241,0.15)', color: m.priority === 'High' ? '#ef4444' : m.priority === 'Medium' ? '#f59e0b' : '#6366f1', fontWeight: 600 }}>{m.priority}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Domain Insight */}
              {report.domainInsight && (
                <div className="card" style={{ borderColor: '#6366f133' }}>
                  <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>🌐 Domain Intelligence</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {[
                      { label: '📈 Market Trend', value: report.domainInsight.trend },
                      { label: '🔥 Hot Area', value: report.domainInsight.hotArea },
                      { label: '⚠️ Key Risk', value: report.domainInsight.risk },
                      { label: '💡 Pro Tip', value: report.domainInsight.tip },
                    ].map((item, i) => (
                      <div key={i} style={{ padding: '14px', borderRadius: '10px', background: 'var(--bg2)' }}>
                        <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', fontWeight: 600 }}>{item.label}</div>
                        <div style={{ fontSize: '13px', color: 'var(--text)', lineHeight: '1.5' }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Investor Fit */}
              {report.investorFit && (
                <div className="card" style={{ borderColor: '#10b98133' }}>
                  <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>🤝 Top Investor Match</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '16px' }}>{report.investorFit.topInvestorName}</p>
                      <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Best matched investor</p>
                    </div>
                    <div style={{ fontSize: '36px', fontWeight: 800, color: '#10b981' }}>{report.investorFit.topInvestorScore}%</div>
                  </div>
                  {report.investorFit.reasons?.map((r, i) => (
                    <div key={i} style={{ fontSize: '13px', padding: '6px 12px', marginBottom: '6px', borderRadius: '8px', background: r.startsWith('✅') ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)', color: 'var(--text)' }}>{r}</div>
                  ))}
                </div>
              )}

              {/* Re-run */}
              <button onClick={runAgent} className="btn btn-outline" style={{ justifyContent: 'center', padding: '12px' }}>
                🔄 Re-run Agent Analysis
              </button>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
