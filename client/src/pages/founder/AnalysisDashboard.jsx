import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

export default function AnalysisDashboard({ analysis, onVoiceRead }) {
  const { t } = useTranslation();
  const a = analysis;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* Score Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <ScoreCard label={t('overallRating')} value={`${a.overallRating}/10`} color="#6366f1" icon="⭐" />
        <ScoreCard label={t('innovationScore')} value={`${a.innovationScore}%`} color="#10b981" icon="💡" />
        <ScoreCard label={t('marketScore')} value={`${a.marketScore}%`} color="#f59e0b" icon="📈" />
        <ScoreCard label={t('feasibility')} value={`${a.feasibilityScore}%`} color="#3b82f6" icon="🔧" />
        <ScoreCard label="Similarity" value={`${a.similarityScore}%`} color="#ef4444" icon="🔗" />
      </div>

      {/* Key Highlights */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <SectionHeader title={t('keyHighlights')} icon="🔑" onVoice={() => onVoiceRead(a.keyHighlights.map(h => h.text).join('. '))} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '16px' }}>
          {a.keyHighlights.map((h, i) => (
            <span key={i} className={`highlight-${h.type}`} style={{ fontSize: '14px', fontWeight: 500 }}>
              {h.type === 'positive' ? '✅' : h.type === 'warning' ? '⚠️' : 'ℹ️'} {h.text}
            </span>
          ))}
        </div>
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Radar Chart */}
        <div className="card">
          <SectionHeader title="Idea Scorecard" icon="🎯" />
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={[
              { subject: 'Innovation', A: a.innovationScore },
              { subject: 'Market', A: a.marketScore },
              { subject: 'Feasibility', A: a.feasibilityScore },
              { subject: 'Similarity', A: a.similarityScore },
              { subject: 'Rating', A: a.overallRating * 10 },
            ]}>
              <PolarGrid stroke="#2d3748" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Radar dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Market Trends Line Chart */}
        <div className="card">
          <SectionHeader title={t('marketTrends')} icon="📊" />
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={a.marketTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis dataKey="year" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#1a2235', border: '1px solid #2d3748', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="deals" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Competitor Comparison Bar Chart */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <SectionHeader title={t('competitorComparison')} icon="⚔️" onVoice={() => onVoiceRead('Competitor comparison chart showing innovation, market, and feasibility scores.')} />
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={a.competitorComparison} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#1a2235', border: '1px solid #2d3748', borderRadius: '8px' }} />
            <Legend wrapperStyle={{ color: '#94a3b8' }} />
            <Bar dataKey="innovation" fill="#6366f1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="market" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="feasibility" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Similar Companies */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <SectionHeader title={t('similarCompanies')} icon="🏢" onVoice={() => onVoiceRead(a.existingCompanies.map(c => `${c.name}, ${c.status}, ${c.similarity}% similar`).join('. '))} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '16px' }}>
          {a.existingCompanies.map((c, i) => (
            <CompanyCard key={i} company={c} />
          ))}
        </div>
      </div>

      {/* Features + SWOT Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Features to Add */}
        <div className="card">
          <SectionHeader title={t('featuresToAdd')} icon="➕" />
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {a.featuresToAdd.map((f, i) => (
              <div key={i} style={{ background: 'var(--bg2)', borderRadius: '10px', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>{f.feature}</span>
                  <span className={`badge ${f.priority === 'High' ? 'badge-green' : 'badge-yellow'}`}>{f.priority}</span>
                </div>
                <p style={{ color: 'var(--muted)', fontSize: '12px' }}>{f.impact}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features to Remove */}
        <div className="card">
          <SectionHeader title={t('featuresToRemove')} icon="➖" />
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {a.featuresToRemove.map((f, i) => (
              <div key={i} style={{ background: 'var(--bg2)', borderRadius: '10px', padding: '12px' }}>
                <span style={{ fontWeight: 600, fontSize: '14px', display: 'block', marginBottom: '4px' }}>{f.feature}</span>
                <p style={{ color: 'var(--muted)', fontSize: '12px' }}>{f.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SWOT + Pie Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        <div className="card">
          <SectionHeader title={t('swotAnalysis')} icon="🔲" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
            <SwotBox title="Strengths" items={a.swot.strengths} color="#10b981" />
            <SwotBox title="Weaknesses" items={a.swot.weaknesses} color="#ef4444" />
            <SwotBox title="Opportunities" items={a.swot.opportunities} color="#6366f1" />
            <SwotBox title="Threats" items={a.swot.threats} color="#f59e0b" />
          </div>
        </div>

        {/* Pie Chart - Competitor similarity */}
        <div className="card">
          <SectionHeader title="Similarity Distribution" icon="🥧" />
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={a.existingCompanies.map(c => ({ name: c.name, value: c.similarity }))}
                cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}
                labelLine={{ stroke: '#94a3b8' }}>
                {a.existingCompanies.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1a2235', border: '1px solid #2d3748', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* New Technologies */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <SectionHeader title={t('newTech')} icon="⚡" onVoice={() => onVoiceRead(a.newTechnologies.join('. '))} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '16px' }}>
          {a.newTechnologies.map((tech, i) => (
            <span key={i} className="badge badge-purple" style={{ fontSize: '13px', padding: '6px 14px' }}>
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ScoreCard({ label, value, color, icon }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="card" style={{ textAlign: 'center', borderColor: `${color}33`, boxShadow: `0 0 20px ${color}10` }}>
      <div style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontSize: '28px', fontWeight: 800, color, marginBottom: '4px' }}>{value}</div>
      <div style={{ color: 'var(--muted)', fontSize: '12px' }}>{label}</div>
    </motion.div>
  );
}

function SectionHeader({ title, icon, onVoice }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{icon} {title}</h3>
      {onVoice && (
        <button onClick={onVoice} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '8px', padding: '4px 10px', color: 'var(--muted)', cursor: 'pointer', fontSize: '12px' }}>
          🔊 Listen
        </button>
      )}
    </div>
  );
}

function CompanyCard({ company }) {
  return (
    <div style={{ background: 'var(--bg2)', borderRadius: '12px', padding: '16px', border: `1px solid ${company.status === 'active' ? '#10b98133' : '#ef444433'}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <h4 style={{ fontWeight: 700, fontSize: '15px' }}>{company.name}</h4>
        <span className={`badge ${company.status === 'active' ? 'badge-green' : 'badge-red'}`}>
          {company.status === 'active' ? '✅ Active' : '❌ Closed'}
        </span>
      </div>
      <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '10px', lineHeight: '1.5' }}>{company.description}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>
        <span>Founded: {company.founded}</span>
        <span className="badge badge-blue">{company.similarity}% similar</span>
      </div>
      {company.funding && <p style={{ fontSize: '12px', color: '#10b981' }}>💰 {company.funding}</p>}
      {company.closureReason && (
        <div style={{ marginTop: '10px', background: 'rgba(239,68,68,0.08)', borderRadius: '8px', padding: '10px' }}>
          <p style={{ fontSize: '12px', color: '#ef4444', fontWeight: 600, marginBottom: '4px' }}>Why it closed:</p>
          <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: '1.5' }}>{company.closureReason}</p>
        </div>
      )}
    </div>
  );
}

function SwotBox({ title, items, color }) {
  return (
    <div style={{ background: 'var(--bg2)', borderRadius: '10px', padding: '12px', borderLeft: `3px solid ${color}` }}>
      <p style={{ fontWeight: 700, fontSize: '13px', color, marginBottom: '8px' }}>{title}</p>
      {items.map((item, i) => (
        <p key={i} style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>• {item}</p>
      ))}
    </div>
  );
}
