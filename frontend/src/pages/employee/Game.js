import React, { useState, useEffect } from 'react';
import { gameAPI } from '../../utils/api';
import { scenarios } from '../../data/scenarios';
import ChatWindow from '../../components/game/ChatWindow';
import ChoiceButtons from '../../components/game/ChoiceButtons';
import ProgressBar from '../../components/game/ProgressBar';
import LevelBadge from '../../components/game/LevelBadge';

export default function Game() {
  const [currentScenarioIdx, setCurrentScenarioIdx] = useState(0);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [gameState, setGameState] = useState('intro'); // intro, playing, feedback, finished
  const [view, setView] = useState('hub'); // hub, playing
  const [progress, setProgress] = useState({
    points: 0,
    level: 1,
    badges: [],
    completedScenarios: []
  });
  const [loading, setLoading] = useState(true);

  const scenario = scenarios[currentScenarioIdx];

  useEffect(() => {
    fetchProgress();
  }, []);

  useEffect(() => {
    if (!loading && scenario) {
      startScenario();
    }
  }, [currentScenarioIdx, loading]);

  const fetchProgress = async () => {
    try {
      const res = await gameAPI.getProgress();
      if (res.data) setProgress(res.data);
    } catch (err) {
      console.error("Failed to fetch progress", err);
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async (newProgress) => {
    try {
      await gameAPI.saveProgress(newProgress);
      setProgress(newProgress);
    } catch (err) {
      console.error("Failed to save progress", err);
    }
  };

  const startScenario = async () => {
    setMessages([]);
    setGameState('playing');
    
    for (const msg of scenario.messages) {
      setIsTyping(true);
      await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));
      setIsTyping(false);
      setMessages(prev => [...prev, msg]);
    }
  };

  const handleChoice = async (choice) => {
    setMessages(prev => [...prev, { type: 'user', text: choice.text }]);
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsTyping(false);

    let feedbackText = choice.feedback;
    
    // Optional AI Integration for wrong answers
    if (!choice.correct && choice.aiPrompt) {
      try {
        const aiRes = await axios.post('/api/chatbot/ask', { question: choice.aiPrompt });
        feedbackText = `${choice.feedback}\n\n🤖 AI Insight: ${aiRes.data.answer}`;
      } catch (err) {
        console.warn("AI explanation failed", err);
      }
    }

    setMessages(prev => [...prev, { type: 'bot', text: feedbackText }]);
    
    if (choice.correct) {
      const newPoints = progress.points + 50;
      const newCompleted = [...progress.completedScenarios, scenario.id];
      const newBadges = scenario.badge && !progress.badges.includes(scenario.badge) 
        ? [...progress.badges, scenario.badge] 
        : progress.badges;
      
      // Level calculation
      let newLevel = 1;
      if (newPoints >= 600) newLevel = 4;
      else if (newPoints >= 300) newLevel = 3;
      else if (newPoints >= 100) newLevel = 2;

      const newProgress = { 
        ...progress, 
        points: newPoints, 
        completedScenarios: newCompleted, 
        badges: newBadges,
        level: newLevel
      };
      saveProgress(newProgress);
    }

    setGameState('feedback');
  };

  const nextScenario = () => {
    setView('hub'); // Return to hub after each mission
    setGameState('intro');
  };

  const startMission = (idx) => {
    setCurrentScenarioIdx(idx);
    setView('playing');
    setGameState('playing');
    startScenario();
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading your mission...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', minHeight: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', padding: '0 20px' }}>
      
      {/* Header Stats */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '16px 24px', background: '#ffffff', borderRadius: '16px', 
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginBottom: '20px',
        border: '1px solid #e5e8ed'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <LevelBadge level={progress.level} />
          <div style={{ borderLeft: '1px solid #e5e8ed', paddingLeft: '16px' }}>
            <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: '700', textTransform: 'uppercase' }}>Rank Progress</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#111827' }}>{progress.points} XP</div>
          </div>
        </div>
        
        {view === 'playing' && (
          <button onClick={() => setView('hub')} style={{ background: 'none', border: '1px solid #e5e7eb', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}>
            ← Back to Hub
          </button>
        )}

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: '700', textTransform: 'uppercase' }}>Achievements</div>
          <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
            {progress.badges.length > 0 ? progress.badges.map((b, i) => (
              <span key={i} title={b} style={{ fontSize: '18px' }}>🏆</span>
            )) : <span style={{ fontSize: '12px', color: '#9ca3af' }}>No badges yet</span>}
          </div>
        </div>
      </div>

      {view === 'hub' ? (
        <div style={{ flex: 1, animation: 'fadeIn 0.4s ease' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#111827' }}>Training Academy</h2>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>Complete missions to increase your security rank and earn badges.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            {scenarios.map((s, idx) => {
              const isCompleted = progress.completedScenarios.includes(s.id);
              return (
                <div 
                  key={s.id} 
                  className="card"
                  style={{ 
                    padding: '20px', 
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative',
                    border: isCompleted ? '1px solid #22c55e' : '1px solid #e5e8ed',
                    background: isCompleted ? 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)' : '#fff'
                  }}
                  onClick={() => startMission(idx)}
                  onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)'; }}
                  onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ 
                      width: '40px', height: '40px', background: isCompleted ? '#22c55e' : '#f3f4f6', 
                      borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' 
                    }}>
                      {isCompleted ? '✅' : '🎮'}
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: '800', padding: '4px 8px', borderRadius: '4px', background: s.difficulty === 'Hard' ? '#fef2f2' : s.difficulty === 'Medium' ? '#fffbeb' : '#f0fdf4', color: s.difficulty === 'Hard' ? '#ef4444' : s.difficulty === 'Medium' ? '#f59e0b' : '#22c55e' }}>
                      {s.difficulty || 'Easy'}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '4px' }}>{s.title}</h3>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px' }}>{isCompleted ? 'Mission successfully completed.' : 'Start this mission to earn +50 XP.'}</p>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: isCompleted ? '#166534' : 'var(--accent)' }}>
                    {isCompleted ? 'View Results' : 'Launch Mission →'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={{ 
          flex: 1, display: 'flex', flexDirection: 'column', 
          background: '#ffffff', borderRadius: '24px', padding: '24px',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e8ed', overflow: 'hidden',
          animation: 'slideUp 0.4s ease'
        }}>
          <ProgressBar 
            current={currentScenarioIdx + 1} 
            total={scenarios.length} 
            label={`Mission: ${scenario?.title}`} 
          />

          {gameState === 'finished' ? (
            <div style={{ 
              flex: 1, display: 'flex', flexDirection: 'column', 
              alignItems: 'center', justifyContent: 'center', textAlign: 'center' 
            }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>🏆</div>
              <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#111827' }}>Mission Accomplished!</h2>
              <p style={{ color: '#4b5563', marginTop: '12px', maxWidth: '400px' }}>
                Great job! You've successfully completed the <strong>{scenario?.title}</strong> mission.
              </p>
              <div style={{ 
                marginTop: '32px', padding: '24px', background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', 
                borderRadius: '16px', border: '1px solid #bbf7d0', width: '100%',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
              }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Rank</div>
                <div style={{ fontSize: '32px', fontWeight: '900', color: '#166534', marginTop: '4px' }}>
                  {progress.level === 4 ? 'Elite Guardian' : progress.level === 3 ? 'Security Expert' : progress.level === 2 ? 'Aware Employee' : 'Novice'}
                </div>
              </div>
              <button 
                onClick={() => setView('hub')}
                style={{
                  marginTop: '32px', padding: '12px 32px', background: '#0f1923',
                  color: '#fff', borderRadius: '12px', border: 'none',
                  fontWeight: '700', cursor: 'pointer'
                }}
              >
                Return to Mission Hub
              </button>
            </div>
          ) : (
            <>
              <ChatWindow messages={messages} isTyping={isTyping} />
              
              {gameState === 'playing' && !isTyping && (
                <ChoiceButtons 
                  choices={scenario.choices} 
                  onSelect={handleChoice} 
                />
              )}

              {gameState === 'feedback' && (
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                  <button 
                    onClick={nextScenario}
                    style={{
                      padding: '12px 40px', background: '#22c55e',
                      color: '#fff', borderRadius: '12px', border: 'none',
                      fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 6px rgba(34,197,94,0.2)'
                    }}
                  >
                    Finish Mission →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* SOS Button */}
      <div style={{ marginTop: '20px', marginBottom: '20px', textAlign: 'center' }}>
        <button 
          onClick={() => window.location.href = '/employee/chatbot'}
          style={{
            background: 'none', border: 'none', color: '#ef4444', 
            fontSize: '13px', fontWeight: '600', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px', margin: '0 auto'
          }}
        >
          <span>⚠️ Something suspicious?</span>
          <span style={{ textDecoration: 'underline' }}>Report to IT</span>
        </button>
      </div>

    </div>
  );
}
