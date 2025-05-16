import type { NextApiRequest, NextApiResponse } from 'next';
import { PetalData, CommunityAction } from '../../../types/petals';

// Mock database
let petals: PetalData[] = [];
let communityActions: CommunityAction[] = [];

// Mock initial data
const mockPetals: PetalData[] = [
  {
    id: '1',
    color: '#FF6B6B',
    size: 1.2,
    position: { x: 0.5, y: 0.3, z: 0.1 },
    rotation: { x: 0, y: 45, z: 0 },
    velocity: { x: 0.1, y: 0.2, z: 0.05 },
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    color: '#4ECDC4',
    size: 0.8,
    position: { x: -0.3, y: 0.4, z: 0.2 },
    rotation: { x: 30, y: 0, z: 15 },
    velocity: { x: -0.15, y: 0.1, z: 0.08 },
    createdAt: new Date().toISOString(),
  },
];

// Initialize mock data
petals = [...mockPetals];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      // Return current petal state and community actions
      return res.status(200).json({
        petals,
        communityActions,
        lastUpdated: new Date().toISOString(),
      });

    case 'POST':
      // Handle new community action
      const action: CommunityAction = {
        id: Date.now().toString(),
        type: req.body.type,
        position: req.body.position,
        intensity: req.body.intensity || 1,
        timestamp: new Date().toISOString(),
        userId: req.body.userId || 'anonymous',
      };

      // Add new action
      communityActions.push(action);

      // Generate new petals based on action
      const newPetals = generatePetalsFromAction(action);
      petals = [...petals, ...newPetals];

      // Clean up old actions (keep last 100)
      if (communityActions.length > 100) {
        communityActions = communityActions.slice(-100);
      }

      return res.status(201).json({
        success: true,
        action,
        newPetals,
      });

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function generatePetalsFromAction(action: CommunityAction): PetalData[] {
  const numPetals = Math.floor(action.intensity * 5);
  const newPetals: PetalData[] = [];

  for (let i = 0; i < numPetals; i++) {
    newPetals.push({
      id: `${Date.now()}-${i}`,
      color: getRandomColor(),
      size: 0.5 + Math.random() * 1.5,
      position: {
        x: action.position.x + (Math.random() - 0.5) * 0.2,
        y: action.position.y + (Math.random() - 0.5) * 0.2,
        z: action.position.z + (Math.random() - 0.5) * 0.2,
      },
      rotation: {
        x: Math.random() * 360,
        y: Math.random() * 360,
        z: Math.random() * 360,
      },
      velocity: {
        x: (Math.random() - 0.5) * 0.2,
        y: (Math.random() - 0.5) * 0.2,
        z: (Math.random() - 0.5) * 0.2,
      },
      createdAt: new Date().toISOString(),
    });
  }

  return newPetals;
}

function getRandomColor(): string {
  const colors = [
    '#FF6B6B', // Coral
    '#4ECDC4', // Turquoise
    '#FFE66D', // Yellow
    '#6B5B95', // Purple
    '#88D8B0', // Mint
    '#FF9F1C', // Orange
  ];
  return colors[Math.floor(Math.random() * colors.length)];
} 