import React, { useEffect, useState } from 'react';
import { useStore } from '../store/gameStore';
import GameCanvas from '../components/GameCanvas';
import GameHUD from '../components/GameHUD';
import '../styles/GameScreen.css';

export default function GameScreen() {
  const {
    matchId,
    players,
    health,
    armor,
    kills,
    playerPosition,
    currentMatch,
    updatePosition,
    fireWeapon,
    useAbility
  } = useStore();

  const [gameTime, setGameTime] = useState(0);
  const [aliveCount, setAliveCount] = useState(players.length);

  useEffect(() => {
    const timer = setInterval(() => {
      setGameTime((t) => t + 1);
    }, 1000);

    setAliveCount(players.filter(p => p.isAlive).length);

    return () => clearInterval(timer);
  }, [players]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-screen">
      {/* Main Game Canvas */}
      <GameCanvas />

      {/* HUD Overlay */}
      <GameHUD
        health={health}
        armor={armor}
        kills={kills}
        aliveCount={aliveCount}
        gameTime={formatTime(gameTime)}
        position={playerPosition}
        onFire={fireWeapon}
        onAbility={useAbility}
      />

      {/* Minimap */}
      <div className="minimap">
        <div className="minimap-content">
          <canvas id="minimap-canvas"></canvas>
          <div className="player-marker">●</div>
        </div>
      </div>

      {/* Zone Info */}
      <div className="zone-info">
        <p>Safe Zone Shrinking</p>
        <p className="time">{formatTime(gameTime)}</p>
      </div>
    </div>
  );
}
