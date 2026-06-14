import React, { useState } from 'react';
import '../styles/GameHUD.css';

export default function GameHUD({
  health,
  armor,
  kills,
  aliveCount,
  gameTime,
  position,
  onFire,
  onAbility
}) {
  const [showInventory, setShowInventory] = useState(false);

  return (
    <div className="game-hud">
      {/* Top HUD */}
      <div className="hud-top">
        <div className="timer">
          <span>⏱ {gameTime}</span>
        </div>
        <div className="alive-count">
          <span>👥 {aliveCount} Players Alive</span>
        </div>
        <div className="fps">
          <span>60 FPS</span>
        </div>
      </div>

      {/* Bottom HUD */}
      <div className="hud-bottom">
        {/* Health & Armor */}
        <div className="health-section">
          <div className="health-bar">
            <div className="health-fill" style={{ width: `${health}%` }}></div>
            <span className="health-text">❤️ {health}</span>
          </div>
          <div className="armor-bar">
            <div className="armor-fill" style={{ width: `${armor}%` }}></div>
            <span className="armor-text">🛡️ {armor}</span>
          </div>
        </div>

        {/* Kills Counter */}
        <div className="kills-section">
          <span>💀 Kills: {kills}</span>
        </div>

        {/* Crosshair */}
        <div className="crosshair">
          <div className="crosshair-center"></div>
          <div className="crosshair-dot"></div>
        </div>

        {/* Abilities */}
        <div className="abilities-section">
          <button className="ability-btn" onClick={() => onAbility('ability-1')} title="Q">
            <span>Q</span>
          </button>
          <button className="ability-btn" onClick={() => onAbility('ability-2')} title="E">
            <span>E</span>
          </button>
        </div>

        {/* Weapon Ammo */}
        <div className="ammo-section">
          <div className="ammo-display">
            <span className="current">30</span>
            <span className="separator">/</span>
            <span className="reserve">120</span>
          </div>
          <div className="weapon-name">AK-47</div>
        </div>

        {/* Mini Hotbar */}
        <div className="hotbar">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`hotbar-slot ${i === 1 ? 'active' : ''}`}>
              <span>{i}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Coordinates */}
      <div className="coordinates">
        <span>📍 X: {position.x.toFixed(1)} Y: {position.z.toFixed(1)}</span>
      </div>
    </div>
  );
}
