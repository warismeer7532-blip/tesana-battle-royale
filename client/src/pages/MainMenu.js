import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/gameStore';
import '../styles/MainMenu.css';

export default function MainMenu() {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);

  return (
    <div className="main-menu">
      <div className="menu-background" />

      <div className="menu-content">
        <h1 className="title">🎮 TESANA: Clash of Warriors</h1>
        <p className="subtitle">Battle Royale - 100 Players, 1 Winner</p>

        <div className="user-info">
          <p>Welcome, <span>{user?.username}</span></p>
          <p className="level">Level {user?.progression?.level || 1} - {user?.progression?.rank || 'Bronze'}</p>
        </div>

        <div className="menu-buttons">
          <button className="btn-play" onClick={() => navigate('/lobby')}>
            ▶ PLAY
          </button>
          <button className="btn-secondary" onClick={() => navigate('/stats')}>
            📊 STATS
          </button>
          <button className="btn-secondary" onClick={() => navigate('/shop')}>
            🛍️ SHOP
          </button>
          <button className="btn-secondary" onClick={() => navigate('/battlepass')}>
            🎯 BATTLE PASS
          </button>
        </div>

        <div className="menu-footer">
          <button onClick={logout} className="btn-logout">
            LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
}
