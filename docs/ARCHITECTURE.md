# TESANA Battle Royale - Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (React + Three.js)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   UI Layer   │  │ Game Canvas  │  │ State Store  │       │
│  │ (Menu, HUD)  │  │ (3D Render)  │  │  (Zustand)   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└────────────────────────┬─────────────────────────────────────┘
                         │ WebSocket (Socket.io)
┌────────────────────────▼─────────────────────────────────────┐
│                   SERVER (Node.js + Express)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Auth Routes  │  │ Game Routes  │  │ User Routes  │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                         │                                     │
│  ┌──────────────────────▼──────────────────────────┐        │
│  │         Game Server (Matchmaking, Logic)        │        │
│  │  - Matches management                           │        │
│  │  - Player tracking                              │        │
│  │  - Zone shrinking                               │        │
│  │  - Combat resolution                            │        │
│  └──────────────────────┬──────────────────────────┘        │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────┐
│                   DATABASE (MongoDB)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Users      │  │  Matches     │  │  Statistics  │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

## Key Components

### Client Architecture

- **Pages:** Login, Register, MainMenu, GameLobby, GameScreen, Stats, Shop
- **Components:** GameCanvas (Three.js), GameHUD, Minimap
- **State Management:** Zustand store for authentication, game state, player data
- **Communication:** Socket.io for real-time game events

### Server Architecture

- **Express Routes:**
  - `/api/auth` - Authentication (login, register)
  - `/api/game` - Game data (weapons, maps, leaderboards)
  - `/api/users` - User profiles and statistics

- **Game Server:**
  - Matchmaking queue system
  - Active match management
  - Real-time player updates via WebSocket
  - Zone shrinking logic
  - Combat calculations

### Database Schema

**Users Collection:**
- Basic info (username, email, password)
- Statistics (kills, deaths, wins, playtime)
- Progression (level, rank, battle points)
- Inventory (weapons, cosmetics, items)

**Matches Collection:**
- Match metadata (ID, status, map, weather)
- Player list with positions and stats
- Zone information
- Winner information

## Real-time Communication Flow

### Player Joins Match

```
Client → "join-match" event → Server
Server → Creates/adds to Match → Socket room
Server → "match-found" → Client
Client → Enters GameScreen
```

### Player Movement

```
Client → "player-move" event (position) → Server
Server → Updates player position
Server → Broadcasts to other clients in match
Clients → Update other player positions
```

### Combat

```
Player A → "player-shoot" event → Server
Server → Calculates damage
Server → Applies to Player B
Server → "hit-notification" → Player B
Server → "enemy-shoot" → Other players
```

## Technology Stack

- **Frontend:** React 18, Three.js, Zustand, Socket.io-client
- **Backend:** Node.js, Express, Socket.io
- **Database:** MongoDB
- **Deployment:** Docker, AWS/GCP
- **Real-time:** WebSockets via Socket.io

## Scalability Considerations

- **Horizontal Scaling:** Multiple game server instances
- **Load Balancing:** Distribute matches across servers
- **Database Indexing:** Index frequently queried fields
- **Caching:** Redis for leaderboards and match data
- **CDN:** Serve static assets globally
