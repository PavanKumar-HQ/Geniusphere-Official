import React, { useState } from 'react';
import { InMemoryDatabase } from '../db/in-memory-db';
import { LeaderboardEntry } from '../types';
import {
  Trophy,
  Flame,
  Zap,
  Search,
} from 'lucide-react';

interface LeaderboardPageProps {
  db: InMemoryDatabase;
  currentUserId: string;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ db, currentUserId }) => {
  const [filterDomain, setFilterDomain] = useState<'all' | 'weekly' | 'schools'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const liveProgress = db.getUserProgress(currentUserId);
  const currentUserObj = db.getUser(currentUserId, currentUserId);

  const leaderboardData: LeaderboardEntry[] = [
    {
      rank: 1,
      user_id: currentUserId,
      user_name: currentUserObj?.full_name || 'Aarav Patel',
      school_name: 'Delhi Public Tech School',
      xp: Math.max(3250, liveProgress.xp),
      streak: liveProgress.streak_days,
      courses_completed: Math.max(4, liveProgress.completed_courses.length),
      badge: 'Cyber Sentinel',
      avatar_color: '#3B82F6',
    },
    {
      rank: 2,
      user_id: 'user-st-2',
      user_name: 'Priya Nair',
      school_name: 'Bengaluru Tech Academy',
      xp: 2980,
      streak: 11,
      courses_completed: 3,
      badge: 'Logic Architect',
      avatar_color: '#10B981',
    },
    {
      rank: 3,
      user_id: 'user-st-3',
      user_name: 'Rohan Gupta',
      school_name: 'Delhi Public Tech School',
      xp: 2740,
      streak: 9,
      courses_completed: 3,
      badge: 'Market Analyst',
      avatar_color: '#F59E0B',
    },
    {
      rank: 4,
      user_id: 'user-st-4',
      user_name: 'Ananya Sharma',
      school_name: 'Modern Vidya High',
      xp: 2420,
      streak: 8,
      courses_completed: 2,
      badge: 'AI Explorer',
      avatar_color: '#8B5CF6',
    },
    {
      rank: 5,
      user_id: 'user-st-5',
      user_name: 'Kabir Mehta',
      school_name: 'PES CIE Collegiate',
      xp: 2190,
      streak: 7,
      courses_completed: 2,
      badge: 'Cloud Pioneer',
      avatar_color: '#06B6D4',
    },
    {
      rank: 6,
      user_id: 'user-st-6',
      user_name: 'Meera Iyer',
      school_name: 'Bengaluru Tech Academy',
      xp: 1850,
      streak: 5,
      courses_completed: 2,
      badge: 'FinTech Scholar',
      avatar_color: '#EC4899',
    },
  ];

  const schoolRankings = [
    { rank: 1, name: 'Delhi Public Tech School', students: 48, totalXp: 48920, topSubject: 'Cybersecurity' },
    { rank: 2, name: 'Bengaluru Tech Academy', students: 42, totalXp: 41250, topSubject: 'Coding & Logic' },
    { rank: 3, name: 'Modern Vidya High', students: 35, totalXp: 33400, topSubject: 'Financial Markets' },
    { rank: 4, name: 'PES CIE Collegiate', students: 28, totalXp: 29800, topSubject: 'AI Systems' },
  ];

  const filteredLearners = leaderboardData.filter((entry) => {
    return (
      entry.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.school_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.badge.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px 80px', display: 'flex', flexDirection: 'column', gap: '36px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', backgroundColor: 'var(--brand-cyan-surface)', color: 'var(--brand-cyan-light)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '14px' }}>
            <Trophy size={15} />
            <span>LEARNER LEADERBOARD & RECOGNITION</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            Global Learning Arena
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Celebrating student persistence, concept mastery, daily streaks, and certified course completions.
          </p>
        </div>

        {/* User Quick Stats Banner */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <div className="streak-pill">
            <Flame size={18} />
            <span>14-Day Streak</span>
          </div>
          <div className="xp-pill">
            <Zap size={18} />
            <span>3,250 XP</span>
          </div>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {/* Rank 2 */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '10px', order: 1 }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#64748B', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
            2
          </div>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: leaderboardData[1].avatar_color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: '1.4rem', fontWeight: 800 }}>
            {leaderboardData[1].user_name[0]}
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>{leaderboardData[1].user_name}</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{leaderboardData[1].school_name}</p>
          <div className="badge badge-accent">{leaderboardData[1].badge}</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-accent)', marginTop: '6px' }}>
            {leaderboardData[1].xp.toLocaleString()} XP
          </div>
        </div>

        {/* Rank 1 (Grand Winner) */}
        <div
          className="card"
          style={{
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '12px',
            border: '2px solid #F59E0B',
            boxShadow: '0 0 30px rgba(245, 158, 11, 0.25)',
            order: 0,
            transform: 'scale(1.03)',
          }}
        >
          <div style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: '#F59E0B', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, boxShadow: '0 2px 10px rgba(245, 158, 11, 0.4)' }}>
            <Trophy size={24} />
          </div>
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: leaderboardData[0].avatar_color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: '1.6rem', fontWeight: 800, border: '3px solid #F59E0B' }}>
            {leaderboardData[0].user_name[0]}
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>{leaderboardData[0].user_name}</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{leaderboardData[0].school_name}</p>
          <div className="streak-pill" style={{ fontSize: '0.8rem', padding: '4px 12px' }}>
            <Flame size={14} />
            <span>{leaderboardData[0].streak} Days Streak</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#D97706' }}>
            {leaderboardData[0].xp.toLocaleString()} XP
          </div>
        </div>

        {/* Rank 3 */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '10px', order: 2 }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#B45309', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
            3
          </div>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: leaderboardData[2].avatar_color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: '1.4rem', fontWeight: 800 }}>
            {leaderboardData[2].user_name[0]}
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>{leaderboardData[2].user_name}</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{leaderboardData[2].school_name}</p>
          <div className="badge badge-warning">{leaderboardData[2].badge}</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#B45309', marginTop: '6px' }}>
            {leaderboardData[2].xp.toLocaleString()} XP
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setFilterDomain('all')}
            className={`filter-pill ${filterDomain === 'all' ? 'active' : ''}`}
          >
            All Learners
          </button>
          <button
            type="button"
            onClick={() => setFilterDomain('schools')}
            className={`filter-pill ${filterDomain === 'schools' ? 'active' : ''}`}
          >
            Top Partner Schools
          </button>
        </div>

        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search learners or schools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '36px', height: '40px' }}
          />
        </div>
      </div>

      {/* Roster Table */}
      {filterDomain === 'all' ? (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-surface-subdued)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: '0.82rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '16px 20px' }}>Rank</th>
                <th style={{ padding: '16px 20px' }}>Learner</th>
                <th style={{ padding: '16px 20px' }}>School / Institution</th>
                <th style={{ padding: '16px 20px' }}>Streak</th>
                <th style={{ padding: '16px 20px' }}>Courses</th>
                <th style={{ padding: '16px 20px', textAlign: 'right' }}>Total XP</th>
              </tr>
            </thead>
            <tbody>
              {filteredLearners.map((learner) => (
                <tr
                  key={learner.user_id}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    backgroundColor: learner.user_id === currentUserId ? 'rgba(37, 99, 235, 0.12)' : 'transparent',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <td style={{ padding: '16px 20px', fontWeight: 800, color: learner.rank === 1 ? '#F59E0B' : learner.rank === 2 ? '#94A3B8' : learner.rank === 3 ? '#B45309' : '#64748B' }}>
                    #{learner.rank}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: learner.avatar_color, color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.88rem' }}>
                        {learner.user_name[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                          {learner.user_name}
                          {learner.user_id === currentUserId && (
                            <span className="badge badge-brand" style={{ marginLeft: '8px', fontSize: '0.65rem' }}>You</span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{learner.badge}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                    {learner.school_name}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#F59E0B', fontWeight: 700, fontSize: '0.85rem' }}>
                      <Flame size={15} />
                      {learner.streak}d
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                    {learner.courses_completed} completed
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right', fontWeight: 800, color: '#34D399', fontSize: '0.95rem' }}>
                    {learner.xp.toLocaleString()} XP
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {schoolRankings.map((school) => (
            <div key={school.rank} className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-cyan">RANK #{school.rank}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{school.students} Active Learners</span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>{school.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Top Discipline: <strong style={{ color: 'var(--brand-accent)' }}>{school.topSubject}</strong>
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Cumulative XP</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#D97706' }}>{school.totalXp.toLocaleString()} XP</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
