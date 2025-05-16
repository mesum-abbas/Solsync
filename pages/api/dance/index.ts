import type { NextApiRequest, NextApiResponse } from 'next';
import { DanceMove, DanceAction } from '../../../types/dance';

// Mock database
let moves: DanceMove[] = [];
let actions: DanceAction[] = [];

// Mock initial data
const mockMoves: DanceMove[] = [
  {
    id: '1',
    color: '#f06292',
    style: 'wave',
    intensity: 0.8,
    position: { lat: 0.2, lng: 0.3, t: 0 },
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    color: '#64b5f6',
    style: 'spin',
    intensity: 0.6,
    position: { lat: -0.3, lng: 0.1, t: 0.5 },
    createdAt: new Date().toISOString(),
  },
];

moves = [...mockMoves];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return res.status(200).json({
        moves,
        actions,
        lastUpdated: new Date().toISOString(),
      });
    case 'POST': {
      // Add a new dance action
      const action: DanceAction = {
        id: Date.now().toString(),
        type: req.body.type,
        intensity: req.body.intensity || 1,
        timestamp: new Date().toISOString(),
        userId: req.body.userId || 'anonymous',
      };
      actions.push(action);
      // Generate new moves based on action
      const newMoves = generateMovesFromAction(action);
      moves = [...moves, ...newMoves];
      // Clean up old actions (keep last 100)
      if (actions.length > 100) {
        actions = actions.slice(-100);
      }
      return res.status(201).json({
        success: true,
        action,
        newMoves,
      });
    }
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function generateMovesFromAction(action: DanceAction): DanceMove[] {
  const styles = ['wave', 'spin', 'jump', 'step'] as const;
  const colors = ['#f06292', '#64b5f6', '#ffd54f', '#81c784'];
  const numMoves = Math.floor(action.intensity * 4) + 1;
  const newMoves: DanceMove[] = [];
  for (let i = 0; i < numMoves; i++) {
    newMoves.push({
      id: `${Date.now()}-${i}`,
      color: colors[Math.floor(Math.random() * colors.length)],
      style: styles[Math.floor(Math.random() * styles.length)],
      intensity: 0.5 + Math.random() * 0.5,
      position: {
        lat: (Math.random() - 0.5) * 1.2,
        lng: (Math.random() - 0.5) * 1.2,
        t: Math.random(),
      },
      createdAt: new Date().toISOString(),
    });
  }
  return newMoves;
} 