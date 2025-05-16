import type { NextApiRequest, NextApiResponse } from 'next';
import { WaterDrop, RhythmAction } from '../../../types/cascade';

// Mock database
let drops: WaterDrop[] = [];
let rhythmActions: RhythmAction[] = [];

// Mock initial data
const mockDrops: WaterDrop[] = [
  {
    id: '1',
    color: '#4FC3F7',
    size: 1.1,
    position: { x: 0.5, y: 0.1 },
    velocity: 0.03,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    color: '#0288D1',
    size: 0.8,
    position: { x: 0.7, y: 0.2 },
    velocity: 0.025,
    createdAt: new Date().toISOString(),
  },
];

drops = [...mockDrops];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return res.status(200).json({
        drops,
        rhythmActions,
        lastUpdated: new Date().toISOString(),
      });
    case 'POST': {
      // Add a new rhythm action
      const action: RhythmAction = {
        id: Date.now().toString(),
        type: req.body.type,
        intensity: req.body.intensity || 1,
        timestamp: new Date().toISOString(),
        userId: req.body.userId || 'anonymous',
      };
      rhythmActions.push(action);
      // Generate new drops based on rhythm
      const newDrops = generateDropsFromAction(action);
      drops = [...drops, ...newDrops];
      // Clean up old actions (keep last 100)
      if (rhythmActions.length > 100) {
        rhythmActions = rhythmActions.slice(-100);
      }
      return res.status(201).json({
        success: true,
        action,
        newDrops,
      });
    }
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function generateDropsFromAction(action: RhythmAction): WaterDrop[] {
  const numDrops = Math.floor(action.intensity * 4) + 1;
  const newDrops: WaterDrop[] = [];
  for (let i = 0; i < numDrops; i++) {
    newDrops.push({
      id: `${Date.now()}-${i}`,
      color: getDropColor(action.type),
      size: 0.7 + Math.random() * 1.2,
      position: {
        x: 0.2 + Math.random() * 0.6,
        y: 0.05 + Math.random() * 0.1,
      },
      velocity: 0.02 + Math.random() * 0.02,
      createdAt: new Date().toISOString(),
    });
  }
  return newDrops;
}

function getDropColor(type: string): string {
  switch (type) {
    case 'inhale':
      return '#4FC3F7'; // Light blue
    case 'exhale':
      return '#0288D1'; // Deep blue
    case 'hold':
      return '#B3E5FC'; // Pale blue
    default:
      return '#4FC3F7';
  }
} 