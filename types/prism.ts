export interface PrismPosition {
  x: number;
  y: number;
  z: number;
}

export interface PrismPattern {
  id: string;
  color: string;
  shape: 'sphere' | 'cube' | 'pyramid' | 'torus';
  size: number;
  position: PrismPosition;
  rotation: PrismPosition;
  glow: number;
  createdAt: string;
}

export type PatternType = 'energy' | 'balance' | 'growth' | 'focus';

export interface PrismAction {
  id: string;
  type: PatternType;
  intensity: number; // 0-1 scale
  timestamp: string;
  userId: string;
}

export interface PrismSystemState {
  patterns: PrismPattern[];
  actions: PrismAction[];
  lastUpdated: string;
} 