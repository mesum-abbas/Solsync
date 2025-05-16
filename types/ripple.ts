export interface JetPosition {
  x: number;
  y: number;
}

export interface WaterJet {
  id: string;
  color: string;
  height: number;
  position: JetPosition;
  rippleRadius: number;
  createdAt: string;
}

export type RippleType = 'hope' | 'support' | 'celebrate';

export interface RippleAction {
  id: string;
  type: RippleType;
  intensity: number; // 0-1 scale
  timestamp: string;
  userId: string;
}

export interface RippleSystemState {
  jets: WaterJet[];
  rippleActions: RippleAction[];
  lastUpdated: string;
} 