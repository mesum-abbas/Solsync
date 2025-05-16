export interface DancePosition {
  lat: number;
  lng: number;
  t: number; // time or phase on the sphere
}

export interface DanceMove {
  id: string;
  color: string;
  style: 'wave' | 'spin' | 'jump' | 'step';
  intensity: number;
  position: DancePosition;
  createdAt: string;
}

export type DanceActionType = 'milestone' | 'celebration' | 'unity' | 'healing';

export interface DanceAction {
  id: string;
  type: DanceActionType;
  intensity: number; // 0-1 scale
  timestamp: string;
  userId: string;
}

export interface DanceSystemState {
  moves: DanceMove[];
  actions: DanceAction[];
  lastUpdated: string;
} 