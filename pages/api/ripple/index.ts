import type { NextApiRequest, NextApiResponse } from 'next';
import { WaterJet, RippleAction } from '../../../types/ripple';

// Mock database
let jets: WaterJet[] = [];
let rippleActions: RippleAction[] = [];

// Mock initial data
const mockJets: WaterJet[] = [
  {
    id: '1',
    color: '#00B8D4',
    height: 0.7,
    position: { x: 0.3, y: 0.8 },
    rippleRadius: 0.1,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    color: '#43E97B',
    height: 0.5,
    position: { x: 0.7, y: 0.8 },
    rippleRadius: 0.08,
    createdAt: new Date().toISOString(),
  },
];

jets = [...mockJets];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return res.status(200).json({
        jets,
        rippleActions,
        lastUpdated: new Date().toISOString(),
      });
    case 'POST': {
      // Add a new ripple action
      const action: RippleAction = {
        id: Date.now().toString(),
        type: req.body.type,
        intensity: req.body.intensity || 1,
        timestamp: new Date().toISOString(),
        userId: req.body.userId || 'anonymous',
      };
      rippleActions.push(action);
      // Generate new jets based on ripple
      const newJets = generateJetsFromAction(action);
      jets = [...jets, ...newJets];
      // Clean up old actions (keep last 100)
      if (rippleActions.length > 100) {
        rippleActions = rippleActions.slice(-100);
      }
      return res.status(201).json({
        success: true,
        action,
        newJets,
      });
    }
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function generateJetsFromAction(action: RippleAction): WaterJet[] {
  const numJets = Math.floor(action.intensity * 3) + 1;
  const newJets: WaterJet[] = [];
  for (let i = 0; i < numJets; i++) {
    newJets.push({
      id: `${Date.now()}-${i}`,
      color: getJetColor(action.type),
      height: 0.4 + Math.random() * 0.6,
      position: {
        x: 0.1 + Math.random() * 0.8,
        y: 0.7 + Math.random() * 0.2,
      },
      rippleRadius: 0.08 + Math.random() * 0.08,
      createdAt: new Date().toISOString(),
    });
  }
  return newJets;
}

function getJetColor(type: string): string {
  switch (type) {
    case 'hope':
      return '#00B8D4'; // Cyan
    case 'support':
      return '#43E97B'; // Green
    case 'celebrate':
      return '#FFD700'; // Gold
    default:
      return '#00B8D4';
  }
} 