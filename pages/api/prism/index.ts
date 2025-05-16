import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismPattern, PrismAction } from '../../../types/prism';

// Mock database
let patterns: PrismPattern[] = [];
let actions: PrismAction[] = [];

// Mock initial data
const mockPatterns: PrismPattern[] = [
  {
    id: '1',
    color: '#8e24aa',
    shape: 'sphere',
    size: 1.1,
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    glow: 0.7,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    color: '#00bcd4',
    shape: 'cube',
    size: 0.9,
    position: { x: 0.5, y: 0.2, z: -0.3 },
    rotation: { x: 30, y: 45, z: 0 },
    glow: 0.5,
    createdAt: new Date().toISOString(),
  },
];

patterns = [...mockPatterns];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return res.status(200).json({
        patterns,
        actions,
        lastUpdated: new Date().toISOString(),
      });
    case 'POST': {
      // Add a new pattern action
      const action: PrismAction = {
        id: Date.now().toString(),
        type: req.body.type,
        intensity: req.body.intensity || 1,
        timestamp: new Date().toISOString(),
        userId: req.body.userId || 'anonymous',
      };
      actions.push(action);
      // Generate new patterns based on action
      const newPatterns = generatePatternsFromAction(action);
      patterns = [...patterns, ...newPatterns];
      // Clean up old actions (keep last 100)
      if (actions.length > 100) {
        actions = actions.slice(-100);
      }
      return res.status(201).json({
        success: true,
        action,
        newPatterns,
      });
    }
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function generatePatternsFromAction(action: PrismAction): PrismPattern[] {
  const shapes = ['sphere', 'cube', 'pyramid', 'torus'] as const;
  const numPatterns = Math.floor(action.intensity * 3) + 1;
  const newPatterns: PrismPattern[] = [];
  for (let i = 0; i < numPatterns; i++) {
    newPatterns.push({
      id: `${Date.now()}-${i}`,
      color: getPatternColor(action.type),
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      size: 0.7 + Math.random() * 1.2,
      position: {
        x: (Math.random() - 0.5) * 1.2,
        y: (Math.random() - 0.5) * 1.2,
        z: (Math.random() - 0.5) * 1.2,
      },
      rotation: {
        x: Math.random() * 360,
        y: Math.random() * 360,
        z: Math.random() * 360,
      },
      glow: 0.4 + Math.random() * 0.7,
      createdAt: new Date().toISOString(),
    });
  }
  return newPatterns;
}

function getPatternColor(type: string): string {
  switch (type) {
    case 'energy':
      return '#ffeb3b'; // Yellow
    case 'balance':
      return '#00bcd4'; // Cyan
    case 'growth':
      return '#43a047'; // Green
    case 'focus':
      return '#8e24aa'; // Purple
    default:
      return '#00bcd4';
  }
} 