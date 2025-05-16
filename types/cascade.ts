export interface DropPosition {
  x: number;
  y: number;
}

export interface WaterDrop {
  id: string;
  color: string;
  size: number;
  position: DropPosition;
  velocity: number;
  createdAt: string;
}

export type RhythmType = 'inhale' | 'exhale' | 'hold';

export interface RhythmAction {
  id: string;
  type: RhythmType;
  intensity: number; // 0-1 scale
  timestamp: string;
  userId: string;
}

export interface CascadeSystemState {
  drops: WaterDrop[];
  rhythmActions: RhythmAction[];
  lastUpdated: string;
} 